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
        <div className="container mt-5" style={{ width: 500 }}>
            <div className="card p-4 custom-shadow">
                <h2 className="mb-4 text-center">Inloggen</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email:</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Wachtwoord:</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="alert alert-danger mb-3">{error}</div>}
                    <div className="d-flex justify-content-between">
                        <button type="submit" className="btn btn-primary">Login</button>
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => window.location.href = "/register"}
                        >
                            Registreren
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;