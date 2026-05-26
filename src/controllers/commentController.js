import { randomUUID } from "crypto";

// Armazena comentários por ocorrência em memória
// Estrutura: { [occurrenceId]: [ { id, autor, texto, replies: [...] } ] }
export const commentsByOccurrence = {};

// GET comentários de uma ocorrência
export const getComments = (req, res) => {
  try {
    const { occurrenceId } = req.params;
    const comments = commentsByOccurrence[occurrenceId] || [];
    res.json(comments);
  } catch {
    res.status(500).json({ error: "Erro ao buscar comentários" });
  }
};

// POST novo comentário em uma ocorrência
export const addComment = (req, res) => {
  try {
    const { occurrenceId } = req.params;
    const { autor, texto } = req.body;

    if (!autor || !texto) {
      return res.status(400).json({ error: "Autor e texto são obrigatórios" });
    }

    if (!commentsByOccurrence[occurrenceId]) {
      commentsByOccurrence[occurrenceId] = [];
    }

    const newComment = {
      id: randomUUID(),
      autor,
      texto,
      createdAt: new Date(),
      replies: [],
    };

    commentsByOccurrence[occurrenceId].push(newComment);
    res.json(newComment);
  } catch {
    res.status(500).json({ error: "Erro ao adicionar comentário" });
  }
};

// POST resposta a um comentário
export const addReply = (req, res) => {
  try {
    const { occurrenceId, commentId } = req.params;
    const { autor, texto, isAuthor } = req.body;

    if (!autor || !texto) {
      return res.status(400).json({ error: "Autor e texto são obrigatórios" });
    }

    const comments = commentsByOccurrence[occurrenceId];
    if (!comments) {
      return res.status(404).json({ error: "Ocorrência não encontrada" });
    }

    const comment = comments.find((c) => c.id === commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comentário não encontrado" });
    }

    const newReply = {
      id: randomUUID(),
      autor,
      texto,
      isAuthor: isAuthor || false,
      createdAt: new Date(),
    };

    comment.replies.push(newReply);
    res.json(newReply);
  } catch {
    res.status(500).json({ error: "Erro ao adicionar resposta" });
  }
};

// UPDATE comentário
export const updateComment = (req, res) => {
  try {
    const { occurrenceId, commentId } = req.params;
    const { texto } = req.body;

    if (!texto) {
      return res.status(400).json({
        error: "Texto é obrigatório",
      });
    }

    const comments = commentsByOccurrence[occurrenceId];

    if (!comments) {
      return res.status(404).json({
        error: "Ocorrência não encontrada",
      });
    }

    const comment = comments.find((c) => c.id === commentId);

    if (!comment) {
      return res.status(404).json({
        error: "Comentário não encontrado",
      });
    }

    comment.texto = texto;
    comment.updatedAt = new Date();

    res.json(comment);
  } catch {
    res.status(500).json({
      error: "Erro ao atualizar comentário",
    });
  }
};

// DELETE comentário
export const deleteComment = (req, res) => {
  try {
    const { occurrenceId, commentId } = req.params;

    const comments = commentsByOccurrence[occurrenceId];

    if (!comments) {
      return res.status(404).json({
        error: "Ocorrência não encontrada",
      });
    }

    const index = comments.findIndex((c) => c.id === commentId);

    if (index === -1) {
      return res.status(404).json({
        error: "Comentário não encontrado",
      });
    }

    comments.splice(index, 1);

    res.json({
      message: "Comentário deletado com sucesso",
    });
  } catch {
    res.status(500).json({
      error: "Erro ao deletar comentário",
    });
  }
};

// UPDATE reply
export const updateReply = (req, res) => {
  try {
    const { occurrenceId, commentId, replyId } = req.params;
    const { texto } = req.body;

    if (!texto) {
      return res.status(400).json({
        error: "Texto é obrigatório",
      });
    }

    const comments = commentsByOccurrence[occurrenceId];

    if (!comments) {
      return res.status(404).json({
        error: "Ocorrência não encontrada",
      });
    }

    const comment = comments.find((c) => c.id === commentId);

    if (!comment) {
      return res.status(404).json({
        error: "Comentário não encontrado",
      });
    }

    const reply = comment.replies.find((r) => r.id === replyId);

    if (!reply) {
      return res.status(404).json({
        error: "Resposta não encontrada",
      });
    }

    reply.texto = texto;
    reply.updatedAt = new Date();

    res.json(reply);
  } catch {
    res.status(500).json({
      error: "Erro ao atualizar resposta",
    });
  }
};

// DELETE reply
export const deleteReply = (req, res) => {
  try {
    const { occurrenceId, commentId, replyId } = req.params;

    const comments = commentsByOccurrence[occurrenceId];

    if (!comments) {
      return res.status(404).json({
        error: "Ocorrência não encontrada",
      });
    }

    const comment = comments.find((c) => c.id === commentId);

    if (!comment) {
      return res.status(404).json({
        error: "Comentário não encontrado",
      });
    }

    const index = comment.replies.findIndex((r) => r.id === replyId);

    if (index === -1) {
      return res.status(404).json({
        error: "Resposta não encontrada",
      });
    }

    comment.replies.splice(index, 1);

    res.json({
      message: "Resposta deletada com sucesso",
    });
  } catch {
    res.status(500).json({
      error: "Erro ao deletar resposta",
    });
  }
};