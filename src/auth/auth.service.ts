import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SignInDto, SignInResponseDto } from '@src/auth/dto/sign-in.dto';

@Injectable()
export class AuthService {
    #secret: string;

    constructor(private readonly configService: ConfigService, private readonly jwtService: JwtService) {
        this.#secret = this.configService.get('JWT_SECRET')!;
    }

    async signIn({ email, password }: SignInDto): Promise<SignInResponseDto> {
        // @TODO: findOne(email, password)
        const accessToken = await this.jwtService.signAsync({ userId: 1 }, { secret: this.#secret });

        return { accessToken };
    }
}
