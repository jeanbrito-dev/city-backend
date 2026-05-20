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
      id: Date.now().toString(),
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
      id: Date.now().toString(),
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
