import { Controller, Get, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-session')
  createPaymentSession() {
    return 'Should create a payment session';
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
  async stripeWebhook() {
    return 'StripeWebhook';
  }
}
