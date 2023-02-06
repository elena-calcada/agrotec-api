import "reflect-metadata";
import { describe, beforeEach, test, expect } from "vitest";

import { CategoryGroupRepositoryInMemory } from "../../repositories/in-memory/CategoryGroupRepositoryInMemory";
import { CreateCategoryGroupUseCase } from "../createCategoryGroup/CreateCategoryGroupUseCase";
import { ListAllCategoryGroupUseCase } from "./ListAllCategoryGroupUseCase";

let categoryGroupRepositoryInMemory: CategoryGroupRepositoryInMemory;
let createCategoryGroupUseCase: CreateCategoryGroupUseCase;
let listAllCategoryGroupUseCase: ListAllCategoryGroupUseCase;

describe("List All Categories Group", () => {
  beforeEach(() => {
    categoryGroupRepositoryInMemory = new CategoryGroupRepositoryInMemory();
    createCategoryGroupUseCase = new CreateCategoryGroupUseCase(
      categoryGroupRepositoryInMemory
    );
    listAllCategoryGroupUseCase = new ListAllCategoryGroupUseCase(
      categoryGroupRepositoryInMemory
    );
  });

  test("Should be able to list all categories group", async () => {
    await createCategoryGroupUseCase.execute({
      name: "name_one",
      description: "description_one",
    });
    await createCategoryGroupUseCase.execute({
      name: "name_two",
      description: "description_two",
    });

    const groups = await listAllCategoryGroupUseCase.execute();

    expect(groups.length).toBe(2);
    expect(groups[0].name).toEqual("name_one");
    expect(groups[1].name).toEqual("name_two");
  });
});
