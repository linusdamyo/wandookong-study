import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SignInDto, SignInResponseDto } from '@src/auth/dto/sign-in.dto';
import { UsersService } from '@src/users/users.service';

@Injectable()
export class AuthService {
    #secret: string;

    constructor(private readonly configService: ConfigService, private readonly jwtService: JwtService, private readonly usersService: UsersService) {
        this.#secret = this.configService.get('JWT_SECRET')!;
    }

    async signIn({ email, password }: SignInDto): Promise<SignInResponseDto> {
        const user = await this.usersService.getUserByEmail(email);
        if (!user) throw new UnauthorizedException('사용자를 찾을 수 없습니다.');

        // @TODO: password hash
        if (user.password !== password) throw new UnauthorizedException('잘못된 password입니다.');

        const accessToken = await this.jwtService.signAsync({ userId: user.id }, { secret: this.#secret });

        return { accessToken };
    }
}
