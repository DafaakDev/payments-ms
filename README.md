set env path for stripe
```$Env:Path +=';C:\Users\Israel\Desktop\stripe_1.25.0_windows_x86_64'```

to forward the webhook to the local server
```stripe listen --forward-to localhost:3003/payments/webhook```

to know the secret key of stripe

```
stripe listen
```

to simulate a call to the webhook when a payment is successful

```
 stripe trigger payment_intent.succeeded    
```