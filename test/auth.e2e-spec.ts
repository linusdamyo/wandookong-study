import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@src/app.module';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let configService: ConfigService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        configService = app.get(ConfigService);
        jwtService = app.get(JwtService);

        await app.init();
    });

    describe('POST /auth/test', () => {
        it('Unauthorized', () => {
            return request(app.getHttpServer()).post('/auth/test').expect(HttpStatus.UNAUTHORIZED);
        });

        it('JwtGuard - OK', async () => {
            const accessToken = await jwtService.signAsync({ userId: 1 }, { secret: configService.get('JWT_SECRET') });

            return request(app.getHttpServer()).post('/auth/test').set('Authorization', `Bearer ${accessToken}`).expect(HttpStatus.CREATED);
        });
    });
});
