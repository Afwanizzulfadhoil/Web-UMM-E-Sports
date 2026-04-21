import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import { prisma } from './src/lib/db.ts';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for easier dev
  }));
  app.use(express.json());
  app.use('/uploads', express.static(uploadDir));

  // Middleware to authenticate JWT
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ error: 'Invalid token' });
      req.user = user;
      next();
    });
  };

  // Middleware to check admin role
  const isAdmin = (req: any, res: any, next: any) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  };

  // Multer setup for file uploads
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  });
  const upload = multer({ storage });

  // --- AUTH ROUTES ---
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'user', // Default role
        },
      });

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      
      if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- ARENA ROUTES ---
  app.get('/api/arenas', async (req, res) => {
    try {
      const arenas = await prisma.arena.findMany({
        orderBy: { created_at: 'desc' },
      });
      res.json(arenas);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/arenas/:id', async (req, res) => {
    try {
      const arena = await prisma.arena.findUnique({ where: { id: parseInt(req.params.id) } });
      if (!arena) return res.status(404).json({ error: "Arena not found" });
      res.json(arena);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/arenas', authenticateToken, isAdmin, upload.single('image'), async (req, res) => {
    try {
      const { name, location, capacity, description, status } = req.body;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

      const arena = await prisma.arena.create({
        data: {
          name,
          location,
          capacity: parseInt(capacity),
          description,
          image_url: imageUrl,
          status,
        },
      });

      // Log activity
      await prisma.activityLog.create({
        data: { user_id: (req as any).user.id, action: 'CREATE_ARENA', table_name: 'arenas' },
      });

      res.json(arena);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // --- TOURNAMENT ROUTES ---
  app.get('/api/tournaments', async (req, res) => {
    try {
      const tournaments = await prisma.tournament.findMany({
        include: { arena: true },
        orderBy: { start_date: 'desc' },
      });
      res.json(tournaments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/tournaments/:id', async (req, res) => {
    try {
      const tournament = await prisma.tournament.findUnique({ 
        where: { id: parseInt(req.params.id) },
        include: { arena: true } 
      });
      if (!tournament) return res.status(404).json({ error: "Tournament not found" });
      res.json(tournament);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/tournaments', authenticateToken, isAdmin, upload.single('image'), async (req, res) => {
    try {
      const { name, game, start_date, end_date, prize_pool, max_teams, status, description, arena_id } = req.body;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

      const tournament = await prisma.tournament.create({
        data: {
          name,
          game,
          start_date: new Date(start_date),
          end_date: new Date(end_date),
          prize_pool: parseFloat(prize_pool),
          max_teams: parseInt(max_teams),
          status,
          description,
          image_url: imageUrl,
          arena_id: arena_id ? parseInt(arena_id) : undefined,
          created_by: (req as any).user.id,
        },
      });

      res.json(tournament);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // --- EVENT ROUTES ---
  app.get('/api/events', async (req, res) => {
    try {
      const events = await prisma.event.findMany({
        orderBy: { date: 'desc' },
      });
      res.json(events);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/events/:id', async (req, res) => {
    try {
      const event = await prisma.event.findUnique({ 
        where: { id: parseInt(req.params.id) }
      });
      if (!event) return res.status(404).json({ error: "Event not found" });
      res.json(event);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/events', authenticateToken, isAdmin, upload.single('image'), async (req, res) => {
    try {
      const { name, date, time, location, description, status, category } = req.body;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

      const event = await prisma.event.create({
        data: {
          name,
          date: new Date(date),
          time,
          location,
          description,
          image_url: imageUrl,
          status,
          category,
          created_by: (req as any).user.id,
        },
      });

      res.json(event);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // --- USER MGMT ROUTES ---
  app.get('/api/users', authenticateToken, isAdmin, async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, created_at: true },
      });
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/users/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
      if (parseInt(req.params.id) === (req as any).user.id) {
        return res.status(400).json({ error: "Cannot delete yourself" });
      }
      // Note: If you don't have cascade delete on Prisma, we manually delete dependencies
      await prisma.activityLog.deleteMany({ where: { user_id: parseInt(req.params.id) } });
      await prisma.tournament.updateMany({ where: { created_by: parseInt(req.params.id) }, data: { created_by: null } });
      await prisma.event.updateMany({ where: { created_by: parseInt(req.params.id) }, data: { created_by: null } });
      
      await prisma.user.delete({ where: { id: parseInt(req.params.id) } });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch('/api/users/:id/role', authenticateToken, isAdmin, async (req, res) => {
    try {
      if (parseInt(req.params.id) === (req as any).user.id) {
        return res.status(400).json({ error: "Cannot change your own role" });
      }
      const { role } = req.body;
      if (!['user', 'admin'].includes(role)) return res.status(400).json({ error: "Invalid role" });
      
      const user = await prisma.user.update({
        where: { id: parseInt(req.params.id) },
        data: { role },
      });
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/tournaments/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
      await prisma.tournament.delete({ where: { id: parseInt(req.params.id) } });
      
      await prisma.activityLog.create({
        data: { user_id: (req as any).user.id, action: `DELETED_TOURNAMENT_ID_${req.params.id}`, table_name: 'tournaments' },
      });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/events/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
      await prisma.event.delete({ where: { id: parseInt(req.params.id) } });
      
      await prisma.activityLog.create({
        data: { user_id: (req as any).user.id, action: `DELETED_EVENT_ID_${req.params.id}`, table_name: 'events' },
      });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/activities', authenticateToken, isAdmin, async (req, res) => {
    try {
      const activities = await prisma.activityLog.findMany({
        take: 5,
        orderBy: { created_at: 'desc' },
        include: { user: { select: { name: true } } }
      });
      res.json(activities);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- PUBLIC STATS ---
  app.get('/api/public-stats', async (req, res) => {
    try {
      const [arenas, tournaments, users, tournamentAgg] = await Promise.all([
        prisma.arena.count({ where: { status: 'active' } }),
        prisma.tournament.count(),
        prisma.user.count(),
        prisma.tournament.aggregate({
          _sum: { prize_pool: true },
        }),
      ]);
      const prizePool = tournamentAgg._sum.prize_pool || 0;
      res.json({ arenas, tournaments, users, prizePool: prizePool.toString() });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- DASHBOARD STATS ---
  app.get('/api/stats', authenticateToken, isAdmin, async (req, res) => {
    try {
      const [arenas, tournaments, events, users] = await Promise.all([
        prisma.arena.count(),
        prisma.tournament.count(),
        prisma.event.count(),
        prisma.user.count(),
      ]);
      res.json({ arenas, tournaments, events, users });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Catch-all for API routes to prevent falling through to the SPA (which responds with HTML and causes JSON parse errors)
  app.use('/api', (req, res) => {
    res.status(404).json({ error: 'API route not found' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global Error Handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Global Error Handler:', err);
    if (req.path.startsWith('/api/')) {
      res.status(500).json({ error: err.message || 'Internal Server Error' });
    } else {
      next(err);
    }
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
