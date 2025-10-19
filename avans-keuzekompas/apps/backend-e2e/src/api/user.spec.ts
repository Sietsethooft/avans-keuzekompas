import axios from 'axios';

describe('UserController (e2e)', () => {
  const baseUrl = '/api';
  let userId: string;
  let token: string;
  let email: string;

  beforeAll(async () => {
    email = `e2euser${Date.now()}@student.avans.nl`;
    const registerRes = await axios.post(`${baseUrl}/auth/register`, {
      firstName: 'E2E',
      lastName: 'User',
      email,
      studentNumber: `${Math.floor(Math.random() * 1e7)}`,
      password: 'testaccount123',
    });
    userId = registerRes.data.data.id;

    const loginRes = await axios.post(`${baseUrl}/auth/login`, {
      email,
      password: 'testaccount123',
    });
    token = loginRes.data.data.access_token;
  });

  it('should get own profile (happy flow)', async () => {
    const res = await axios.get(`${baseUrl}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(200);
    expect(res.data.data).toHaveProperty('email', email);
  });

  it('should get user by id (happy flow)', async () => {
    const res = await axios.get(`${baseUrl}/user/${userId}`);
    expect(res.status).toBe(200);
    expect(res.data.data).toHaveProperty('id', userId);
  });

  it('should update user (happy flow)', async () => {
    const res = await axios.put(
      `${baseUrl}/user/${userId}`,
      { firstName: 'E2E-updated' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    expect(res.status).toBe(200);
    expect(res.data.data).toHaveProperty('firstName', 'E2E-updated');
  });

  it('should delete user (happy flow)', async () => {
    const res = await axios.delete(`${baseUrl}/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(200);
    try {
      await axios.get(`${baseUrl}/user/${userId}`);
      throw new Error('Should not succeed');
    } catch (err: any) {
      expect(err.response.status).toBe(500);
    }
  });
});