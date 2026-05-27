import { signToken } from "../lib/jwt.js";

// mock de usuários
const users = [
  {
    id: 1,
    nome: "Jean",
    email: "jean@email.com",
    senha: "123456",
  },
];

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        error: "Email e senha obrigatórios",
      });
    }

    const user = users.find(
      (u) => u.email === email && u.senha === senha
    );

    if (!user) {
      return res.status(401).json({
        error: "Credenciais inválidas",
      });
    }

    const token = signToken({
      id: user.id,
      nome: user.nome,
      email: user.email,
    });

    return res.json({
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
      },
    });

  } catch {
    res.status(500).json({
      error: "Erro no login",
    });
  }
};

// REGISTER
export const register = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        error: "Preencha todos os campos",
      });
    }

    const exists = users.find((u) => u.email === email);

    if (exists) {
      return res.status(400).json({
        error: "Usuário já existe",
      });
    }

    const newUser = {
      id: Date.now(),
      nome,
      email,
      senha,
    };

    users.push(newUser);

    const token = signToken({
      id: newUser.id,
      nome: newUser.nome,
      email: newUser.email,
    });

    res.json({
      message: "Usuário criado",
      token,
      user: {
        id: newUser.id,
        nome: newUser.nome,
        email: newUser.email,
      },
    });

  } catch {
    res.status(500).json({
      error: "Erro ao registrar",
    });
  }
};

// GET USER
export const getUser = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (req.user.id !== id) {
      return res.status(403).json({
        error: "Acesso proibido",
      });
    }

    const user = users.find((u) => u.id === id);

    if (!user) {
      return res.status(404).json({
        error: "Usuário não encontrado",
      });
    }

    res.json({
      id: user.id,
      nome: user.nome,
      email: user.email,
    });

  } catch {
    res.status(500).json({
      error: "Erro ao buscar usuário",
    });
  }
};

// UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (req.user.id !== id) {
      return res.status(403).json({
        error: "Acesso proibido",
      });
    }

    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      return res.status(404).json({
        error: "Usuário não encontrado",
      });
    }

    const { nome, email, senha } = req.body;

    // impede email duplicado
    const emailExists = users.find(
      (u) => u.email === email && u.id !== id
    );

    if (emailExists) {
      return res.status(400).json({
        error: "Email já está em uso",
      });
    }

    users[index] = {
      ...users[index],
      nome: nome || users[index].nome,
      email: email || users[index].email,
      senha: senha || users[index].senha,
    };

    const token = signToken({
      id: users[index].id,
      nome: users[index].nome,
      email: users[index].email,
    });

    res.json({
      message: "Usuário atualizado",
      token,
      user: {
        id: users[index].id,
        nome: users[index].nome,
        email: users[index].email,
      },
    });

  } catch {
    res.status(500).json({
      error: "Erro ao atualizar usuário",
    });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (req.user.id !== id) {
      return res.status(403).json({
        error: "Acesso proibido",
      });
    }

    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      return res.status(404).json({
        error: "Usuário não encontrado",
      });
    }

    users.splice(index, 1);

    res.json({
      message: "Usuário deletado com sucesso",
    });

  } catch {
    res.status(500).json({
      error: "Erro ao deletar usuário",
    });
  }
};