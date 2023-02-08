import "reflect-metadata";
import { describe, beforeEach, test, expect } from "vitest";

import { CategoryRepositoryInMemory } from "../../repositories/in-memory/CategoryRepositoryInMemory";
import { CreateCategorysUseCase } from "../createCategory/CreateCategoryUseCase";
import { UpdateCategoryUseCase } from "./updateCategoryUseCase";

let categoryRepositoryInMemory: CategoryRepositoryInMemory;
let createCategoryUseCase: CreateCategorysUseCase;
let updateCategoryUseCase: UpdateCategoryUseCase;

describe("Update Category", () => {
  beforeEach(() => {
    categoryRepositoryInMemory = new CategoryRepositoryInMemory();
    createCategoryUseCase = new CreateCategorysUseCase(
      categoryRepositoryInMemory
    );
    updateCategoryUseCase = new UpdateCategoryUseCase(
      categoryRepositoryInMemory
    );
  });

  test("Should be able to update a category", async () => {
    const category = await createCategoryUseCase.execute({
      name: "category_name",
      description: "category_description",
      group_id: "group_id",
    });

    await updateCategoryUseCase.execute({
      id: category.id,
      name: "category_name_updated",
      description: "category_description_updated",
      group_id: "group_id_updated",
    });

    expect(category.name).toEqual("category_name_updated");
    expect(category.group_id).toEqual("group_id_updated");
  });

  test("Should be able to update a category if description does not informed", async () => {
    const category = await createCategoryUseCase.execute({
      name: "category_name",
      description: "category_description",
      group_id: "group_id",
    });

    await updateCategoryUseCase.execute({
      id: category.id,
      name: "category_name_updated",
      description: "",
      group_id: "group_id_updated",
    });

    expect(category.name).toEqual("category_name_updated");
    expect(category.group_id).toEqual("group_id_updated");
    expect(category.description).toEqual("");
  });

  test("Should not be able to update a category if category does not exists", async () => {
    expect(async () => {
      await updateCategoryUseCase.execute({
        id: "false_id",
        name: "category_name_updated",
        description: "category_description_updated",
        group_id: "group_id_updated",
      });
    }).rejects.toThrow("Category does not exists");
  });

  test("Should not be able to update a category if id does not informed", async () => {
    expect(async () => {
      await updateCategoryUseCase.execute({
        id: "",
        name: "category_name_updated",
        description: "category_description_updated",
        group_id: "group_id_updated",
      });
    }).rejects.toThrow("Ctaegory id is required");
  });

  test("Should not be able to update a category if name does not informed", async () => {
    expect(async () => {
      await updateCategoryUseCase.execute({
        id: "id",
        name: "",
        description: "category_description_updated",
        group_id: "group_id_updated",
      });
    }).rejects.toThrow("Name is required");
  });

  test("Should not be able to update a category if name does not informed", async () => {
    expect(async () => {
      await updateCategoryUseCase.execute({
        id: "id",
        name: "category_name_updated",
        description: "category_description_updated",
        group_id: "",
      });
    }).rejects.toThrow("Group id is required");
  });
});
