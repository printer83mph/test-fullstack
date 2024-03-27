import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// read environment variables from .env file
dotenv.config();
const PORT = process.env.PORT ?? 8000;

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: [process.env.FRONTEND_URL ?? 'http://localhost:3000'],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  }),
);

const db: Record<string, string> = {
  hello: 'world',
};

// define root route
app.get('/api/stuff', (_, res) => {
  res.json({ things: db });
});

app.post('/api/stuff', (req, res) => {
  if (typeof req.body !== 'object')
    return res.status(400).send('Invalid body!');

  const { key, value } = req.body;
  db[key] = value;

  return res.send('success!');
});

// listen
app.listen(PORT as number, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`Now listening on port ${PORT}.`);
});
