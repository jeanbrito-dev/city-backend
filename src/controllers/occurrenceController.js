import { prisma } from "../lib/prisma.js";

// CREATE
export const createOccurrence = async (req, res) => {
  try {
    const occurrence = await prisma.occurrence.create({
      data: req.body,
    });

    res.json(occurrence);
  } catch {
    res.status(500).json({ error: "Erro ao criar ocorrência" });
  }
};

// GET ALL + FILTRO
export const getOccurrences = async (req, res) => {
  try {
    const { status, categoria } = req.query;

    const occurrences = await prisma.occurrence.findMany({
      where: {
        status: status || undefined,
        categoria: categoria || undefined,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(occurrences);
  } catch {
    res.status(500).json({ error: "Erro ao buscar ocorrências" });
  }
};

// GET BY ID
export const getOccurrenceById = async (req, res) => {
  try {
    const { id } = req.params;

    const occurrence = await prisma.occurrence.findUnique({
      where: { id: Number(id) },
    });

    res.json(occurrence);
  } catch {
    res.status(500).json({ error: "Erro ao buscar ocorrência" });
  }
};

// UPDATE
export const updateOccurrence = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await prisma.occurrence.update({
      where: { id: Number(id) },
      data: req.body,
    });

    res.json(updated);
  } catch {
    res.status(500).json({ error: "Erro ao atualizar ocorrência" });
  }
};

// DELETE
export const deleteOccurrence = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.occurrence.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Deletado com sucesso" });
  } catch {
    res.status(500).json({ error: "Erro ao deletar ocorrência" });
  }
};