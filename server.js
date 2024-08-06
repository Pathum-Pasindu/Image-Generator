const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/imageGenerationDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const imageSchema = new mongoose.Schema({
  prompt: String,
  imageUrl: String,
});

const Image = mongoose.model('Image', imageSchema);

app.post('/generate-image', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post('https://api.openai.com/v1/images/generations', {
      prompt: prompt,
      n: 1,
      size: "1024x1024"
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });

    const imageUrl = response.data.data[0].url;

    const newImage = new Image({
      prompt: prompt,
      imageUrl: imageUrl,
    });

    await newImage.save();

    res.json(newImage);
  } catch (err) {
    console.error('Error generating image:', err.message);
    console.error('Stack trace:', err.stack);
    if (err.response) {
      console.error('Response data:', err.response.data);
    }
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
