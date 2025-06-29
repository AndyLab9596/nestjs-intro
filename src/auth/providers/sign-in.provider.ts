import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dtos/signin.dto';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { HashingProvider } from './hashing.provider';

@Injectable()
export class SignInProvider {
  constructor(
    // Injecting UserService
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,

    private readonly generateTokenProvider: GenerateTokensProvider,
  ) {}

  public async signIn(signInDto: SignInDto) {
    // Find the user using email
    const foundUser = await this.usersService.findOneByEmail(signInDto.email);
    // Throw an exception if user not found
    if (!foundUser) {
      throw new BadRequestException('User not found');
    }
    // Compare the password to the hash
    const isMatch = await this.hashingProvider.comaprePassword(
      signInDto.password,
      foundUser.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credential');
    }

    return await this.generateTokenProvider.generateTokens(foundUser);
  }
}
