import "reflect-metadata";
import { describe, beforeEach, test, expect } from "vitest";

import { CategoryGroupRepositoryInMemory } from "../../repositories/in-memory/CategoryGroupRepositoryInMemory";
import { CategoryRepositoryInMemory } from "../../repositories/in-memory/CategoryRepositoryInMemory";
import { CreateCategorysUseCase } from "../createCategory/CreateCategoryUseCase";
import { CreateCategoryGroupUseCase } from "../createCategoryGroup/CreateCategoryGroupUseCase";
import { UpdateCategoryUseCase } from "./updateCategoryUseCase";

let categoryRepositoryInMemory: CategoryRepositoryInMemory;
let categoryGroupRepository: CategoryGroupRepositoryInMemory;
let createCategoryUseCase: CreateCategorysUseCase;
let createCategoryGroupUseCase: CreateCategoryGroupUseCase;
let updateCategoryUseCase: UpdateCategoryUseCase;

describe("Update Category", () => {
  beforeEach(() => {
    categoryRepositoryInMemory = new CategoryRepositoryInMemory();
    categoryGroupRepository = new CategoryGroupRepositoryInMemory();
    createCategoryUseCase = new CreateCategorysUseCase(
      categoryRepositoryInMemory,
      categoryGroupRepository
    );
    createCategoryGroupUseCase = new CreateCategoryGroupUseCase(
      categoryGroupRepository
    );
    updateCategoryUseCase = new UpdateCategoryUseCase(
      categoryRepositoryInMemory,
      categoryGroupRepository
    );
  });

  test("Should be able to update a category", async () => {
    const group = await createCategoryGroupUseCase.execute({
      name: "group_name",
      description: "group_description",
    });

    const category = await createCategoryUseCase.execute({
      name: "category_name",
      description: "category_description",
      group_id: group.id,
    });

    await updateCategoryUseCase.execute({
      id: category.id,
      name: "category_name_updated",
      description: "category_description_updated",
      group_id: group.id,
    });

    expect(category.name).toEqual("category_name_updated");
    expect(category.description).toEqual("category_description_updated");
  });

  test("Should be able to update a category if description does not informed", async () => {
    const group = await createCategoryGroupUseCase.execute({
      name: "group_name",
      description: "group_description",
    });

    const category = await createCategoryUseCase.execute({
      name: "category_name",
      description: "category_description",
      group_id: group.id,
    });

    await updateCategoryUseCase.execute({
      id: category.id,
      name: "category_name_updated",
      description: "",
      group_id: group.id,
    });

    expect(category.name).toEqual("category_name_updated");
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

  test("Should not be able to update a category group if category does not exists", async () => {
    const group = await createCategoryGroupUseCase.execute({
      name: "group_name",
      description: "group_description",
    });

    const category = await createCategoryUseCase.execute({
      name: "category_name",
      description: "category_description",
      group_id: group.id,
    });

    expect(async () => {
      await updateCategoryUseCase.execute({
        id: category.id,
        name: "category_name_updated",
        description: "category_description_updated",
        group_id: "falese_group_id",
      });
    }).rejects.toThrow("Category group does not exists!");
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

  test("Should not be able to update a category if category group does not informed", async () => {
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
