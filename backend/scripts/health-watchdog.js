const http = require('http');
const { exec } = require('child_process');
const path = require('path');

const HEALTH_URL = process.env.HEALTH_URL || 'http://localhost:5001/api/health';
const CHECK_INTERVAL_MS = Number(process.env.CHECK_INTERVAL_MS) || 30_000; // 30s
const MAX_FAILED = Number(process.env.MAX_FAILED) || 3;

let failed = 0;

function check() {
  const req = http.get(HEALTH_URL, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      if (res.statusCode === 200) {
        failed = 0;
        console.log(`[watchdog] healthy: ${HEALTH_URL}`);
      } else {
        failed += 1;
        console.warn(`[watchdog] unhealthy status ${res.statusCode} (failed ${failed}/${MAX_FAILED})`);
        handleFailure();
      }
    });
  });

  req.on('error', (err) => {
    failed += 1;
    console.error(`[watchdog] request error: ${err.message} (failed ${failed}/${MAX_FAILED})`);
    handleFailure();
  });

  req.setTimeout(5000, () => {
    req.abort();
  });
}

function handleFailure() {
  if (failed >= MAX_FAILED) {
    console.error('[watchdog] max failures reached, attempting restart via pm2');
    // Try local pm2 binary first
    const pm2 = path.join(__dirname, '..', 'node_modules', '.bin', 'pm2');
    const cmd = `${pm2} restart creavo-backend || ${pm2} start ../ecosystem.config.js --env development`;
    exec(cmd, { cwd: path.join(__dirname, '..') }, (err, stdout, stderr) => {
      if (err) {
        console.error('[watchdog] pm2 restart failed:', err.message);
        console.error(stderr);
        return;
      }
      console.log('[watchdog] pm2 restart output:', stdout);
      failed = 0;
    });
  }
}

console.log('[watchdog] starting, checking', HEALTH_URL, 'every', CHECK_INTERVAL_MS, 'ms');
check();
setInterval(check, CHECK_INTERVAL_MS);
