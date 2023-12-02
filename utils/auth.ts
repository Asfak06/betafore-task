// utils/auth.js
import jwt from 'jsonwebtoken';

export const verifyToken = (token:string) => {
  try {
    const decoded = jwt.verify(token, 'betafore-task'); 
    return decoded; 
  } catch (error) {
    console.error("Token verification error:", error);
    return false;
  }
};
