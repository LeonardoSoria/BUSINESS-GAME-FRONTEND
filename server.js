const express = require('express');
const http = require('http')
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'dist/sig-scvs')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/business-game-frontend/index.html'));
});

const port = process.env.PORT || 4200;
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => console.log('running'));