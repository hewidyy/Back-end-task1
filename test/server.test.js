import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));

function launchServer(t, overrides = {}) {
  const child = spawn(process.execPath, ['src/server.js'], {
    cwd: projectRoot,
    env: { ...process.env, HOST: '127.0.0.1', PORT: '0', ...overrides },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let stdout = '';
  let stderr = '';
  child.stdout.setEncoding('utf8').on('data', (chunk) => {
    stdout += chunk;
  });
  child.stderr.setEncoding('utf8').on('data', (chunk) => {
    stderr += chunk;
  });
  const closed = once(child, 'close');
  t.after(async () => {
    if (child.exitCode === null && child.signalCode === null) {
      child.kill('SIGKILL');
    }
    await closed;
  });
  return { child, closed, output: () => ({ stdout, stderr }) };
}

async function waitForAddress(processHandle) {
  const { child, closed, output } = processHandle;
  const addressPattern = /http:\/\/127\.0\.0\.1:(\d+)/;
  if (addressPattern.test(output().stdout)) {
    return output().stdout.match(addressPattern)[0];
  }
  return new Promise((resolve, reject) => {
    const onData = () => {
      const match = output().stdout.match(addressPattern);
      if (match) {
        child.stdout.off('data', onData);
        resolve(match[0]);
      }
    };
    child.stdout.on('data', onData);
    closed.then(([code, signal]) => {
      child.stdout.off('data', onData);
      reject(new Error(`Server exited before readiness (${code ?? signal}): ${output().stderr}`));
    }, reject);
  });
}

test('the server starts on an ephemeral port and shuts down on SIGTERM', { timeout: 5000 }, async (t) => {
  const processHandle = launchServer(t);
  const address = await waitForAddress(processHandle);
  const response = await fetch(`${address}/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });

  processHandle.child.kill('SIGTERM');
  const [code, signal] = await processHandle.closed;
  assert.equal(signal, null);
  assert.equal(code, 0);
});

test('invalid runtime configuration exits with a useful error', { timeout: 5000 }, async (t) => {
  for (const configuration of [{ PORT: '-1' }, { PORT: '65536' }, { PORT: 'invalid' }, { HOST: '' }]) {
    await t.test(JSON.stringify(configuration), async (t) => {
      const processHandle = launchServer(t, configuration);
      const [code, signal] = await processHandle.closed;
      assert.equal(signal, null);
      assert.equal(code, 1);
      assert.notEqual(processHandle.output().stderr.trim(), '');
    });
  }
});

test('an occupied port produces a clear startup failure', { timeout: 5000 }, async (t) => {
  const occupied = createServer();
  occupied.listen(0, '127.0.0.1');
  await once(occupied, 'listening');
  t.after(() => new Promise((resolve, reject) => {
    occupied.close((error) => (error ? reject(error) : resolve()));
  }));

  const processHandle = launchServer(t, { PORT: String(occupied.address().port) });
  const [code, signal] = await processHandle.closed;
  assert.equal(signal, null);
  assert.equal(code, 1);
  assert.match(processHandle.output().stderr, /EADDRINUSE|address.*in use/i);
  assert.doesNotMatch(processHandle.output().stderr, /\n\s+at /);
});
