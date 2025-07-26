import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from '@marzneshin/common/components';
import { fetch } from '@marzneshin/common/utils';
import { useQuery } from '@tanstack/react-query'; // --- ADDED: For data fetching ---
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// --- ADDED: Define a type for the admin data we expect from the API ---
type AdminData = {
  is_otp_enabled: boolean;
  username: string;
  // ... other admin properties if needed
};

export const Admin2FASetup = () => {
  const { t } = useTranslation();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);

  // --- MODIFIED: Use useQuery to fetch the current admin's data ---
  const {
    data: adminData,
    refetch,
    isLoading,
  } = useQuery<AdminData>({
    queryKey: ['currentAdmin'],
    queryFn: () => fetch('/admins/current'),
  });
  // -------------------------------------------------------------

  const is2FAEnabled = adminData?.is_otp_enabled || false;

  const handleEnable = async () => {
    setError(null);
    try {
      const response = await fetch('/admins/current/otp/enable', {
        method: 'post',
      });
      setQrCode(URL.createObjectURL(response));
    } catch (err: any) {
      setError(err.response?._data?.detail || 'Failed to start 2FA setup.');
    }
  };

  const handleVerify = async () => {
    setError(null);
    try {
      await fetch('/admins/current/otp/verify', {
        method: 'post',
        body: { token: otp },
      });
      setQrCode(null);
      setOtp('');
      refetch(); // --- This now comes from useQuery and will work ---
      alert('2FA enabled successfully!');
    } catch (err: any) {
      setError(err.response?._data?.detail || 'Invalid OTP token. Please try again.');
    }
  };

  const handleDisable = async () => {
    if (!otp) {
      setError('Please enter a code from your authenticator app to disable 2FA.');
      return;
    }
    setError(null);
    try {
      await fetch('/admins/current/otp/disable', {
        method: 'post',
        body: { token: otp },
      });
      setOtp('');
      refetch(); // --- This now comes from useQuery and will work ---
      alert('2FA disabled successfully!');
    } catch (err: any) {
      setError(err.response?._data?.detail || 'Invalid OTP token. Please try again.');
    }
  };

  // --- ADDED: A loading state while fetching admin data ---
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('Two-Factor Authentication (2FA)')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{t('Loading...')}</p>
        </CardContent>
      </Card>
    );
  }
  // --------------------------------------------------------

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Two-Factor Authentication (2FA)')}</CardTitle>
        <CardDescription>
          {t('Add an extra layer of security to your account by requiring a one-time code to log in.')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {is2FAEnabled ? (
          <div className="space-y-4">
            <p className="text-sm font-medium text-green-600">
              {t('2FA is currently enabled on your account.')}
            </p>
            <div>
              <label htmlFor="otp-disable" className="text-sm font-medium">
                {t('Enter code to disable')}
              </label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="otp-disable"
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  autoComplete="one-time-code"
                />
                <Button variant="destructive" onClick={handleDisable}>
                  {t('Disable 2FA')}
                </Button>
              </div>
            </div>
          </div>
        ) : qrCode ? (
          <div className="space-y-4 text-center">
            <div>
              <h3 className="text-lg font-semibold">{t('1. Scan QR Code')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('Use an authenticator app like Google Authenticator or Authy.')}
              </p>
            </div>
            <div className="flex justify-center">
              <img src={qrCode} alt="2FA QR Code" className="p-2 border rounded-md bg-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{t('2. Verify Code')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('Enter the 6-digit code from your app to finish setup.')}
              </p>
            </div>
            <div className="flex gap-2 justify-center">
              <Input
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="max-w-xs"
              />
              <Button onClick={handleVerify}>{t('Verify & Activate')}</Button>
            </div>
          </div>
        ) : (
          <Button onClick={handleEnable}>{t('Enable 2FA')}</Button>
        )}
        {error && <p className="text-sm font-medium text-destructive mt-4">{error}</p>}
      </CardContent>
    </Card>
  );
};