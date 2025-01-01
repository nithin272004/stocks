const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = 5000;
const MONGO_URI = `mongodb+srv://{process.env.MONGODB_USERNAME}:{process.env.MONGODB_PASSWORD}@cluster0.eyext.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const API_KEY = process.env.FINNHUB_API_KEY; // Store Finnhub API key in your .env file

// Middleware
app.use(cors(
 
));
app.use(express.json());

// MongoDB Schema
const stockSchema = new mongoose.Schema({
  name: String,
  ticker: String,
  buyPrice: Number,
 
  quantity: { type: Number, default: 1 },
});

const Stock = mongoose.model('Stock', stockSchema);

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));

// Helper function to fetch stock price from Finnhub API
const fetchStockPrice = async (ticker, retries = 3, delay = 2000) => {
  const url = `https://finnhub.io/api/v1/quote`;
  const params = {
    symbol: ticker,
    token: API_KEY, // Your Finnhub API key
  };

  try {
    const response = await axios.get(url, { params });
    const priceData = response.data;
    let currentPrice = priceData && priceData.c ? parseFloat(priceData.c) : 0; // Close price
 // Close price

    return currentPrice;
  } catch (error) {
    if (error.response && error.response.status === 429 && retries > 0) {
      // If status is 429 (Too Many Requests), retry after a delay
      console.log(`Rate limit hit for ${ticker}, retrying after ${delay / 1000} seconds...`);
      await new Promise(res => setTimeout(res, delay));
      return await fetchStockPrice(ticker, retries - 1, delay); // Retry with reduced attempts
    } else {
      console.error(`Error fetching data for ${ticker}:`, error.message);
      return 0; // Return 0 if the request fails
    }
  }
};
const fetchStockHighPrice = async (ticker, retries = 3, delay = 2000) => {
  const url = `https://finnhub.io/api/v1/quote`;
  const params = {
    symbol: ticker,
    token: API_KEY, // Your Finnhub API key
  };

  try {
    const response = await axios.get(url, { params });
    console.log('Finnhub Response for High Price:', response.data); // Log the response
    const priceData = response.data;
    const highPrice = priceData && priceData.h ? parseFloat(priceData.h) : 0; // Correct high price

    return highPrice;
  } catch (error) {
    if (error.response && error.response.status === 429 && retries > 0) {
      console.log(`Rate limit hit for ${ticker}, retrying after ${delay / 1000} seconds...`);
      await new Promise(res => setTimeout(res, delay));
      return await fetchStockHighPrice(ticker, retries - 1, delay); // Retry with reduced attempts
    } else {
      console.error(`Error fetching data for ${ticker}:`, error.message);
      return 0; // Return 0 if the request fails
    }
  }
};
const fetchStockLowPrice = async (ticker, retries = 3, delay = 2000) => {
  const url = `https://finnhub.io/api/v1/quote`;
  const params = {
    symbol: ticker,
    token: API_KEY, // Your Finnhub API key
  };

  try {
    const response = await axios.get(url, { params });
    console.log('Finnhub Response for High Price:', response.data); // Log the response
    const priceData = response.data;
    const lowPrice = priceData && priceData.l ? parseFloat(priceData.l) : 0; // Correct high price

    return lowPrice;
  } catch (error) {
    if (error.response && error.response.status === 429 && retries > 0) {
      console.log(`Rate limit hit for ${ticker}, retrying after ${delay / 1000} seconds...`);
      await new Promise(res => setTimeout(res, delay));
      return await fetchStockLowPrice(ticker, retries - 1, delay); // Retry with reduced attempts
    } else {
      console.error(`Error fetching data for ${ticker}:`, error.message);
      return 0; // Return 0 if the request fails
    }
  }
};



// Routes
app.post('/api/stocks', async (req, res) => {
  const { name, ticker, buyPrice } = req.body;
  const stock = new Stock({ name, ticker, buyPrice });
  await stock.save();
  res.status(201).send(stock);
});

app.get('/api/stocks', async (req, res) => {
  try {
    const stocks = await Stock.find();
    
    const prices = await Promise.all(
      stocks.map(async (stock) => {
        const highPrice = await fetchStockHighPrice(stock.ticker);
        const currentPrice = await fetchStockPrice(stock.ticker); // Fetch stock price from Finnhub
        const lowPrice = await fetchStockLowPrice(stock.ticker); // Fetch stock price from Finnhub
         // Fetch stock price from Finnhub

        return { ...stock._doc, currentPrice ,highPrice,lowPrice }; // Include currentPrice in the response
      })
    );

    // Calculate total values
    const totalValue = prices.reduce(
      (acc, stock) => acc + stock.currentPrice * stock.quantity,
      0
    );
    const totalCurrValue = stocks.reduce(
      (acc, stock) => acc + stock.buyPrice * stock.quantity,  // Corrected to multiply by quantity
      0
    );

    res.send({ stocks: prices, totalValue, totalCurrValue });
  } catch (error) {
    console.error('Error fetching stock data:', error.message);
    res.status(500).send({ message: 'Failed to fetch stock data.' });
  }
});

app.put('/api/stocks/:id', async (req, res) => {
  const { id } = req.params;
  const { name, ticker, buyPrice } = req.body;
  const stock = await Stock.findByIdAndUpdate(id, { name, ticker, buyPrice }, { new: true });
  res.send(stock);
});

app.delete('/api/stocks/:id', async (req, res) => {
  const { id } = req.params;
  await Stock.findByIdAndDelete(id);
  res.send({ message: 'Stock deleted successfully' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
