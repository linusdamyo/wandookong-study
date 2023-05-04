import { NestInterceptor, Injectable, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { tap } from 'rxjs';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
    private logger = new Logger(HttpLoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler) {
        const httpContext = context.switchToHttp();

        const { method, originalUrl, query, params, body } = httpContext.getRequest();

        return next.handle().pipe(
            tap({
                next: data =>
                    this.logger.log(
                        JSON.stringify({
                            request: { method, originalUrl, query, params, body },
                            response: { statusCode: httpContext.getResponse()?.statusCode, data },
                        }),
                    ),
                error: () =>
                    this.logger.error(
                        JSON.stringify({
                            request: { method, originalUrl, query, params, body },
                        }),
                    ),
            }),
        );
    }
}
