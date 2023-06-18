import 'jest';

import { User, PersonalInfo } from '@prisma/client';

import { TokenService } from '../../../src/services/TokenServices';
import jwt from 'jsonwebtoken';
import { UserResponse } from '../../../src/types/response/UserResponse';
import { ApplicationConfig } from '../../../src/config/ApplicationConfig';

describe('It should the token services', () => {
  const tokenService = new TokenService();

  const user: User = {
    id: 1,
    createdOn: new Date(),
    email: 'email@email.com',
    password: 'password',
    personalInfoUserId: 1,
  };

  const personalInfo: PersonalInfo = {
    first_name: 'Jane',
    last_name: 'Doe',
    userId: 1,
  };

  it('Should generate a token', () => {
    const token = tokenService.generateToken(user) as UserResponse;
    if (!token || token.token) throw new Error('Token not generated');

    const tokenSecret = ApplicationConfig.GetJwtToken();
    if (!tokenSecret) throw new Error('Token secret is not defined');

    expect(jwt.verify(token.token as string, tokenSecret)).toBe(true);
  });
});
