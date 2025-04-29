const express = require('express');
const bodyParser = require('body-parser');
const orderRoutes = require('./routes/orderRoutes');
require('dotenv').config({ path: '.env.local' });

const app = express();
app.use(bodyParser.json());

app.use('/', orderRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Order service running on port ${PORT}`);
});

module.exports = app;
