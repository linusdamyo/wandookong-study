import { Injectable } from '@nestjs/common';
import { UsersRepository } from '@src/users/users.repository';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

    async getUser(userId: number) {
        return this.usersRepository.findOne(userId);
    }

    async getUserByEmail(email: string) {
        return this.usersRepository.findOneByEmail(email);
    }
}
