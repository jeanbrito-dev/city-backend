import { prisma } from "../lib/prisma.js";

// GET COMMENTS
export const getComments = async (req, res) => {
  try {
    const occurrenceId = Number(req.params.occurrenceId);

    const comments = await prisma.comment.findMany({
      where: {
        occurrenceId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        replies: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    res.json(comments);
  } catch (error) {
    console.error("Erro ao buscar comentários:", error);

    res.status(500).json({
      error: "Erro ao buscar comentários",
      details: error.message,
    });
  }
};

// ADD COMMENT
export const addComment = async (req, res) => {
  try {
    const occurrenceId = Number(req.params.occurrenceId);
    const userId = req.user?.id ? Number(req.user.id) : null;

    const { texto, autor } = req.body;

    if (!texto) {
      return res.status(400).json({
        error: "Texto do comentário é obrigatório",
      });
    }

    const comment = await prisma.comment.create({
      data: {
        texto,
        autor,
        userId,
        occurrenceId,
      },
      include: {
        replies: true,
      },
    });

    res.json(comment);
  } catch (error) {
    console.error("Erro ao adicionar comentário:", error);

    res.status(500).json({
      error: "Erro ao adicionar comentário",
      details: error.message,
    });
  }
};

// UPDATE COMMENT
export const updateComment = async (req, res) => {
  try {
    const commentId = Number(req.params.commentId);
    const userId = Number(req.user?.id);

    const { texto } = req.body;

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      return res.status(404).json({
        error: "Comentário não encontrado",
      });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({
        error: "Você não tem permissão para editar este comentário",
      });
    }

    const updated = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        texto,
      },
      include: {
        replies: true,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("Erro ao atualizar comentário:", error);

    res.status(500).json({
      error: "Erro ao atualizar comentário",
      details: error.message,
    });
  }
};

// DELETE COMMENT
export const deleteComment = async (req, res) => {
  try {
    const commentId = Number(req.params.commentId);
    const userId = Number(req.user?.id);

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      return res.status(404).json({
        error: "Comentário não encontrado",
      });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({
        error: "Você não tem permissão para deletar este comentário",
      });
    }

    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    res.json({
      message: "Comentário deletado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao deletar comentário:", error);

    res.status(500).json({
      error: "Erro ao deletar comentário",
      details: error.message,
    });
  }
};

// ADD REPLY
export const addReply = async (req, res) => {
  try {
    const commentId = Number(req.params.commentId);
    const userId = req.user?.id ? Number(req.user.id) : null;

    const { texto, autor } = req.body;

    if (!texto) {
      return res.status(400).json({
        error: "Texto da resposta é obrigatório",
      });
    }

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      return res.status(404).json({
        error: "Comentário não encontrado",
      });
    }

    const reply = await prisma.reply.create({
      data: {
        texto,
        autor,
        userId,
        commentId,
      },
    });

    res.json(reply);
  } catch (error) {
    console.error("Erro ao adicionar resposta:", error);

    res.status(500).json({
      error: "Erro ao adicionar resposta",
      details: error.message,
    });
  }
};

// UPDATE REPLY
export const updateReply = async (req, res) => {
  try {
    const replyId = Number(req.params.replyId);
    const userId = Number(req.user?.id);

    const { texto } = req.body;

    const reply = await prisma.reply.findUnique({
      where: {
        id: replyId,
      },
    });

    if (!reply) {
      return res.status(404).json({
        error: "Resposta não encontrada",
      });
    }

    if (reply.userId !== userId) {
      return res.status(403).json({
        error: "Você não tem permissão para editar esta resposta",
      });
    }

    const updated = await prisma.reply.update({
      where: {
        id: replyId,
      },
      data: {
        texto,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("Erro ao atualizar resposta:", error);

    res.status(500).json({
      error: "Erro ao atualizar resposta",
      details: error.message,
    });
  }
};

// DELETE REPLY
export const deleteReply = async (req, res) => {
  try {
    const replyId = Number(req.params.replyId);
    const userId = Number(req.user?.id);

    const reply = await prisma.reply.findUnique({
      where: {
        id: replyId,
      },
    });

    if (!reply) {
      return res.status(404).json({
        error: "Resposta não encontrada",
      });
    }

    if (reply.userId !== userId) {
      return res.status(403).json({
        error: "Você não tem permissão para deletar esta resposta",
      });
    }

    await prisma.reply.delete({
      where: {
        id: replyId,
      },
    });

    res.json({
      message: "Resposta deletada com sucesso",
    });
  } catch (error) {
    console.error("Erro ao deletar resposta:", error);

    res.status(500).json({
      error: "Erro ao deletar resposta",
      details: error.message,
    });
  }
};