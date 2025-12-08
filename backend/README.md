# Backend: PM2 Local Run Instructions

This short guide shows how to run the Creavo backend locally with `pm2` for more stable long-running development.

Prerequisites
- Node.js and project dependencies installed in the `backend` folder
- `pm2` installed globally (optional if using the local dev dependency)

Install dependencies (if not already):

```bash
cd /Users/mariodasilva/Documents/Creavojob/backend
npm install
```

Install `pm2` globally (optional):

```bash
npm i -g pm2
```

Start with PM2 (development env):

```bash
cd /Users/mariodasilva/Documents/Creavojob/backend
npm run start:pm2
```

Common PM2 commands:

```bash
# View running processes
pm2 list

# View logs (follow)
pm2 logs creavo-backend --lines 200

# Stop
npm run pm2:stop

# Restart
npm run pm2:restart

# Save current process list so pm2 resurrects them after machine reboot
pm2 save
```

Notes
- The included `ecosystem.config.js` runs `src/index.js` and sets `PORT` to `5001` by default in development. Adjust `.env` or the ecosystem file for different ports.
- PM2 provides automatic restarts and basic log rotation options; this is meant for local developer convenience. For production use a more complete setup (Docker, systemd, or cloud-managed services) is recommended.
