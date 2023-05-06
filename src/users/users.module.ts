import { Module } from '@nestjs/common';
import { UsersService } from '@src/users/users.service';
import { UsersRepository } from '@src/users/users.repository';
import { UsersController } from '@src/users/users.controller';

@Module({
    controllers: [UsersController],
    providers: [UsersService, UsersRepository],
    exports: [UsersService],
})
export class UsersModule {}
