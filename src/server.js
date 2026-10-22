import { createServer } from 'node:http';
import { createApp } from './app.js';

function start() {
  const host = process.env.HOST ?? '127.0.0.1';
  const portText = process.env.PORT ?? '3000';
  if (!host.trim()) {
    throw new Error('HOST must not be empty.');
  }
  if (!/^(0|[1-9]\d*)$/.test(portText) || Number(portText) > 65535) {
    throw new Error('PORT must be an integer between 0 and 65535.');
  }

  const server = createServer(createApp());
  server.on('error', (error) => {
    console.error(`Server failed: ${error.message}`);
    process.exitCode = 1;
  });

  let stopping = false;
  const shutdown = () => {
    if (stopping) return;
    stopping = true;
    const timeout = setTimeout(() => {
      console.error('Server shutdown timed out.');
      server.closeAllConnections();
      process.exit(1);
    }, 10_000);
    timeout.unref();
    server.close((error) => {
      clearTimeout(timeout);
      if (error) {
        console.error(`Server shutdown failed: ${error.message}`);
        process.exitCode = 1;
      }
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  server.listen(Number(portText), host, () => {
    const address = server.address();
    const displayHost = address.address.includes(':')
      ? `[${address.address}]`
      : address.address;
    console.log(`Server listening on http://${displayHost}:${address.port}`);
  });
}

try {
  start();
} catch (error) {
  console.error(`Server configuration error: ${error.message}`);
  process.exitCode = 1;
}
