import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from '@src/app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('/hello')
    getHello(): string {
        return this.appService.getHello();
    }

    @Post()
    post(): string {
        throw new Error('Wrong request /.');
    }
}
