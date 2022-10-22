import crypto from "crypto";
import multer from "multer";
import { resolve } from "path";

import { AppError } from "../shared/errors/AppError";

export default {
  upload(folder: string) {
    return {
      storage: multer.diskStorage({
        destination: resolve(__dirname, "..", "..", folder),
        filename: (request, file, callback) => {
          const fileHash = crypto.randomBytes(16).toString("hex");
          const fileName = `${fileHash}-${file.originalname}`;

          return callback(null, fileName);
        },
      }),

      limits: {
        fileSize: 2 * 1024 * 1024,
      },

      fileFilter: (request, file, callback) => {
        const allowedMimes = ["image/jpeg", "image/png"];

        if (allowedMimes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new AppError("Invalid file type!"));
        }
      },
    };
  },
};
