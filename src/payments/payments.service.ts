import {Inject, Injectable, Logger} from '@nestjs/common';
import Stripe from 'stripe';
import {envs} from '../config/envs';
import {PaymentSessionDto} from './dto/payment-session.dto';
import {Request, Response} from 'express';
import {NATS_SERVICE} from "../config";
import {ClientProxy} from "@nestjs/microservices";

@Injectable()
export class PaymentsService {
    private readonly stripe = new Stripe(envs.stripeSecret);

    private readonly logger = new Logger('PAYMENTS-SERVICE');

    constructor(
        @Inject(NATS_SERVICE) private readonly natsClient: ClientProxy
    ) {
    }

    async createPaymentSession(paymentSessionDto: PaymentSessionDto) {
        const {metadata, line_items} = paymentSessionDto;

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

        return {cancelUrl: session.cancel_url, successUrl: session.success_url, url: session.url};
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
            this.logger.error('Error: ', (e as Error).message);
            res.status(400).send(`Webhook Error: ${(e as Error).message}`);
            return;
        }
        switch (event.type) {
            case 'charge.succeeded':
                const charge = event.data.object;
                const payload = {
                    stripePaymentId: charge.id,
                    orderId: charge.metadata.order,
                    receiptUrl: charge.receipt_url,
                };
                this.logger.debug({payload});
                this.natsClient.emit('payment.succeeded', payload);
                // llamar al microservicio de ordenes
                break;
            default:
                this.logger.log(`Event not handled: ${event.type}`);
                break;
        }
        return res.status(200).json({sig});
    }
}
