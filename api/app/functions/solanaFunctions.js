import axios from "axios";
import {
  getAccount,
  getMint,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import * as fs from "fs";
import * as path from "path";
import { Connection, PublicKey } from "@solana/web3.js";
import fetch from "node-fetch";
import { error } from "console";
// Assuming you're using Coingecko and Solscan APIs for the example
const COINGECKO_API_KEY = "CG-dzv62nejDaFKy6TMax45yvpc";
const COINGECKO_API_URL_PRO = "https://api.coingecko.com/api/v3/";
const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";
const SOLSCAN_API_URL = "https://public-api.solscan.io"; // Note: Adjust this URL based on actual Solscan API documentation
const API_KEY = "6dcb78d9-dcda-48d8-bbdc-0a5813e6b18c";
const MAINNET_RPC =
  "https://mainnet.helius-rpc.com/?api-key=6dcb78d9-dcda-48d8-bbdc-0a5813e6b18c";

/**
 * Function to determine if a query is likely a contract address based on its length and character set.
 * @param {string} query - The query string to check.
 * @returns {boolean} - True if the query is likely a contract address, otherwise false.
 */
function isLikelyContractAddress(query) {
  // Regular expression for Base58 characters and exact length of 44
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{44}$/;

  return base58Regex.test(query);
}

/**
 * Writes JSON data to a file.
 * @param {string} filename - The name of the file.
 * @param {object} jsonData - The JSON data to write to the file.
 */
const writeJsonToFile = (filename, jsonData) => {
  const prettyJson = JSON.stringify(jsonData, null, 2); // Pretty-print JSON
  const filePath = path.join("/tmp", filename); // Use /tmp directory
  fs.writeFile(filePath, prettyJson, (err) => {
    if (err) {
      console.error("Error writing file:", err);
    } else {
      console.log("File has been saved to", filePath);
    }
  });
};

/**
 * Extracts signatures from transactions based on a specific token mint.
 *
 * In Solana, a token mint is a unique address representing a specific token.
 * It functions similarly to a contract address in Ethereum's ERC-20 tokens and is used to uniquely identify and manage a token.
 *
 * A transaction signature in Solana is a unique identifier that verifies and records the transaction on the blockchain.
 * It ensures the authenticity and integrity of the transaction, similar to a digital signature.
 *
 * This function filters out and collects the signatures of transactions that involve the specified token mint.
 *
 * @param {Array} transactions - The list of transactions to process.
 * @param {string} tokenMint - The token mint address to filter transactions by.
 * @returns {Array} - An array of signatures from the transactions that involve the specified token mint.
 */
function getSignaturesByTokenMint(transactions, tokenMint) {
  const signatures = [];

  transactions.forEach((transaction) => {
    const postTokenBalances = transaction.meta.postTokenBalances;

    const hasMatchingMint = postTokenBalances.some(
      (balance) => balance.mint === tokenMint
    );

    if (hasMatchingMint) {
      signatures.push(...transaction.transaction.signatures);
    }
  });

  return signatures;
}

/**
 * Checks if a token account is related to a specific token mint.
 *
 * This function verifies whether a given token account is associated with a specific token mint
 * by fetching the token account information from Solana and comparing the mint address stored in the account with the provided token mint address.
 * @param {string} tokenAccountAddress - The token account address to check.
 * @param {string} tokenMintAddress - The token mint address to check against.
 * @returns {Promise<boolean>} - True if the token account is related to the token mint, otherwise false.
 */
async function isTokenAccountRelatedToToken(
  tokenAccountAddress,
  tokenMintAddress
) {
  // Create a connection to the Solana cluster
  const connection = new Connection(MAINNET_RPC);

  // Parse the provided addresses
  const tokenAccountPubkey = new PublicKey(tokenAccountAddress);
  const tokenMintPubkey = new PublicKey(tokenMintAddress);

  try {
    // Fetch the token account information
    const tokenAccountInfo = await connection.getParsedAccountInfo(
      tokenAccountPubkey
    );

    // Check if the account is an SPL Token account
    if (!tokenAccountInfo.value) {
      return false;
    }

    // Get the token account's parsed data
    const tokenAccountData = tokenAccountInfo.value.data.parsed.info;

    // Check if the mint address of the token account matches the provided token mint address
    return tokenAccountData.mint === tokenMintPubkey.toString();
  } catch (error) {
    console.error("Error fetching token account info:", error);
    return false;
  }
}
const addressesToIgnore = ["5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"];

/**
 * Retrieves the creation block slot of a token.
 * @param {string} tokenAddress - The token address to check.
 * @returns {Promise<number>} - The block slot number where the token was created.
 */
async function getBlockZero(tokenAddress) {
  try {
    //1 Get Deployer Address
    let deployerAddress = (
      await axios.post(
        MAINNET_RPC,
        {
          jsonrpc: "2.0",
          id: "text",
          method: "getAsset",
          params: { id: tokenAddress },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    ).data.result.authorities[0].address;
    const url = `https://api.helius.xyz/v0/addresses/${deployerAddress}/transactions?api-key=${API_KEY}&type=CREATE_POOL`;
    let createPoolSlot = (await axios.get(url)).data[0].slot;
    return createPoolSlot;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

/**
 * Retrieves the first block transactions involving a specific token.
 *
 * In Solana, a slot number is similar to a block number in Ethereum. It represents the unique identifier for a specific block created during that slot.
 * The `createPoolSlot` parameter is the slot number during which the token was created.
 * This function uses the slot number to fetch and analyze transactions from the block where the token was created.
 *
 * @param {string} tokenAddress - The token address to filter transactions by.
 * @param {number} createPoolSlot - The slot number of the creation block, similar to a block number in Ethereum.
 * @returns {Promise<Array>} - An array of transaction signatures.
 */
async function getFirstBlockTransactions(tokenAddress, createPoolSlot) {
  const ALCHEMY_API_KEY = "9_QM6oI2Z6M31UYQYLF6wttXzk4zJmBB"; // Ensure you replace this with your actual Alchemy API key
  const ALCHEMY_URL = `https://solana-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`; // Adjust as necessary for different networks or API keys
  //Get all relevant tx in that block
  const blockTxs = (
    await axios.post(
      ALCHEMY_URL,
      {
        jsonrpc: "2.0",
        id: 1,
        method: "getBlock",
        params: [
          createPoolSlot,
          {
            encoding: "jsonParsed",
            transactionDetails: "full",
            rewards: false,
            maxSupportedTransactionVersion: 0,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  ).data.result.transactions;
  const successfulTxs = blockTxs.filter(
    (tx) => tx.meta && tx.meta.err === null
  );

  let matchingSignatures = getSignaturesByTokenMint(
    successfulTxs,
    tokenAddress
  );

  return matchingSignatures;
}

/**
 * Searches for tokens by name using the DexScreener API.
 * @param {string} query - The name of the token to search for.
 * @returns {Promise<Array>} - An array of token information objects.
 */
async function searchByName(query) {
  try {
    const response = await axios.get(
      `https://api.dexscreener.com/latest/dex/search/?q=${query}`,
      {}
    );
    console.log(response);
    // Adapt this path based on the actual structure of the response from Coingecko
    return response.data.pairs
      .filter((x) => x.chainId == "solana")
      .map((coin) => ({
        id: coin.baseToken.address,
        address: coin.baseToken.address,
        symbol: coin.baseToken.symbol,
        name: coin.baseToken.name,
        image: coin?.info?.imageUrl,
        isAddress: false,
        ...coin,
      }));
  } catch (error) {
    console.error("Error searching tokens by name:", error);
    throw error;
  }
}

/**
 * Checks for token transfers after a swap transaction.
 * @param {string} walletAddress - The wallet address to check.
 * @param {string} mintAddress - The mint address of the token to check for.
 * @returns {Promise<boolean>} - True if there are token transfers after the swap, otherwise false.
 */
async function checkTransfersAfterSwap(walletAddress, mintAddress) {
  const url = `https://api.helius.xyz/v0/addresses/${walletAddress}/transactions?api-key=${API_KEY}`;
  try {
    const response = await axios.get(url);
    const data = response.data;

    let count = 0;
    data.forEach((transaction) => {
      if (transaction.tokenTransfers && transaction.tokenTransfers.length > 0) {
        transaction.tokenTransfers.forEach((transfer) => {
          if (transfer.mint === mintAddress) {
            count++;
          }
        });
      }
    });
    return count > 0;
  } catch (error) {
    console.error("Error checking transfers after SWAP:", error);
    return false;
  }
}

/**
 * Searches for a token by contract address using Solscan API.
 * Note: The actual implementation and endpoint may vary based on available APIs.
 *
 * @param {string} address - The contract address of the token to search for.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of token information objects.
 * @throws {Error} - Throws an error if the search operation fails.
 */
async function searchByAddress(address) {
  try {
    // Sending a POST request to the Solscan API to get the token information by address
    const response = (
      await axios.post(
        MAINNET_RPC,
        {
          jsonrpc: "2.0",
          id: "text",
          method: "getAsset",
          params: { id: address },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    ).data.result;

    // Logging the response for debugging purposes
    console.log(response);

    // Returning the token information in the required format
    return [
      {
        address: response.id,
        symbol: response.content.metadata.symbol,
        isAddress: true,
        id: response.id,
        name: response.content.metadata.name,
        image: response.content?.links?.image
          ? response.content?.links?.image
          : "/Solana_logo.png", // Default image if none is provided
      },
    ];
  } catch (error) {
    // Logging and rethrowing the error if the search operation fails
    console.error("Error searching tokens by address:", error);
    throw error;
  }
}

/**
 * Calculates the percentage of x relative to y with a fixed number of decimal places.
 *
 * @param {number} x - The numerator value.
 * @param {number} y - The denominator value.
 * @param {number} [fixed=3] - The number of decimal places to fix the result to (default is 3).
 * @returns {string} - The calculated percentage as a string fixed to the specified number of decimal places.
 */
function calcPercentage(x, y, fixed = 3) {
  // Calculating the percentage
  const percent = (x / y) * 100;

  // Returning the percentage fixed to the specified number of decimal places
  return percent.toFixed(fixed);
}

/**
 * Exports a single function that decides whether to search by name or address
 * based on the format of the query.
 *
 * @param {string} query - The query string which can be a token name or address.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of token information objects.
 */
async function searchTokens(query) {
  // Returning an empty array if the query is empty
  if (!query) return [];

  // Checking if the query is likely a contract address and searching accordingly
  if (isLikelyContractAddress(query)) {
    return await searchByAddress(query);
  } else {
    return await searchByName(query);
  }
}

/**
 * Handles the KOL search data by analyzing token transactions.
 *
 * @param {string} tokenAddress - The contract address of the token to search for.
 * @param {string[]} marketingAddresses - An array of marketing addresses to analyze.
 * @param {string[]} signatures - An array of transaction signatures to analyze.
 * @returns {Promise<Object>} - A promise that resolves to an object containing KOL analysis data.
 * @throws {Error} - Throws an error if any operation within the function fails.
 */

async function handleKOLSearchData(
  tokenAddress,
  marketingAddresses,
  signatures
) {
  try {
    // Initialize variables to store aggregate data
    let totalTokensSold = 0;
    let totalTokensUnsold = 0;
    let totalUSDSold = 0;
    let totalSolSold = 0;
    let totalTokensTransferred = 0;
    let totalTokensRebought = 0;
    let totalSolRebought = 0;
    let totalUSDRebought = 0;
    let totalPnlSol = 0;
    let totalPnlUSD = 0;

    const connection = new Connection(MAINNET_RPC);
    const scannedKolAddresses = [];

    // Get total supply of the token
    const totalSupplyData = await connection.getTokenSupply(
      new PublicKey(tokenAddress)
    );
    const totalSupply = totalSupplyData.value.uiAmount;

    // Get initial swap transactions and calculate initial tokens and SOL bought
    let initialBuys = await getSwapTransactions(signatures, totalSupply);
    let initialSolBought = initialBuys.reduce((acc, x) => acc + x.solAmount, 0);
    let initialTokensBought = initialBuys.reduce(
      (acc, x) => acc + x.tokenAmount,
      0
    );

    try {
      // Fetch token price data from APIs
      const kolTableData = [];

      const [tokenPriceData, soltokenPriceData] = await Promise.all([
        axios.get(
          `https://public-api.dextools.io/trial/v2/token/solana/${tokenAddress}/price`,
          {
            headers: {
              accept: "application/json",
              "x-api-key": "hBNUy8F2OA6nFWDy2P8Hi5La5NWl0nDa8P9rD2SF",
            },
          }
        ),
        axios.get(`https://price.jup.ag/v4/price?ids=SOL`),
      ]);

      const tokenPrice = parseFloat(tokenPriceData.data.data.price);
      const soltokenPrice = soltokenPriceData.data.data["SOL"].price;

      // Analyze each marketing address
      await Promise.all(
        marketingAddresses.map(async (address) => {
          const lastSignatureCheckBox = new Map();
          let lastSignature;

          while (true) {
            try {
              let url = `https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${API_KEY}`;
              if (lastSignature) {
                if (lastSignatureCheckBox.get(lastSignature)) break;
                url += `&before=${lastSignature}`;
                lastSignatureCheckBox.set(lastSignature, true);
              }
              const response = await fetch(url);
              const transactions = await response.json();

              if (!transactions || transactions.length === 0) break;
              const tokenTransferPromises = transactions.map(
                async (transactionData) => {
                  if (
                    !transactionData ||
                    transactionData.type === "BURN" ||
                    transactionData.type === "SWAP" ||
                    transactionData.tokenTransfers.length === 0
                  )
                    return null;

                  const tokenTransferDetails = await Promise.all(
                    transactionData.tokenTransfers.map(
                      async (tokenTransfer) => {
                        const kolAddress = tokenTransfer.toUserAccount;
                        const kolATAAddress = tokenTransfer.toTokenAccount;

                        if (addressesToIgnore.includes(kolAddress)) {
                          return null;
                        }
                        if (scannedKolAddresses.includes(kolAddress)) {
                          return null;
                        }
                        scannedKolAddresses.push(kolAddress);

                        if (
                          tokenTransfer.mint !=
                            "So11111111111111111111111111111111111111112" &&
                          tokenTransfer.mint != tokenAddress
                        ) {
                          return null;
                        }
                        let kol_holding_amount = 0;
                        try {
                          if (
                            await isTokenAccountRelatedToToken(
                              kolATAAddress,
                              tokenAddress
                            )
                          ) {
                            await new Promise((f) => setTimeout(f, 500)); // Reduced delay
                            kol_holding_amount = await getTokenBalance(
                              connection,
                              new PublicKey(kolATAAddress)
                            );
                            console.log(
                              "KOL HOLDING AMOUNT FOR " + kolATAAddress
                            );
                            console.log(kol_holding_amount);
                          }
                        } catch (error) {}
                        const transfered_amount = parseFloat(
                          tokenTransfer.tokenAmount
                        );
                        let txLinks = [];
                        let status = "";
                        let apiError = false;
                        let tokens_transferred_amount = 0;
                        let external_tokens_transfered = 0;
                        let amountSwappedInUSD = 0;
                        let amountSwappedInSol = 0;
                        let rebought_tokens_amount = 0;
                        let rebought_tokens_value_in_sol = 0;
                        let rebought_tokens_value_in_usd = 0;
                        let tokens_swapped_amount = 0;

                        if (kol_holding_amount < transfered_amount) {
                          const nestedurl = `https://api.helius.xyz/v0/addresses/${kolATAAddress}/transactions?api-key=${API_KEY}`;
                          try {
                            const nested_response = await fetch(nestedurl);
                            const nested_transactions =
                              await nested_response.json();
                            if (
                              nested_transactions &&
                              nested_transactions.length > 0
                            ) {
                              nested_transactions.forEach(
                                (nested_transactionData) => {
                                  if (
                                    !nested_transactionData ||
                                    nested_transactionData.tokenTransfers
                                      .length === 0
                                  )
                                    return;
                                  const nested_tokenTransfers =
                                    nested_transactionData.tokenTransfers;
                                  txLinks.push(
                                    nested_transactionData.signature
                                  );

                                  nested_tokenTransfers.forEach(
                                    (nested_tokenTransfer) => {
                                      if (
                                        nested_tokenTransfer.mint ===
                                        tokenAddress
                                      ) {
                                        const nested_token_Amount = parseFloat(
                                          nested_tokenTransfer.tokenAmount
                                        );
                                        if (
                                          nested_transactionData.type === "SWAP"
                                        ) {
                                          let tokenAmount = 0;
                                          let solAmount = 0;
                                          nested_tokenTransfers.forEach(
                                            (transfer) => {
                                              if (
                                                transfer.mint === tokenAddress
                                              )
                                                tokenAmount += parseFloat(
                                                  transfer.tokenAmount
                                                );
                                              if (
                                                transfer.mint ===
                                                "So11111111111111111111111111111111111111112"
                                              )
                                                solAmount += parseFloat(
                                                  transfer.tokenAmount
                                                );
                                            }
                                          );
                                          const tokenPriceInSOL =
                                            tokenAmount > 0 && solAmount > 0
                                              ? solAmount / tokenAmount
                                              : 0;
                                          if (
                                            nested_tokenTransfer.fromUserAccount.toString() ===
                                            kolAddress.trim()
                                          ) {
                                            amountSwappedInSol +=
                                              nested_token_Amount *
                                              tokenPriceInSOL;
                                            amountSwappedInUSD +=
                                              nested_token_Amount *
                                              tokenPriceInSOL *
                                              soltokenPrice;
                                            tokens_swapped_amount +=
                                              nested_token_Amount;
                                          } else {
                                            rebought_tokens_amount +=
                                              nested_token_Amount;
                                            rebought_tokens_value_in_sol +=
                                              nested_token_Amount *
                                              tokenPriceInSOL;
                                            rebought_tokens_value_in_usd +=
                                              nested_token_Amount *
                                              tokenPriceInSOL *
                                              soltokenPrice;
                                          }
                                        } else if (
                                          nested_transactionData.type ===
                                          "TRANSFER"
                                        ) {
                                          if (
                                            nested_tokenTransfer.fromUserAccount ===
                                            kolAddress
                                          ) {
                                            external_tokens_transfered +=
                                              nested_token_Amount;
                                          } else {
                                            tokens_transferred_amount +=
                                              nested_token_Amount;
                                          }
                                        }
                                      }
                                    }
                                  );
                                }
                              );
                            }
                          } catch (error) {
                            console.log(error);
                            apiError = true;
                          }
                        }

                        const transferred_percentage = calcPercentage(
                          transfered_amount,
                          external_tokens_transfered
                        );
                        const swapped_percentage = calcPercentage(
                          tokens_swapped_amount,
                          external_tokens_transfered
                        );
                        const hold_percentage = calcPercentage(
                          kol_holding_amount,
                          external_tokens_transfered
                        );

                        if (
                          parseInt(kol_holding_amount.toString()) === 0 &&
                          tokens_transferred_amount === 0
                        ) {
                          status = "All Tokens SOLD";
                        } else if (
                          parseInt(kol_holding_amount.toString()) === 0 &&
                          tokens_swapped_amount === 0
                        ) {
                          status = "All Tokens TRANSFERRED";
                        } else if (
                          parseInt(kol_holding_amount.toString()) ===
                          parseInt(transfered_amount.toString())
                        ) {
                          status = "Still Holds all Tokens";
                        } else if (
                          parseInt(kol_holding_amount.toString()) >
                          parseInt(transfered_amount.toString())
                        ) {
                          status = "Still Holds and Bought More Tokens";
                        } else {
                          status = `${
                            parseInt(kol_holding_amount.toString()) !== 0
                              ? `HOLDS: ${parseFloat(hold_percentage).toFixed(
                                  0
                                )}% `
                              : ""
                          } ${
                            tokens_transferred_amount !== 0
                              ? `TRANSFERRED: ${parseFloat(
                                  transferred_percentage
                                ).toFixed(0)}% `
                              : ``
                          } ${
                            tokens_swapped_amount !== 0
                              ? `SOLD: ${parseFloat(swapped_percentage).toFixed(
                                  0
                                )}% `
                              : ``
                          }`;
                        }

                        totalTokensUnsold += kol_holding_amount;
                        totalTokensSold += tokens_swapped_amount;
                        totalUSDSold += amountSwappedInUSD;
                        totalSolSold += amountSwappedInSol;
                        totalTokensRebought += rebought_tokens_amount;
                        totalSolRebought += rebought_tokens_value_in_sol;
                        totalUSDRebought += rebought_tokens_value_in_usd;
                        totalPnlUSD +=
                          amountSwappedInUSD - rebought_tokens_value_in_usd;
                        totalPnlSol +=
                          amountSwappedInSol - rebought_tokens_value_in_sol;
                        external_tokens_transfered +=
                          external_tokens_transfered;
                        kolTableData.push({
                          amount: transfered_amount,
                          amountHoldInUSD: tokenPrice * kol_holding_amount,
                          amountHoldInSOL:
                            (tokenPrice * kol_holding_amount) / soltokenPrice,
                          amount_supply_percentage: calcPercentage(
                            transfered_amount,
                            totalSupply
                          ),
                          address: kolAddress,
                          amount_hold: kol_holding_amount,
                          amount_hold_worth: kol_holding_amount * tokenPrice,
                          amount_hold_supply_percentage: calcPercentage(
                            kol_holding_amount,
                            totalSupply
                          ),
                          marketing_address: address.trim(),
                          txLinks: txLinks,
                          status: status,
                          apiError: apiError,
                          tokens_transferred_amount: tokens_transferred_amount,
                          amountTransferredInUSD:
                            tokens_transferred_amount * tokenPrice,
                          amountTransferredInSOL:
                            (tokens_transferred_amount * tokenPrice) /
                            soltokenPrice,
                          tokens_swapped_amount: tokens_swapped_amount,
                          amountSwappedInUSD: amountSwappedInUSD,
                          amountSwappedInSol: amountSwappedInSol,
                          transferred_percentage: transferred_percentage,
                          swapped_percentage: swapped_percentage,
                          external_tokens_transfered:
                            external_tokens_transfered,
                          rebought_tokens_amount: rebought_tokens_amount,
                          rebought_tokens_value_in_sol:
                            rebought_tokens_value_in_sol,
                          rebought_tokens_value_in_usd:
                            rebought_tokens_value_in_usd,
                          pnlUsd:
                            amountSwappedInUSD - rebought_tokens_value_in_usd,
                          pnlSol:
                            amountSwappedInSol - rebought_tokens_value_in_sol,

                          kolATAAddress: kolATAAddress,
                          transfered_amount: transfered_amount,
                        });
                      }
                    )
                  );

                  return await Promise.all(tokenTransferDetails);
                }
              );

              await Promise.all(tokenTransferPromises);

              lastSignature = transactions[transactions.length - 1].signature;
            } catch (error) {
              console.log(error);
              break;
            }
          }
        })
      );
      let percentageSniped = calcPercentage(initialTokensBought, totalSupply);
      return {
        percentageOfSupplyHeld: calcPercentage(totalTokensUnsold, totalSupply),
        data: kolTableData,
        totalTokensTransferred: totalTokensTransferred,
        totalTokensTransferredPercentage: calcPercentage(
          totalTokensTransferred,
          initialTokensBought
        ),
        totalTokensSold: totalTokensSold,
        totalTokensUnsold: totalTokensUnsold,
        totalUSDSold: totalUSDSold,
        totalSolSold: totalSolSold,
        totalTokensRebought: totalTokensRebought,
        totalSolRebought: totalSolRebought,
        totalUSDRebought: totalUSDRebought,
        totalPnlSol: totalPnlSol - initialSolBought,
        totalPnlUSD: totalPnlUSD - initialSolBought * soltokenPrice,
        totalTokensSniped: initialTokensBought,
        swapped_percentage: calcPercentage(
          totalTokensSold - totalTokensRebought,
          totalTokensSold - totalTokensRebought + totalTokensUnsold
        ),
        initialBuys: initialBuys,
        percentageSniped,
        initialSolBought,
        initialTokensBought,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

/**
 * Not used at the moment. Could be used in the future?
 * Fetches all transactions for a given address.
 * @param {string} address - The address to fetch transactions for.
 * @param {object} addressStats - An object to store address statistics.
 * @param {string} tokenAddress - The token address to filter transactions by.
 * @param {number} tokenPrice - The price of the token.
 * @param {number} solTokenPrice - The price of SOL.
 * @param {string} [beforeSignature=""] - The signature to fetch transactions before.
 * @returns {Promise<void>}
 */
async function fetchAllTransactions(
  address,
  addressStats,
  tokenAddress,
  tokenPrice,
  solTokenPrice,
  beforeSignature = ""
) {
  let url = `https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${API_KEY}`;
  if (beforeSignature) {
    url += `&before=${beforeSignature}`;
  }
  const response = await fetch(url);
  const transactions = await response.json();
  if (transactions && transactions.length > 0) {
    for (const transaction of transactions) {
      if (addressStats.transactionsChecked.has(transaction.signature)) continue;
      addressStats.transactionsChecked.add(transaction.signature);

      const tokenTransfers = transaction.tokenTransfers.filter(
        (transfer) => transfer.mint === tokenAddress
      );
      for (const transfer of tokenTransfers) {
        if (transfer.toUserAccount === address) {
          addressStats.totalBoughtByAddress += transfer.tokenAmount;
        }
        if (transfer.fromUserAccount === address) {
          addressStats.totalSoldByAddress += transfer.tokenAmount;
        }
      }

      // Recursively check for more transactions, making sure to pass the last signature of the current batch
      await fetchAllTransactions(
        address,
        addressStats,
        tokenAddress,
        tokenPrice,
        solTokenPrice,
        transactions[transactions.length - 1].signature
      );
    }
  }
}

/**
 * Retrieves the token balance for a given token account.
 * @param {Connection} connection - The connection to the Solana cluster.
 * @param {PublicKey} tokenAccount - The token account public key.
 * @returns {Promise<number>} - The token balance.
 */
async function getTokenBalance(connection, tokenAccount) {
  const info = await getAccount(connection, tokenAccount);
  const amount = Number(info.amount);
  const mint = await getMint(connection, info.mint);
  const balance = amount / 10 ** mint.decimals;
  return balance;
}

/**
 * Retrieves wallets involved in SWAP transactions from a list of transaction signatures.
 *
 * @param {string[]} transactionSignatures - An array of transaction signatures to analyze.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of objects containing wallet and signature information.
 * @throws {Error} - Throws an error if any operation within the function fails.
 */
async function getSwapWallets(transactionSignatures) {
  const apiKey = `${API_KEY}`;
  const url = `https://api.helius.xyz/v0/transactions?api-key=${apiKey}`;

  try {
    // Reverse the transaction signatures to maintain the original reverse order processing
    const reversedSignatures = transactionSignatures.slice().reverse();

    // Fetch all transaction details in parallel
    const responses = await Promise.all(
      reversedSignatures.map((signature) =>
        axios.post(url, { transactions: [signature] }).catch((error) => {
          console.error("Error fetching transaction details:", error);
          return null; // Return null for failed requests
        })
      )
    );

    // Filter out failed responses and transactions without SWAP type
    const swapTransactions = responses
      .filter(
        (response) =>
          response &&
          response.data[0] &&
          !response.data[0].transactionError &&
          response.data[0].type === "SWAP"
      )
      .map((response) => response.data[0]);

    if (swapTransactions.length === 0) {
      console.log("No SWAP transaction found.");
      return null;
    }

    console.log("TRANSFERS");
    console.log(swapTransactions);

    // Transform the data to extract wallet and signature information
    const transformedData = swapTransactions.flatMap((tx) => {
      const signature = tx.signature;
      return tx.tokenTransfers.map((transfer) => ({
        wallet: transfer.fromUserAccount,
        signature,
      }));
    });

    console.log(transformedData);
    return transformedData;
  } catch (error) {
    console.log(error);
    return null;
  }
}

/**
 * Fetches swap transactions and calculates relevant data based on transaction signatures and total supply.
 *
 * @param {Array<string>} transactionSignatures - Array of transaction signatures to fetch details for.
 * @param {number} totalSupply - The total supply of the token.
 * @returns {Array<Object>|null} - Array of transformed data objects or null if no SWAP transactions are found.
 */
async function getSwapTransactions(transactionSignatures, totalSupply) {
  try {
    let swapTransactions = [];

    // Loop through the transaction signatures from the last to the first
    for (let i = transactionSignatures.length - 1; i >= 0; i--) {
      let signature = transactionSignatures[i];

      try {
        // Define the API URL with the API key
        let url = `https://api.helius.xyz/v0/transactions?api-key=${API_KEY}`;

        // Fetch the transaction details from the API
        const response = await axios.post(url, {
          transactions: [signature],
        });

        // Extract the first transaction from the response
        let tx = response.data[0];

        // Check if the transaction data is undefined
        if (!tx) {
          console.error(
            "Transaction data is undefined for signature:",
            signature
          );
          continue;
        }

        // Skip the transaction if it contains an error
        if (tx.transactionError) {
          continue;
        }

        // Add the transaction to the swapTransactions array if it is of type "SWAP"
        if (tx.type === "SWAP") {
          swapTransactions.push(tx);
        }
      } catch (error) {
        console.error(
          "Error fetching transaction details for signature:",
          signature,
          error
        );
      }
    }

    // If no SWAP transactions are found, log a message and return null
    if (swapTransactions.length === 0) {
      console.log("No SWAP transaction found.");
      return null;
    }

    console.log("TRANSFERS");
    console.log(swapTransactions);

    // Map the swap transactions to extract relevant transfer details
    let transfers = swapTransactions.map((x) => {
      return {
        tokenTransfers: x.tokenTransfers,
        signature: x.signature,
      };
    });

    // Transform the transfer data to calculate SOL and token amounts and the percentage sniped
    const transformedData = transfers.map((transactionGroup) => {
      let solAmount = 0;
      let tokenAmount = 0;
      let percentageSniped = 0;
      let signature = transactionGroup.signature;
      let wallet = transactionGroup.tokenTransfers[0]?.fromUserAccount; // Assuming fromUserAccount as the wallet identifier

      transactionGroup.tokenTransfers.forEach((transaction) => {
        if (
          transaction.mint === "So11111111111111111111111111111111111111112"
        ) {
          solAmount += transaction.tokenAmount;
        } else {
          tokenAmount += transaction.tokenAmount;
        }
        percentageSniped = calcPercentage(tokenAmount, totalSupply);
      });

      return { wallet, solAmount, tokenAmount, percentageSniped, signature };
    });

    console.log(transformedData);
    return transformedData;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Checks if a token is bundled by analyzing its first block transactions.
 *
 * @param {string} tokenAddress - The contract address of the token to check.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the token is bundled.
 * @throws {Error} - Throws an error if any operation within the function fails.
 */
async function isBundled(tokenAddress) {
  // Get the first block of the token
  let firstBlock = await getBlockZero(tokenAddress);

  // Get the transactions from the first block of the token
  let txs = await getFirstBlockTransactions(tokenAddress, firstBlock);

  // Check if there are any transactions in the first block
  if (txs.length > 0) {
    return true; // The token is bundled
  }
  return false; // The token is not bundled
}

/**
 * Asynchronously fetches bundle details for a given token ID.
 *
 * This function locates the launch block of a given token, fetches the relevant transactions,
 * identifies swap wallets, checks for bundled buys, and calculates selling activities.
 * The progress of these steps can be emitted to a progressEmitter if provided.
 *
 * @param {string} tokenId - The ID of the token to fetch bundle details for.
 * @param {object} progressEmitter - Optional. An event emitter to emit progress updates.
 * @param {string} taskId - Optional. A unique task identifier for progress tracking.
 * @returns {Promise<object>} An object indicating if the token is bundled and the corresponding bundle data.
 */
async function getBundleDetails(
  tokenId,
  progressEmitter = null,
  taskId = null
) {
  // Emit progress indicating the start of locating the launch block.
  if (taskId != null) {
    progressEmitter.emit(taskId, {
      progress: 25,
      message: "Locating launch block",
    });
  }

  // Initialize the token address and locate the first block for the given token.
  let tokenAddress = tokenId;
  let firstBlock = await getBlockZero(tokenAddress);

  // Emit progress indicating the start of fetching bundled buys.
  if (taskId != null) {
    progressEmitter.emit(taskId, {
      progress: 50,
      message: "Fetching bundled buys",
    });
  }

  // Fetch the transactions from the first block.
  let txs = await getFirstBlockTransactions(tokenAddress, firstBlock);
  console.log("RELEVANT TXS");
  console.log(txs);

  // Identify swap wallets from the fetched transactions.
  let swaps = await getSwapWallets(txs);
  console.log("RELEVANT SWAPS");
  console.log(swaps);

  // Array to store valid swaps.
  let validSwaps = [];

  // Check each swap for bundled buys after the swap.
  const checkPromises = swaps.map((swap) =>
    checkTransfersAfterSwap(swap.wallet, tokenId)
  );
  const results = await Promise.all(checkPromises);

  // Collect valid swaps based on the check results.
  for (let i = 0; i < results.length; i++) {
    const bundled = results[i];
    const swap = swaps[i];

    console.log(bundled);

    // If any swap is not bundled, stop processing further
    if (bundled) {
      validSwaps.push(swap);
    }
  }

  // Emit progress indicating the start of calculating selling activities.
  if (taskId != null) {
    progressEmitter.emit(taskId, {
      progress: 75,
      message: "Calculating selling activities",
    });
  }

  // Extract wallets and signatures from valid swaps.
  let wallets = validSwaps.map((x) => x.wallet);
  let signatures = validSwaps.map((x) => x.signature);

  // If there are valid swaps, handle the KOL search data and return the bundle data.
  if (validSwaps.length > 0) {
    let bundleData = await handleKOLSearchData(
      tokenAddress,
      wallets,
      signatures
    );
    if (bundleData == null) {
      return { isBundled: false, data: null };
    }
    return {
      isBundled: true,
      bundleData: bundleData,
    };
  } else {
    return { isBundled: false, data: null };
  }
}

export {
  searchTokens,
  handleKOLSearchData,
  getBundleDetails,
  isBundled,
  searchByAddress,
};
