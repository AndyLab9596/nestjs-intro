import {
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/providers/users.service';
import jwtConfig from '../config/jwt.config';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { GenerateTokensProvider } from './generate-tokens.provider';

@Injectable()
export class RefreshTokensProvider {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    private readonly jwtService: JwtService,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly generateTokenProvider: GenerateTokensProvider,
  ) {}
  public async refreshToken(refreshTokenDto: RefreshTokenDto) {
    // verify the refresh token using jwtService
    const payload = await this.jwtService.verifyAsync(
      refreshTokenDto.refreshToken,
      this.jwtConfiguration,
    );

    if (!payload) {
      throw new UnauthorizedException();
    }
    const user = await this.usersService.findOneById(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return await this.generateTokenProvider.generateTokens(user);
  }
}
