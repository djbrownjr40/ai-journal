import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, DatabaseResults, AuthRequest } from './src/types/express';
import { RowDataPacket, OkPacket, ResultSetHeader } from 'mysql2';

dotenv.config();

const app = express();
const port =  Number(process.env.PORT) || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';

app.use(cors({
    origin: 'http://157.7.86.182:8080',
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.options('*', cors());

// Initialize MySQL connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.get('/api/test-db', async (req: Request, res: Response) => {
    try {
        const connection = await db.getConnection();
        await connection.ping(); // Test connection
        connection.release();
        res.send('Database connection is working!');
    } catch (error: unknown) {
        if (error instanceof Error){
            res.status(500).json({ error: 'Failed to connect to database', details: error.message });
        }else {
            res.status(500).json({ error: 'Failed to connect to database', details: 'Unknown error occurred' });
        }
    }
});

(async () => {
    try {
        const connection = await db.getConnection();
        try {
            const username1 = 'admin';
            const password1 = '';
            const hashedPassword1 = await bcrypt.hash(password1, 10);

            const username2 = '';
            const password2 = '';
            const hashedPassword2 = await bcrypt.hash(password2, 10);

            // Create master users
            await connection.query(
                'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
                [username1, `${username1}@example.com`, hashedPassword1, 'admin']
            );

            await connection.query(
                'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
                [username2, `${username2}@example.com`, hashedPassword2, 'admin']
            );

            console.log('Master users created successfully');
        } finally {
            connection.release(); // Release the connection back to the pool
        }
    } catch (error: unknown) {
        console.error('Error creating master users:', error);
    }
})();

// Authentication middleware for JWT
function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.sendStatus(401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden, token invalid
        }

        req.user = user as User;
        next();
    });
}

// Login route
app.post('/api/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const [rows]: [RowDataPacket[], any] = await db.query(
        'SELECT * FROM users WHERE username = ?',
        [username]
    );

    const user = rows[0] as User;
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials (username)' });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password_hash);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials (password)' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
        expiresIn: '1h',
    });

    res.json({ token });
});

// Token verification route
app.get('/api/verify-token', authenticateToken, (req: Request, res: Response) => {
    res.sendStatus(200);
});


// create user
app.post('/api/users', async (req: Request, res: Response) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    try {
        const [existingUsers]: [RowDataPacket[], any] = await db.query(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result]: [OkPacket, any] = await db.query(
            'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, role || 'user']
        );

        res.status(201).json({ id: result.insertId, username, email, role: role || 'user' });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: 'Server error', details: error.message });
        } else {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Server error', details: 'Unknown error occurred' });
    }
}
});

// CRUD operations for journal entries
app.post('/api/entries', authenticateToken, async (req: Request, res: Response) => {
    const { title, content } = req.body;

    if (!req.user){
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const user_id = req.user.id;

    try {
        const [results]: [OkPacket, any] = await db.query(
            'INSERT INTO journal_entries (title, content, user_id) VALUES (?, ?, ?)',
            [title, content, user_id]
        );

        res.status(201).json({ id: results.insertId });
    } catch (error: unknown) {
        if (error instanceof Error){
        res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
});

app.get('/api/entries/:id', authenticateToken, async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const user_id = req.user.id;

    try {
        const [results]: [RowDataPacket[], any] = await db.query('SELECT * FROM journal_entries WHERE id = ? AND user_id = ?', [id, user_id]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Entry not found' });
        }

        res.status(200).json(results[0]);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
});

app.get('/api/entries', authenticateToken, async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const user_id = req.user.id;

    try {
        const [results]: [RowDataPacket[], any] = await db.query('SELECT * FROM journal_entries WHERE user_id = ?', [user_id]);
        res.status(200).json(results);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
});

app.delete('/api/entries/:id', authenticateToken, async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    const user_id = req.user.id;

    try {
        const [results]: [ResultSetHeader, any] = await db.query(
            'DELETE FROM journal_entries WHERE id = ? AND user_id = ?',
            [id, user_id]
        );

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Entry not found' });
        }

        res.status(200).json({ message: 'Entry deleted' });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
});

app.put('/api/entries/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { title, content } = req.body;

    const user_id = req.user?.id;
    if (!user_id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const [results]: [ResultSetHeader, any] = await db.query(
            'UPDATE journal_entries SET title = ?, content = ? WHERE id = ? AND user_id = ?',
            [title, content, id, user_id]
        );
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Entry not found' });
        }
        res.status(200).json({ message: 'Entry updated' });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
});

// Temporary endpoint for generating hashed password
app.post('/api/generate-password', async (req: Request, res: Response) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        res.json({ hashedPassword });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
});


app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${port}`);
});
