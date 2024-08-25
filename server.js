const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const logoGeneratorRoute = require('./routes/imageRoutes');
const imageRoutes = require('./routes/imageRoutes');

dotenv.config(); // Load environment variables

const app = express();

app.use(cors());
app.use(express.json());

app.use('/generate-image', imageRoutes);

app.listen(8000, () => {
  console.log('Server is running on port 8000');
});
