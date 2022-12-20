import request from "supertest";

import { app } from "../../../../shared/app";

describe("Detail User Controller", () => {
  it("Should be able to access the logged in user's datails", async () => {
    await request(app).post("/users").send({
      name: "Maria",
      email: "maria@mail.com",
      password: "123",
    });

    const userAuthenticated = await request(app).post("/users/session").send({
      email: "maria@mail.com",
      password: "123",
    });

    const response = await request(app)
      .get("/users/detail")
      .set({ Authorization: `Bearer ${userAuthenticated.body.token}` });

    expect(response.status).toBe(200);
  });

  it("Should be not be able to access user detail if token missing", async () => {
    const response = await request(app).get("/users/detail");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Token missing!");
  });

  it("Should be not be able to access user detail if invalid token", async () => {
    const response = await request(app)
      .get("/users/detail")
      .set({ Authorization: "Bearer invalidToken" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid Token");
  });
});
