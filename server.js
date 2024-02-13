const express = require('express');
const axios = require('axios'); // Make sure to install axios
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// In-memory storage to track triggered webhooks
let triggeredWebhooks = {};

app.get('/', async (req, res) => {
  const { contact_id } = req.query;

  // Check if the webhook has already been triggered for this contact_id
  if (contact_id && !triggeredWebhooks[contact_id]) {
    try {
      await axios.post('https://hooks.zapier.com/hooks/catch/16510018/3lepsis/', { contact_id });
      console.log(`Webhook triggered for contact_id ${contact_id}`);

      // Mark the webhook as triggered for this contact_id
      triggeredWebhooks[contact_id] = true;
    } catch (error) {
      console.error(`Failed to trigger webhook for contact_id ${contact_id}: ${error}`);
    }
  }

  res.sendFile(path.join(__dirname, 'index.html'));
});

// Optional: Clear the in-memory storage periodically if needed
setInterval(() => {
  triggeredWebhooks = {}; // Reset the storage
}, 1000 * 60 * 60); // Every hour

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
