import { test, expect, describe } from "vitest";

import { User } from "../user.entity";

describe("User Entity", () => {
  test("Should be able to create a new user", () => {
    const user = User.create({
      name: "name_test",
      email: "email@mail.com",
      password: "password_test",
    });

    expect(user).toBeInstanceOf(User);
    expect(user).toHaveProperty("id");
  });

  test("Should not be able to create a new user without name", () => {
    expect(() => {
      User.create({
        name: "",
        email: "email@mail.com",
        password: "password_test",
      });
    }).toThrow("All fields must be filled!");
  });

  test("Should not be able to create a new user without e-mail", () => {
    expect(() => {
      User.create({
        name: "name_test",
        email: "",
        password: "password_test",
      });
    }).toThrow("All fields must be filled!");
  });

  test("Should not be able to create a new user without password", () => {
    expect(() => {
      User.create({
        name: "name_test",
        email: "email@mail.com",
        password: "",
      });
    }).toThrow("All fields must be filled!");
  });
});
