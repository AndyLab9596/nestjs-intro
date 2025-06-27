import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingProvider {
  abstract hashPassword(data: string | Buffer): Promise<string>;
  abstract comaprePassword(
    data: string | Buffer,
    encrypted: string,
  ): Promise<boolean>;
}
