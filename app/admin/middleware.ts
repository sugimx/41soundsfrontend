import { redirect } from 'next/navigation';
import { tokenStorage } from '@/lib/api';

// This is a helper function to check admin access
// In a real app, this would verify the token and check the user's role on the backend
export async function verifyAdminAccess() {
  const token = tokenStorage.getToken();

  if (!token) {
    redirect('/login');
  }

  // Additional verification would happen here
  // For now, we'll let the client-side middleware handle it
  return token;
}
