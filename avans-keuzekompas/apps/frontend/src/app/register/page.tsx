"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { JsonResponse } from '@avans-keuzekompas/utils';

const avansEmailRegex = /^[a-zA-Z0-9._%+-]+@student\.avans\.nl$/;
const studentNumberRegex = /^[0-9]{7,}$/;

const RegisterPage: React.FC = () => {
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [studentNumber, setStudentNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [touched, setTouched] = useState({
        firstName: false,
        lastName: false,
        email: false,
        studentNumber: false,
        password: false,
    });

    // Validation functions
    const validateFirstName = (value: string) => !value ? 'Graag een voornaam invullen' : '';
    const validateLastName = (value: string) => !value ? 'Graag een achternaam invullen' : '';
    const validateEmail = (value: string) => {
        if (!value) return 'Graag een geldige e-mail invullen';
        if (!avansEmailRegex.test(value)) return 'Deze e-mail is ongeldig, volg dit format: naam@student.avans.nl';
        return '';
    };
    const validateStudentNumber = (value: string) => {
        if (!value) return 'Graag een studentnummer invullen';
        if (!studentNumberRegex.test(value)) return 'Studentnummer moet minimaal 7 cijfers zijn';
        return '';
    };
    const validatePassword = (value: string) => {
        if (!value) return 'Graag een geldig wachtwoord invullen';
        if (value.length < 8) return 'Wachtwoord moet minimaal 8 tekens lang zijn';
        return '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({
            firstName: true,
            lastName: true,
            email: true,
            studentNumber: true,
            password: true,
        });

        // Validate all fields
        const errors = [
            validateFirstName(firstName),
            validateLastName(lastName),
            validateEmail(email),
            validateStudentNumber(studentNumber),
            validatePassword(password),
        ].filter(Boolean);

        // If there are validation errors, show the first one
        if (errors.length > 0) {
            setError(errors[0]);
            return;
        }

        // Submit registration data to API
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`;
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, email, studentNumber, password }),
            });

            const data: JsonResponse<null> = await res.json();

            if (!res.ok || data.status !== 201) {
                setError(data.message || 'Registratie mislukt.');
                return;
            }

            router.push('/login');
        } catch (err) {
            setError('Er ging iets mis met registreren. ' + err);
        }
    };

    return (
        <div className="container mt-5" style={{ width: 500 }}>
            <div className="card p-4 custom-shadow">
                <h2 className="mb-4 text-center">Registreren</h2>
                <form noValidate onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="firstName" className="form-label">Voornaam:</label>
                        <input
                            type="text"
                            id="firstName"
                            className={`form-control ${touched.firstName && validateFirstName(firstName) ? 'is-invalid' : touched.firstName ? 'is-valid' : ''}`}
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            onBlur={() => setTouched(t => ({ ...t, firstName: true }))}
                            required
                        />
                        {touched.firstName && validateFirstName(firstName) && (
                            <div className="invalid-feedback">{validateFirstName(firstName)}</div>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="lastName" className="form-label">Achternaam:</label>
                        <input
                            type="text"
                            id="lastName"
                            className={`form-control ${touched.lastName && validateLastName(lastName) ? 'is-invalid' : touched.lastName ? 'is-valid' : ''}`}
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            onBlur={() => setTouched(t => ({ ...t, lastName: true }))}
                            required
                        />
                        {touched.lastName && validateLastName(lastName) && (
                            <div className="invalid-feedback">{validateLastName(lastName)}</div>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email:</label>
                        <input
                            type="email"
                            id="email"
                            className={`form-control ${touched.email && validateEmail(email) ? 'is-invalid' : touched.email ? 'is-valid' : ''}`}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onBlur={() => setTouched(t => ({ ...t, email: true }))}
                            required
                        />
                        {touched.email && validateEmail(email) && (
                            <div className="invalid-feedback">{validateEmail(email)}</div>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="studentNumber" className="form-label">Studentnummer:</label>
                        <input
                            type="text"
                            id="studentNumber"
                            className={`form-control ${touched.studentNumber && validateStudentNumber(studentNumber) ? 'is-invalid' : touched.studentNumber ? 'is-valid' : ''}`}
                            value={studentNumber}
                            onChange={e => setStudentNumber(e.target.value)}
                            onBlur={() => setTouched(t => ({ ...t, studentNumber: true }))}
                            required
                        />
                        {touched.studentNumber && validateStudentNumber(studentNumber) && (
                            <div className="invalid-feedback">{validateStudentNumber(studentNumber)}</div>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Wachtwoord:</label>
                        <input
                            type="password"
                            id="password"
                            className={`form-control ${touched.password && validatePassword(password) ? 'is-invalid' : touched.password ? 'is-valid' : ''}`}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onBlur={() => setTouched(t => ({ ...t, password: true }))}
                            required
                        />
                        {touched.password && validatePassword(password) && (
                            <div className="invalid-feedback">{validatePassword(password)}</div>
                        )}
                    </div>
                    {error && <div className="alert alert-danger mb-3">{error}</div>}
                    <div className="d-flex justify-content-between">
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => router.push("/login")}
                        >
                            Inloggen
                        </button>
                        <button type="submit" className="btn btn-primary">Registreren</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;