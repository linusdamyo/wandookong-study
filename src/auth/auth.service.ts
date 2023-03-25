import { Injectable } from '@nestjs/common';
import { SignInDto, SignInResponseDto } from '@src/auth/dto/sign-in.dto';

@Injectable()
export class AuthService {
    async signIn({ email, password }: SignInDto): Promise<SignInResponseDto> {
        return { accessToken: 'access' };
    }
}
