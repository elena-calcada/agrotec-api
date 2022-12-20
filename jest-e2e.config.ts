import jestConfig from "./jest.config";

export default {
  ...jestConfig,
  testEnvironment: "./prisma/prisma-environment-jest.ts",
  testRegex: ".e2e-spec.ts$",
};
