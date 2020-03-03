const   express = require('express');
const expressGraphQl = require('express-graphql');
const schema = require('./schema.js');
const fetch = require('node-fetch');
const { client, setexAsync, setData, getData } = require('./redis');
// const redis = require('redis');

const app = express();

app.use('/graphql', expressGraphQl({
  schema: schema,
  graphiql: true
}));

// const REDIS_PORT = 'redis://127.0.0.1:6379'; 
// const client = redis.createClient(REDIS_PORT);

function setResponse(username, repos) {
  return `<h2>${username} has ${repos} Github</h2>`
}

async function getRepos(req, res, next) {
   try {
      console.log('Fetching data...');
      const { username } = req.params;
      // const response = await fetch(`https://api.github.com/users/${username}`);
    //  const data = await response.json();
    //  console.log(data);
    //  const repos = data.public_repos;
    //  console.log(repos);
     const repos = 10;
     
      //  set data to redis
    //  setexAsync(username, 3600, repos);
     await setData(username, 3600, repos);
    //  client.setexAsync(username, 3600, JSON.stringify(data));
    //  client.hmsetAsync("data", data.public_repos, data.id, data.login, data.type);
      res.send(setResponse(username, repos));
   } catch (err) {
     console.error(err);
     res.status(500);
   }
}

// Cache middleware
async function cache(req, res, next) {
  const { username } = req.params;
  // client.get(username, (err, data) => {
  //   if (err) throw err;
  //   if (data !== null) {
  //     res.send(setResponse(username, data));
  //   } else {
  //     next();
  //   }
  // });
  const data = await getData(username);
  console.log(data);
    if (data !== null) {
      res.send(setResponse(username, data));
    } else {
      next();
    }
}

app.get('/repos/:username', cache, getRepos);

app.listen(5000, () => {
  console.log('🚀  Running on port 5000....');
});