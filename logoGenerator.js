const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/generate-logo', async (req, res) => {
  const { keyword, size } = req.body;

  try {
    const response = await axios.get(
      `https://simple-logo-generator-api.p.rapidapi.com/generateLogo?keyword=${encodeURIComponent(keyword)}&size=${size}`,
      {
        headers: {
          'x-rapidapi-key': process.env.RAPIDAPI_KEY,
          'x-rapidapi-host': 'simple-logo-generator-api.p.rapidapi.com',
        },
      }
    );

    const logoUrl = response.data.logoUrl;
    res.json({ logoUrl });
  } catch (err) {
    console.error('Error generating logo:', err);
    res.status(500).json({ message: 'Failed to generate logo', error: err.message });
  }
});

module.exports = router;
