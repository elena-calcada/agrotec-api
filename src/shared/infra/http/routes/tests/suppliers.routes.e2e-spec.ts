import { hash } from "bcryptjs";
import { randomUUID } from "crypto";
import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

import prismaClient from "../../../prisma/prisma.config";
import { app } from "../../app";

describe("Suppliers", () => {
  beforeAll(async () => {
    const passwordHash_admin = await hash("admin", 8);
    const passwordHash_executor = await hash("executor", 8);
    const passwordHash_common = await hash("common", 8);

    await prismaClient.user.create({
      data: {
        name: "admin_supplier",
        email: "admin_supplier@mail.com",
        password: passwordHash_admin,
        is_admin: true,
        is_executor: true,
      },
    });

    await prismaClient.user.create({
      data: {
        name: "executor_supplier",
        email: "executor_supplier@mail.com",
        password: passwordHash_executor,
        is_admin: false,
        is_executor: true,
      },
    });

    await prismaClient.user.create({
      data: {
        name: "common_supplier",
        email: "common_supplier@mail.com",
        password: passwordHash_common,
        is_admin: false,
        is_executor: false,
      },
    });
  });
  it("Should be able to create a new supplier", async () => {
    const user = await request(app).post("/users/login").send({
      email: "executor_supplier@mail.com",
      password: "executor",
    });

    const supplier = await request(app)
      .post("/suppliers")
      .send({
        name: "supllier_one",
        description: "Description supplier",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(supplier.body).toHaveProperty("id");
    expect(supplier.status).toBe(201);
  });
  it("Should not be able to create a new supplier if supplier already exists", async () => {
    const user = await request(app).post("/users/login").send({
      email: "executor_supplier@mail.com",
      password: "executor",
    });

    await request(app)
      .post("/suppliers")
      .send({
        name: "supllier_two",
        description: "Description supplier",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    const response = await request(app)
      .post("/suppliers")
      .send({
        name: "supllier_two",
        description: "Description supplier",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.body).toBe("Supplier already exists!");
    expect(response.status).toBe(400);
  });
  it("Should not be able to create a new supplier if name does not informed", async () => {
    const user = await request(app).post("/users/login").send({
      email: "executor_supplier@mail.com",
      password: "executor",
    });

    const supplier = await request(app)
      .post("/suppliers")
      .send({
        name: "",
        description: "Description supplier",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(supplier.body).toBe("Name is required");
    expect(supplier.status).toBe(422);
  });
  it("Should not be able to create a new supplier if user does not admin or executor", async () => {
    const user = await request(app).post("/users/login").send({
      email: "common_supplier@mail.com",
      password: "common",
    });

    const supplier = await request(app)
      .post("/suppliers")
      .send({
        name: "supllier",
        description: "Description supplier",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(supplier.body.message).toBe("This user is not an executor!");
    expect(supplier.status).toBe(401);
  });
  it("Should not be able to create a new supplier if token invalid", async () => {
    const supplier = await request(app)
      .post("/suppliers")
      .send({
        name: "supllier",
        description: "Description supplier",
      })
      .set({
        Authorization: "Bearer INVALID_TOKEN",
      });

    expect(supplier.body.message).toBe("Invalid Token");
    expect(supplier.status).toBe(401);
  });
  it("Should not be able to create a new supplier if token missing", async () => {
    const supplier = await request(app).post("/suppliers").send({
      name: "supllier",
      description: "Description supplier",
    });

    expect(supplier.body.message).toBe("Token missing!");
    expect(supplier.status).toBe(401);
  });
  it("Should be able to list detail a supplier", async () => {
    const user = await request(app).post("/users/login").send({
      email: "executor_supplier@mail.com",
      password: "executor",
    });

    const supplier = await request(app)
      .post("/suppliers")
      .send({
        name: "supllier_three",
        description: "Description supplier",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    const response = await request(app)
      .get(`/suppliers/detail/${supplier.body.id}`)
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toEqual("supllier_three");
  });
  it("Should not be able to list detail a supplier if supplier does not exists", async () => {
    const id = randomUUID();

    const user = await request(app).post("/users/login").send({
      email: "executor_supplier@mail.com",
      password: "executor",
    });

    const response = await request(app)
      .get(`/suppliers/detail/${id}`)
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.body).toBe("Supplier does not exists!");
    expect(response.status).toBe(400);
  });
  it("Should not be able to list detail a supplier if user does not admin or executor", async () => {
    const id = randomUUID();

    const user = await request(app).post("/users/login").send({
      email: "common_supplier@mail.com",
      password: "common",
    });

    const response = await request(app)
      .get(`/suppliers/detail/${id}`)
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.body.message).toBe("This user is not an executor!");
    expect(response.status).toBe(401);
  });
  it("Should not be able to list detail a supplier if invalid token", async () => {
    const id = randomUUID();

    const response = await request(app).get(`/suppliers/detail/${id}`).set({
      Authorization: "Bearer INVALID_TOKEN",
    });

    expect(response.body.message).toBe("Invalid Token");
    expect(response.status).toBe(401);
  });
  it("Should not be able to list detail a supplier if token missing", async () => {
    const id = randomUUID();

    const response = await request(app).get(`/suppliers/detail/${id}`);

    expect(response.body.message).toBe("Token missing!");
    expect(response.status).toBe(401);
  });
  it("Should be able to list all suppliers", async () => {
    const user = await request(app).post("/users/login").send({
      email: "executor_supplier@mail.com",
      password: "executor",
    });

    const response = await request(app)
      .get("/suppliers")
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.body.length).toBe(3);
  });
  it("Should not be able to list all suppliers if user does not admin or executor", async () => {
    const user = await request(app).post("/users/login").send({
      email: "common_supplier@mail.com",
      password: "common",
    });

    const response = await request(app)
      .get("/suppliers")
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.body.message).toBe("This user is not an executor!");
    expect(response.status).toBe(401);
  });
  it("Should not be able to list all suppliers if invalid token", async () => {
    const response = await request(app).get("/suppliers").set({
      Authorization: "Bearer INVALID_TOKEN",
    });

    expect(response.body.message).toBe("Invalid Token");
    expect(response.status).toBe(401);
  });
  it("Should not be able to list all suppliers if token missing", async () => {
    const response = await request(app).get("/suppliers");

    expect(response.body.message).toBe("Token missing!");
    expect(response.status).toBe(401);
  });
  it("Should be able to update a supplier", async () => {
    const user = await request(app).post("/users/login").send({
      email: "executor_supplier@mail.com",
      password: "executor",
    });

    const supplier = await request(app)
      .post("/suppliers")
      .send({
        name: "supllier_four",
        description: "Description supplier",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    const supplierUpdated = await request(app)
      .put("/suppliers")
      .send({
        id: supplier.body.id,
        name: "new_supplier_four",
        description: "",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(supplier.body.id).toEqual(supplierUpdated.body.id);
    expect(supplierUpdated.body.name).toEqual("new_supplier_four");
    expect(supplierUpdated.body.description).toEqual("");
  });
  it("Should not be able to update a supplier if supplier does not exists", async () => {
    const id = randomUUID();
    const user = await request(app).post("/users/login").send({
      email: "executor_supplier@mail.com",
      password: "executor",
    });

    const supplierUpdated = await request(app)
      .put("/suppliers")
      .send({
        id,
        name: "new_supplier_four",
        description: "",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(supplierUpdated.status).toEqual(400);
    expect(supplierUpdated.body).toEqual("Supplier does not exists!");
  });
  it("Should not be able to update a supplier if name does not informed", async () => {
    const user = await request(app).post("/users/login").send({
      email: "executor_supplier@mail.com",
      password: "executor",
    });

    const supplier = await request(app)
      .post("/suppliers")
      .send({
        name: "supllier_four",
        description: "Description supplier",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    const supplierUpdated = await request(app)
      .put("/suppliers")
      .send({
        id: supplier.body.id,
        name: "",
        description: "new description",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(supplierUpdated.body).toEqual("Name is required!");
    expect(supplierUpdated.status).toEqual(400);
  });
  it("Should not be able to update a supplier if user does not admin or executor", async () => {
    const user = await request(app).post("/users/login").send({
      email: "common_supplier@mail.com",
      password: "common",
    });

    const supplier = await request(app)
      .post("/suppliers")
      .send({
        name: "supllier_fiv",
        description: "Description supplier",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    const supplierUpdated = await request(app)
      .put("/suppliers")
      .send({
        id: supplier.body.id,
        name: "new_supplier_fiv",
        description: "",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(supplierUpdated.body.message).toEqual(
      "This user is not an executor!"
    );
    expect(supplierUpdated.status).toEqual(401);
  });
  it("Should not be able to update a supplier if invalid token", async () => {
    const id = randomUUID();

    const supplierUpdated = await request(app)
      .put("/suppliers")
      .send({
        id,
        name: "new_supplier_fiv",
        description: "",
      })
      .set({
        Authorization: "Bearer INVALID_TOKEN",
      });

    expect(supplierUpdated.body.message).toEqual("Invalid Token");
    expect(supplierUpdated.status).toEqual(401);
  });
  it("Should not be able to update a supplier if token missing", async () => {
    const id = randomUUID();

    const supplierUpdated = await request(app).put("/suppliers").send({
      id,
      name: "new_supplier_fiv",
      description: "",
    });

    expect(supplierUpdated.body.message).toEqual("Token missing!");
    expect(supplierUpdated.status).toEqual(401);
  });
});
