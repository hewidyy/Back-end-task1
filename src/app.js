const routes = new Map([
  ['/', { name: 'back-end-task1', status: 'ok' }],
  ['/health', { status: 'ok' }],
]);

function sendJson(request, response, status, payload, headers = {}) {
  const body = JSON.stringify(payload);
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'X-Content-Type-Options': 'nosniff',
    ...headers,
  });
  response.end(request.method === 'HEAD' ? undefined : body);
}

export function createApp() {
  return (request, response) => {
    const path = request.url?.split('?')[0];
    if (!routes.has(path)) {
      sendJson(request, response, 404, { error: 'Not found' });
      return;
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      sendJson(request, response, 405, { error: 'Method not allowed' }, {
        Allow: 'GET, HEAD',
      });
      return;
    }

    sendJson(request, response, 200, routes.get(path));
  };
}
