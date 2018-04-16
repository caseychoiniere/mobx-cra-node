const cors = require('cors');
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Priority serve any static files.
// app.use(() => {
//     // cors();
//     app.use(express.static(__dirname + '/../react-ui/build'));
//     // express.static(path.resolve(__dirname, '../react-ui/build'))
// });
// app.use(express.static(__dirname + '/../react-ui/build'), cors());
app.use(express.static(path.resolve(__dirname, '../react-ui/build')), cors());
// Answer API requests.
app.get('/data', (req, res) => {
    console.log('api request received')
  res.set('Content-Type', 'application/json');
  res.send('{"message":"DATADATADTA!"}');
});
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