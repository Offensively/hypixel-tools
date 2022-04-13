const express = require('express')
const app = express();

require('./api/denick')(app);

app.listen(8080, () =>
  console.log(`API listening on port 8080!`),
);