import "reflect-metadata";
import { describe, beforeEach, test, expect } from "vitest";

import { CategoryGroupRepositoryInMemory } from "../../repositories/in-memory/CategoryGroupRepositoryInMemory";
import { CategoryRepositoryInMemory } from "../../repositories/in-memory/CategoryRepositoryInMemory";
import { CreateCategorysUseCase } from "../createCategory/CreateCategoryUseCase";
import { CreateCategoryGroupUseCase } from "../createCategoryGroup/CreateCategoryGroupUseCase";
import { ListCategoryByGroupUseCase } from "./ListCategoryByGroupUseCase";

let categoryGroupRepositoryInMemory: CategoryGroupRepositoryInMemory;
let createCategoryGroupUseCase: CreateCategoryGroupUseCase;
let categoryRepositoryInMemory: CategoryRepositoryInMemory;
let createCategoryUseCase: CreateCategorysUseCase;
let listCategoryByGroupUseCase: ListCategoryByGroupUseCase;

describe("List Categories By Group", () => {
  beforeEach(() => {
    categoryGroupRepositoryInMemory = new CategoryGroupRepositoryInMemory();
    createCategoryGroupUseCase = new CreateCategoryGroupUseCase(
      categoryGroupRepositoryInMemory
    );
    categoryRepositoryInMemory = new CategoryRepositoryInMemory();
    createCategoryUseCase = new CreateCategorysUseCase(
      categoryRepositoryInMemory,
      categoryGroupRepositoryInMemory
    );
    listCategoryByGroupUseCase = new ListCategoryByGroupUseCase(
      categoryRepositoryInMemory
    );
  });

  test("Should be able to list categories by group", async () => {
    const group_one = await createCategoryGroupUseCase.execute({
      name: "group_one",
      description: "group_description",
    });
    const group_two = await createCategoryGroupUseCase.execute({
      name: "group_two",
      description: "group_description",
    });

    await createCategoryUseCase.execute({
      name: "name_one",
      description: "description_one",
      group_id: group_one.id,
    });

    await createCategoryUseCase.execute({
      name: "name_two",
      description: "description_two",
      group_id: group_two.id,
    });

    await createCategoryUseCase.execute({
      name: "name_three",
      description: "description_three",
      group_id: group_two.id,
    });

    const listCategoriesByGoupOne = await listCategoryByGroupUseCase.execute(
      group_one.id
    );

    const listCategoriesByGoupTwo = await listCategoryByGroupUseCase.execute(
      group_two.id
    );

    expect(listCategoriesByGoupOne).length(1);
    expect(listCategoriesByGoupOne[0].name).toEqual("name_one");
    expect(listCategoriesByGoupTwo).length(2);
  });

  test("Should be able to list all categories if the group is not informed", async () => {
    const group_three = await createCategoryGroupUseCase.execute({
      name: "group_three",
      description: "group_description",
    });

    const group_four = await createCategoryGroupUseCase.execute({
      name: "group_four",
      description: "group_description",
    });

    await createCategoryUseCase.execute({
      name: "name_one",
      description: "description_one",
      group_id: group_three.id,
    });

    await createCategoryUseCase.execute({
      name: "name_two",
      description: "description_two",
      group_id: group_four.id,
    });

    await createCategoryUseCase.execute({
      name: "name_three",
      description: "description_three",
      group_id: group_four.id,
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
