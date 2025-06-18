import axios from "../utils/axios.instance";

async function getSolanaNonce(walletAddress) {
  return await axios.get("/api/auth/getSolanaNonce", {
    params: { walletAddress },
    withCredentials: true,
    credentials: "include",
  });
}

async function verifySolanaUser(walletAddress, signature) {
  return await axios.post(
    "/api/auth/verifySolanaUser",
    {
      walletAddress,
      signature,
    },
    {
      withCredentials: true,
      credentials: "include",
    }
  );
}

export { getSolanaNonce, verifySolanaUser };
