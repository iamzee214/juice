import { Connection, PublicKey, Message } from "@solana/web3.js";
import nacl from "tweetnacl";
import { signJWT, verifyJWT } from "../utils/jwt.utils.js";
import * as authFunctions from "../functions/authFunctions.js";
import { sendTelegramMessage } from "../functions/telegramFunctions.js";

import * as twitterFunctions from "../functions/twitterFunctions.js";
import * as ethers from "ethers";
import bcrypt from "bcrypt";
import bs58 from "bs58";
import crypto from "crypto";
import { sha256 } from "js-sha256";

async function getSolanaNonce(req, res) {
  try {
    let walletAddress = req.query.walletAddress;
    let user = await authFunctions.getSolanaUser(walletAddress);
    let nonce;
    if (!user) {
      user = await authFunctions.createSolanaUser(walletAddress);
      nonce = user.solanaNonce;
    } else {
      nonce = await authFunctions.updateSolanaNonce(walletAddress);
    }
    let msg = `Sign this message for authenticating with Juice AI: ${nonce}`;
    res.status(200).send({ msg: msg });
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
}

async function verifySolanaUser(req, res) {
  try {
    let { walletAddress, signature } = req.body;
    let user = await authFunctions.getSolanaUser(walletAddress);

    if (!user) {
      return res.status(500).send();
    }

    let msg = `Sign this message for authenticating with Juice AI: ${user.solanaNonce}`;

    // Convert the message to Uint8Array
    const messageBytes = new TextEncoder().encode(msg);

    // Convert the signature from base64 string to Uint8Array
    const signatureBytes = Buffer.from(signature, "base64");

    // Convert the public key from string to PublicKey object
    const publicKey = new PublicKey(walletAddress);

    // Verify the signature
    const verified = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKey.toBytes()
    );

    if (!verified) {
      console.log("Signature verification failed");
      return res.status(500).send();
    }

    let session = await authFunctions.createSession(user.id);

    const accessToken = signJWT(
      { user_id: user.id, sessionId: session.id },
      "2h"
    );
    const refreshToken = signJWT({ sessionId: session.id }, "1y");

    res.cookie("accessToken", accessToken, {
      maxAge: 300000,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 3.154e10,
      sameSite: "none",
    });

    res.status(200).send({
      id: user.id,
      sessionId: session.id,
      walletAddress: walletAddress,
      style: user.style,
      configuration: user.configuration || {
        bullishTokens: [],
        bearishTokens: [],
        personalityTraits: [],
        bannedWords: [],
        interests: [],
        rules: [],
        isComplete: false,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
}

async function disconnectTwitter(req, res) {
  try {
    let userId = req.user_id;

    // Clear all Twitter-related fields
    await authFunctions.updateUser(userId, {
      twitter_access_token: null,
      twitter_refresh_token: null,
      twitter_token_expires_at: null,
      twitter_auth_state: null,
      twitterConnected: false,
      twitterUsername: null,
      twitterName: null,
      twitterId: null,
      twitterPhoto: null,
      twitterBanner: null,
      isVerified: false,
      twitterPostsCount: 0,
      twitterFollowersCount: 0,
      twitterFollowingCount: 0,
    });

    // Clear any cached Twitter data
    await twitterFunctions.clearTwitterCache(userId);

    res.status(200).send({ success: true });
  } catch (error) {
    console.error("Error disconnecting Twitter:", error);
    res.status(500).send({ error: "Failed to disconnect Twitter" });
  }
}

async function updateUserStyle(req, res) {
  try {
    const userId = req.user_id;
    const { style } = req.body;

    await authFunctions.updateUser(userId, { style: style });

    const updatedUser = await authFunctions.getUser(userId);

    res.status(200).send({
      message: "User style updated successfully",
      style: updatedUser.style,
    });
  } catch (error) {
    console.error("Error updating user style:", error);
    res.status(500).send({ message: "Failed to update user style" });
  }
}

async function updateUserConfiguration(req, res) {
  try {
    const userId = req.user_id;
    const { configuration } = req.body;

    await authFunctions.updateUser(userId, {
      configuration: {
        ...configuration,
        isComplete: true,
      },
    });

    const updatedUser = await authFunctions.getUser(userId);

    res.status(200).send({
      message: "User configuration updated successfully",
      configuration: updatedUser.configuration,
    });
  } catch (error) {
    console.error("Error updating user configuration:", error);
    res.status(500).send({ message: "Failed to update user configuration" });
  }
}

async function getUserData(req, res) {
  try {
    const userId = req.user_id;
    const user = await authFunctions.getUser(userId);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({
      user: {
        id: user.id,
        twitterUsername: user.twitterUsername,
        twitterConnected: user.twitterConnected,
        twitterPhoto: user.twitterPhoto,
        twitterBanner: user.twitterBanner,
        twitterName: user.twitterName,
        isVerified: user.isVerified,
        twitterPostsCount: user.twitterPostsCount,
        twitterFollowersCount: user.twitterFollowersCount,
        twitterFollowingCount: user.twitterFollowingCount,
        style: user.style,
        configuration: user.configuration || {
          bullishTokens: [],
          bearishTokens: [],
          personalityTraits: [],
          bannedWords: [],
          interests: [],
          rules: [],
          isComplete: false,
        },
      },
    });
  } catch (error) {
    console.error("Error getting user data:", error);
    res.status(500).send({ message: "Failed to get user data" });
  }
}

async function getTwitterOAuth2Url(req, res) {
  try {
    // Generate OAuth 2.0 authorization URL with PKCE
    const { authUrl, state, codeVerifier } =
      twitterFunctions.getTwitterOAuth2AuthorizeUrl();

    console.log("Twitter OAuth URL generation debug:", {
      state,
      codeVerifier: codeVerifier ? "exists" : "missing",
      codeVerifierLength: codeVerifier ? codeVerifier.length : 0,
      authUrlLength: authUrl ? authUrl.length : 0,
    });

    // Store the OAuth state and code verifier in session/cache
    // Since we don't have a user yet, we'll temporarily store this data
    // and match it during the callback
    await twitterFunctions.storeOAuthSession(state, codeVerifier);

    console.log("Stored OAuth session data");

    // Return the auth URL for the client to redirect to
    res.status(200).send({ authUrl });
  } catch (error) {
    console.error("Error generating Twitter OAuth 2.0 URL:", error);
    res
      .status(500)
      .send({ error: "Failed to generate Twitter authorization URL" });
  }
}

async function handleTwitterOAuth2Callback(req, res) {
  try {
    const { code, state } = req.body;

    console.log("OAuth callback debug:", {
      state,
      codeLength: code ? code.length : 0,
    });

    // Verify the state and get the stored OAuth session
    const oauthSession = await twitterFunctions.getOAuthSession(state);
    if (!oauthSession) {
      throw new Error("Invalid state parameter - OAuth session not found");
    }

    console.log("Exchanging code for tokens using OAuth session");
    // Exchange code for tokens using the stored OAuth session
    const tokens = await twitterFunctions.getTwitterOAuth2Tokens(
      code,
      state,
      oauthSession.codeVerifier
    );
    console.log("Received tokens:", {
      access_token_length: tokens.access_token.length,
      refresh_token_length: tokens.refresh_token
        ? tokens.refresh_token.length
        : 0,
      expires_at: tokens.expires_at,
    });

    console.log("Getting user information");
    // Get user information using the new token - use 'me' to get authenticated user's info
    const userInfo = await twitterFunctions.getUserById(
      tokens.access_token,
      tokens.refresh_token,
      "me" // Special parameter to get the authenticated user's info
    );

    // Extract user information - handle both direct API and SDK formats
    // Direct API returns { data: { ... } }, SDK might have different structure
    const twitterData = userInfo.data;

    if (!twitterData) {
      console.error("No Twitter data in response:", userInfo);
      throw new Error("Failed to retrieve Twitter profile data");
    }

    console.log("Twitter user data retrieved:", {
      id: twitterData.id,
      username: twitterData.username,
      name: twitterData.name,
    });

    // Check if user already exists by Twitter ID
    let user = await authFunctions.getUserByTwitterId(twitterData.id);

    if (!user) {
      // Create new user with Twitter data
      user = await authFunctions.createTwitterUser({
        twitterId: twitterData.id,
        twitterUsername: twitterData.username,
        twitterName: twitterData.name,
        twitter_access_token: tokens.access_token,
        twitter_refresh_token: tokens.refresh_token,
        twitter_token_expires_at:
          tokens.expires_at instanceof Date
            ? tokens.expires_at
            : new Date(Number(tokens.expires_at)),
        twitterConnected: true,
        twitterPhoto: twitterData.profile_image_url
          ? twitterData.profile_image_url.replace("_normal", "_400x400")
          : null,
        twitterBanner: twitterData.profile_banner_url || null,
        isVerified: twitterData.verified || false,
        twitterPostsCount: twitterData.public_metrics?.tweet_count || 0,
        twitterFollowersCount: twitterData.public_metrics?.followers_count || 0,
        twitterFollowingCount: twitterData.public_metrics?.following_count || 0,
      });
    } else {
      // Update existing user with new tokens and profile info
      await authFunctions.updateUser(user.id, {
        twitter_access_token: tokens.access_token,
        twitter_refresh_token: tokens.refresh_token,
        twitter_token_expires_at:
          tokens.expires_at instanceof Date
            ? tokens.expires_at
            : new Date(Number(tokens.expires_at)),
        twitterUsername: twitterData.username,
        twitterName: twitterData.name,
        twitterConnected: true,
        twitterPhoto: twitterData.profile_image_url
          ? twitterData.profile_image_url.replace("_normal", "_400x400")
          : null,
        twitterBanner: twitterData.profile_banner_url || null,
        isVerified: twitterData.verified || false,
        twitterPostsCount: twitterData.public_metrics?.tweet_count || 0,
        twitterFollowersCount: twitterData.public_metrics?.followers_count || 0,
        twitterFollowingCount: twitterData.public_metrics?.following_count || 0,
      });

      // Refresh user data
      user = await authFunctions.getUser(user.id);
    }

    // Create session for the user
    const session = await authFunctions.createSession(user.id);

    // Generate JWT tokens
    const accessToken = signJWT(
      { user_id: user.id, sessionId: session.id },
      "2h"
    );
    const refreshToken = signJWT({ sessionId: session.id }, "1y");

    // Set cookies
    res.cookie("accessToken", accessToken, {
      maxAge: 300000,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 3.154e10,
      sameSite: "none",
    });

    // Clean up OAuth session
    await twitterFunctions.cleanupOAuthSession(state);

    // Return the user data
    res.status(200).send({
      userData: {
        id: user.id,
        twitterConnected: user.twitterConnected,
        twitterUsername: user.twitterUsername,
        twitterName: user.twitterName,
        twitterPhoto: user.twitterPhoto,
        twitterBanner: user.twitterBanner,
        isVerified: user.isVerified,
        twitterPostsCount: user.twitterPostsCount,
        twitterFollowersCount: user.twitterFollowersCount,
        twitterFollowingCount: user.twitterFollowingCount,
        style: user.style,
        configuration: user.configuration || {
          bullishTokens: [],
          bearishTokens: [],
          personalityTraits: [],
          bannedWords: [],
          interests: [],
          rules: [],
          isComplete: false,
        },
      },
    });
  } catch (error) {
    console.error("Error handling Twitter OAuth 2.0 callback:", error);
    res.status(500).send({ error: "Failed to authenticate with Twitter" });
  }
}

async function signOut(req, res) {
  try {
    const sessionId = req.sessionId;

    if (sessionId) {
      // Invalidate the session
      await authFunctions.deleteSession(sessionId);
    }

    // Clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).send({ message: "Successfully signed out" });
  } catch (error) {
    console.error("Error signing out:", error);
    res.status(500).send({ error: "Failed to sign out" });
  }
}

export {
  getSolanaNonce,
  verifySolanaUser,
  disconnectTwitter,
  updateUserStyle,
  updateUserConfiguration,
  getUserData,
  getTwitterOAuth2Url,
  handleTwitterOAuth2Callback,
  signOut,
};
