import { prisma } from "../lib/prisma.js";
import { occurrences } from "../data/occurrences.js";
import { v4 as uuidv4 } from "uuid";
import { cloudinary } from "../lib/cloudinary.js";

const useMock = false;

// CREATE
export const createOccurrence = async (req, res) => {
  try {
    let imagem = null;

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "unicity/occurrences",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );

        stream.end(req.file.buffer);
      });

      imagem = uploadResult.secure_url;
    }

    if (useMock) {
      const newOccurrence = {
        id: uuidv4(),
        createdAt: new Date(),
        likedBy: [],
        userId: req.user?.id || req.body.userId,
        ...req.body,
        latitude: Number(req.body.latitude),
        longitude: Number(req.body.longitude),
        imagem,
      };

      occurrences.push(newOccurrence);

      return res.json({
        ...newOccurrence,
        likes: 0,
        likedBy: [],
        comentarios: 0,
      });
    }

    const occurrence = await prisma.occurrence.create({
      data: {
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        categoria: req.body.categoria,
        status: req.body.status || "pendente",
        latitude: Number(req.body.latitude),
        longitude: Number(req.body.longitude),
        imagem,
        autor: req.body.autor,
        userId: req.body.userId ? Number(req.body.userId) : null,
      },
    });

    return res.json({
      ...occurrence,
      likes: 0,
      likedBy: [],
      comentarios: 0,
    });
  } catch (error) {
    console.error("Erro ao criar ocorrência:", error);

    return res.status(500).json({
      error: "Erro ao criar ocorrência",
      details: error.message,
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
        data = data.filter((o) => o.status === status);
      }

      if (categoria) {
        data = data.filter((o) => o.categoria === categoria);
      }

      if (userId) {
        data = data.filter((o) => String(o.userId) === String(userId));
      }

      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const withCounts = data.map((o) => ({
        ...o,
        likes: (o.likedBy || []).length,
        likedBy: o.likedBy || [],
        comentarios: 0,
      }));

      return res.json(withCounts);
    }

    const where = {};

    if (status) {
      where.status = status;
    }

    if (categoria) {
      where.categoria = categoria;
    }

    if (userId) {
      where.userId = Number(userId);
    }

    const data = await prisma.occurrence.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        comments: {
          include: {
            replies: true,
          },
        },
        likes: true,
      },
    });

    return res.json(
      data.map((o) => ({
        ...o,
        likes: o.likes.length,
        likedBy: o.likes.map((like) => like.userId),
        comentarios: o.comments.reduce(
          (acc, comment) => acc + 1 + comment.replies.length,
          0,
        ),
      })),
    );
  } catch (error) {
    console.error("Erro ao buscar ocorrências:", error);

    return res.status(500).json({
      error: "Erro ao buscar ocorrências",
      details: error.message,
    });
  }
};

// GET BY ID
export const getOccurrenceById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (useMock) {
      const occurrence = occurrences.find((o) => String(o.id) === String(id));

      if (!occurrence) {
        return res.status(404).json({
          error: "Ocorrência não encontrada",
        });
      }

      return res.json({
        ...occurrence,
        likes: (occurrence.likedBy || []).length,
        likedBy: occurrence.likedBy || [],
        comentarios: 0,
      });
    }

    const occurrence = await prisma.occurrence.findUnique({
      where: {
        id,
      },
      include: {
        comments: {
          include: {
            replies: true,
          },
        },
        likes: true,
      },
    });

    if (!occurrence) {
      return res.status(404).json({
        error: "Ocorrência não encontrada",
      });
    }

    return res.json({
      ...occurrence,
      likes: occurrence.likes.length,
      likedBy: occurrence.likes.map((like) => like.userId),
      comentarios: occurrence.comments.reduce(
        (acc, comment) => acc + 1 + comment.replies.length,
        0,
      ),
    });
  } catch (error) {
    console.error("Erro ao buscar ocorrência:", error);

    return res.status(500).json({
      error: "Erro ao buscar ocorrência",
      details: error.message,
    });
  }
};

// UPDATE
export const updateOccurrence = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (useMock) {
      const index = occurrences.findIndex((o) => String(o.id) === String(id));

      if (index === -1) {
        return res.status(404).json({
          error: "Ocorrência não encontrada",
        });
      }

      occurrences[index] = {
        ...occurrences[index],
        ...req.body,
      };

      return res.json(occurrences[index]);
    }

    const updated = await prisma.occurrence.update({
      where: {
        id,
      },
      data: {
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        categoria: req.body.categoria,
        status: req.body.status,
        latitude:
          req.body.latitude !== undefined ? Number(req.body.latitude) : undefined,
        longitude:
          req.body.longitude !== undefined ? Number(req.body.longitude) : undefined,
        imagem: req.body.imagem,
        autor: req.body.autor,
        userId:
          req.body.userId !== undefined && req.body.userId !== null
            ? Number(req.body.userId)
            : undefined,
      },
    });

    return res.json(updated);
  } catch (error) {
    console.error("Erro ao atualizar ocorrência:", error);

    return res.status(500).json({
      error: "Erro ao atualizar ocorrência",
      details: error.message,
    });
  }
};

// DELETE
export const deleteOccurrence = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (useMock) {
      const filtered = occurrences.filter((o) => String(o.id) !== String(id));

      occurrences.length = 0;
      occurrences.push(...filtered);

      return res.json({
        message: "Deletado com sucesso",
      });
    }

    await prisma.occurrence.delete({
      where: {
        id,
      },
    });

    return res.json({
      message: "Deletado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao deletar ocorrência:", error);

    return res.status(500).json({
      error: "Erro ao deletar ocorrência",
      details: error.message,
    });
  }
};

// LIKE / UNLIKE
export const toggleLike = async (req, res) => {
  try {
    const occurrenceId = Number(req.params.id);
    const userId = Number(req.user?.id || req.body.userId);

    if (!userId) {
      return res.status(400).json({
        error: "userId é obrigatório",
      });
    }

    if (!occurrenceId) {
      return res.status(400).json({
        error: "occurrenceId inválido",
      });
    }

    const occurrence = await prisma.occurrence.findUnique({
      where: {
        id: occurrenceId,
      },
    });

    if (!occurrence) {
      return res.status(404).json({
        error: "Ocorrência não encontrada",
      });
    }

    const existingLike = await prisma.occurrenceLike.findUnique({
      where: {
        userId_occurrenceId: {
          userId,
          occurrenceId,
        },
      },
    });

    let liked = false;

    if (existingLike) {
      await prisma.occurrenceLike.delete({
        where: {
          id: existingLike.id,
        },
      });

      liked = false;
    } else {
      await prisma.occurrenceLike.create({
        data: {
          userId,
          occurrenceId,
        },
      });

      liked = true;
    }

    const likes = await prisma.occurrenceLike.count({
      where: {
        occurrenceId,
      },
    });

    const likedByRows = await prisma.occurrenceLike.findMany({
      where: {
        occurrenceId,
      },
      select: {
        userId: true,
      },
    });

    return res.json({
      likes,
      liked,
      likedBy: likedByRows.map((like) => like.userId),
    });
  } catch (error) {
    console.error("Erro ao curtir ocorrência:", error);

    return res.status(500).json({
      error: "Erro ao curtir ocorrência",
      details: error.message,
    });
  }
};