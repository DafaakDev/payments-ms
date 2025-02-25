import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { envs } from '../config/envs';
import { PaymentSessionDto } from './dto/payment-session.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.stripeSecret);

  async createPaymentSession(paymentSessionDto: PaymentSessionDto) {
    const { metadata, line_items } = paymentSessionDto;

    const session = await this.stripe.checkout.sessions.create({
      // colocar aqui el ID de mi orden
      metadata: {
        order: metadata.order,
      },
      // colocar items que el usuario esta comprando
      line_items: [...line_items],
      mode: 'payment',
      success_url: envs.stripeSuccessUrl,
      cancel_url: envs.stripeCancelUrl,
    });

    return session;
  }
}
