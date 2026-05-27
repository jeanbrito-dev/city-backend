import { prisma } from "../lib/prisma.js";
import { occurrences } from "../data/occurrences.js";
import { commentsByOccurrence } from "./commentController.js";
import { v4 as uuidv4 } from "uuid";

const useMock = true; // true = usa array | false = usa banco

// Helper: calcula total de comentários + replies de uma ocorrência
const getCommentCount = (occurrenceId) => {
  const comments = commentsByOccurrence[occurrenceId] || [];
  return comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0);
};

// CREATE
export const createOccurrence = async (req, res) => {
  try {
    if (useMock) {
      const newOccurrence = {
        id: uuidv4(),
        createdAt: new Date(),
        likedBy: [],
        userId: req.user?.id || req.body.userId, // IMPORTANTE
        ...req.body,
      };

      occurrences.push(newOccurrence);

      return res.json({
        ...newOccurrence,
        likes: 0,
        comentarios: 0,
      });
    }

    const occurrence = await prisma.occurrence.create({
      data: req.body,
    });

    res.json(occurrence);
  } catch {
    res.status(500).json({
      error: "Erro ao criar ocorrência",
    });
  }
};

// GET ALL + FILTRO
export const getOccurrences = async (req, res) => {
  try {
    const { status, categoria, userId } = req.query;

    if (useMock) {
      let data = [...occurrences];

      if (status) {
        data = data.filter(o => o.status === status);
      }

      if (categoria) {
        data = data.filter(o => o.categoria === categoria);
      }

      // FILTRO POR USUÁRIO
      if (userId) {
        data = data.filter(o => String(o.userId) === String(userId));
      }

      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const withCounts = data.map(o => ({
        ...o,
        likes: (o.likedBy || []).length,
        likedBy: o.likedBy || [],
        comentarios: getCommentCount(o.id),
      }));

      return res.json(withCounts);
    }

    const data = await prisma.occurrence.findMany({
      where: {
        status: status || undefined,
        categoria: categoria || undefined,
        userId: userId || undefined,
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
    const id = req.params.id;

    if (useMock) {
      const occurrence = occurrences.find((o) => o.id === id);
      if (!occurrence) {
        return res.status(404).json({ error: "Ocorrência não encontrada" });
      }

      return res.json({
        ...occurrence,
        likes: (occurrence.likedBy || []).length,
        likedBy: occurrence.likedBy || [],
        comentarios: getCommentCount(id),
      });
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
    const id = req.params.id;

    if (useMock) {
      const index = occurrences.findIndex((o) => o.id === id);

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
    const id = req.params.id;

    if (useMock) {
      const filtered = occurrences.filter((o) => o.id !== id);

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

// LIKE / UNLIKE (por usuário)
export const toggleLike = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user?.id || req.body.userId;

    if (!userId) {
      return res.status(400).json({ error: "userId é obrigatório" });
    }

    if (useMock) {
      const occurrence = occurrences.find((o) => o.id === id);
      if (!occurrence) {
        return res.status(404).json({ error: "Ocorrência não encontrada" });
      }

      if (!occurrence.likedBy) occurrence.likedBy = [];

      const alreadyLiked = occurrence.likedBy.includes(userId);

      if (alreadyLiked) {
        // remove o like
        occurrence.likedBy = occurrence.likedBy.filter((uid) => uid !== userId);
      } else {
        // adiciona o like
        occurrence.likedBy.push(userId);
      }

      return res.json({
        likes: occurrence.likedBy.length,
        liked: !alreadyLiked,
        likedBy: occurrence.likedBy,
      });
    }

    res.status(501).json({ error: "Não implementado para banco" });
  } catch {
    res.status(500).json({ error: "Erro ao curtir ocorrência" });
  }
};
