import "reflect-metadata";
import "./container";
import cors from "cors";
import "express-async-errors";
import express, { NextFunction, Request, Response } from "express";
import path from "path";

import { AppError } from "./errors/AppError";
import { router } from "./routes";

const app = express();

app.use(express.json());

app.use(cors());

app.use(router);

app.use("/images", express.static(path.resolve(__dirname, "..", "..", "tmp")));

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }

    return response.status(500).json({
      status: "error",
      message: `Internal Server Error - ${err.message}`,
    });
  }
);

export { app };
