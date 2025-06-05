import { envVariables } from './config/config';
import createServer from './app';
import http, { Server } from 'http';
import fs from 'fs';
import https from 'https';

createServer().then((app) => {
  const port: number = envVariables.port;

  let server: Server;

  if (envVariables.nodeEnv !== 'production') {
    server = http.createServer(app);
  } else {
    const certs = {
      key: fs.readFileSync('./client-key.pem'),
      cert: fs.readFileSync('./client-cert.pem'),
    };
    server = https.createServer(certs, app);
  }

  server = server
    .listen(port, () => console.log(`Server running on port ${port}`))
    .on('error', (err) => {
      console.error('Error creating server:', err.message);
    });
});
