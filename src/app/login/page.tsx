"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function Login() {
    const router = useRouter();
    const [credentials, setCredentials] = useState({ identifier: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/auth/login', {
                username: credentials.identifier,
                email: credentials.identifier,
                password: credentials.password
            });

            const { token, user } = response.data;

            // Store session securely on this domain
            localStorage.setItem('kodflix_token', token);
            localStorage.setItem('kodflix_username', user.username);

            // Redirect internally to the Next.js homepage
            // We force a hard reload here to ensure Navbar state re-initializes 
            // naturally without having to use context for this quick migration.
            window.location.href = '/';

        } catch (err: any) {
            setError(err.response?.data?.error || 'Sorry, we can\'t find an account with this email/username. Please try again or create a new account.');
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <header className="auth-header">
                <Link href="/" className="logo-text">KODFLIX</Link>
            </header>

            <div className="auth-container">
                <div className="auth-card">
                    <h2>Sign In</h2>

                    {error && <div className="alert error">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="input-group">
                            <input
                                type="text"
                                name="identifier"
                                placeholder="Email or username"
                                value={credentials.identifier}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="primary-btn" disabled={isLoading}>
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="auth-footer mt-4">
                        New to Kodflix? <Link href="/register">Sign up now.</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
