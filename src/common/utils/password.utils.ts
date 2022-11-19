import * as bcrypt from 'bcrypt';

export class PasswordUtils {
  static async hashing(password: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  static async hashCompare(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
