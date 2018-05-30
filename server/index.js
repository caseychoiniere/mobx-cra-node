const cors = require('cors');
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};
const express = require('express');
const fetch = require('node-fetch');
const helmet = require('helmet');
const jwks = require('jwks-rsa');
const jwt = require('express-jwt');
const path = require('path');

if (!process.env.NODE_ENV) {
    require('dotenv').load();
}

const app = express();
const PORT = process.env.PORT || 5000;

const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: process.env.REACT_APP_JWKS_URI
    }),
    audience: process.env.REACT_APP_URL,
    issuer: process.env.REACT_APP_AUTH0,
    algorithms: ['RS256']
});

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../react-ui/build')), cors(corsOptions), helmet());

app.get('/api/agent-token', jwtCheck, (req, res) => {
    res.set('Content-Type', 'application/json');
    fetch(`${process.env.REACT_APP_DDS_API_URL}software_agents/api_token`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'agent_key': process.env.REACT_APP_AGENT_KEY,
            'user_key': process.env.REACT_APP_AGENT_USER_KEY
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