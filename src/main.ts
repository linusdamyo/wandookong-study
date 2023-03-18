import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AllExceptionsFilter } from '@src/common/all-exceptions.filter';
import { HttpLoggingInterceptor } from '@src/common/http-logging.interceptor';
import { AppModule } from '@src/app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const httpAdapter = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

    app.useGlobalInterceptors(new HttpLoggingInterceptor());

    await app.listen(3000);
}
bootstrap();
