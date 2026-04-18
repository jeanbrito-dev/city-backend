import { prisma } from "../lib/prisma.js";
import { occurrences } from "../data/occurrences.js";
import { v4 as uuidv4 } from "uuid";

const useMock = true; // true = usa array | false = usa banco

// CREATE
export const createOccurrence = async (req, res) => {
  try {
    if (useMock) {
      const newOccurrence = {
        id: uuidv4(), // gera id único simples
        createdAt: new Date(), // simula campo do banco
        ...req.body,
      };

      occurrences.push(newOccurrence); // salva no array (memória)

      return res.json(newOccurrence);
    }

    const occurrence = await prisma.occurrence.create({
      data: req.body, // envia direto pro banco
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

    if (useMock) {
      let data = [...occurrences]; // copia pra não alterar original

      // filtro manual (igual ao where do prisma)
      if (status) {
        data = data.filter(o => o.status === status);
      }

      if (categoria) {
        data = data.filter(o => o.categoria === categoria);
      }

      // ordena por data (mais recente primeiro)
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return res.json(data);
    }

    const data = await prisma.occurrence.findMany({
      where: {
        status: status || undefined, // undefined ignora filtro
        categoria: categoria || undefined,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(data);
  } catch {
    res.status(500).json({ error: "Erro ao buscar ocorrências" });
  }
};

// GET BY ID
export const getOccurrenceById = async (req, res) => {
  try {
    const id = Number(req.params.id); // garante número

    if (useMock) {
      const occurrence = occurrences.find(o => o.id === id);

      return res.json(occurrence);
    }

    const occurrence = await prisma.occurrence.findUnique({
      where: { id },
    });

    res.json(occurrence);
  } catch {
    res.status(500).json({ error: "Erro ao buscar ocorrência" });
  }
};

// UPDATE
export const updateOccurrence = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (useMock) {
      const index = occurrences.findIndex(o => o.id === id);

      if (index !== -1) {
        occurrences[index] = {
          ...occurrences[index],
          ...req.body, // sobrescreve só o que veio
        };
      }

      return res.json(occurrences[index]);
    }

    const updated = await prisma.occurrence.update({
      where: { id },
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
    const id = Number(req.params.id);

    if (useMock) {
      const filtered = occurrences.filter(o => o.id !== id);

      occurrences.length = 0; // limpa array original
      occurrences.push(...filtered); // recria sem o item deletado

      return res.json({ message: "Deletado com sucesso" });
    }

    await prisma.occurrence.delete({
      where: { id },
    });

    res.json({ message: "Deletado com sucesso" });
  } catch {
    res.status(500).json({ error: "Erro ao deletar ocorrência" });
  }
};