import jwt from 'jsonwebtoken';

export default function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'gavyadhenu_secret', { expiresIn: '30d' });
}
