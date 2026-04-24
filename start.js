const { spawn } = require('child_process');
const express = require('express');
const app = express();
app.use(express.static('frontend'));
app.listen(3001, () => console.log('Frontend: http://localhost:3001\nBackend: http://localhost:3000/bfhl'));
const backend = spawn('node', ['backend/server.js'], { stdio: 'inherit' });
process.on('SIGINT', () => { backend.kill(); process.exit(); });