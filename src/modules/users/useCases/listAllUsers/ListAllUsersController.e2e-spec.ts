import { hash } from "bcryptjs";
import request from "supertest";

import prismaClient from "../../../../prisma";
import { app } from "../../../../shared/app";

describe("List All Users Controller", () => {
  beforeAll(async () => {
    const passwordHashAdmin = await hash("admin2", 8);
    const passwordHashEcxecutor = await hash("executor2", 8);

    await prismaClient.user.create({
      data: {
        name: "admin2",
        email: "admin2@mail.com",
        password: passwordHashAdmin,
        is_admin: true,
        is_executor: true,
      },
    });

    await prismaClient.user.create({
      data: {
        name: "executor2",
        email: "executor2@mail.com",
        password: passwordHashEcxecutor,
        is_admin: false,
        is_executor: true,
      },
    });
  });

  it("Should be able to list all users", async () => {
    const userAdminAuthenticated = await request(app)
      .post("/users/session")
      .send({
        email: "admin2@mail.com",
        password: "admin2",
      });

    const response = await request(app)
      .get("/users")
      .set({ Authorization: `Bearer ${userAdminAuthenticated.body.token}` });

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

  it("Should not be able to list all users if token missing", async () => {
    const response = await request(app).get("/users");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Token missing!");
  });

  it("Should not be able to list all users if their permission is not admin", async () => {
    const userExecutorAuthenticated = await request(app)
      .post("/users/session")
      .send({
        email: "executor2@mail.com",
        password: "executor2",
      });

    const response = await request(app)
      .get("/users")
      .set({ Authorization: `Bearer ${userExecutorAuthenticated.body.token}` });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("This user is not an admin!");
  });

  it("Should not be able to list all users if invalid token", async () => {
    const response = await request(app)
      .get("/users")
      .set({ Authorization: "Bearer invalidToken" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid Token");
  });
});
