import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import { ApplicationConfig } from '../config/ApplicationConfig';
import { UserRequest } from '../types/UserRequest';
import { Logger } from '../util/Logger';
import { LogLevel } from '../enum/LogLevel';
import { Validator } from '../util/Validator';

export class UserRepository {
  private prisma: PrismaClient;
  private logger: Logger;
  private validator: Validator;

  constructor() {
    this.prisma = new PrismaClient();
    this.logger = new Logger();
    this.validator = new Validator();
  }

  /**
   * @description Check if user exists in the database
   * @returns {boolean} True if user exists, false otherwise
   */
  public async userExists(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) return true;
    return false;
  }

  /**
   * Asynchronously stores a user and their personal info in the database.
   *
   * @param {UserRequest} user - The user object to store.
   * @return {Promise<void>} A promise that resolves when the user is stored.
   */
  public async storeUser(user: UserRequest) {
    if (!this.validator.isEmail(user.email))
      throw new Error('Email is not valid');

    const passwordHash = bcryptjs.hashSync(
      user.password,
      ApplicationConfig.GetPasswordSalts()
    );

    try {
      await this.prisma.$transaction(async (prisma) => {
        const storedUser = await prisma.user.create({
          data: {
            email: user.email,
            password: passwordHash,
          },
          include: {
            personalInfo: true,
          },
        });

        const storedPersonalInfo = await prisma.personalInfo.create({
          data: {
            userId: storedUser.id,
            first_name: user.personalInfo.firstName,
            last_name: user.personalInfo.lastName,
          },
        });
      });
    } catch (error) {
      if (error instanceof Error) {
        const message = error.message ?? 'Error while creating user';
        this.logger.log(message, LogLevel.ERROR);
      }
    }
  }

  /**
   * Retrieves a user object given their email.
   *
   * @param {string} email - Email of the user to retrieve.
   * @return {Promise<ReturnType<typeof this.prisma.user.findUnique> | null>}
   * User object or null if not found.
   */
  public async getUserByEmail(
    email: string
  ): Promise<ReturnType<typeof this.prisma.user.findUnique> | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    return user;
  }

  public async deleteUserByEmail(email: string) {
    if (!this.userExists(email)) throw new Error('User does not exists!');

    await this.prisma.user.delete({
      where: {
        email: email,
      },
    });
  }
}
