import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@src/app.module';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { UserEntity } from '@src/users/entities/user.entity';
import { USER_STATUS } from '@src/common/enums/status.enum';

describe('UsersController (e2e)', () => {
    let app: INestApplication;
    let configService: ConfigService;
    let jwtService: JwtService;
    let dataSource: DataSource;
    let user: UserEntity;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        configService = app.get(ConfigService);
        jwtService = app.get(JwtService);
        dataSource = app.get(DataSource);

        await app.init();
    });

    describe('GET /users/me', () => {
        beforeAll(async () => {
            user = await dataSource.getRepository(UserEntity).save({ email: 'iu@wandookong.com', password: '123456', nickname: '아이유' });
        });

        it('Unauthorized', () => {
            return request(app.getHttpServer()).get('/users/me').expect(HttpStatus.UNAUTHORIZED);
        });

        it('JwtGuard - OK', async () => {
            const accessToken = await jwtService.signAsync({ userId: user.id }, { secret: configService.get('JWT_SECRET') });

            const response = await request(app.getHttpServer()).get('/users/me').set('Authorization', `Bearer ${accessToken}`).expect(HttpStatus.OK);

            expect(response.body).toBeDefined();
            expect(response.body.email).toBe('iu@wandookong.com');
            expect(response.body.nickname).toBe('아이유');
            expect(response.body.status).toBe(USER_STATUS.NORMAL);
        });

        afterAll(async () => {
            await dataSource.getRepository(UserEntity).delete({});
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
