const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const jwks = require('jwks-rsa');
const jwt = require('express-jwt');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;


const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://securepoint.auth0.com/.well-known/jwks.json"
    }),
    audience: 'https://blooming-ridge-83489.herokuapp.com/',
    issuer: "https://securepoint.auth0.com/",
    algorithms: ['RS256']
});

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../react-ui/build')), cors(), helmet());

// Answer API requests.
app.get('/data', jwtCheck, (req, res) => {
  res.set('Content-Type', 'application/json');
  res.send('{"message":"DATA"}');
});
// Answer API requests.
app.get('/api', jwtCheck, (req, res) => {
    res.set('Content-Type', 'application/json');
    res.send('{"message":"Hello from the server"}');
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', (request, response) => {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));