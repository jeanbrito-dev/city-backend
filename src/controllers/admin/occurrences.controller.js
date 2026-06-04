import { prisma } from "../../lib/prisma.js";

export async function getAllOccurrences(req, res) {
  try {
    const occurrences = await prisma.occurrence.findMany({
      include: { user: { select: { nome: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });

    return res.json(occurrences);

  } catch (err) {
    console.error(err);

    return res.status(500).json({ error: "Erro ao buscar ocorrências" });
  }
}

export async function updateOccurrenceStatus(req, res) {
  try {
    const { id } = req.params;

    const { status } = req.body;

    const updated = await prisma.occurrence.update({
      where: { id: Number(id) },
      data: { status },
    });

    return res.json(updated);

  } catch (err) {
    console.error(err);

    return res.status(500).json({ error: "Erro ao atualizar status" });
  }
}

export async function deleteOccurrence(req, res) {
  try {
    const { id } = req.params;

    await prisma.occurrence.delete({ where: { id: Number(id) } });

    return res.json({ message: "Ocorrência deletada" });
  } catch (err) {

    console.error(err);

    return res.status(500).json({ error: "Erro ao deletar ocorrência" });
  }
}
