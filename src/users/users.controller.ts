import { Controller, UseGuards, Get } from '@nestjs/common';
import { UsersService } from '@src/users/users.service';
import { JwtGuard } from '@src/auth/jwt/jwt.guard';
import { AuthUser, AuthUserType } from '@src/common/decorators/auth-user.decorator';
import { UsersMeResponseDto } from '@src/users/dto/users-me.dto';

@UseGuards(JwtGuard)
@Controller('/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('/me')
    async getMe(@AuthUser() authUser: AuthUserType): Promise<UsersMeResponseDto> {
        return this.usersService.getMe(authUser);
    }
}
