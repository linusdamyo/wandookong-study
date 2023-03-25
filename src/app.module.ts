import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import { AuthModule } from '@src/auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `${__dirname}/config/.${process.env.NODE_ENV}.env`,
            validationSchema: Joi.object({
                NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
            }),
        }),
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
