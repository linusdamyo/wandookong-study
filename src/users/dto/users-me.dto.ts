import { USER_STATUS } from '@src/common/enums/status.enum';
import { UserEntity } from '@src/users/entities/user.entity';

export class UsersMeResponseDto {
    email: string;
    nickname: string;
    status: USER_STATUS;

    constructor(user: UserEntity) {
        this.email = user.email;
        this.nickname = user.nickname;
        this.status = user.status;
    }
}
