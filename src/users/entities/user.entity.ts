import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { USER_STATUS } from '@src/common/enums/status.enum';

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column({ name: 'email', default: '' })
    email: string;

    @Column({ name: 'password', default: '' })
    password: string;

    @Column({ name: 'nickname', default: '' })
    nickname: string;

    @Column('enum', { enum: USER_STATUS, default: USER_STATUS.NORMAL })
    status: USER_STATUS;
}
