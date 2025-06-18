function generateAIPromptTemplate(userData) {
  const config = userData.configuration || {};

  // Extract data from configuration
  const personalityTraits = config.personalityTraits || [];
  const bullishTokens = config.bullishTokens || [];
  const bearishTokens = config.bearishTokens || [];
  const interests = config.interests || [];
  const rules = config.rules || [];
  const bannedWords = config.bannedWords || [];

  // Format tokens to extract symbols and add $ prefix
  const bullishSymbols = bullishTokens
    .map((token) => `$${token.symbol || token}`)
    .join(", ");
  const bearishSymbols = bearishTokens
    .map((token) => `$${token.symbol || token}`)
    .join(", ");

  // Generate the prompt template
  let template = `
You are an AI managing a crypto twitter account that has to tweet with these personailty traits ${personalityTraits.join(
    ", "
  )}.

Your twitter handle is @${userData.twitterUsername}.

Your goal is to get as much engagement as possible.
`;

  // Only include sections if they have content
  if (bullishSymbols) {
    template += `\nYou are heavily invested in these tokens: ${bullishSymbols}. You believe all of these tokens have superior communities.\n`;
  }

  if (bearishSymbols) {
    template += `\nYou are bearish on these tokens: ${bearishSymbols}.\n`;
  }

  if (interests.length > 0) {
    template += `\nThese are things you are interested in: ${interests.join(
      ", "
    )}.\n`;
  }

  if (rules.length > 0) {
    template += `\nThese are rules you must follow: ${rules.join(", ")}.\n`;
  }

  if (bannedWords.length > 0) {
    template += `\nThese words are banned: ${bannedWords.join(", ")}.\n`;
  }

  template += `
CRITICAL INSTRUCTIONS THAT MUST BE FOLLOWED AT ALL TIMES:
- Do not include any questions in your response.
- Omit introductory phrases like "It sounds like" or "This appears to be."
- Provide direct, concise statements that capture the essence of your reply.
- Ensure your response is relevant and directly replies to the tweet.
- Do not repeat any part of the tweet in your response.
- Provide only one response per tweet.
- Do not enclose your response in quotation marks or apostrophes; do not start with a dash.
- Generate responses that directly communicate the primary message without any additional commentary, comparisons, or colloquial phrases such as 'more like'. Focus solely on the core content needed to convey the intended meaning, and omit any embellishments or secondary expressions.
- Maintain a POSITIVE tone & DO NOT be rude, or roast people.
- All Responses MUST be under 50 characters.
- Respond directly with the core information. Avoid casual terms or unnecessary additions at the end.
- Do not enclose your response in quotation marks or apostrophes; do not start with a dash.
- Do not use hashtags in your response.
- Do not use emojis in your response.
- If referencing a token ticker, prepend it with $.
`;

  return template;
}

const OPENAI_API_KEY =
  "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";

import { OpenAI } from "openai";

const ai_client = new OpenAI({ apiKey: OPENAI_API_KEY });

const post_process = (response) => {
  let sentences = response.trim().split(/(?<=[.!?])\s+/);

  let result = sentences.join(" ").toLowerCase().replace(/\.$/, "");
  return result;
};

/**
 * Generates AI responses for multiple tweets in a batch to improve performance
 * @param {Array} tweets - Array of objects containing tweetContent and imageUrl
 * @param {Object} user - User object with AI prompt template
 * @returns {Array} Array of responses corresponding to each tweet
 */
async function generateBatchTweetResponses(tweets, user) {
  try {
    // Generate a fresh AI prompt template if not provided in the user object
    const systemPrompt =
      user.aiPromptTemplate || generateAIPromptTemplate(user);

    // Create an array of promises for all tweets
    const responsePromises = tweets.map(async (tweet) => {
      try {
        // Prepare the prompt for each tweet
        let prompt = `Respond to this tweet: "${tweet.tweetContent}"`;

        // Add information about image if present
        if (tweet.imageUrl) {
          prompt += `\nThe tweet includes an image: ${tweet.imageUrl}`;
        }
        console.log("Prompt:", prompt);
        console.log("System Prompt:", systemPrompt);
        // Make API call to OpenAI
        const completion = await ai_client.chat.completions.create({
          model: "gpt-4",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
          top_p: 0.7,
          max_tokens: 50,
        });

        // Extract and process the response
        let response = completion.choices[0].message.content;
        response = post_process(response);

        return {
          tweetId: tweet.tweetId,
          response: response,
        };
      } catch (error) {
        console.error(
          `Error generating response for tweet ${tweet.tweetId}:`,
          error
        );
        // Return a fallback response on error
        return {
          tweetId: tweet.tweetId,
          response: "Fascinating perspective! Let's connect.",
          error: true,
        };
      }
    });

    // Wait for all responses in parallel
    return Promise.all(responsePromises);
  } catch (error) {
    console.error("Error in batch tweet response generation:", error);
    // Return fallback responses for all tweets
    return tweets.map((tweet) => ({
      tweetId: tweet.tweetId,
      response: "Interesting! Would love to discuss more.",
      error: true,
    }));
  }
}

async function generateTweetResponse(tweetContent, imageUrl, user) {
  try {
    // Prepare the prompt for the AI
    let prompt = `Respond to this tweet: "${tweetContent}"`;

    // Add information about image if present
    if (imageUrl) {
      prompt += `\nThe tweet includes an image: ${imageUrl}`;
    }

    // Generate a fresh AI prompt template
    const aiPromptTemplate = generateAIPromptTemplate(user);

    // Make API call to OpenAI
    const completion = await ai_client.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: aiPromptTemplate },
        { role: "user", content: prompt },
      ],
      top_p: 0.7,
      max_tokens: 50,
    });

    // Extract and process the response
    let response = completion.choices[0].message.content;
    response = post_process(response);

    return response;
  } catch (error) {
    console.error("Error generating tweet response:", error);
    throw error;
  }
}

// Convert from CommonJS to ES Module exports
export {
  generateAIPromptTemplate,
  generateTweetResponse,
  generateBatchTweetResponses,
};
