"use client";
import React, { useState } from 'react';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }
        setError('');
        // TODO: Add authentication logic here
        alert(`Logged in as: ${email}`);
    };

    return (
        <div style={{ maxWidth: 400, margin: '2rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: 8 }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem' }}
                        required
                    />
                </div>
                {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
                <button type="submit" style={{ padding: '0.5rem 1rem' }}>Login</button>
            </form>
        </div>
    );
};

export default LoginPage;