// pages/api/retrieve-session.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51MbbiGK3RZZOQUDyRQl4zzD9kSHU6weYV1wrxCkXxO94E4V5P8McJnOnGL1cXCaNf8TVouK23HMh97VwtbOlvX2700x2w8z7Qv', {
  apiVersion: '2023-10-16',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { sessionId } = req.query;

  if (typeof sessionId !== 'string') {
    return res.status(400).json({ error: 'Session ID must be provided' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    // You can add more logic here, such as validating the payment, etc.
    res.status(200).json(session);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
}
