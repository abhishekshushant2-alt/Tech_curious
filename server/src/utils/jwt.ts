import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tech_curious_super_secret_jwt_key_2026_dev_mode';

export interface AdminTokenPayload {
  email: string;
  role: 'admin';
}

export const signAdminToken = (email: string): string => {
  return jwt.sign({ email, role: 'admin' }, JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const verifyAdminToken = (token: string): AdminTokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
    if (decoded && decoded.role === 'admin') {
      return decoded;
    }
    return null;
  } catch (error) {
    return null;
  }
};
