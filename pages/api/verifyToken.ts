// pages/api/verifyToken.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const secretKey = 'betafore-task'; // Replace with your actual secret key

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: 'Token not provided' });
    }

    try {
      jwt.verify(token, secretKey);
      res.status(200).json({ valid: true });
    } catch (error) {
      res.status(401).json({ valid: false, message: 'Invalid token' });
    }
  } else {
    res.status(405).end('Method Not Allowed');
  }
}
