import "reflect-metadata";
import { describe, beforeEach, test, expect } from "vitest";

import { CategoryGroupRepositoryInMemory } from "../../repositories/in-memory/CategoryGroupRepositoryInMemory";
import { CreateCategoryGroupUseCase } from "../createCategoryGroup/CreateCategoryGroupUseCase";
import { UpdateCategoryGroupUseCase } from "./UpdateCategoryGroupUseCase";

let categoryGroupRepositoryInMemory: CategoryGroupRepositoryInMemory;
let createCategoryGroupUseCase: CreateCategoryGroupUseCase;
let updateCategoryGroupUseCase: UpdateCategoryGroupUseCase;

describe("Update Category Group", () => {
  beforeEach(() => {
    categoryGroupRepositoryInMemory = new CategoryGroupRepositoryInMemory();
    createCategoryGroupUseCase = new CreateCategoryGroupUseCase(
      categoryGroupRepositoryInMemory
    );
    updateCategoryGroupUseCase = new UpdateCategoryGroupUseCase(
      categoryGroupRepositoryInMemory
    );
  });

  test("Should be able to update a category group", async () => {
    const group = await createCategoryGroupUseCase.execute({
      name: "name_test",
      description: "description_test",
    });

    expect(group.name).toEqual("name_test");
    expect(group.description).toEqual("description_test");

    await updateCategoryGroupUseCase.execute({
      id: group.id,
      name: "name",
      description: "description",
    });

    expect(group.name).toEqual("name");
    expect(group.description).toEqual("description");
  });

  test("Should not be able to update a category group if category group does not exists", async () => {
    expect(async () => {
      await updateCategoryGroupUseCase.execute({
        id: "false_id",
        name: "name",
        description: "description",
      });
    }).rejects.toThrow("Category group does not exists");
  });

  test("Should not be able to update a category group if group name does not informed", async () => {
    const group = await createCategoryGroupUseCase.execute({
      name: "name_test",
      description: "description_test",
    });

    expect(async () => {
      await updateCategoryGroupUseCase.execute({
        id: group.id,
        name: "",
        description: "description",
      });
    }).rejects.toThrow("Name is required!");
  });

  test("Should not be able to update a category group if group description does not informed", async () => {
    const group = await createCategoryGroupUseCase.execute({
      name: "name_test",
      description: "description_test",
    });

    await updateCategoryGroupUseCase.execute({
      id: group.id,
      name: "name",
      description: "",
    });

    expect(group.name).toEqual("name");
    expect(group.description).toEqual("");
  });
});
