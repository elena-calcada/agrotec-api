import fs from "fs";

export const deleteFile = async (filename: string) => {
  await fs.promises.unlink(filename);
};
