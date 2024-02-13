const express = require('express');
const axios = require('axios'); // Make sure to install axios with npm install axios
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve the static HTML file for the homepage
app.get('/', async (req, res) => {
  const { contact_id } = req.query;

  // Check if contact_id is present
  if (contact_id) {
    try {
      // Trigger the Zapier webhook with the contact_id
      await axios.post('https://hooks.zapier.com/hooks/catch/16510018/3lepsis/', {
        contact_id: contact_id
      });
      console.log(`Webhook triggered for contact_id ${contact_id}`);
    } catch (error) {
      console.error(`Failed to trigger webhook for contact_id ${contact_id}: ${error}`);
      // Handle failure (optional)
    }
  }

  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
