import {Body, Controller, Get, Post, RawBody, Req, Res} from '@nestjs/common';
import {PaymentsService} from './payments.service';
import {PaymentSessionDto} from './dto/payment-session.dto';
import {Request, Response} from 'express';
import {MessagePattern} from "@nestjs/microservices";

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {
    }

    // @Post('create-payment-session')
    @MessagePattern('create.payment.session')
    createPaymentSession(@Body() paymentSessionDto: PaymentSessionDto) {
        // return paymentSessionDto;
        return this.paymentsService.createPaymentSession(paymentSessionDto);
    }

    @Get('success')
    success() {
        return {
            ok: true,
            message: 'Payment successfull',
        };
    }

    @Get('canceled')
    canceled() {
        return {
            ok: false,
            message: 'Payment canceled',
        };
    }

    @Post('webhook')
    async stripeWebhook(
        @RawBody() rawBody: Buffer,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        return this.paymentsService.stripeWebhook(req, res);
    }
}
