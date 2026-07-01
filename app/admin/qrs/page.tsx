'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';
import { useAuth } from '@/lib/auth-context';

interface ScanResult {
  valid: boolean;
  message: string;
  name?: string;
  email?: string;
  ticketTier?: string;
  ticketId?: string;
}

export default function QRPage() {
  const { token } = useAuth();

  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const isProcessingRef = useRef(false);

  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(true);

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.clear();
      } catch {}
      scannerRef.current = null;
    }
    isProcessingRef.current = false;
  };

  const startScanner = async () => {
    if (!token) return;

    await stopScanner();

    isProcessingRef.current = false;

    const scanner = new Html5QrcodeScanner(
      'reader',
      { fps: 5, qrbox: 250 },
      false
    );

    scannerRef.current = scanner;

    scanner.render(
      async (decodedText) => {
        if (isProcessingRef.current) return;
        isProcessingRef.current = true;

        setIsScanning(false);
        setError('');

        try {
          const data = await adminApi.qrScanner(token, decodedText);
          setResult(data);

          await stopScanner(); // stop after success
        } catch (err) {
          setResult({
            valid: false,
            message: 'Unable to validate ticket',
          });

          setError('Failed to validate ticket');


          await stopScanner();
        }
      },
      () => {
        // REQUIRED second callback (ignore errors safely)
      }
    );
  };

  useEffect(() => {
    if (!token) return;

    startScanner();

    return () => {
      stopScanner();
    };
  }, [token]);

  const handleRescan = () => {
    setResult(null);
    setError('');
    setIsScanning(true);

    isProcessingRef.current = false;

    startScanner();
  };

  return (
    <div className="min-h-screen bg-black p-4 lg:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Concert QR Scanner
          </h1>
          <p className="text-gray-400">
            Scan customer tickets at event entrance
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
          <div
            id="reader"
            className="w-full rounded-lg overflow-hidden"
            style={{ minHeight: '300px' }}
          />

          {!isScanning && (
            <div className="mt-4 text-center">
              <button
                onClick={handleRescan}
                className="px-6 py-3 bg-pink-600 text-white rounded-lg"
              >
                Scan Another Ticket
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-600/10 border border-red-600/20 rounded-lg flex items-center gap-3">
            <AlertCircle size={24} className="text-red-400" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {result && (
          <div
            className={`p-8 rounded-lg border-2 ${
              result.valid
                ? 'bg-green-600/10 border-green-600/30'
                : 'bg-red-600/10 border-red-600/30'
            }`}
          >
            <div className="flex items-center gap-4 mb-6">
              {result.valid ? (
                <CheckCircle2 size={48} className="text-green-400" />
              ) : (
                <AlertCircle size={48} className="text-red-400" />
              )}

              <div>
                <h2
                  className={`text-3xl font-bold ${
                    result.valid ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {result.valid ? 'Valid Ticket' : 'Invalid Ticket'}
                </h2>
                <p className={result.valid ? 'text-green-300' : 'text-red-300'}>
                  {result.message}
                </p>
              </div>
            </div>

            {!result.valid && (
              <div className="text-center">
                <button
                  onClick={handleRescan}
                  className="px-6 py-3 bg-pink-600 text-white rounded-lg"
                >
                  Try Another Scan
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}