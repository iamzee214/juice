import TelegramBot from "node-telegram-bot-api";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config({ path: `${process.env.NODE_ENV}.env` });
const bot = new TelegramBot(process.env.TELEGRAM_BOT_KEY);
import * as userFunctions from "./authFunctions.js";
async function sendTelegramMessage(user_id, title, message) {
  console.log(user_id);
  let user = await userFunctions.getUser(user_id);
  console.log("USER");
  console.log(user);

  let userName = user.ethWalletAddress;
  const markdownMessage = `*${title}*\n[${userName}](https://solscan.io/account/${userName}) ${message}`;
  bot.sendMessage(process.env.TELEGRAM_CHANNEL_ID, markdownMessage, {
    parse_mode: "Markdown",
    disable_web_page_preview: true,
  });
}
function ellipsisWalletName(value) {
  if (value.length > 20) {
    return value.slice(0, 4) + "..." + value.slice(-4);
  }
  return value;
}

async function newAnalysisMessage(ticker, ca, imageUrl, data) {
  // Prepare the caption text with MarkdownV2 formatting
  let caption;
  if (data != null) {
    let bundleBuyInfo = `\n\n*Total Sniped*\n├─ ${formatStat(
      parseFloat(data.percentageSniped)
    )}% with ${formatStat(
      parseFloat(data.initialSolBought)
    )} SOL\n└─ ${formatNumber(
      parseFloat(data.initialTokensBought)
    )} $${ticker}`;
    for (let buy of data.initialBuys) {
      let index = data.initialBuys.indexOf(buy) + 1;
      bundleBuyInfo += `\n\n*Wallet ${index}*\n├─ \`${
        buy.wallet
      }\`\ \n├─ Sniped ${formatStat(parseFloat(buy.percentageSniped))}% with ${
        buy.solAmount
      } SOL\n├─ ${formatNumber(
        parseFloat(data.initialTokensBought)
      )} $${ticker}\n└─ [View TX](https://solscan.io/tx/${buy.signature})`;
    }
    console.log(bundleBuyInfo);
    caption = `🕵️‍♂️ *New Juice dApp Analysis* 🕵️‍♂️\n\nSomeone has just analysed *$${ticker}*\n\nCA: \`${ca}\`\n\n*👨‍🌾 Team Selling Stats 👨‍🌾*\n\n*Team PnL Breakdown*\n├─ Sold ${formatStat(
      data.totalSolSold
    )} SOL\n├─ Bought ${formatStat(
      data.totalSolRebought
    )} SOL\n├─ Sniped ${formatStat(
      data.initialSolBought
    )} SOL\n└─ *Total ${formatStat(data.totalPnlSol)} SOL* \\($${formatStat(
      data.totalPnlUSD
    )}\\)\n\n*Team Holdings Breakdown*\n├─ Swapped: ${formatStat(
      parseFloat(data.swapped_percentage)
    )}%\n├─ Transferred: ${formatStat(
      parseFloat(data.totalTokensTransferredPercentage)
    )}%\n└─ Total $${ticker} remaining: *${formatNumber(
      data.totalTokensUnsold
    )}* \\(${formatStat(
      parseFloat(data.percentageOfSupplyHeld)
    )}% of supply\\)\n\n*Bundled Buys Breakdown*${bundleBuyInfo}\n\n[View Chart](https://dexscreener.com/solana/${ca})
  `;
  } else {
    caption = `🕵️‍♂️ *New Juice dApp Analysis* 🕵️‍♂️\n\nSomeone has just analysed *$${ticker}*\n\nCA: \`${ca}\`\n\n*✅ No Bundled Buys Found ✅*\n\n[View Chart](https://dexscreener.com/solana/${ca})
  `;
  }
  // Send the image with the caption
  bot.sendPhoto(process.env.TELEGRAM_CHANNEL_ID, imageUrl, {
    caption: caption,
    parse_mode: "MarkdownV2",
    disable_web_page_preview: false,
  });
}
function escapeMarkdownV2(text) {
  return text.replace(/[_*[\]()~`>#+-=|{}.!]/g, (x) => "\\" + x);
}

function formatStat(value) {
  return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
}
function formatNumber(num) {
  // Determine the value in thousands and millions
  const thousands = Math.round(num / 1000);
  const millions = Math.round(num / 1000000);

  // Format based on the size of the number
  if (num >= 1000000) {
    // If the number is in the millions, format with 'M'
    return `${millions}M`;
  } else if (num >= 1000) {
    // If the number is in the thousands, format with 'K'
    return `${thousands}K`;
  } else {
    // If the number is less than 1000, round to nearest whole number
    return Math.round(num).toString();
  }
}

export { sendTelegramMessage, newAnalysisMessage };
