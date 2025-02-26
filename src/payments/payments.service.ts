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
    console.log({ metadataOrder: metadata.order });
    const session = await this.stripe.checkout.sessions.create({
      // colocar aqui el ID de mi orden
      payment_intent_data: {
        metadata: {
          order: metadata.order,
        },
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

    let event: Stripe.Event;
    const endpointSecret = envs.stripeEndPointSecret;

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
        const charge = event.data.object;
        console.log({ metadata: charge.metadata });
        // llamar al microservicio de ordenes
        // console.log(event);
        break;
      default:
        console.log(`Event not handled: ${event.type}`);
        break;
    }
    return res.status(200).json({ sig });
  }
}
