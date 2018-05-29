const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const jwks = require('jwks-rsa');
const jwt = require('express-jwt');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DDS_API_URL = `${process.env.DDS_API_URL}software_agents/api_token`;
const agentKey = process.env.REACT_APP_AGENT_KEY;
const userKey = process.env.REACT_APP_AGENT_USER_KEY;

const fetch = require('node-fetch');

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

app.get('/api/agent-token', jwtCheck, (req, res) => {
    res.set('Content-Type', 'application/json');
    fetch(DDS_API_URL, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'agent_key': agentKey,
            'user_key': userKey
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