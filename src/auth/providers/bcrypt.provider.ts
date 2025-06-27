import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider implements HashingProvider {
  public async hashPassword(data: string | Buffer): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data, salt);
    return hashedPassword;
  }
  public async comaprePassword(
    data: string | Buffer,
    encrypted: string,
  ): Promise<boolean> {
    const isMatch = await bcrypt.compare(data, encrypted);
    return isMatch;
  }
}
