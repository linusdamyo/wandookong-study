import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AuthModule } from '@src/auth/auth.module';
import { AuthService } from '@src/auth/auth.service';
import { UserEntity } from '@src/users/entities/user.entity';

describe('AuthService', () => {
    let service: AuthService;
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
                        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                        synchronize: true,
                        autoLoadEntities: true,
                        logging: false,
                        charset: 'utf8mb4',
                    }),
                }),
                AuthModule,
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        dataSource = module.get<DataSource>(DataSource);
    });

    beforeEach(async () => {
        user = await dataSource.getRepository(UserEntity).save({ email: 'iu@wandookong.com', password: '123456', nickname: '아이유' });
    });

    it('signIn() - accessToken 반환', async () => {
        const result = await service.signIn({ email: user.email, password: '123456' });

        expect(result.accessToken).toBeDefined();
    });

    it('signIn() - 없는 이메일', async () => {
        await expect(service.signIn({ email: 'wrong_email@email.com', password: '123456' })).rejects.toThrow(
            new UnauthorizedException('사용자를 찾을 수 없습니다.'),
        );
    });

    it('signIn() - 잘못된 패스워드', async () => {
        await expect(service.signIn({ email: user.email, password: 'wrong_password' })).rejects.toThrow(
            new UnauthorizedException('잘못된 password입니다.'),
        );
    });

    afterEach(async () => {
        await dataSource.getRepository(UserEntity).delete({ id: user.id });
    });

    afterAll(async () => {
        await dataSource.destroy();
    });
});
