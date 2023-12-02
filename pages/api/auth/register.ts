// pages/api/auth/register.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, password } = req.body;

  const filePath = path.join(process.cwd(), 'users.json');
  const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const existingUser = fileData.users.find((user: any) => user.email === email);
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { name, email, password: hashedPassword };
  fileData.users.push(newUser);

  fs.writeFileSync(filePath, JSON.stringify(fileData));

  res.status(201).json({ message: 'User created' });
}
