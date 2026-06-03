import { prisma } from "../lib/prisma.js";
import { signToken } from "../lib/jwt.js";
import bcrypt from "bcrypt";

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        error: "Email e senha obrigatórios",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const valid = await bcrypt.compare(senha, user.senha);

    if (!valid) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = signToken({
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
    });

    return res.json({
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);

    res.status(500).json({
      error: "Erro no login",
      details: error.message,
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

    const exists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (exists) {
      return res.status(400).json({
        error: "Usuário já existe",
      });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const newUser = await prisma.user.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
      },
    });

    const token = signToken({
      id: newUser.id,
      nome: newUser.nome,
      email: newUser.email,
      role: newUser.role,
    });

    res.json({
      message: "Usuário criado",
      token,
      user: {
        id: newUser.id,
        nome: newUser.nome,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Erro ao registrar:", error);

    res.status(500).json({
      error: "Erro ao registrar",
      details: error.message,
    });
  }
};

// GET USER
export const getUser = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number(req.user.id) !== id) {
      return res.status(403).json({
        error: "Acesso proibido",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

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
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);

    res.status(500).json({
      error: "Erro ao buscar usuário",
      details: error.message,
    });
  }
};

// UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number(req.user.id) !== id) {
      return res.status(403).json({
        error: "Acesso proibido",
      });
    }

    const { nome, email, senha } = req.body;

    if (email) {
      const emailExists = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (emailExists && emailExists.id !== id) {
        return res.status(400).json({
          error: "Email já está em uso",
        });
      }
    }

    let hashedPassword = undefined;
    if (senha) {
      hashedPassword = await bcrypt.hash(senha, 10);
    }

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        nome: nome || undefined,
        email: email || undefined,
        senha: hashedPassword || undefined,
      },
    });

    const token = signToken({
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
    });

    res.json({
      message: "Usuário atualizado",
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);

    res.status(500).json({
      error: "Erro ao atualizar usuário",
      details: error.message,
    });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number(req.user.id) !== id) {
      return res.status(403).json({
        error: "Acesso proibido",
      });
    }

    await prisma.user.delete({
      where: {
        id,
      },
    });

    res.json({
      message: "Usuário deletado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);

    res.status(500).json({
      error: "Erro ao deletar usuário",
      details: error.message,
    });
  }
};
