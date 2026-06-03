import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

async function main() {
  const hash = await bcrypt.hash("Mega.admin67", 10);
  await prisma.user.create({
    data: {
      nome: "Administrador",
      email: "admin@city.com",
      senha: hash,
      role: "admin",
    },
  });
  console.log("Admin criado");
}
main();
