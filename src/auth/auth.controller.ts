import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';
import { SignInDto, SignInResponseDto } from '@src/auth/dto/sign-in.dto';
import { JwtGuard } from '@src/auth/jwt/jwt.guard';

@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/signIn')
    async signIn(@Body() dto: SignInDto): Promise<SignInResponseDto> {
        return this.authService.signIn(dto);
    }

    @UseGuards(JwtGuard)
    @Post('/test')
    async authTest() {
        return;
    }
}
