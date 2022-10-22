import { hash } from "bcryptjs";

import prismaClient from "../../src/prisma";

async function userAdmin() {
  const passwordHash = await hash(process.env.PASSWORD_ADMIN, 8);

  const user = {
    name: "Juliana Bessa",
    email: "juliana@mail.com",
    password: passwordHash,
    is_admin: true,
    is_executor: true,
  };

  await prismaClient.user.create({
    data: {
      name: user.name,
      email: user.email,
      password: user.password,
      is_admin: user.is_admin,
      is_executor: user.is_executor,
    },
  });
}

userAdmin();
