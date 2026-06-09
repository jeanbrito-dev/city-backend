import { prisma } from "../../lib/prisma.js";

export async function deleteCommentAdmin(req, res) {
  try {
    const { id } = req.params;

    await prisma.comment.delete({
      where: {
        id: Number(id),
      },
    });

    return res.json({
      message: "Comentário removido pelo administrador",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Erro ao remover comentário",
    });
  }
}

export async function deleteReplyAdmin(req, res) {
  try {
    const { id } = req.params;

    await prisma.reply.delete({
      where: {
        id: Number(id),
      },
    });

    return res.json({
      message: "Resposta removida pelo administrador",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Erro ao remover resposta",
    });
  }
}