const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { User } = require('../models');

dotenv.config();

// Gera o token JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
};

// Cadastro
async function signup(req, res) {
  const { name, email, password, role } = req.body;
  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email já está em uso.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role && role === 'manager' ? 'manager' : 'user',
    });

    return res.status(201).json({ message: 'Usuário registrado com sucesso!', userId: user.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao registrar usuário.' });
  }
}

// Login com retorno de isManager
async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Senha inválida.' });
    }

    const token = generateToken(user.id);

    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isManager: user.role === 'manager'  // 👈 incluído aqui
      },
      accessToken: token
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Falha no login.' });
  }
}

module.exports = {
  signup,
  login,
};
