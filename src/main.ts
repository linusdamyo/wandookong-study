import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AllExceptionsFilter } from '@src/common/all-exceptions.filter';
import { AppModule } from '@src/app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const httpAdapter = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

    await app.listen(3000);
}
bootstrap();
