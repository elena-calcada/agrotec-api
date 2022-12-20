import request from "supertest";

import { app } from "../../../../shared/app";

describe("Create User Controller", () => {
  it("Should be able to create a new user", async () => {
    const response = await request(app).post("/users").send({
      name: "teste name 1",
      email: "teste1@mail.com",
      password: "1230",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("Should not be able to create a new user there is some information missing", async () => {
    const response = await request(app).post("/users").send({
      name: "",
      email: "test@mail.com",
      password: "1230",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("All fields must be filled!");
  });

  it("should not be able to create a user that already exists", async () => {
    await request(app).post("/users").send({
      name: "user exists",
      email: "userexists@mail.com",
      password: "321",
    });

    const response = await request(app).post("/users").send({
      name: "user exists",
      email: "userexists@mail.com",
      password: "321",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User already exists!");
  });
});
