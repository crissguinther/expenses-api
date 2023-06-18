import 'jest';
import { UserRepository } from '../../../src/repositories/UserRepository';
import { UserRequest } from '../../../src/types/request/UserRequest';
import { Validator } from '../../../src/util/Validator';
import { PrismaClient } from '@prisma/client';

const privatePrisma = new PrismaClient();

async function truncateUsersTable() {
  const usersCount = await privatePrisma.user.count();

  // DEV NOTE: As the database is a PostgreSQL, we need the double quotes
  // inside the template string
  if (usersCount > 0)
    await privatePrisma.$queryRaw`TRUNCATE TABLE "users" CASCADE;`;

  const personalInfoCount = await privatePrisma.personalInfo.count();
  if (personalInfoCount > 0)
    await privatePrisma.$queryRaw`TRUNCATE TABLE "personalInfo" CASCADE`;
}

describe('Tests the user repository functionality', () => {
  // Arrange
  let userRequest: UserRequest = {
    email: 'email',
    password: 'password',
    personalInfo: {
      firstName: 'Jane',
      lastName: 'Doe',
    },
  };

  beforeAll(async () => {
    truncateUsersTable();
  });

  const userRepository = new UserRepository();
  const validator = new Validator();

  // Act
  it('Should return false for a user exists check', async () => {
    const verification = await userRepository.userExists(userRequest.email);

    expect(verification).toBe(false);
  });

  it('Should throw error for a user with invalid email', async () => {
    await expect(userRepository.storeUser(userRequest)).rejects.toThrowError();
  });

  it('Should not throw an error for a user with a valid email', async () => {
    userRequest.email = 'email@gmail.com';
    await expect(
      userRepository.storeUser(userRequest)
    ).resolves.not.toThrowError();
  });

  it('Should properly hash the password', async () => {
    const userInDb = await userRepository.getUserByEmail(userRequest.email);
    expect(userInDb).not.toBeNull();

    if (userInDb) {
      expect(userInDb.password).not.toBe(userRequest.password);
      expect(
        validator.passwordMatchesHash(userRequest.password, userInDb.password)
      ).toBe(true);
    } else {
      throw new Error('User was not found in the database');
    }
  });

  afterAll(async () => {
    truncateUsersTable();
  });
});
