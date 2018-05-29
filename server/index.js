import config from '../react-ui/src/config';
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const jwks = require('jwks-rsa');
const jwt = require('express-jwt');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

const fetch = require('node-fetch');

const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: config.JWKS_URI
    }),
    audience: config.APP_URL,
    issuer: config.AUTH0_URL,
    algorithms: ['RS256']
});

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../react-ui/build')), cors(), helmet());

app.get('/api/agent-token', jwtCheck, (req, res) => {
    res.set('Content-Type', 'application/json');
    fetch(`${config.DDS_API_URL}software_agents/api_token`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'agent_key': config.AGENT_KEY,
            'user_key': config.USER_KEY
        })
    }).then(res => res.json()).then((json) => {
        return res.send(json)
    })
});

// Answer API requests.
app.get('/data', jwtCheck, (req, res) => {
  res.set('Content-Type', 'application/json');
  res.send('{"message":"DATA"}');
});
// Answer API requests.
app.get('/api/status', jwtCheck, (req, res) => {
    res.set('Content-Type', 'application/json');
    res.send('{"message":"Hello from the server"}');
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', (request, response) => {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));