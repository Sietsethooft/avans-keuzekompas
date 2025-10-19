/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

describe('AuthController (e2e)', () => {
  const baseUrl = '/api/auth';

//   it('should register a new user (happy flow)', async () => {
//     const email = `test${Date.now()}@student.avans.nl`;
//     const res = await axios.post(`${baseUrl}/register`, {
//       firstName: 'Test',
//       lastName: 'Gebruiker',
//       email,
//       studentNumber: `${Math.floor(Math.random() * 1e7)}`,
//       password: 'testaccount123',
//     });
//     expect(res.status).toBe(201);
//     expect(res.data.status).toBe(201);
//     expect(res.data.data).toHaveProperty('id');
//     expect(res.data.data).toHaveProperty('email', email);
//   });

  it('should fail to register with duplicate email (unhappy flow)', async () => {
    const email = `testuser@student.avans.nl`;
    // Register first time
    await axios.post(`${baseUrl}/register`, {
      firstName: 'Dup',
      lastName: 'User',
      email,
      studentNumber: `${Math.floor(Math.random() * 1e7)}`,
      password: 'testaccount123',
    });
    // Register with used email
    try {
      await axios.post(`${baseUrl}/register`, {
        firstName: 'Dup',
        lastName: 'User',
        email,
        studentNumber: `${Math.floor(Math.random() * 1e7)}`,
        password: 'testaccount123',
      });
      throw new Error('Should not succeed');
    } catch (err: any) {
      expect(err.response.status).toBe(500);
      expect(err.response.data.message).toMatch(/e-?mail/i);
    }
  });

  it('should login with correct credentials (happy flow)', async () => {
    const email = `testuser@student.avans.nl`;
    const password = 'testaccount123';
    // Register user first
    await axios.post(`${baseUrl}/register`, {
      firstName: 'Login',
      lastName: 'Test',
      email,
      studentNumber: `${Math.floor(Math.random() * 1e7)}`,
      password,
    });
    // Login
    const res = await axios.post(`${baseUrl}/login`, { email, password });
    expect(res.status).toBe(200);
    expect(res.data.status).toBe(200);
    expect(res.data.data).toHaveProperty('access_token');
  });

  it('should fail login with wrong password (unhappy flow)', async () => {
    const email = `failedtestuser@student.avans.nl`;
    const password = 'testaccount123';
    // Register user first
    await axios.post(`${baseUrl}/register`, {
      firstName: 'Fail',
      lastName: 'Login',
      email,
      studentNumber: `${Math.floor(Math.random() * 1e7)}`,
      password,
    });
    // Try wrong password
    try {
      await axios.post(`${baseUrl}/login`, { email, password: 'wrongpass' });
      throw new Error('Should not succeed');
    } catch (err: any) {
      expect(err.response.status).toBe(500);
      expect(err.response.data.message).toMatch(/inlog|wachtwoord|ongeldig/i);
    }
  });
});