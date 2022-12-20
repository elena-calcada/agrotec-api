import { hash } from "bcryptjs";
import request from "supertest";

import prismaClient from "../../../../prisma";
import { app } from "../../../../shared/app";

describe("Delete User Controller", () => {
  beforeAll(async () => {
    const passwordHashAdmin = await hash("admin", 8);
    const passwordHashEcxecutor = await hash("executor", 8);

    await prismaClient.user.create({
      data: {
        name: "admin",
        email: "admin@mail.com",
        password: passwordHashAdmin,
        is_admin: true,
        is_executor: true,
      },
    });

    await prismaClient.user.create({
      data: {
        name: "executor",
        email: "executor@mail.com",
        password: passwordHashEcxecutor,
        is_admin: false,
        is_executor: true,
      },
    });
  });

  it("Should be able an user admin to delete an user", async () => {
    const userAdminAuthenticated = await request(app)
      .post("/users/session")
      .send({
        email: "admin@mail.com",
        password: "admin",
      });

    const newUser = await request(app).post("/users").send({
      name: "New User 1",
      email: "new1@mail.com",
      password: "321",
    });

    const response = await request(app)
      .delete("/users")
      .query({ id: newUser.body.id })
      .set({ Authorization: `Bearer ${userAdminAuthenticated.body.token}` });

    expect(response.status).toBe(200);
  });

  it("Should not be able to delete an user if token missing", async () => {
    const newUser = await request(app).post("/users").send({
      name: "New User 2",
      email: "new2@mail.com",
      password: "321",
    });

    const response = await request(app)
      .delete("/users")
      .query({ id: newUser.body.id });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Token missing!");
  });

  it("Should not be able to delete an user if their permission is not admin", async () => {
    const userExecutorAuthenticated = await request(app)
      .post("/users/session")
      .send({
        email: "executor@mail.com",
        password: "executor",
      });

    const newUser = await request(app).post("/users").send({
      name: "New User 3",
      email: "new3@mail.com",
      password: "321",
    });

    const response = await request(app)
      .delete("/users")
      .query({ id: newUser.body.id })
      .set({ Authorization: `Bearer ${userExecutorAuthenticated.body.token}` });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("This user is not an admin!");
  });

  it("Should not be able to delete an user if ivalidToken", async () => {
    const newUser = await request(app).post("/users").send({
      name: "New User 4",
      email: "new4@mail.com",
      password: "321",
    });

    const response = await request(app)
      .delete("/users")
      .query({ id: newUser.body.id })
      .set({ Authorization: "Bearer invalidToken" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid Token");
  });
});
