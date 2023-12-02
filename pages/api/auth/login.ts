// pages/api/auth/login.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  const filePath = path.join(process.cwd(), 'users.json');
  const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const user = fileData.users.find((user: any) => user.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ email: user.email }, 'betafore-task', { expiresIn: '2m' }); // Replace 'your_secret_key' with an actual secret key

  res.status(200).json({ token });
}
