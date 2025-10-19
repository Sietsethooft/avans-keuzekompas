import axios from 'axios';

const baseUrl = '/api/module';
const loginUrl = '/api/auth/login';

let token: string;

beforeAll(async () => {
  const res = await axios.post(loginUrl, {
    email: 'testuser@student.avans.nl',
    password: 'testaccount123',
  });
  token = res.data?.data?.access_token || res.data?.data?.token;
});

describe('ModuleController (e2e)', () => {
  let createdModuleId: string;

  it('should get all modules (happy flow)', async () => {
    const res = await axios.get(baseUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(200);
    expect(res.data.status).toBe(200);
    expect(Array.isArray(res.data.data)).toBe(true);
    expect(res.data.data.length).toBeGreaterThan(0);
  });

  it('should create a new module (happy flow)', async () => {
    const mod = {
      title: 'Testmodule E2E',
      description: 'E2E test module',
      location: 'Breda',
      period: 'P1',
      studentCredits: 3,
      language: 'NL',
      level: 'Jaar 1',
      duration: '4 weken',
      offeredBy: 'Testopleiding',
    };
    const res = await axios.post(baseUrl, mod, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(201);
    expect(res.data.status).toBe(201);
    expect(res.data.data).toHaveProperty('id');
    createdModuleId = res.data.data.id;
  });

  it('should get module by id (happy flow)', async () => {
    const res = await axios.get(`${baseUrl}/${createdModuleId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(200);
    expect(res.data.status).toBe(200);
    expect(res.data.data).toHaveProperty('title', 'Testmodule E2E');
  });

  it('should toggle favorite for module (happy flow)', async () => {
    const res = await axios.put(`${baseUrl}/favorite/${createdModuleId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(200);
    expect(res.data.status).toBe(200);
    expect(res.data.data).toHaveProperty('isFavorite');
    expect(Array.isArray(res.data.data.favorites)).toBe(true);
  });

  it('should return 404 for unknown module (unhappy flow)', async () => {
    try {
      await axios.get(`${baseUrl}/unknownid`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      throw new Error('Should not succeed');
    } catch (err: any) {
      expect(err.response.status).toBe(404);
      expect(err.response.data.message).toMatch(/not found/i);
    }
  });
});