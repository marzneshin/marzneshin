import { fetch } from '@marzneshin/common/utils';
import { LoginSchema, useAuth } from '@marzneshin/modules/auth';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@marzneshin/common/components';
import { useTranslation } from 'react-i18next';
import { FormError } from './form-error';

export const LoginForm = () => {
  const { setAuthToken, setSudo } = useAuth();
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: '',
      password: '',
      otp: '',
    },
  });
  const navigate = useNavigate({ from: '/login' });
  const [error, setError] = useState<string>('');
  const [otpRequired, setOtpRequired] = useState(false);
  const { t } = useTranslation();

  const submit = async (values: FieldValues) => {
    setError('');
    const formData = new FormData();
    formData.append('username', values.username);
    formData.append('password', values.password);
    formData.append('grant_type', 'password');

    // This part adds the 2FA code if the form is in OTP mode
    if (otpRequired && values.otp) {
      formData.append('client_secret', values.otp);
    }

    try {
      const { access_token, is_sudo } = await fetch('/admins/token', {
        method: 'post',
        body: formData,
      });
      setAuthToken(access_token);
      setSudo(is_sudo);
      navigate({ to: '/' });
    } catch (err: any) {
      // This is the key logic that checks for the 2FA requirement
      const errorDetail = err.response?._data?.detail;
      if (errorDetail?.otp_required) {
        setOtpRequired(true); // This tells the form to switch to OTP mode
      } else {
        setError(errorDetail || 'An error occurred');
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)}>
        {/* This is the logic that shows/hides the OTP field */}
        {otpRequired ? (
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-primary">
                  {t('One-Time Code')}
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="123456"
                    autoComplete="one-time-code"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-primary">
                    {t('username')}
                  </FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-primary">
                    {t('password')}
                  </FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <Button className="mt-3 w-full" type="submit">
          {t(otpRequired ? 'Verify & Login' : 'login')}
        </Button>
        {error && (
          <FormError
            className="mt-2"
            title="Submission failed"
            desc={error}
          />
        )}
      </form>
    </Form>
  );
};