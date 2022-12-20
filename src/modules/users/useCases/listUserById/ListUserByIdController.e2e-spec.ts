import { hash } from "bcryptjs";
import request from "supertest";

import prismaClient from "../../../../prisma";
import { app } from "../../../../shared/app";

describe("List User by Id Controller", () => {
  beforeAll(async () => {
    const passwordHashAdmin = await hash("admin3", 8);
    const passwordHashEcxecutor = await hash("executor3", 8);

    await prismaClient.user.create({
      data: {
        name: "admin3",
        email: "admin3@mail.com",
        password: passwordHashAdmin,
        is_admin: true,
        is_executor: true,
      },
    });

    await prismaClient.user.create({
      data: {
        name: "executor3",
        email: "executor3@mail.com",
        password: passwordHashEcxecutor,
        is_admin: false,
        is_executor: true,
      },
    });
  });

  it("Should be able to list an user by id", async () => {
    const userAdminAuthenticated = await request(app)
      .post("/users/session")
      .send({
        email: "admin3@mail.com",
        password: "admin3",
      });

    const newUser = await request(app).post("/users").send({
      name: "Ulisses",
      email: "Ulisses@mail.com",
      password: "321",
    });

    const response = await request(app)
      .get("/users/detail/id")
      .query({ id: newUser.body.id })
      .set({ Authorization: `Bearer ${userAdminAuthenticated.body.token}` });

    expect(response.status).toBe(200);
    expect(response.body.name).toEqual("Ulisses");
  });

  it("Should not be able to list an user if not exists", async () => {
    const userAdminAuthenticated = await request(app)
      .post("/users/session")
      .send({
        email: "admin3@mail.com",
        password: "admin3",
      });

    const response = await request(app)
      .get("/users/detail/id")
      .query({ id: "invalidId" })
      .set({ Authorization: `Bearer ${userAdminAuthenticated.body.token}` });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User does not exists!");
  });

  it("Should not be able to list an user by id if their permission is not admin", async () => {
    const userExecutorAuthenticated = await request(app)
      .post("/users/session")
      .send({
        email: "executor3@mail.com",
        password: "executor3",
      });

    const newUser = await request(app).post("/users").send({
      name: "Ulisses2",
      email: "Ulisses2@mail.com",
      password: "321",
    });

    const response = await request(app)
      .get("/users/detail/id")
      .send({ id: newUser.body.id })
      .set({ Authorization: `Bearer ${userExecutorAuthenticated.body.token}` });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("This user is not an admin!");
  });

  it("Should not be able to list user by id if token missing", async () => {
    const newUser = await request(app).post("/users").send({
      name: "Ulisses3",
      email: "Ulisses3@mail.com",
      password: "321",
    });

    const response = await request(app)
      .get("/users/detail/id")
      .send({ id: newUser.body.id });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Token missing!");
  });

  it("Should not be able to list user by id if invalid token", async () => {
    const newUser = await request(app).post("/users").send({
      name: "Ulisses4",
      email: "Ulisses4@mail.com",
      password: "321",
    });

    const response = await request(app)
      .get("/users/detail/id")
      .send({ id: newUser.body.id })
      .set({ Authorization: "Bearer invalidToken" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid Token");
  });
});
