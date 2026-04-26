'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useCallback } from 'react';
import { tokenStorage } from '@/lib/api';

declare global {
  interface Window {
    google: any;
  }
}

export function GoogleLoginButton() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string>('');

  // Define callback with useCallback to ensure stable reference
  const handleCredentialResponse = useCallback(
    async (response: any) => {
      try {
        const idToken = response?.credential;
        
        if (!idToken) {
          setError('No credential received from Google');
          return;
        }
        
        console.log('📱 Sending Google token to backend...');
        
        // Send token to backend for verification
        const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/oauth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken }),
        });

        console.log('✅ Response received:', fetchResponse.status);

        // Try to parse response as JSON
        let responseData: any = {};
        try {
          responseData = await fetchResponse.json();
        } catch (parseError) {
          console.error('Failed to parse JSON:', parseError);
          setError('Invalid response from server');
          return;
        }

        // Check for success
        if (!fetchResponse.ok) {
          const errorMsg = responseData?.message || `Server error: ${fetchResponse.status}`;
          console.error('❌ Backend error:', errorMsg);
          setError(`Google login failed: ${errorMsg}`);
          return;
        }

        console.log('✅ Google login successful');

        // Store token and redirect
        if (responseData?.token) {
          tokenStorage.setToken(responseData.token);
          router.push('/');
          window.location.reload();
        } else {
          setError('No token received from server');
        }
      } catch (err: any) {
        const msg = err?.message || 'Unknown error';
        console.error('❌ Error:', msg);
        setError(`Google login failed: ${msg}`);
      }
    },
    [router]
  );

  useEffect(() => {
    // Wait for Google SDK to load
    const checkGoogleSDK = setInterval(() => {
      if (window.google?.accounts?.id) {
        console.log('✅ Google SDK loaded');
        try {
          // Initialize Google Sign-In
          window.google.accounts.id.initialize({
            client_id: process.env.GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
          });

          // Render the sign-in button
          if (containerRef.current) {
            window.google.accounts.id.renderButton(containerRef.current, {
              theme: 'dark',
              size: 'large',
              text: 'signin',
              width: '280',
            });
          }
          clearInterval(checkGoogleSDK);
        } catch (err: any) {
          console.error('❌ SDK init error:', err?.message || 'Unknown');
          setError('Failed to initialize Google Sign-In');
          clearInterval(checkGoogleSDK);
        }
      }
    }, 100);

    return () => clearInterval(checkGoogleSDK);
  }, [handleCredentialResponse]);

  return (
    <div>
      <div 
        ref={containerRef}
        className="flex justify-center"
        id="google-signin-button"
      />
      {error && (
        <p className="text-red-400 text-sm mt-2 text-center">{error}</p>
      )}
    </div>
  );
}
