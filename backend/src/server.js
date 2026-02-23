require('dotenv').config();
const app = require('./app');
const config = require('./config/app.config');

const PORT = config.port;

const transactionService = require('./services/transaction.service');

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);

  // Background daemon: auto-expire pending trades every 1 hour
  setInterval(async () => {
    try {
      const count = await transactionService.revertExpiredTrades();
      if (count > 0) console.log(`[Daemon] Auto-reverted ${count} expired pending trades`);
    } catch (e) {
      console.error('[Daemon ERROR]', e.message);
    }
  }, 60 * 60 * 1000);
});