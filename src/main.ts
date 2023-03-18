import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from '@src/common/all-exceptions.filter';
import { HttpLoggingInterceptor } from '@src/common/http-logging.interceptor';
import { AppModule } from '@src/app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // @TODO: origin, header 설정 필요
    app.enableCors();

    const httpAdapter = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

    app.useGlobalInterceptors(new HttpLoggingInterceptor());

    /**
     * whitelist - https://seungtaek-overflow.tistory.com/13
     * enableImplicitConversion - https://gongmeda.tistory.com/64
     */
    app.useGlobalPipes(
        new ValidationPipe({ transform: true, whitelist: true, transformOptions: { enableImplicitConversion: true }, disableErrorMessages: false }),
    );

    await app.listen(3000);
}
bootstrap();
