import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    // Map frontend roles to database roles
    const mappedRole = role === 'Owner' ? 'ADMIN' : 'STAFF';

    const user = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    if (user.role !== mappedRole) {
      res.status(401).json({ error: 'Role mismatch' });
      return;
    }

    // Simple plain-text comparison for now as requested
    if (user.passwordHash !== password) {
      res.status(401).json({ error: 'Invalid password' });
      return;
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
