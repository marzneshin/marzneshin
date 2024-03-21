
import { fetch } from "@marzneshin/utils"
import { LoginSchema, useAuth } from "@marzneshin/features/auth";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from "@marzneshin/components";
import { useTranslation } from "react-i18next";
import { FormError } from "./form-error";

export const LoginForm = () => {
    const { setAuthToken } = useAuth();
    const form = useForm({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            username: '',
            password: '',
        }
    })
    const navigate = useNavigate({ from: '/login' });
    const [error, setError] = useState<string>('');
    const { t } = useTranslation();

    const submit = (values: FieldValues) => {
        setError('');
        const formData = new FormData();
        formData.append('username', values.username);
        formData.append('password', values.password);
        formData.append('grant_type', 'password');
        fetch('/admins/token', { method: 'post', body: formData })
            .then(({ access_token: token }) => {
                setAuthToken(token);
                navigate({ to: '/' });
            })
            .catch((err) => {
                setError(err.response._data?.detail);
            });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)}>
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-semibold text-primary">{t('username')}</FormLabel>
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
                            <FormLabel className="font-semibold text-primary">{t('password')}</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="mt-3 w-full" type="submit">{t('login')}</Button>
                {error && <FormError className="mt-2" title='Submission failed' desc={error} />}
            </form>
        </Form>
    )
}
