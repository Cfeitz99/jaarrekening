const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Request logging middleware
app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url} from ${req.ip}`);
    next();
});

app.get('/', async (req, res) => {
    const { deal_id } = req.query; // Extract `deal_id` from query parameters

    // Proceed only if `deal_id` is provided
    if (deal_id) {
        try {
            // Trigger Zapier webhook
            const zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/14846189/3lepsis/';
            await axios.post(zapierWebhookUrl, { deal_id });
            console.log(`Webhook triggered successfully for deal_id ${deal_id}`);

            // Call FastAPI endpoint to update HubSpot deal properties
            const fastapiEndpoint = 'https://your-fastapi-endpoint.com/update-hubspot-deal';
            const fastapiPayload = { deal_id };

            const fastapiResponse = await axios.post(fastapiEndpoint, fastapiPayload);
            console.log(`FastAPI call successful for deal_id ${deal_id}:`, fastapiResponse.data);
        } catch (error) {
            // Log specific error details
            console.error(`Error processing deal_id ${deal_id}:`, error.message);
        }
    } else {
        console.warn('No deal_id provided in the request.');
    }

    // Serve the static HTML file
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
