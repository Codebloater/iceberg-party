import axios from "axios";

const PUDGY_PENGUIN_CONTRACT_ADDRESS =
  "0xBd3531dA5CF5857e7CfAA92426877b022e612cf8";

// export async function fetchNFTMetadata(tokenId) {
//   const options = {
//     method: "GET",
//     url: "https://eth-mainnet.g.alchemy.com/nft/v3/lfH0EEtXj6C04tsODaPwybYd--tbonlE/getNFTMetadata",
//     params: {
//       contractAddress: PUDGY_PENGUIN_CONTRACT_ADDRESS,
//       tokenId: tokenId.toString(),
//       refreshCache: "false"
//     },
//     headers: { accept: "application/json" }
//   };

//   try {
//     const response = await axios.request(options);
//     return response.data.image.cachedUrl; // Return the NFT image URL
//   } catch (error) {
//     console.error("Error fetching NFT metadata:", error.message);
//     throw error;
//   }
// }

export async function fetchNFTMetadata(startToken, limit) {
  const options = {
    method: "GET",
    url: `https://eth-mainnet.g.alchemy.com/nft/v3/lfH0EEtXj6C04tsODaPwybYd--tbonlE/getNFTsForContract`,
    params: {
      contractAddress: PUDGY_PENGUIN_CONTRACT_ADDRESS,
      withMetadata: "true",
      startToken: startToken,
      limit: limit
    },
    headers: { accept: "application/json" }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error("Error fetching NFT metadata:", error.message);
  }
}

export function getRandomNFTNumberWithBatch(min, max, batchSize) {
  if (min > max) {
    throw new Error("The min value should not be greater than the max value.");
  }
  if (batchSize > max) {
    throw new Error("Batch size exceeds the total NFT count.");
  }
  const validMax = max - batchSize + 1; // Ensure there are enough images after the generated number
  return Math.floor(Math.random() * (validMax - min + 1)) + min;
}

export const shuffleArray = (array) => {
  let shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};
