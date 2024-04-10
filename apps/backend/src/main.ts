import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

// read environment variables from .env file
dotenv.config();
const PORT = process.env.PORT ?? 8000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL ?? 'http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
});

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

io.on('connection', (socket) => {
  socket.data.name = 'John';

  socket.on('message', (message: string) => {
    io.emit('message', socket.data.name, message);
  });
});

setInterval(() => {
  io.emit('ping');
}, 1000);

// listen
server.listen(PORT as number, () => {
  // eslint-disable-next-line no-console
  console.log(`Now listening on port ${PORT}.`);
});
