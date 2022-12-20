import { EnvironmentContext, JestEnvironmentConfig } from "@jest/environment";
// import type { Config } from "@jest/types";
import dotenv from "dotenv";
import NodeEnvironment from "jest-environment-node";
import { exec } from "node:child_process";
import crypto from "node:crypto";
import util from "node:util";
import { Client } from "pg";

// const { execSync } = require("child_process");

// const { resolve } = require("path");
// const { Client } = require("pg");
// const { v4: uuid } = require("uuid");

dotenv.config({ path: ".env.test" });

const execSync = util.promisify(exec);

const prismaBinary = "./node_modules/.bin/prisma";

export default class CustomEnvironment extends NodeEnvironment {
  private schema: string;
  private connectionString: string;

  constructor(config: JestEnvironmentConfig, _context: EnvironmentContext) {
    super(config, _context);

    const dbUser = process.env.DATABASE_USER;
    const dbPass = process.env.DATABASE_PASS;
    const dbHost = process.env.DATABASE_HOST;
    const dbPort = process.env.DATABASE_PORT;
    const dbName = process.env.DATABASE_NAME;

    this.schema = `test_${crypto.randomUUID()}`;
    this.connectionString = `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?schema=${this.schema}`;
  }

  async setup() {
    process.env.DATABASE_URL = this.connectionString;
    this.global.process.env.DATABASE_URL = this.connectionString;

    execSync(`${prismaBinary} migrate dev`);

    return super.setup();
  }

  async teardown() {
    const client = new Client({
      connectionString: this.connectionString,
    });

    await client.connect();
    await client.query(`DROP SCHEMA IF EXISTS "${this.schema}" CASCADE`);
    await client.end();
  }
}
