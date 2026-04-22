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

    // valida campos
    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha obrigatórios" });
    }

    // busca usuário
    const user = users.find(
      (u) => u.email === email && u.senha === senha
    );

    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // simula "login"
    return res.json({
      message: "Login realizado com sucesso",
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
      },
    });

  } catch (err) {
    res.status(500).json({ error: "Erro no login" });
  }
};

// REGISTER (opcional)
export const register = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: "Preencha todos os campos" });
    }

    const exists = users.find((u) => u.email === email);

    if (exists) {
      return res.status(400).json({ error: "Usuário já existe" });
    }

    const newUser = {
      id: Date.now(),
      nome,
      email,
      senha,
    };

    users.push(newUser);

    res.json({
      message: "Usuário criado",
      user: {
        id: newUser.id,
        nome: newUser.nome,
        email: newUser.email,
      },
    });

  } catch {
    res.status(500).json({ error: "Erro ao registrar" });
  }
};