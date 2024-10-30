const express = require('express');
const router = express.Router();
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// RapidAPI URL and API Key
const rapidApiUrl = 'https://ai-text-to-image-generator-api.p.rapidapi.com/realistic';
const rapidApiKey = process.env.RAPIDAPI_KEY;

router.post('/', async (req, res) => {
  const { prompt } = req.body;

  console.log('Received prompt:', prompt); // Log the prompt for debugging

  try {
    // Check if the API key exists
    if (!rapidApiKey) {
      console.error('RAPIDAPI_KEY is missing');
      return res.status(500).json({ message: 'RAPIDAPI_KEY is missing from environment variables' });
    }

    // Ensure the prompt is not empty
    if (!prompt || prompt.trim() === '') {
      return res.status(400).json({ message: 'Prompt cannot be empty' });
    }

    // Payload sent to the API
    const data = { inputs: prompt };

    console.log('Payload being sent to API:', data);

    // Send request to RapidAPI AI service
    const response = await axios.post(rapidApiUrl, data, {
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'ai-text-to-image-generator-api.p.rapidapi.com',
        'x-rapidapi-key': rapidApiKey,
      },
    });

    console.log('API Response:', response.data); // Log the API response

    // Extract the image URL from the response
    const imageUrl = response.data.url;

    if (!imageUrl) {
      throw new Error('Image URL not found in the API response');
    }

    // Return the image URL to the client
    res.json({ imageUrl });
  } catch (err) {
    console.error('Error generating image:', err.message);
    console.error('Stack trace:', err.stack);

    // Handle API-specific errors
    if (err.response) {
      console.error('API response data:', err.response.data);
      return res.status(err.response.status || 500).json({
        message: 'Error querying the AI Image Generator API',
        details: err.response.data,
      });
    } else {
      // Handle other types of errors
      res.status(500).json({
        message: 'Internal Server Error',
        error: err.message,
      });
    }
  }
});

module.exports = router;
