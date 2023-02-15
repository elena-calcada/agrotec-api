import dotenv from "dotenv";
import { defineConfig } from "vitest/config";

dotenv.config({ path: ".env.test" });

export default defineConfig({
  plugins: [
    {
      name: "setup-config",
      config: () => ({
        test: {
          setupFiles: ["./test/setup.ts"],
        },
      }),
    },
  ],
  test: {
    include: ["**/*.e2e-spec.ts"],
    exclude: ["**/*.test.ts"],
  },
});
