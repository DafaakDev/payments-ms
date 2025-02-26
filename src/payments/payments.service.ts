import { Injectable, RawBody } from '@nestjs/common';
import Stripe from 'stripe';
import { envs } from '../config/envs';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { Request, Response } from 'express';

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

  async stripeWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'] as string | string[];
    console.log(sig);
    let event: Stripe.Event;
    const endpointSecret = 'whsec_xKikD0fVAaSSvqc7CQ0qKdIanOJ98xZD';
    // const endpointSecret =      'whsec_c674bb2e4ad92241b344eedd005d8fb1d9f26a1b0c322639b5319e7f67f2c68c';
    try {
      event = this.stripe.webhooks.constructEvent(
        req['rawBody'],
        sig,
        endpointSecret,
      );
    } catch (e) {
      console.log('Error: ', (e as Error).message);
      res.status(400).send(`Webhook Error: ${(e as Error).message}`);
      return;
    }
    switch (event.type) {
      case 'charge.succeeded':
        // llamar al microservicio de ordenes
        console.log(event);
        break;
      default:
        console.log(`Event not handled: ${event.type}`);
        break;
    }
    return res.status(200).json({ sig });
  }
}
