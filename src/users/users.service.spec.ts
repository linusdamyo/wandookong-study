import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, EntityNotFoundError } from 'typeorm';
import { UsersService } from '@src/users/users.service';
import { UsersModule } from '@src/users/users.module';
import { UserEntity } from '@src/users/entities/user.entity';
import { USER_STATUS } from '@src/common/enums/status.enum';

describe('UsersService', () => {
    let service: UsersService;
    let dataSource: DataSource;
    let user: UserEntity;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: `src/config/.${process.env.NODE_ENV}.env`,
                }),
                TypeOrmModule.forRootAsync({
                    imports: [ConfigModule],
                    inject: [ConfigService],
                    useFactory: (configService: ConfigService) => ({
                        type: 'mysql',
                        host: configService.get('DB_HOST'),
                        port: +configService.get('DB_PORT'),
                        username: configService.get('DB_USERNAME'),
                        password: configService.get('DB_PASSWORD'),
                        database: configService.get('DB_DATABASE'),
                        entities: [__dirname + '/**/*.entity{.ts,.js}'],
                        synchronize: true,
                        autoLoadEntities: true,
                        logging: false,
                        charset: 'utf8mb4',
                    }),
                }),
                UsersModule,
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        dataSource = module.get<DataSource>(DataSource);
    });

    beforeEach(async () => {
        user = await dataSource.getRepository(UserEntity).save({ email: 'iu@wandookong.com', password: '123456', nickname: '아이유' });
    });

    it('getMe()', async () => {
        const result = await service.getMe({ userId: user.id });

        expect(result).toBeDefined();
        expect(result.nickname).toBe(user.nickname);
        expect(result.email).toBe(user.email);
        expect(result.status).toBe(USER_STATUS.NORMAL);
    });

    it('getMe() error!', async () => {
        await expect(service.getMe({ userId: user.id + 1 })).rejects.toThrow(EntityNotFoundError);
    });

    it('getUserByEmail()', async () => {
        const findUser = await service.getUserByEmail(user.email);

        expect(findUser).toBeDefined();
        expect(findUser!.id).toBe(user.id);
        expect(findUser!.nickname).toBe(user.nickname);
        expect(findUser!.status).toBe(USER_STATUS.NORMAL);
    });

    it('getUserByEmail() - no user', async () => {
        const findUser = await service.getUserByEmail(user.email + '_not');

        expect(findUser).toBeNull();
    });

    afterEach(async () => {
        await dataSource.getRepository(UserEntity).delete({ id: user.id });
    });

    afterAll(async () => {
        await dataSource.destroy();
    });
});
