import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
    async getUser() {
        return { id: 1 };
    }
}
