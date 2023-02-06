import "reflect-metadata";
import { describe, beforeEach, test, expect } from "vitest";

import { CategoryGroupRepositoryInMemory } from "../../repositories/in-memory/CategoryGroupRepositoryInMemory";
import { CreateCategoryGroupUseCase } from "../createCategoryGroup/CreateCategoryGroupUseCase";
import { DetailGroupCategoryUseCase } from "./DetailGroupCategoryUseCase";

let categoryGroupRepositoryInMemory: CategoryGroupRepositoryInMemory;
let createCategoryGroupUseCase: CreateCategoryGroupUseCase;
let detailCategoryGroupUseCase: DetailGroupCategoryUseCase;

describe("Detail Category Group", () => {
  beforeEach(() => {
    categoryGroupRepositoryInMemory = new CategoryGroupRepositoryInMemory();
    createCategoryGroupUseCase = new CreateCategoryGroupUseCase(
      categoryGroupRepositoryInMemory
    );
    detailCategoryGroupUseCase = new DetailGroupCategoryUseCase(
      categoryGroupRepositoryInMemory
    );
  });

  test("Should be able to access grou detail", async () => {
    const group = await createCategoryGroupUseCase.execute({
      name: "group_name",
      description: "group_description",
    });

    const groupDetail = await detailCategoryGroupUseCase.execute(group.id);

    expect(group.name).toEqual(groupDetail.name);
    expect(group.id).toEqual(groupDetail.id);
    expect(group.description).toEqual(groupDetail.description);
  });

  test("Should not be able to access group detail if group does not exits", async () => {
    expect(async () => {
      await detailCategoryGroupUseCase.execute("incorrect_id");
    }).rejects.toThrow("Group does not exists!");
  });
});
