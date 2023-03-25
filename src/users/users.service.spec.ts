import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersService } from '@src/users/users.service';
import { UsersModule } from '@src/users/users.module';
import { UserEntity } from '@src/users/entities/user.entity';

describe('UsersService', () => {
    let service: UsersService;
    let dataSource: DataSource;

    beforeEach(async () => {
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

    it('load user entity', async () => {
        const users = await dataSource.getRepository(UserEntity).find();

        expect(users).toEqual([]);
    });

    afterAll(async () => {
        await dataSource.destroy();
    });
});
