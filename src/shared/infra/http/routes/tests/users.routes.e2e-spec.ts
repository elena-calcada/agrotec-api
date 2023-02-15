import { hash } from "bcryptjs";
import { randomUUID } from "crypto";
import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

import prismaClient from "../../../prisma/prisma.config";
import { app } from "../../app";

describe("Users", () => {
  beforeAll(async () => {
    const passwordHash = await hash("admin", 8);

    await prismaClient.user.create({
      data: {
        name: "admin",
        email: "admin@mail.com",
        password: passwordHash,
        is_admin: true,
        is_executor: true,
      },
    });
  });
  it("Should be able to create a new user", async () => {
    const result = await request(app).post("/users").send({
      name: "user_supertest",
      email: "user_supertest@mail.com",
      password: "123456",
    });

    expect(result.body).toHaveProperty("id");
    expect(result.statusCode).toEqual(201);
  });
  it("Should not be able to create a new user if user already exists", async () => {
    const response = await request(app).post("/users").send({
      name: "user_supertest",
      email: "user_supertest@mail.com",
      password: "123456",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual("User already exists!");
  });
  it("Should be able to authenticate an user", async () => {
    const response = await request(app).post("/users/login").send({
      email: "user_supertest@mail.com",
      password: "123456",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });
  it("Should not be able to authenticate an user if user does not exists", async () => {
    const response = await request(app).post("/users/login").send({
      email: "false_user@mail.com",
      password: "123456",
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual("E-mail or password incorrect!");
  });
  it("Should not be able to authenticate an user with incorrect password", async () => {
    const response = await request(app).post("/users/login").send({
      email: "user_supertest@mail.com",
      password: "incorrect_password",
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual("E-mail or password incorrect!");
  });
  it("Should be able to access the logged in user's datails", async () => {
    const user = await request(app).post("/users/login").send({
      email: "user_supertest@mail.com",
      password: "123456",
    });
    const response = await request(app)
      .get("/users/me")
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toEqual("user_supertest");
  });
  it("Should not be able to access user datails if token missing", async () => {
    const response = await request(app).get("/users/me");

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("Token missing!");
  });
  it("Should not be able to access user datails if invalid token", async () => {
    const response = await request(app).get("/users/me").set({
      Authorization: "Bearer INVALID_TOKEN",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("Invalid Token");
  });
  it("Should be able an user admin to list all users", async () => {
    const userAdmin = await request(app).post("/users/login").send({
      email: "admin@mail.com",
      password: "admin",
    });
    const response = await request(app)
      .get("/users")
      .set({
        Authorization: `Bearer ${userAdmin.body.token}`,
      });

    expect(response.body.length).toBe(2);
    expect(response.body[0].name).toEqual("admin");
    expect(response.body[1].name).toEqual("user_supertest");
  });
  it("Should not be able to list all users if user does not admin", async () => {
    const user = await request(app).post("/users/login").send({
      email: "user_supertest@mail.com",
      password: "123456",
    });

    const response = await request(app)
      .get("/users")
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.body.message).toEqual("This user is not an admin!");
    expect(response.status).toBe(401);
  });
  it("Should not be able to list all users if token missing", async () => {
    const response = await request(app).get("/users");

    expect(response.body.message).toEqual("Token missing!");
    expect(response.status).toBe(401);
  });
  it("Should not be able to list all users if invalid token", async () => {
    const response = await request(app).get("/users").set({
      Authorization: "Bearer INVALID_TOKEN",
    });

    expect(response.body.message).toEqual("Invalid Token");
    expect(response.status).toBe(401);
  });
  it("Should be able an user admin to list users by id", async () => {
    const user = await request(app).post("/users").send({
      name: "user_by_id",
      email: "user_by_id@mail.com",
      password: "123456",
    });

    const userAdmin = await request(app).post("/users/login").send({
      email: "admin@mail.com",
      password: "admin",
    });

    const response = await request(app)
      .get(`/users/${user.body.id}`)
      .set({
        Authorization: `Bearer ${userAdmin.body.token}`,
      });

    expect(response.body.name).toEqual("user_by_id");
    expect(response.body.email).toEqual("user_by_id@mail.com");
  });
  it("Should not be able to list users by id if user does not admin", async () => {
    const id = randomUUID();

    const user = await request(app).post("/users/login").send({
      email: "user_supertest@mail.com",
      password: "123456",
    });

    const response = await request(app)
      .get(`/users/${id}`)
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("This user is not an admin!");
  });
  it("Should not be able to list users by id if token missing", async () => {
    const id = randomUUID();

    const response = await request(app).get(`/users/${id}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Token missing!");
  });
  it("Should not be able to list users by id if invalid token", async () => {
    const id = randomUUID();

    const response = await request(app).get(`/users/${id}`).set({
      Authorization: "Bearer INVALID_TOKEN",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid Token");
  });
  it("Should not be able to list user if user does not exists", async () => {
    const id = randomUUID();

    const userAdmin = await request(app).post("/users/login").send({
      email: "admin@mail.com",
      password: "admin",
    });

    const response = await request(app)
      .get(`/users/${id}`)
      .set({
        Authorization: `Bearer ${userAdmin.body.token}`,
      });
    console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body).toBe("User does not exists!");
  });
  it("Should be possible for an admin user to give admin permission to another user", async () => {
    const userWithoutAccess = await request(app).post("/users").send({
      name: "user_not_admin",
      email: "user_not_admin@mail.com",
      password: "user_not_admin",
    });

    const userAdmin = await request(app).post("/users/login").send({
      email: "admin@mail.com",
      password: "admin",
    });

    const response = await request(app)
      .put("/users/admin")
      .send({
        id: userWithoutAccess.body.id,
      })
      .set({
        Authorization: `Bearer ${userAdmin.body.token}`,
      });

    expect(response.body.name).toEqual("user_not_admin");
    expect(response.body.is_admin).toBe(true);
  });
  it("Should not be possible for an regular user to give admin permission to another user", async () => {
    const id = randomUUID();

    const user = await request(app).post("/users/login").send({
      email: "user_supertest@mail.com",
      password: "123456",
    });

    const response = await request(app)
      .put("/users/admin")
      .send({
        id,
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.body.message).toEqual("This user is not an admin!");
    expect(response.status).toBe(401);
  });
  it("Should not be possible for an admin user to give admin permission to another user if token missing", async () => {
    const id = randomUUID();

    await request(app).post("/users/login").send({
      email: "admin@mail.com",
      password: "admin",
    });

    const response = await request(app).put("/users/admin").send({
      id,
    });

    expect(response.body.message).toEqual("Token missing!");
    expect(response.status).toBe(401);
  });
  it("Should not be possible for an admin user to give admin permission to another user if invalid token", async () => {
    const id = randomUUID();

    await request(app).post("/users/login").send({
      email: "adimin@mail.com",
      password: "admin",
    });

    const response = await request(app)
      .put("/users/admin")
      .send({
        id,
      })
      .set({
        Authorization: "Bearer INVALID_TOKEN",
      });

    expect(response.body.message).toEqual("Invalid Token");
    expect(response.status).toBe(401);
  });
  it("Should not be possible for an admin user to give admin permission to an user that does not exists", async () => {
    const id = randomUUID();

    const user = await request(app).post("/users/login").send({
      email: "admin@mail.com",
      password: "admin",
    });

    const response = await request(app)
      .put("/users/admin")
      .send({
        id,
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.body).toEqual("User does not exists!");
    expect(response.status).toBe(400);
  });
  it("Should be possible for an admin user to give executor permission to another user", async () => {
    const userWithoutAccess = await request(app).post("/users").send({
      name: "user_not_executor",
      email: "user_not_executor@mail.com",
      password: "user_not_executor",
    });

    const userAdmin = await request(app).post("/users/login").send({
      email: "admin@mail.com",
      password: "admin",
    });

    const response = await request(app)
      .put("/users/executor")
      .send({
        id: userWithoutAccess.body.id,
      })
      .set({
        Authorization: `Bearer ${userAdmin.body.token}`,
      });

    expect(response.body.name).toEqual("user_not_executor");
    expect(response.body.is_executor).toBe(true);
  });
  it("Should not be possible for an regular user to give executor permission to another user", async () => {
    const id = randomUUID();

    const user = await request(app).post("/users/login").send({
      email: "user_supertest@mail.com",
      password: "123456",
    });

    const response = await request(app)
      .put("/users/executor")
      .send({
        id,
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.body.message).toEqual("This user is not an admin!");
    expect(response.status).toBe(401);
  });
  it("Should not be possible for an admin user to give executor permission to another user if token missing", async () => {
    const id = randomUUID();

    await request(app).post("/users/login").send({
      email: "admin@mail.com",
      password: "admin",
    });

    const response = await request(app).put("/users/executor").send({
      id,
    });

    expect(response.body.message).toEqual("Token missing!");
    expect(response.status).toBe(401);
  });
  it("Should not be possible for an admin user to give executor permission to another user if invalid token", async () => {
    const id = randomUUID();

    await request(app).post("/users/login").send({
      email: "adimin@mail.com",
      password: "admin",
    });

    const response = await request(app)
      .put("/users/executor")
      .send({
        id,
      })
      .set({
        Authorization: "Bearer INVALID_TOKEN",
      });

    expect(response.body.message).toEqual("Invalid Token");
    expect(response.status).toBe(401);
  });
  it("Should not be possible for an admin user to give executor permission to an user that does not exists", async () => {
    const id = randomUUID();

    const user = await request(app).post("/users/login").send({
      email: "admin@mail.com",
      password: "admin",
    });

    const response = await request(app)
      .put("/users/executor")
      .send({
        id,
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.body).toEqual("User does not exists!");
    expect(response.status).toBe(400);
  });
  it("Should be possible for an admin user to remove admin/executor permission to another user", async () => {
    const userWithoutAccess = await request(app).post("/users").send({
      name: "user_without_access",
      email: "user_without_access@mail.com",
      password: "user_without_access",
    });

    const userAdmin = await request(app).post("/users/login").send({
      email: "admin@mail.com",
      password: "admin",
    });

    const newUserAdmin = await request(app)
      .put("/users/admin")
      .send({
        id: userWithoutAccess.body.id,
      })
      .set({
        Authorization: `Bearer ${userAdmin.body.token}`,
      });

    expect(newUserAdmin.body.is_admin).toBe(true);
    expect(newUserAdmin.body.is_executor).toBe(true);

    const response = await request(app)
      .put("/users/remove-access")
      .send({
        id: userWithoutAccess.body.id,
      })
      .set({
        Authorization: `Bearer ${userAdmin.body.token}`,
      });

    expect(response.body.is_admin).toBe(false);
    expect(response.body.is_executor).toBe(false);
  });
  it("Should not be possible for an regular user to remove admin/executor permission to another user", async () => {
    const id = randomUUID();

    const user = await request(app).post("/users/login").send({
      email: "user_supertest@mail.com",
      password: "123456",
    });

    const response = await request(app)
      .put("/users/remove-access")
      .send({
        id,
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    console.log(user.body.token);

    expect(response.body.message).toBe("This user is not an admin!");
    expect(response.status).toBe(401);
  });
  it("Should not be possible to remove admin/executor permission to another user if token missing", async () => {
    const id = randomUUID();

    const response = await request(app).put("/users/remove-access").send({
      id,
    });

    expect(response.body.message).toBe("Token missing!");
    expect(response.status).toBe(401);
  });
  it("Should not be possible to remove admin/executor permission to another user if invalid token", async () => {
    const id = randomUUID();

    const response = await request(app)
      .put("/users/remove-access")
      .send({
        id,
      })
      .set({
        Authorization: "Bearer INVALID_TOKEN",
      });

    expect(response.body.message).toBe("Invalid Token");
    expect(response.status).toBe(401);
  });
  it("Should not be possible to remove admin/executor permission to non existent user", async () => {
    const id = randomUUID();

    const userAdmin = await request(app).post("/users/login").send({
      email: "admin@mail.com",
      password: "admin",
    });

    const response = await request(app)
      .put("/users/remove-access")
      .send({
        id,
      })
      .set({
        Authorization: `Bearer ${userAdmin.body.token}`,
      });

    expect(response.body).toBe("User does not exists!");
    expect(response.status).toBe(400);
  });
  it("Should be able to update authenticate user name", async () => {
    const user = await request(app).post("/users/login").send({
      email: "user_supertest@mail.com",
      password: "123456",
    });

    const response = await request(app)
      .put("/users/name")
      .send({
        name: "new_name_supertest",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.body.name).toEqual("new_name_supertest");
  });
  it("Should not be able to update user name if token missing", async () => {
    const response = await request(app).put("/users/name").send({
      name: "new_name_supertest",
    });

    expect(response.body.message).toEqual("Token missing!");
    expect(response.status).toBe(401);
  });
  it("Should not be able to update user name if invalid token", async () => {
    const response = await request(app)
      .put("/users/name")
      .send({
        name: "new_name_supertest",
      })
      .set({
        Authorization: "Bearer INVALID_TOKEN",
      });

    expect(response.body.message).toEqual("Invalid Token");
    expect(response.status).toBe(401);
  });
  it("Should not be able to update user name if name is not informed", async () => {
    const user = await request(app).post("/users/login").send({
      email: "user_supertest@mail.com",
      password: "123456",
    });

    const response = await request(app)
      .put("/users/name")
      .send({
        name: "",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.body).toEqual("Name not informed!");
  });
  it("Should be able to update authenticate user password", async () => {
    const user = await request(app).post("/users/login").send({
      email: "user_supertest@mail.com",
      password: "123456",
    });

    await request(app)
      .put("/users/password")
      .send({
        password: "654321",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    const old_password_response = await request(app).post("/users/login").send({
      email: "user_supertest@mail.com",
      password: "123456",
    });

    expect(old_password_response.body).toEqual("E-mail or password incorrect!");

    const new_password_response = await request(app).post("/users/login").send({
      email: "user_supertest@mail.com",
      password: "654321",
    });

    expect(new_password_response.body).toHaveProperty("token");
  });
  it("Should not be able to update user password if token missing", async () => {
    const response = await request(app).put("/users/password").send({
      password: "new_password",
    });

    expect(response.body.message).toEqual("Token missing!");
    expect(response.status).toBe(401);
  });
  it("Should not be able to update user password if invalid token", async () => {
    const response = await request(app)
      .put("/users/password")
      .send({
        password: "new_password",
      })
      .set({
        Authorization: "Bearer INVALID_TOKEN",
      });

    expect(response.body.message).toEqual("Invalid Token");
    expect(response.status).toBe(401);
  });
  it("Should not be able to update user password if password is not informed", async () => {
    const user = await request(app).post("/users/login").send({
      email: "user_supertest@mail.com",
      password: "654321",
    });

    const response = await request(app)
      .put("/users/password")
      .send({
        password: "",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.body[0].message).toEqual("Invalid password");
  });
});
