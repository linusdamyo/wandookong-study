import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '@src/users/users.service';
import { UserEntity } from '@src/users/entities/user.entity';
import { UsersRepository } from '@src/users/users.repository';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [UsersService, UsersRepository],
    exports: [UsersService],
})
export class UsersModule {}
