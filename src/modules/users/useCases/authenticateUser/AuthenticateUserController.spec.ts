import request from "supertest";

import { app } from "../../../../shared/app";

describe("Authenticate User Controller", () => {
  it("Should be able to authenticate an user", async () => {
    await request(app).post("/users").send({
      name: "Fulana",
      email: "fulana@mail.com",
      password: "123",
    });

    const response = await request(app).post("/users/session").send({
      email: "fulana@mail.com",
      password: "123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("Should not be able to authenticate an user that not exists", async () => {
    const response = await request(app).post("/users/session").send({
      email: "false@mail.com",
      password: "falsepassword",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("E-mail or password incorrect!");
  });

  it("Should not be able to authenticate an user if the email or password is incorrect", async () => {
    await request(app).post("/users").send({
      name: "new user",
      email: "user@mail.com",
      password: "123",
    });

    const response = await request(app).post("/users/session").send({
      email: "false@mail.com",
      password: "123",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("E-mail or password incorrect!");
  });
});
