import request from 'supertest';
import app from '../app.js';

describe('Auth Testing', () => {
  describe('User SignIn Tests', () => {
    test('User should login', async () => {
      const response = await request(app).post(`/api/auth/signin`).send({
        email: "asura@example.com",
        password: "Asura#123"
      });
      
      expect(response.status).toBe(200);
    });
  });
  
  describe('User SignUp Tests', () => {
    test('New user should be created', async () => {
      const userInfo = {
        fullname: "Test User",
        username: `user${Date.now()}`,
        password: "Test#123",
        confirmPassword: "Test#123",
        email: `user${Date.now()}@example.com`
      };

      const response = await request(app).post(`/api/auth/signup`).send({
        ...userInfo
      });

      expect(response.status).toBe(201);
    });
  });
});