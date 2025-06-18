import axios from "axios";
import * as authFunctions from "../functions/authFunctions.js";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

// Use Helius RPC endpoint for better reliability
const HELIUS_RPC =
  "https://mainnet.helius-rpc.com/?api-key=7e9f2c68-75d0-4ca2-8342-de269f6132f1";

async function getWalletBalance(req, res) {
  try {
    const userId = req.user_id;
    const user = await authFunctions.getUser(userId);

    // Check if user has a wallet address - check multiple possible field names
    const walletAddress = user.solanaWalletAddress;

    if (!user || !walletAddress) {
      console.log("No wallet address found for user:", userId);
      console.log("User object:", user);
      return res.status(400).send({
        error: "No wallet address found for this user",
      });
    }

    // API configuration
    const SOLANA_TRACKER_API_KEY =
      process.env.SOLANA_TRACKER_API_KEY ||
      "4d5666f6-08de-418b-8aaa-35ea0fa9b913";
    const SOLANA_TRACKER_BASE_URL = "https://data.solanatracker.io";

    try {
      // Get native SOL balance as a fallback
      let nativeSolBalance = 0;
      try {
        const connection = new Connection(HELIUS_RPC);
        const publicKey = new PublicKey(walletAddress);
        const balance = await connection.getBalance(publicKey);
        nativeSolBalance = balance / LAMPORTS_PER_SOL;
      } catch (solError) {
        console.error("Error fetching native SOL balance:", solError);
        // Continue even if this fails, we'll still have token data
      }

      // Fetch token holdings directly from Solana Tracker API
      const response = await axios.get(
        `${SOLANA_TRACKER_BASE_URL}/wallet/${walletAddress}`,
        {
          headers: {
            "x-api-key": SOLANA_TRACKER_API_KEY,
          },
        }
      );

      let result = {
        walletAddress,
        tokens: [],
        nativeSolBalance,
        totalValue: 0,
      };

      if (response.data && response.data.tokens) {
        // Transform the response to match frontend requirements
        const tokens = response.data.tokens
          .map((item) => {
            return {
              mint: item.token.mint,
              symbol: item.token.symbol,
              name: item.token.name,
              amount: item.balance,
              logo: item.token.image,
              value: item.value,
              decimals: item.token.decimals,
            };
          })
          // Filter tokens with value > 0
          .filter((token) => token.value > 0)
          // Sort by value in descending order
          .sort((a, b) => b.value - a.value);

        result.tokens = tokens;
        result.totalValue = response.data.total || 0;
      }

      return res.status(200).send(result);
    } catch (error) {
      console.error(`Error fetching tokens for ${walletAddress}:`, error);

      // If Solana Tracker API fails, return at least the native SOL balance
      try {
        const connection = new Connection(HELIUS_RPC);
        const publicKey = new PublicKey(walletAddress);
        const balance = await connection.getBalance(publicKey);
        const nativeSolBalance = balance / LAMPORTS_PER_SOL;

        return res.status(200).send({
          walletAddress,
          tokens: [],
          nativeSolBalance,
          totalValue: 0,
          partialData: true,
        });
      } catch (solError) {
        console.error("Error fetching native SOL balance:", solError);

        // Return error response if both APIs fail
        return res.status(500).send({
          error: "Failed to fetch wallet data",
          details: error.response ? error.response.data : error.message,
          walletAddress,
        });
      }
    }
  } catch (e) {
    console.error("Error in getWalletBalance:", e);
    return res.status(500).send({ error: "Internal server error" });
  }
}

export { getWalletBalance };
