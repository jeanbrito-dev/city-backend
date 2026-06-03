import { prisma } from "../../lib/prisma.js";

export async function getAllUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return res.json(users);

  } catch (err) {

    console.error(err);

    return res.status(500).json({ error: "Erro ao buscar usuários" });

  }
}
export async function deleteUser(req, res) {

  try {
    const { id } = req.params;

    await prisma.user.delete({ where: { id } });

    return res.json({ message: "Usuário removido" });

  } catch (err) {
    console.error(err);
    
    return res.status(500).json({ error: "Erro ao remover usuário" });
  }
}
