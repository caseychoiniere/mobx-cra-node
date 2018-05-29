const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const jwks = require('jwks-rsa');
const jwt = require('express-jwt');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DDS_API_URL = process.env.DDS_API_URL || 'https://apidev.dataservice.duke.edu/api/v1/software_agents/api_token';
const REACT_APP_DDS_API_URL = process.env.REACT_APP_DDS_API_URL || 'test';

console.log(REACT_APP_DDS_API_URL)
console.log(DDS_API_URL)

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

app.get('/api/agent-token', jwtCheck, async (req, res) => {
    res.set('Content-Type', 'application/json');
    const response = await fetch(DDS_API_URL, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'agent_key': "26152df8b8a4a024e8ff30cbc92e50dc",
            'user_key': "4a097b1fcd60b3bb21f50c737f38558f"
        })
    }).then(res => res.json()).then((json) => {
        return json
    })
    const json = await response;
    res.send(json)
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