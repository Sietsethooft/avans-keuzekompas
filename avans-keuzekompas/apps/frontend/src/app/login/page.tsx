"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { JsonResponse } from '@avans-keuzekompas/utils';

const avansEmailRegex = /^[a-zA-Z0-9._%+-]+@student\.avans\.nl$/;

const LoginPage: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);

    // Validation functions
    const validateEmail = (value: string) => {
        if (!value) return 'Graag een geldige e-mail invullen';
        if (!avansEmailRegex.test(value)) return 'Deze e-mail is ongeldig, volg dit format: naam@student.avans.nl';
        return '';
    };

    const validatePassword = (value: string) => {
        if (!value) return 'Graag een geldig wachtwoord invullen';
        return '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailTouched(true);
        setPasswordTouched(true);

        // Validate inputs
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        if (emailError || passwordError) {
            setError(emailError || passwordError);
            return;
        }

        // try to login
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`;
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            // Parse response
            const data: JsonResponse<{ access_token: string }> = await res.json();

            if (!res.ok || data.status !== 200 || !data.data?.access_token) {
                setError(data.message || 'Het opgegeven e-mailadres of wachtwoord is onjuist.');
                return;
            }

            // Store token and redirect
            localStorage.setItem('token', data.data.access_token);
            router.push('/');
        } catch (err) {
            setError('Er ging iets mis met het inloggen. ' + err);
        }
    };

    return (
        <div className="container mt-5" style={{ width: 500 }}>
            <div className="card p-4 custom-shadow">
                <h2 className="mb-4 text-center">Inloggen</h2>
                <form noValidate onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email:</label>
                        <input
                            type="email"
                            id="email"
                            className={`form-control ${emailTouched && validateEmail(email) ? 'is-invalid' : emailTouched ? 'is-valid' : ''}`}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onBlur={() => setEmailTouched(true)}
                            required
                        />
                        {emailTouched && validateEmail(email) && (
                            <div className="invalid-feedback">
                                {validateEmail(email)}
                            </div>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Wachtwoord:</label>
                        <input
                            type="password"
                            id="password"
                            className={`form-control ${passwordTouched && validatePassword(password) ? 'is-invalid' : passwordTouched ? 'is-valid' : ''}`}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onBlur={() => setPasswordTouched(true)}
                            required
                        />
                        {passwordTouched && validatePassword(password) && (
                            <div className="invalid-feedback">
                                {validatePassword(password)}
                            </div>
                        )}
                    </div>
                    {error && <div className="alert alert-danger mb-3">{error}</div>}
                    <div className="d-flex justify-content-between">
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => router.push("/register")}
                        >
                            Registreren
                        </button>
                        <button type="submit" className="btn btn-primary">Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;