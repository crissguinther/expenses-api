import { Router } from 'express';
import { UserRepository } from '../repositories/UserRepository';
import { Validator } from '../util/Validator';
import { Logger } from '../util/Logger';
import { LogLevel } from '../enum/LogLevel';

import { LoginRequest } from '../types/request/LoginRequest';
import { StatusCodes } from 'http-status-codes';

const router = Router();
const userRepository = new UserRepository();
const validator = new Validator();
const logger = new Logger();

// region POST
router.post('/', async (req, res) => {
  try {
    const loginRequest = req.body;
    if (!(loginRequest satisfies LoginRequest)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Missing required fields',
      });
    }

    const { email, password } = loginRequest;
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'User not found',
      });
    }

    if (!validator.passwordMatchesHash(password, user.password)) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'Invalid password',
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.log(error.message, LogLevel.ERROR);
    }
  }
});
// endregion

export { router };
