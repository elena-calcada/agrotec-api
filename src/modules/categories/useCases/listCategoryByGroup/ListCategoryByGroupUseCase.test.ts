import "reflect-metadata";
import { describe, beforeEach, test, expect } from "vitest";

import { CategoryGroupRepositoryInMemory } from "../../repositories/in-memory/CategoryGroupRepositoryInMemory";
import { CategoryRepositoryInMemory } from "../../repositories/in-memory/CategoryRepositoryInMemory";
import { CreateCategorysUseCase } from "../createCategory/CreateCategoryUseCase";
import { ListCategoryByGroupUseCase } from "./ListCategoryByGroupUseCase";

let categoryRepositoryInMemory: CategoryRepositoryInMemory;
let categoryGroupRepositoryInMemory: CategoryGroupRepositoryInMemory;
let createCategoryUseCase: CreateCategorysUseCase;
let listCategoryByGroupUseCase: ListCategoryByGroupUseCase;

describe("List Categories By Group", () => {
  beforeEach(() => {
    categoryRepositoryInMemory = new CategoryRepositoryInMemory();
    categoryGroupRepositoryInMemory = new CategoryGroupRepositoryInMemory();
    createCategoryUseCase = new CreateCategorysUseCase(
      categoryRepositoryInMemory,
      categoryGroupRepositoryInMemory
    );
    listCategoryByGroupUseCase = new ListCategoryByGroupUseCase(
      categoryRepositoryInMemory
    );
  });

  test("Should be able to list categories by group", async () => {
    await createCategoryUseCase.execute({
      name: "name_one",
      description: "description_one",
      group_id: "group_id_one",
    });

    await createCategoryUseCase.execute({
      name: "name_two",
      description: "description_two",
      group_id: "group_id_two",
    });

    await createCategoryUseCase.execute({
      name: "name_three",
      description: "description_three",
      group_id: "group_id_two",
    });

    const listCategoriesByGoupOne = await listCategoryByGroupUseCase.execute(
      "group_id_one"
    );

    const listCategoriesByGoupTwo = await listCategoryByGroupUseCase.execute(
      "group_id_two"
    );

    expect(listCategoriesByGoupOne).length(1);
    expect(listCategoriesByGoupOne[0].name).toEqual("name_one");
    expect(listCategoriesByGoupTwo).length(2);
  });

  test("Should be able to list all categories if the group is not informed", async () => {
    await createCategoryUseCase.execute({
      name: "name_one",
      description: "description_one",
      group_id: "group_id_one",
    });

    await createCategoryUseCase.execute({
      name: "name_two",
      description: "description_two",
      group_id: "group_id_two",
    });

    await createCategoryUseCase.execute({
      name: "name_three",
      description: "description_three",
      group_id: "group_id_two",
    });

    const listCategoriesByGoup = await listCategoryByGroupUseCase.execute();

    expect(listCategoriesByGoup).length(3);
  });

  test("Should not be able to list category by category group if group does not exists", async () => {
    const listCategoriesByGoup = await listCategoryByGroupUseCase.execute(
      "invalid_group_id"
    );

    expect(listCategoriesByGoup).length(0);
  });
});
