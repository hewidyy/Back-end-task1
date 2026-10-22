# Back-end-task1

A minimal JSON HTTP API built with Node.js 24 and its standard library. This is a backend scaffold; application-specific business logic can be added as requirements become available. It needs no database, external services, secrets, or third-party runtime dependencies.

## Requirements

- Node.js 24 LTS (`.node-version` records the version used during setup)
- npm, included with Node.js

## Install and validate

Run these commands from the repository root:

```sh
npm ci
npm run check
npm test
```

`npm ci` uses the committed lockfile. `npm run check` checks the source files for syntax errors, and `npm test` runs the automated tests with Node's built-in test runner.

## Run

```sh
npm start
```

The server listens on `127.0.0.1:3000` by default. For automatic restarts while editing:

```sh
npm run dev
```

Both commands load `.env` when it exists. To customize the address, copy `.env.example` to `.env` and edit `HOST` or `PORT`. Set `HOST=0.0.0.0` when the server must accept connections through a container interface. Do not commit `.env` or put credentials into repository files.

Stop the process with Ctrl+C. The server handles `SIGINT` and `SIGTERM` to close its listener gracefully.

## API

| Method | Path | Status | JSON response |
| --- | --- | --- | --- |
| GET | `/` | 200 | `{"name":"back-end-task1","status":"ok"}` |
| GET | `/health` | 200 | `{"status":"ok"}` |

`HEAD` requests to these paths return the same status and headers without a body. Unknown routes return a JSON response with status 404.

Check the running server from another terminal:

```sh
curl --fail http://127.0.0.1:3000/health
```

GitHub Actions runs installation, syntax checks, and tests on pushes and pull requests.
