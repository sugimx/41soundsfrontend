'use client';

import { useEffect, useState } from 'react';
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
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (!token) return;

    const qrScanner = new Html5QrcodeScanner(
      'reader',
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    setScanner(qrScanner);

    qrScanner.render(
      async (decodedText) => {
        try {
          setError('');
          setIsScanning(false);
          const data = await adminApi.qrScanner(token, decodedText);

          console.log("API Response:", data);

          setResult(data);

          if (data.valid) {
            qrScanner.pause();
          } else {
            setIsScanning(true);
          }
        } catch (err) {
          console.error('Scan error:', err);
          setResult({
        valid: false,
        message: 'Unable to validate ticket',
      });

      setError('Failed to validate ticket');
      setIsScanning(true);
        }
      },
      () => {}
    );

    return () => {
      qrScanner.clear().catch(() => {});
    };
  }, [token]);

  const handleRescan = () => {
    setResult(null);
    setError('');
    setIsScanning(true);
    if (scanner) {
      scanner.resume();
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 lg:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Concert QR Scanner</h1>
          <p className="text-gray-400">Scan customer tickets at event entrance</p>
        </div>

        {/* Scanner Container */}
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
                className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
              >
                Scan Another Ticket
              </button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-600/10 border border-red-600/20 rounded-lg flex items-center gap-3">
            <AlertCircle size={24} className="text-red-400 shrink-0" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Result Card */}
        {result && (
          <div
            className={`p-8 rounded-lg border-2 ${
              result.valid
                ? 'bg-green-600/10 border-green-600/30'
                : 'bg-red-600/10 border-red-600/30'
            }`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="shrink-0">
                {result.valid ? (
                  <CheckCircle2 size={48} className="text-green-400" />
                ) : (
                  <AlertCircle size={48} className="text-red-400" />
                )}
              </div>
              <div>
                <h2
                  className={`text-3xl font-bold ${
                    result.valid ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {result.valid ? '✅ Valid Ticket' : '❌ Invalid Ticket'}
                </h2>
                <p className={result.valid ? 'text-green-300' : 'text-red-300'}>
                  {result.message}
                </p>
              </div>
            </div>

            {result.valid && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-700">
                {result.name && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Name</p>
                    <p className="text-white text-xl font-semibold">{result.name}</p>
                  </div>
                )}
                {result.email && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Email</p>
                    <p className="text-white text-lg break-all">{result.email}</p>
                  </div>
                )}
                {result.ticketTier && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Ticket Tier</p>
                    <p className="text-white text-xl font-semibold">{result.ticketTier}</p>
                  </div>
                )}
                {result.ticketId && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Ticket ID</p>
                    <p className="text-white text-lg font-mono">{result.ticketId}</p>
                  </div>
                )}
              </div>
            )}

            {!result.valid && (
              <div className="pt-4 text-center">
                <button
                  onClick={handleRescan}
                  className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
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