# Juice3

**Juice3** is an AI-powered Twitter automation platform that generates contextual tweet replies and provides automated engagement services. The platform uses OpenAI's GPT-4 to create personalized responses based on user-configured personality traits, interests, and trading sentiment.

## How It Works

### Core Architecture

The platform consists of three main components:

1. **API Backend** (`/api`) - Node.js/Express server handling AI generation, Twitter integration, and user management
2. **Dashboard Frontend** (`/dapp`) - Vue.js application for user configuration and timeline management

### AI Tweet Generation System

#### 1. User Configuration

Users complete a 4-step personalization process:

- **Step 1**: Select personality traits (Sarcastic, Witty, Technical, Casual, Professional, etc.)
- **Step 2**: Define interests and behavioral rules
- **Step 3**: Specify bullish/bearish cryptocurrency tokens
- **Step 4**: Set banned words and content restrictions

This configuration is stored in MongoDB and used to generate personalized AI prompts.

#### 2. Dynamic Prompt Generation

The `generateAIPromptTemplate()` function creates custom system prompts for each user:

```javascript
// Located in api/app/functions/aiPromptFunctions.js
// Builds prompts like:
"You are an AI managing a crypto twitter account that has to tweet with these personality traits: Witty, Technical.
Your twitter handle is @username.
You are heavily invested in these tokens: $SOL, $BTC.
You are bearish on these tokens: $DOGE.
These are things you are interested in: DeFi, NFTs.
These are rules you must follow: Always be positive, No financial advice."
```

#### 3. Batch Response Generation

The system processes multiple tweets simultaneously for efficiency:

- Fetches user's Twitter timeline via Twitter API v2.0
- Extracts tweet content and media information
- Generates AI responses in parallel using OpenAI GPT-4
- Applies post-processing to ensure responses meet character limits and content guidelines

#### 4. Response Optimization

AI responses are optimized for engagement:

- Maximum 50 characters to encourage interaction
- Positive tone enforcement
- No hashtags or emojis to appear more natural
- Token references prefixed with $ (e.g., $SOL, $BTC)

### Twitter Integration

#### OAuth 2.0 Authentication

- Uses Twitter API v2.0 with proper OAuth 2.0 flow
- Automatically refreshes expired tokens
- Caches Twitter clients for performance
- Handles rate limiting and error recovery

#### Timeline Processing

- Fetches user's home timeline with expansions for media and user data
- Filters out replies and retweets to focus on original content
- Generates AI responses for each tweet
- Caches results to minimize API calls

#### Automated Posting

- Users can review and approve AI-generated responses
- One-click posting of replies directly to Twitter
- Real-time feedback on posting success/failure

### Automated Engagement System

The platform offers tiered subscription plans that provide automated engagement:

#### Bronze Tier ($100 USDC/month)

- 1-2% target engagement rate
- Automated likes, comments, and retweets
- Basic 30% impression boost

#### Silver Tier ($200 USDC/month)

- 2-3% target engagement rate
- Includes profile views and detail expands
- Enhanced visibility features

#### Gold Tier ($300 USDC/month)

- 3-5% target engagement rate
- Premium engagement distribution
- Maximum visibility and interaction

The engagement algorithm (`/api/app/functions/algorithm.js`) automatically:

1. Monitors user tweets for new posts
2. Calculates engagement targets based on historical performance
3. Distributes likes, comments, retweets via external bot services
4. Tracks and optimizes engagement patterns

### Real-Time Analytics

The dashboard provides comprehensive analytics:

- **Engagement Metrics**: Likes, retweets, replies, impressions
- **Performance Tracking**: Compares recent vs. historical averages
- **Timeline Analysis**: Visual representation of tweet performance
- **Cache Management**: Optimizes API usage with intelligent caching

### Technical Implementation

#### Database Schema (MongoDB)

- **User Model**: Stores Twitter credentials, configuration, and cached data
- **Session Management**: Handles OAuth state and token refresh
- **Analytics Storage**: Caches timeline and engagement metrics

#### State Management (Vue.js)

- **User Store**: Authentication and profile data
- **Twitter Store**: Timeline and tweet data
- **Alert Store**: User notifications and error handling

#### Performance Optimizations

- **Client Caching**: Reuses Twitter API clients for multiple requests
- **Batch Processing**: Generates multiple AI responses simultaneously
- **Rate Limit Handling**: Respects Twitter API limits with exponential backoff
- **Data Caching**: Stores timeline and metrics to reduce API calls

### Security & Privacy

- **OAuth 2.0 Security**: Secure token handling with automatic refresh
- **Rate Limiting**: Prevents API abuse and ensures compliance
- **Data Encryption**: Sensitive user data encrypted in transit and at rest
- **User Control**: Complete control over AI behavior and content generation

### Future Roadmap

Based on the landing page roadmap:

1. **Smarter Generation**: Enhanced AI training with more user interaction data
2. **24/7 Mode**: Fully automated posting and engagement (currently experimental)
3. **Expanded Features**: Additional social platforms and advanced analytics

## Project Structure

```
├── api/                    # Backend API server
│   ├── app/
│   │   ├── controllers/    # Route handlers
│   │   ├── functions/      # Business logic (AI, Twitter, algorithms)
│   │   ├── middleware/     # Authentication and rate limiting
│   │   ├── routes/         # API route definitions
│   │   └── utils/          # Utilities and helpers
│   ├── models/             # MongoDB schemas
│   └── config/             # Database and authentication config
├── dapp/                   # Frontend dashboard
│   ├── src/
│   │   ├── components/     # Vue components
│   │   ├── functions/      # API communication
│   │   ├── stores/         # Pinia state management
│   │   ├── utils/          # Frontend utilities
│   │   └── views/          # Page components
└── landing-page/           # Marketing website
    └── src/
        ├── components/     # Landing page components
        └── views/          # Landing page views
```

## Key Dependencies

### Backend

- **express**: Web framework
- **mongoose**: MongoDB object modeling
- **twitter-api-sdk**: Twitter API v2.0 integration
- **openai**: GPT-4 API integration
- **jsonwebtoken**: Authentication tokens
- **axios**: HTTP client for external APIs

### Frontend

- **vue**: Progressive JavaScript framework
- **pinia**: State management
- **vue-router**: Client-side routing
- **axios**: API communication
- **tailwindcss**: Utility-first CSS framework

### Blockchain

- **@solana/web3.js**: Solana blockchain integration
- **@solana/spl-token**: SPL token handling

This platform represents a sophisticated integration of AI, social media APIs, and automated engagement systems, designed to enhance Twitter presence through intelligent, personalized content generation.
