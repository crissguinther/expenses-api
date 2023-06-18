import { config as dotenv } from 'dotenv';

dotenv();

export class ApplicationConfig {
  public static GetPasswordSalts(): number {
    return Number(process.env.PASSWORD_SALT);
  }

  public static GetJwtToken(): string | undefined {
    return process.env.JSON_TOKEN_SECRET;
  }

  public static GetJwtExpiration(): string | undefined {
    return process.env.JWT_EXPIRATION;
  }
}
