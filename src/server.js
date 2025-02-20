import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
const PORT = 8000;
const CMC_API_KEY = "0695bef3-d6c6-4e39-b58d-e42c357da62b"; // Your API Key
const CMC_API_URL = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BRYAN&convert=USDC`;

app.use(cors()); // Enable CORS

app.get("/api/bryan-price", async (req, res) => {
  try {
    const response = await axios.get(CMC_API_URL, {
      headers: {
        "X-CMC_PRO_API_KEY": CMC_API_KEY, // ✅ Correct way to send the API key
      },
    });

    if (!response.data || !response.data.data || !response.data.data.BRYAN) {
      throw new Error("No data received for $BRYAN from CoinMarketCap");
    }

    // ✅ Extract $BRYAN token data
    const bryanData = response.data.data.BRYAN;
    const price = bryanData.quote.USDC.price;
    const volume24h = bryanData.quote.USDC.volume_24h;
    const percentChange24h = bryanData.quote.USDC.percent_change_24h;
    const marketCap = bryanData.quote.USDC.market_cap;
    const fullyDilutedMarketCap = bryanData.quote.USDC.fully_diluted_market_cap;

    // ✅ Create a simplified JSON response
    const responseData = {
      name: bryanData.name,
      symbol: bryanData.symbol,
      price: price.toFixed(12),
      volume_24h: volume24h.toFixed(2),
      percent_change_24h: percentChange24h.toFixed(2),
      market_cap: marketCap,
      fully_diluted_market_cap: fullyDilutedMarketCap.toFixed(2),
      last_updated: bryanData.quote.USDC.last_updated,
    };

    console.log("✅ $BRYAN Data:", responseData);
    res.json(responseData);
  } catch (error) {
    console.error("❌ Error fetching $BRYAN data:", error.message);
    res.status(500).json({ error: "Failed to fetch $BRYAN price data" });
  }
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
