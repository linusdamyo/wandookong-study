import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@src/auth/auth.module';
import { AuthService } from '@src/auth/auth.service';

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: `src/config/.${process.env.NODE_ENV}.env`,
                }),
                AuthModule,
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('signIn() - accessToken 반환', async () => {
        const result = await service.signIn({ email: 'iu@wandookong.com', password: 'iuiuiu' });

        expect(result.accessToken).toBeDefined();
    });
});
