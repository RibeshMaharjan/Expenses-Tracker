import request from "supertest";
import app from "../app.js";

let cookies = '';

describe('User Routes Test', () => {
  
  beforeAll(async () => {
    const response = await request(app).post('/api/auth/signin')
      .send({
        email: "asura@example.com",
        password: "Asura#123"
      })
    
    cookies = response.headers['set-cookie'];
  });
  
  describe('Update user Profile', () => {
    test('should update users details', async () => {
      const response = await request(app).put('/api/users')
        .set("Cookie", cookies)
        .send({
          name: "Asura 123",
          username: "asura_123",
          email: "asura@example.com"
        });
      
      expect(response.status).toBe(200);
    });
  });
  
  describe('Change user Password', () => {
    test('should change users password', async () => {
      const response = await request(app).put('/api/users/changepassword')
        .set("Cookie", cookies)
        .send({
            currentPassword: "Asura#123",
          newPassword: "Asura#1234",
          confirmPassword: "Asura#1234"
        });
      
      expect(response.status).toBe(200);
    });
  });
});