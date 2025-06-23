import request from "supertest";
import app from "../app.js";

let cookies = '';

describe("Bank Route Testing" , () => {

  // login to retrieve the cookies
  beforeAll(async () => {
    const res = await request(app).post("/api/auth/signin").send({
      email: "asura@example.com",
      password: "Asura#123"
    });
    
    cookies = res.headers['set-cookie'];
  });
  
  describe("Bank Testing", () => {
    test("create bank account", async () => {
      const response = await request(app).post("/api/bankaccount/createaccount")
        .set("Cookie", cookies)
        .send({
        account_no: `${Date.now()}`,
        account_holder_name: `Test${Date.now()}`,
        bank_name: `Test Bank${Date.now()}`,
        balance: 12000,
      });
      
      expect(response.status).toBe(201);
    });
  });
});
