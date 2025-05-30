import express from 'express';
import dotenv from 'dotenv';
import { initDB } from './config/db.js'; // Adjust the path as necessary
import rateLimiter from './middleware/rateLimiter.js';

import trasactionsRoute from './routes/transactionsRoute.js';
import job from './config/cron.js';

dotenv.config();

const app = express();

if(process.env.NODE_ENV === "production") job.start();

// Middleware to limit the rate of requests
app.use(rateLimiter);
app.use(express.json());

const PORT = process.env.PORT || 5001;

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
})

app.use('/api/transactions', trasactionsRoute);

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
