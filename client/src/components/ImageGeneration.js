import React, { useState } from 'react';
import axios from 'axios';
import './ImageGeneration.css';

const ImageGeneration = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!prompt.trim()) {
      setError('Prompt cannot be empty.');
      return;
    }

    setLoading(true); // Start loading animation
    setError(''); // Clear any previous errors

    try {
      console.log('Sending request to backend with prompt:', prompt);

      const response = await axios.post('http://localhost:8000/generate-image', { prompt });

      // Log the server's response
      console.log('Server response:', response.data);

      setImageUrl(response.data.imageUrl);
    } catch (err) {
      console.error('Error generating image:', err.message);
      setError('Error generating image. Please try again.');
    } finally {
      setLoading(false); // Stop loading animation
    }
  };

  return (
    <div className={`image-generate ${loading ? 'loading' : ''}`}>
      {loading && (
        <div className="loader-wrapper">
          <div className="loader"></div>
          <p className="loading-text">Generating your image...</p>
        </div>
      )}
      {!loading && (
        <div className="image-gen-wrapper">
          <h1 className="neon-text">Prompt your Idea to make it visual</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter prompt"
              className="prompt-input-field"
            />
            <button type="submit" className="generate-btn">Generate Image</button>
          </form>
          {imageUrl && <img src={imageUrl} alt="Generated" className="generated-image" />}
          {error && <p className="error-message">{error}</p>}
        </div>
      )}
      <footer>
        Created by G.A.P. Pathum
      </footer>
    </div>
  );
};

export default ImageGeneration;
