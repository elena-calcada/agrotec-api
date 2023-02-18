import { hash } from "bcryptjs";
import { randomUUID } from "crypto";
import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

import prismaClient from "../../../prisma/prisma.config";
import { app } from "../../app";

describe("Categories", () => {
  beforeAll(async () => {
    const passwordHash_admin = await hash("admin", 8);
    const passwordHash_executor = await hash("executor", 8);
    const passwordHash_common = await hash("common", 8);

    await prismaClient.user.create({
      data: {
        name: "admin_category",
        email: "admin_category@mail.com",
        password: passwordHash_admin,
        is_admin: true,
        is_executor: true,
      },
    });

    await prismaClient.user.create({
      data: {
        name: "executor_category",
        email: "executor_category@mail.com",
        password: passwordHash_executor,
        is_admin: false,
        is_executor: true,
      },
    });

    await prismaClient.user.create({
      data: {
        name: "common_category",
        email: "common_category@mail.com",
        password: passwordHash_common,
        is_admin: false,
        is_executor: false,
      },
    });
  });
  it("Should be able to create a new category group", async () => {
    const user = await request(app).post("/users/login").send({
      email: "executor_category@mail.com",
      password: "executor",
    });

    const response = await request(app)
      .post("/categories/group")
      .send({
        name: "category_group_supertest",
        description: "Category group created for supertest",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toEqual("category_group_supertest");
  });
  it("Should not be able to create a new category group if group already exists", async () => {
    const user = await request(app).post("/users/login").send({
      email: "executor_category@mail.com",
      password: "executor",
    });
    const response = await request(app)
      .post("/categories/group")
      .send({
        name: "category_group_supertest",
        description: "Category group created for supertest",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual("Category group already exists!");
  });
  it("Should not be able to create a new category group by a user without admin or executor access", async () => {
    const user = await request(app).post("/users/login").send({
      email: "common_category@mail.com",
      password: "common",
    });
    const response = await request(app)
      .post("/categories/group")
      .send({
        name: "category_group",
        description: "Category group created for supertest",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("This user is not an executor!");
  });
  it("Should not be able to create a new category group if token missing", async () => {
    const response = await request(app).post("/categories/group").send({
      name: "category_group",
      description: "Category group created for supertest",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("Token missing!");
  });
  it("Should not be able to create a new category group if invalid token", async () => {
    const response = await request(app)
      .post("/categories/group")
      .send({
        name: "category_group",
        description: "Category group created for supertest",
      })
      .set({
        Authorization: "Bearer INVALID_TOKEN",
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("Invalid Token");
  });
  it("Should not be able to create a new category group if name not imfomed", async () => {
    const user = await request(app).post("/users/login").send({
      email: "executor_category@mail.com",
      password: "executor",
    });

    const response = await request(app)
      .post("/categories/group")
      .send({
        name: "",
        description: "Category group created for supertest",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.status).toBe(422);
    expect(response.body).toEqual("Name is required");
  });
  it("Should be able to delete a category group", async () => {
    const user = await request(app).post("/users/login").send({
      email: "executor_category@mail.com",
      password: "executor",
    });

    const group = await request(app)
      .post("/categories/group")
      .send({
        name: "group_to_be_deleted",
        description: "Category group created to be deleted",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(group.body.name).toEqual("group_to_be_deleted");

    await request(app)
      .delete(`/categories/group/${group.body.id}`)
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    const response = await request(app)
      .get(`/categories/group/detail/${group.body.id}`)
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual("Group does not exists!");
  });
  it("Should not be able to delete a category group if group does not exists", async () => {
    const id = randomUUID();

    const user = await request(app).post("/users/login").send({
      email: "executor_category@mail.com",
      password: "executor",
    });

    const response = await request(app)
      .delete(`/categories/group/${id}`)
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual("Category Group does not exists");
  });
  it("Should not be able to delete a category group that has a category associated with it", async () => {
    const user = await request(app).post("/users/login").send({
      email: "executor_category@mail.com",
      password: "executor",
    });

    const group = await request(app)
      .post("/categories/group")
      .send({
        name: "group_with_categories",
        description: "Category group with categories",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    await request(app)
      .post("/categories")
      .send({
        name: "category_one",
        description: "category description",
        group_id: group.body.id,
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    await request(app)
      .get("/categories/by-group")
      .query({ group_id: group.body.id })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    const response = await request(app)
      .delete(`/categories/group/${group.body.id}`)
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.body).toEqual("Cannot delete group!");
    expect(response.status).toBe(400);
  });
  it("Should not be able to delete a group if user does not admin ou executor", async () => {
    const id = randomUUID();

    const user = await request(app).post("/users/login").send({
      email: "common_category@mail.com",
      password: "common",
    });

    const response = await request(app)
      .delete(`/categories/group/${id}`)
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.body.message).toEqual("This user is not an executor!");
    expect(response.status).toBe(401);
  });
  it("Should not be able to delete a group if token missing", async () => {
    const id = randomUUID();

    await request(app).post("/users/login").send({
      email: "executor_category@mail.com",
      password: "executor",
    });

    const response = await request(app).delete(`/categories/group/${id}`);

    expect(response.body.message).toEqual("Token missing!");
    expect(response.status).toBe(401);
  });
  it("Should not be able to delete a group if token invalid", async () => {
    const id = randomUUID();

    await request(app).post("/users/login").send({
      email: "executor_category@mail.com",
      password: "executor",
    });

    const response = await request(app).delete(`/categories/group/${id}`).set({
      Authorization: "Bearer INVALID_TOKEN",
    });

    expect(response.body.message).toEqual("Invalid Token");
    expect(response.status).toBe(401);
  });
  it("Should be able to list a gategory group detail", async () => {
    const user = await request(app).post("/users/login").send({
      email: "executor_category@mail.com",
      password: "executor",
    });

    const group = await request(app)
      .post("/categories/group")
      .send({
        name: "group_detail",
        description: "Category group detail",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    const response = await request(app)
      .get(`/categories/group/detail/${group.body.id}`)
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toEqual("group_detail");
  });
  it("Should not be able to list a gategory group detail if group does not exists", async () => {
    const id = randomUUID();

    const user = await request(app).post("/users/login").send({
      email: "executor_category@mail.com",
      password: "executor",
    });

    const response = await request(app)
      .get(`/categories/group/detail/${id}`)
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual("Group does not exists!");
  });
  it("Should not be able to list a gategory group detail if user does not admin ou executor", async () => {
    const user = await request(app).post("/users/login").send({
      email: "common_category@mail.com",
      password: "common",
    });

    const group = await request(app)
      .post("/categories/group")
      .send({
        name: "group_detail",
        description: "Category group detail",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    const response = await request(app)
      .get(`/categories/group/detail/${group.body.id}`)
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("This user is not an executor!");
  });
  it("Should not be able to list a gategory group detail if token missing", async () => {
    const id = randomUUID();

    const response = await request(app).get(`/categories/group/detail/${id}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("Token missing!");
  });
  it("Should not be able to list a gategory group detail if invalid token", async () => {
    const id = randomUUID();

    const response = await request(app)
      .get(`/categories/group/detail/${id}`)
      .set({
        Authorization: "Bearer INVALID_TOKEN",
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("Invalid Token");
  });
  it("Should be able to list all categories group", async () => {
    const user = await request(app).post("/users/login").send({
      email: "executor_category@mail.com",
      password: "executor",
    });

    const response = await request(app)
      .get("/categories/group")
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.body.length).toBe(3);
  });
  it("Should not be able to list all categories group if user does not admin ou executor", async () => {
    const user = await request(app).post("/users/login").send({
      email: "common_category@mail.com",
      password: "common",
    });

    const response = await request(app)
      .get("/categories/group")
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("This user is not an executor!");
  });
  it("Should not be able to list all categories group if invalid token", async () => {
    const user = await request(app).post("/users/login").send({
      email: "executor_category@mail.com",
      password: "executor",
    });

    const response = await request(app).get("/categories/group").set({
      Authorization: "Bearer INVALID_TOKEN",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("Invalid Token");
  });
  it("Should not be able to list all categories group if token missing", async () => {
    await request(app).post("/users/login").send({
      email: "executor_category@mail.com",
      password: "executor",
    });

    const response = await request(app).get("/categories/group");

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("Token missing!");
  });
  it("Should be able to update a category group", async () => {
    const user = await request(app).post("/users/login").send({
      email: "executor_category@mail.com",
      password: "executor",
    });

    const group = await request(app)
      .post("/categories/group")
      .send({
        name: "group_to_be_update",
        description: "Category group created to be updated",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    const groupUpdated = await request(app)
      .put("/categories/group")
      .send({
        id: group.body.id,
        name: "name_group_updated",
        description: "description updated",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(group.body.id).toEqual(groupUpdated.body.id);
    expect(groupUpdated.body.name).toEqual("name_group_updated");
  });
  it("Should not be able to update a category group if group does not exists", async () => {
    const id = randomUUID();

    const user = await request(app).post("/users/login").send({
      email: "executor_category@mail.com",
      password: "executor",
    });

    const groupUpdated = await request(app)
      .put("/categories/group")
      .send({
        id,
        name: "name_group_updated",
        description: "description updated",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(groupUpdated.status).toBe(400);
    expect(groupUpdated.body).toEqual("Category group does not exists");
  });
  it("Should not be able to update a category group if name not informed", async () => {
    const user = await request(app).post("/users/login").send({
      email: "executor_category@mail.com",
      password: "executor",
    });

    const group = await request(app)
      .post("/categories/group")
      .send({
        name: "group_to_be_update",
        description: "Category group created to be updated",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    const groupUpdated = await request(app)
      .put("/categories/group")
      .send({
        id: group.body.id,
        name: "",
        description: "description updated",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(groupUpdated.status).toBe(400);
    expect(groupUpdated.body).toEqual("Name is required!");
  });
  it("Should not be able to update a category group if user does not admin or executor", async () => {
    const user = await request(app).post("/users/login").send({
      email: "common_category@mail.com",
      password: "common",
    });

    const group = await request(app)
      .post("/categories/group")
      .send({
        name: "group_to_be_update",
        description: "Category group created to be updated",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    const groupUpdated = await request(app)
      .put("/categories/group")
      .send({
        id: group.body.id,
        name: "name_group_updated",
        description: "description updated",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(groupUpdated.status).toBe(401);
    expect(groupUpdated.body.message).toEqual("This user is not an executor!");
  });
  it("Should not be able to update a category group if token invalid", async () => {
    const user = await request(app).post("/users/login").send({
      email: "executor_category@mail.com",
      password: "executor",
    });

    const group = await request(app)
      .post("/categories/group")
      .send({
        name: "group_to_be_update",
        description: "Category group created to be updated",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    const groupUpdated = await request(app)
      .put("/categories/group")
      .send({
        id: group.body.id,
        name: "name_group_updated",
        description: "description updated",
      })
      .set({
        Authorization: "Bearer INVALID_TOKEN",
      });

    expect(groupUpdated.status).toBe(401);
    expect(groupUpdated.body.message).toEqual("Invalid Token");
  });
  it("Should not be able to update a category group if token missing", async () => {
    const user = await request(app).post("/users/login").send({
      email: "executor_category@mail.com",
      password: "executor",
    });

    const group = await request(app)
      .post("/categories/group")
      .send({
        name: "group_to_be_update",
        description: "Category group created to be updated",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    const groupUpdated = await request(app).put("/categories/group").send({
      id: group.body.id,
      name: "name_group_updated",
      description: "description updated",
    });

    expect(groupUpdated.status).toBe(401);
    expect(groupUpdated.body.message).toEqual("Token missing!");
  });
  it("Should be able to create a new category", async () => {
    const user = await request(app).post("/users/login").send({
      email: "executor_category@mail.com",
      password: "executor",
    });

    const group = await request(app)
      .post("/categories/group")
      .send({
        name: "group_category_two",
        description: "Category group created for a category",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    const category = await request(app)
      .post("/categories")
      .send({
        name: "category_two",
        description: "category description",
        group_id: group.body.id,
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(category.body).toHaveProperty("id");
    expect(category.body.group_id).toEqual(group.body.id);
    expect(category.body.name).toEqual("category_two");
  });
  it("Should not be able to create a new category if category already exists", async () => {
    const user = await request(app).post("/users/login").send({
      email: "executor_category@mail.com",
      password: "executor",
    });

    const group = await request(app)
      .post("/categories/group")
      .send({
        name: "group_category_three",
        description: "Category group created for a category three",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    await request(app)
      .post("/categories")
      .send({
        name: "category_three",
        description: "category description",
        group_id: group.body.id,
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    const response = await request(app)
      .post("/categories")
      .send({
        name: "category_three",
        description: "category description",
        group_id: group.body.id,
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual("Category already exists!");
  });
  it("Should not be able to create a new category if category group does not exists", async () => {
    const id = randomUUID();

    const user = await request(app).post("/users/login").send({
      email: "executor_category@mail.com",
      password: "executor",
    });

    const category = await request(app)
      .post("/categories")
      .send({
        name: "new_category",
        description: "category description",
        group_id: id,
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(category.status).toBe(400);
    expect(category.body).toEqual("Category group does not exists!");
  });
  it("Should not be able to create a new category if user does not admin or executor", async () => {
    const id = randomUUID();

    const user = await request(app).post("/users/login").send({
      email: "common_category@mail.com",
      password: "common",
    });

    const category = await request(app)
      .post("/categories")
      .send({
        name: "new_category",
        description: "category description",
        group_id: id,
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(category.status).toBe(401);
    expect(category.body.message).toEqual("This user is not an executor!");
  });
  it("Should not be able to create a new category if invalid token", async () => {
    const id = randomUUID();

    const category = await request(app)
      .post("/categories")
      .send({
        name: "new_category",
        description: "category description",
        group_id: id,
      })
      .set({
        Authorization: "Bearer INVALID_TOKEN",
      });

    expect(category.status).toBe(401);
    expect(category.body.message).toEqual("Invalid Token");
  });
  it("Should not be able to create a new category if token missing", async () => {
    const id = randomUUID();

    const category = await request(app).post("/categories").send({
      name: "new_category",
      description: "category description",
      group_id: id,
    });

    expect(category.status).toBe(401);
    expect(category.body.message).toEqual("Token missing!");
  });
  it("Should be able to list detail a category", async () => {
    const user = await request(app).post("/users/login").send({
      email: "executor_category@mail.com",
      password: "executor",
    });

    const group = await request(app)
      .post("/categories/group")
      .send({
        name: "group_category_four",
        description: "Category group created for a category four",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    const category = await request(app)
      .post("/categories")
      .send({
        name: "category_four",
        description: "category description",
        group_id: group.body.id,
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    const response = await request(app)
      .get(`/categories/detail/${category.body.id}`)
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.body).toHaveProperty("id");
    expect(category.body.group_id).toEqual(group.body.id);
    expect(category.body.name).toEqual("category_four");
  });
  it("Should not be able to list detail a category if category does not exists", async () => {
    const id = randomUUID();

    const user = await request(app).post("/users/login").send({
      email: "executor_category@mail.com",
      password: "executor",
    });

    const response = await request(app)
      .get(`/categories/detail/${id}`)
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual("Category does not exists!");
  });
  it("Should not be able to list detail a category if user does not admin ou executor", async () => {
    const id = randomUUID();

    const user = await request(app).post("/users/login").send({
      email: "common_category@mail.com",
      password: "common",
    });

    const response = await request(app)
      .get(`/categories/detail/${id}`)
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("This user is not an executor!");
  });
  it("Should not be able to list detail a category if invalid token", async () => {
    const id = randomUUID();

    const response = await request(app).get(`/categories/detail/${id}`).set({
      Authorization: "Bearer INVALID_TOKEN",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("Invalid Token");
  });
  it("Should not be able to list detail a category if token missing", async () => {
    const id = randomUUID();

    const response = await request(app).get(`/categories/detail/${id}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("Token missing!");
  });
  it("Should be able to list all categories", async () => {
    const user = await request(app).post("/users/login").send({
      email: "executor_category@mail.com",
      password: "executor",
    });

    const response = await request(app)
      .get("/categories")
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.body.length).toBe(4);
  });
  it("Should not be able to list all categories if user does not admin or executor", async () => {
    const user = await request(app).post("/users/login").send({
      email: "common_category@mail.com",
      password: "common",
    });

    const response = await request(app)
      .get("/categories")
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("This user is not an executor!");
  });
  it("Should not be able to list all categories if invalid token", async () => {
    const response = await request(app).get("/categories").set({
      Authorization: "Bearer INVALID_TOKEN",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("Invalid Token");
  });
  it("Should not be able to list all categories if token missing", async () => {
    const response = await request(app).get("/categories");

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("Token missing!");
  });
  it("Should be able to list categories by category group", async () => {
    const user = await request(app).post("/users/login").send({
      email: "executor_category@mail.com",
      password: "executor",
    });

    const group = await request(app)
      .post("/categories/group")
      .send({
        name: "group_category",
        description: "Category group created for a categories five and six",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    await request(app)
      .post("/categories")
      .send({
        name: "category_five",
        description: "category description",
        group_id: group.body.id,
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    await request(app)
      .post("/categories")
      .send({
        name: "category_six",
        description: "category description",
        group_id: group.body.id,
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    const response = await request(app)
      .get("/categories/by-group")
      .query({
        group_id: group.body.id,
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.body.length).toBe(2);
  });
  it("Should be able to list all categories if group id does not informed", async () => {
    const user = await request(app).post("/users/login").send({
      email: "executor_category@mail.com",
      password: "executor",
    });

    const response = await request(app)
      .get("/categories/by-group")
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.body.length).toBe(6);
  });
  it("Should not be able to list category by category group if user does not admin or executor", async () => {
    const user = await request(app).post("/users/login").send({
      email: "common_category@mail.com",
      password: "common",
    });

    const response = await request(app)
      .get("/categories/by-group")
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.body.message).toBe("This user is not an executor!");
    expect(response.status).toBe(401);
  });
  it("Should not be able to list category by category group if group does not exists", async () => {
    const id = randomUUID();

    const user = await request(app).post("/users/login").send({
      email: "executor_category@mail.com",
      password: "executor",
    });

    const response = await request(app)
      .get("/categories/by-group")
      .query({
        group_id: id,
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.body.length).toBe(0);
  });
  it("Should not be able to list category by category group if invalid token", async () => {
    const response = await request(app).get("/categories/by-group").set({
      Authorization: "Bearer INVALID_TOKEN",
    });

    expect(response.body.message).toBe("Invalid Token");
    expect(response.status).toBe(401);
  });
  it("Should not be able to list category by category group if token missing", async () => {
    const response = await request(app).get("/categories/by-group");

    expect(response.body.message).toBe("Token missing!");
    expect(response.status).toBe(401);
  });
  it("Should be able to update a category", async () => {
    const user = await request(app).post("/users/login").send({
      email: "executor_category@mail.com",
      password: "executor",
    });

    const group = await request(app)
      .post("/categories/group")
      .send({
        name: "group_category_seven",
        description: "Category group created for a category seven",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    const category = await request(app)
      .post("/categories")
      .send({
        name: "category_seven",
        description: "category description",
        group_id: group.body.id,
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    const categoryUpdated = await request(app)
      .put("/categories")
      .send({
        id: category.body.id,
        name: "new_category_seven",
        description: "",
        group_id: group.body.id,
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(category.body.id).toEqual(categoryUpdated.body.id);
    expect(categoryUpdated.body.name).toEqual("new_category_seven");
  });
  it("Should not be able to update a category if category does not exists", async () => {
    const id = randomUUID();

    const user = await request(app).post("/users/login").send({
      email: "executor_category@mail.com",
      password: "executor",
    });

    const group = await request(app)
      .post("/categories/group")
      .send({
        name: "group_category_eight",
        description: "Category group created for a category eight",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    const categoryUpdated = await request(app)
      .put("/categories")
      .send({
        id,
        name: "new_category_eight",
        description: "",
        group_id: group.body.id,
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(categoryUpdated.body).toEqual("Category does not exists");
    expect(categoryUpdated.status).toBe(400);
  });
  it("Should not be able to update a category if category group does not exists", async () => {
    const id = randomUUID();

    const user = await request(app).post("/users/login").send({
      email: "executor_category@mail.com",
      password: "executor",
    });

    const group = await request(app)
      .post("/categories/group")
      .send({
        name: "group_category_nine",
        description: "Category group created for a category nine",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    const category = await request(app)
      .post("/categories")
      .send({
        name: "category_nine",
        description: "category description",
        group_id: group.body.id,
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    const categoryUpdated = await request(app)
      .put("/categories")
      .send({
        id: category.body.id,
        name: "new_category_nine",
        description: "",
        group_id: id,
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(categoryUpdated.body).toEqual("Category group does not exists!");
    expect(categoryUpdated.status).toBe(400);
  });
  it("Should not be able to update a category if category id does not informed", async () => {
    const user = await request(app).post("/users/login").send({
      email: "executor_category@mail.com",
      password: "executor",
    });

    const group = await request(app)
      .post("/categories/group")
      .send({
        name: "group_category_ten",
        description: "Category group created for a category ten",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    const categoryUpdated = await request(app)
      .put("/categories")
      .send({
        id: "",
        name: "new_category_ten",
        description: "",
        group_id: group.body.id,
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(categoryUpdated.body).toEqual("Ctaegory id is required");
    expect(categoryUpdated.status).toBe(400);
  });
  it("Should not be able to update a category if name does not informed", async () => {
    const user = await request(app).post("/users/login").send({
      email: "executor_category@mail.com",
      password: "executor",
    });

    const group = await request(app)
      .post("/categories/group")
      .send({
        name: "group_category_eleven",
        description: "Category group created for a category eleven",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    const category = await request(app)
      .post("/categories")
      .send({
        name: "category_eleven",
        description: "category description",
        group_id: group.body.id,
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    const categoryUpdated = await request(app)
      .put("/categories")
      .send({
        id: category.body.id,
        name: "",
        description: "",
        group_id: group.body.id,
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(categoryUpdated.body).toEqual("Name is required");
    expect(categoryUpdated.status).toBe(400);
  });
  it("Should not be able to update a category if group id does not informed", async () => {
    const user = await request(app).post("/users/login").send({
      email: "executor_category@mail.com",
      password: "executor",
    });

    const group = await request(app)
      .post("/categories/group")
      .send({
        name: "group_category_twelve",
        description: "Category group created for a category twelve",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    const category = await request(app)
      .post("/categories")
      .send({
        name: "category_twelve",
        description: "category description",
        group_id: group.body.id,
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    const categoryUpdated = await request(app)
      .put("/categories")
      .send({
        id: category.body.id,
        name: "new_category_twelve",
        description: "",
        group_id: "",
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(categoryUpdated.body[0].message).toEqual("Invalid uuid");
    expect(categoryUpdated.status).toBe(422);
  });
  it("Should not be able to update a category if user does not admin ou excutor", async () => {
    const categoryId = randomUUID();
    const groupId = randomUUID();

    const user = await request(app).post("/users/login").send({
      email: "common_category@mail.com",
      password: "common",
    });

    const response = await request(app)
      .put("/categories")
      .send({
        id: categoryId,
        name: "new_category_seven",
        description: "",
        group_id: groupId,
      })
      .set({
        Authorization: `Bearer ${user.body.token}`,
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("This user is not an executor!");
  });
  it("Should not be able to update a category if invalid token", async () => {
    const categoryId = randomUUID();
    const groupId = randomUUID();

    const response = await request(app)
      .put("/categories")
      .send({
        id: categoryId,
        name: "new_category",
        description: "",
        group_id: groupId,
      })
      .set({
        Authorization: "Bearer INVALID_TOKEN",
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("Invalid Token");
  });
  it("Should not be able to update a category if token missing", async () => {
    const categoryId = randomUUID();
    const groupId = randomUUID();

    const response = await request(app).put("/categories").send({
      id: categoryId,
      name: "new_category",
      description: "",
      group_id: groupId,
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("Token missing!");
  });
});
