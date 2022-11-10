import request from "supertest";

import { app } from "../../../../shared/app";

describe("Delete User Controller", () => {
  it("Should be able to delete an user", async () => {
    const userAdminAuthenticated = await request(app)
      .post("/users/session")
      .send({
        email: "juliana@mail.com",
        password: "agrotecadmin123",
      });

    const newUser = await request(app).post("/users").send({
      name: "New User",
      email: "new@mail.com",
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
      name: "New User",
      email: "newnew@mail.com",
      password: "321",
    });

    const response = await request(app)
      .delete("/users")
      .query({ id: newUser.body.id });

    console.log(response.body);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Token missing!");
  });
});
