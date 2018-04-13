const cors = require('cors');
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Priority serve any static files.
app.use(() => {
    cors();
    express.static(path.resolve(__dirname, '../react-ui/build'))
});

// Answer API requests.
// app.get('/data', (req, res) => {
//     console.log('api request received')
//   res.set('Content-Type', 'application/json');
//   res.send('{"message":"Hello from the custom server!"}');
// });
// Answer API requests.
app.get('/api', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send('{"message":"Hello from the custom server!"}');
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', (request, response) => {
  response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
