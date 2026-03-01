"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            // 1. Register the user
            await api.post('/auth/register', formData);
            setSuccess('Account created! Logging you in...');

            // 2. Automatically log them in immediately after registration to get the JWT
            const loginResponse = await api.post('/auth/login', {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            const { token, user } = loginResponse.data;

            // 3. Store the token internally
            localStorage.setItem('kodflix_token', token);
            localStorage.setItem('kodflix_username', user.username);

            // 4. Redirect locally using hard reload so Navbar initializes properly
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);

        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
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
                    <h2>Sign Up</h2>

                    {error && <div className="alert error">{error}</div>}
                    {success && <div className="alert success">{success}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="input-group">
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number (Optional)"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="input-group">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="primary-btn" disabled={isLoading}>
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="auth-footer mt-4">
                        Already have an account? <Link href="/login">Sign in.</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
