import 'dotenv/config';
import * as joi from 'joi';
import * as process from 'node:process';

interface EnvVars {
    PORT: number;
    STRIPE_SECRET: string;
    STRIPE_SUCCESS_URL: string;
    STRIPE_CANCEL_URL: string;
    STRIPE_ENDPOINT_SECRET: string;
    NATS_SERVER: string;
}

const envsSchema = joi
    .object({
        PORT: joi.number().required(),
        STRIPE_SECRET: joi.string().required(),
        STRIPE_SUCCESS_URL: joi.string().required(),
        STRIPE_CANCEL_URL: joi.string().required(),
        STRIPE_ENDPOINT_SECRET: joi.string().required(),
        NATS_SERVER: joi.string().required(),
    })
    .unknown(true);

const {error, value} = envsSchema.validate(process.env);

if (error) throw new Error(`Config validation Error: ${error.message}`);

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    stripeSecret: envVars.STRIPE_SECRET,
    stripeSuccessUrl: envVars.STRIPE_SUCCESS_URL,
    stripeCancelUrl: envVars.STRIPE_CANCEL_URL,
    stripeEndPointSecret: envVars.STRIPE_ENDPOINT_SECRET,
    natsServer: envVars.NATS_SERVER,
};
