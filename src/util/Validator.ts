import validator from 'validator';
import { compareSync } from 'bcryptjs';

export class Validator {
  constructor() {}

  public isEmail(email: string): boolean {
    return validator.isEmail(email);
  }

  public passwordMatchesHash(password: string, hash: string): boolean {
    return compareSync(password, hash);
  }
}
