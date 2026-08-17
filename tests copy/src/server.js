require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n==============================================`);
  console.log(`✨ VOXORA - STUDENT FEEDBACK PLATFORM & API ✨`);
  console.log(`==============================================`);
  console.log(`🚀 Web Interface : http://localhost:${PORT}`);
  console.log(`⚡ REST API Base  : http://localhost:${PORT}/api/feedback`);
  console.log(`📊 Stats Endpoint : http://localhost:${PORT}/api/feedback/stats/summary`);
  console.log(`==============================================\n`);
});
