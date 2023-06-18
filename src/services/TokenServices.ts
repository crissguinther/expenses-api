import { User } from '@prisma/client';
import { PersonalInfo } from '@prisma/client';

import { Logger } from '../util/Logger';
import { LogLevel } from '../enum/LogLevel';
import { ApplicationConfig } from '../config/ApplicationConfig';
import { UserResponse } from '../types/response/UserResponse';
import jwt from 'jsonwebtoken';

export class TokenService {
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  /**
   * @description Generates a JWT token based on a database
   * User
   * @param user The User from the database
   */
  public generateToken(user: User | PersonalInfo): UserResponse | undefined {
    try {
      const { id } = user as User;
      const { first_name, last_name } = user as PersonalInfo;

      const userResponse: UserResponse = {
        id,
        first_name: first_name ?? null,
        last_name: last_name ?? null,
      };

      const tokenSecret: string | undefined = ApplicationConfig.GetJwtToken();
      if (!tokenSecret) throw new Error('Token secret not found');

      const tokenExpiration: string | undefined =
        ApplicationConfig.GetJwtExpiration();
      if (!tokenExpiration) throw new Error('Token expiration not found');

      const token: string = jwt.sign(userResponse, tokenSecret, {
        expiresIn: tokenExpiration,
      });

      userResponse.token = token;

      return userResponse;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.log(error.message, LogLevel.ERROR);
        throw new Error(error.message);
      }
    }
  }
}
