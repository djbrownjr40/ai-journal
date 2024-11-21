import express, { Request, Response, NextFunction } from 'express';
import basicAuth from 'basic-auth';

const app = express();
const port = 8080;

// Basic Authentication Middleware
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const user = basicAuth(req);

  // Define your username and password
  const validUser = 'admin';
  const validPassword = 'password';

  if (!user || user.name !== validUser || user.pass !== validPassword) {
    res.setHeader('WWW-Authenticate', 'Basic realm="example"');
    res.status(401).send('Authentication required.');
  } else {
    next();
  }
};

// Use the authentication middleware
app.use(authenticate);

// Define your routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, authenticated user!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
