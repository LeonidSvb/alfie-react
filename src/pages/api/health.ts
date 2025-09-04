import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('🟢 Health check called');
  return res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    method: req.method 
  });
}