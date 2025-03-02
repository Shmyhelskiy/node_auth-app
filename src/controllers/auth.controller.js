import { userService } from '../services/user.service.js';
import { tokenService } from '../services/token.service.js';
import { jwtService } from '../services/jwt.service.js';
import { AppiError } from '../exeptions/api.errors.js';
import bcript from 'bcrypt';

const validateEmail = (value) => {
  if (!value) {
    return 'Email is required';
  }

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailPattern.test(value)) {
    return 'Email is not valid';
  }

  return null;
};

const validatePassword = (value) => {
  if (!value) {
    return 'Password is required';
  }

  if (value.length < 6) {
    return 'At least 6 characters';
  }

  return null;
};

const generateToken = async (res, user) => {
  const normalizedUser = userService.normalized(user);

  const accessToken = jwtService.sign(normalizedUser);
  const refreshToken = jwtService.signRefresh(normalizedUser);

  await tokenService.save(normalizedUser.id, refreshToken);

  res.cookie('refreshToken', refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });

  res.send({
    user: normalizedUser,
    accessToken,
  });
};



const register = async (req, res) => {
  const { email, password, name } = req.body;

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };

  if (errors.email || errors.password) {
    throw AppiError.badRequest('Bad request', errors);
  }
  const hashedPass = await bcript.hash(password, 10);
  await userService.register(email, hashedPass, name);

  res.send({ message: 'User registred' });
};

const activate = async (req, res) => {
  const { activationToken } = req.params;

  await userService.activate(activationToken);

  res.send({ message: 'User activated' });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await userService.findByEmail(email);

  if (!user) {
    throw AppiError.badRequest('No such user');
  }

  const isPasswordVlid = await bcript.compare(password, user.password);

  if (!isPasswordVlid) {
    throw AppiError.badRequest('Wrong password');
  }

  generateToken(res, user);
};

const refresh = async (req, res) => {
  const { refreshToken } = req.cookies;

  const user = jwtService.verifyRefresh(refreshToken);
  const token = await tokenService.getByToken(refreshToken);

  if (!user || !token) {
    throw AppiError.unauthorized();
  }

  generateToken(res, user);
};

export const authController = {
  register,
  activate,
  login,
  refresh,
};
