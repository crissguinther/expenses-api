import { config as dotenv } from 'dotenv';

dotenv();

export class ApplicationConfig {
  public static GetPasswordSalts(): number {
    return Number(process.env.PASSWORD_SALT);
  }
}
