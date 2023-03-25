import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '@src/users/entities/user.entity';

@Injectable()
export class UsersRepository {
    #usersRepository: Repository<UserEntity>;

    constructor(private readonly dataSource: DataSource) {
        this.#usersRepository = this.dataSource.getRepository(UserEntity);
    }

    async findOne(id: number) {
        return this.#usersRepository.findOneByOrFail({ id });
    }

    async findOneByEmail(email: string) {
        return this.#usersRepository.findOneBy({ email });
    }
}
