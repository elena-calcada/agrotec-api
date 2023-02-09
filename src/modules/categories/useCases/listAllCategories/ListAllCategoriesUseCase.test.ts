import "reflect-metadata";
import { describe, beforeEach, test, expect } from "vitest";

import { CategoryGroupRepositoryInMemory } from "../../repositories/in-memory/CategoryGroupRepositoryInMemory";
import { CategoryRepositoryInMemory } from "../../repositories/in-memory/CategoryRepositoryInMemory";
import { CreateCategorysUseCase } from "../createCategory/CreateCategoryUseCase";
import { ListAllCategoriesUseCase } from "./ListAllCategoriesUseCase";

let categoryRepositoryInMemory: CategoryRepositoryInMemory;
let categoryGroupRepository: CategoryGroupRepositoryInMemory;
let createCategoryUseCase: CreateCategorysUseCase;
let listAllCategoriesUseCase: ListAllCategoriesUseCase;

describe("List All Categories", () => {
  beforeEach(() => {
    categoryRepositoryInMemory = new CategoryRepositoryInMemory();
    createCategoryUseCase = new CreateCategorysUseCase(
      categoryRepositoryInMemory,
      categoryGroupRepository
    );
    listAllCategoriesUseCase = new ListAllCategoriesUseCase(
      categoryRepositoryInMemory
    );
  });

  test("Should be able to list all categories", async () => {
    await createCategoryUseCase.execute({
      name: "name_one",
      description: "description_one",
      group_id: "group_id",
    });

    await createCategoryUseCase.execute({
      name: "name_two",
      description: "description_two",
      group_id: "group_id",
    });

    const categories = await listAllCategoriesUseCase.execute();

    expect(categories.length).toBe(2);
    expect(categories[0].name).toEqual("name_one");
    expect(categories[1].name).toEqual("name_two");
  });
});
