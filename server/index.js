const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();
const authRoutes = require('./routes/authRoutes/authRoutes');
const { blacklistExpiredRefresh, deleteBlacklistedOlder } = require('./utils/tokenCleanup');

const app = express();
const port = process.env.PORT || 4500;

app.use(cors());
app.use(express.json());
app.use(bodyparser.json());
app.use(express.urlencoded({ extended: true }));

// mount auth routes at /auth
app.use('/', authRoutes);

// server listen (pool already connects on module load)
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// run cleanup tasks every hour (after server up)
setInterval(() => {
  blacklistExpiredRefresh();
  deleteBlacklistedOlder();
}, 60 * 60 * 1000);
