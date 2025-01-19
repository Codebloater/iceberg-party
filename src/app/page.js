"use client";

import { useState, useEffect } from "react";
import localFont from "next/font/local";
import Image from "next/image";
import {
  fetchNFTMetadata,
  getRandomNFTNumberWithBatch,
  shuffleArray
} from "./utils/FetchNFTImage";
import Link from "next/link";

const tt = localFont({
  src: "./fonts/TypeType_TT_Trailers_ExtraBold.otf",
  variable: "--font-tt",
  weight: "100 900"
});

const kavant = localFont({
  src: "./fonts/Kvant_Menco_Medium.otf",
  variable: "--font-kavant",
  weight: "100 900"
});

const Pudgy_penguin_max_nft_count = 8888;

export default function Home() {
  const MaxPairs = 8;

  const [currentMatchedPairs, setCurrentMatchedPairs] = useState(0);
  const [isGameOn, setIsGameOn] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [loadingLevel, setLoadingLevel] = useState(false);
  const [cardPlacement, setCardPlacement] = useState([]);
  const [currentLevelData, setCurrentLevelData] = useState({});
  const [flippedState, setFlippedState] = useState(
    Array(cardPlacement.length).fill(false)
  );
  const [firstFlippedIndex, setFirstFlippedIndex] = useState(null);

  const handleFlip = (index) => {
    if (isGameOn && !flippedState[index]) {
      const newFlippedState = [...flippedState];
      newFlippedState[index] = true;
      setFlippedState(newFlippedState);

      if (firstFlippedIndex === null) {
        // If this is the first card, store its index
        setFirstFlippedIndex(index);
      } else {
        // If second card is flipped, check for match
        if (
          cardPlacement[firstFlippedIndex].avatar ===
          cardPlacement[index].avatar
        ) {
          // If cards match, increment the matched pairs count
          let updatedNumber = currentMatchedPairs + 1;
          setCurrentMatchedPairs(updatedNumber);
          setFirstFlippedIndex(null); // Reset the first card index
        } else {
          // If cards don't match, flip them back after a short delay
          setTimeout(() => {
            const resetFlippedState = [...flippedState];
            resetFlippedState[firstFlippedIndex] = false;
            resetFlippedState[index] = false;
            setFlippedState(resetFlippedState);
            setFirstFlippedIndex(null); // Reset the first card index
          }, 1000); // Flip back after 1 second
        }
      }
    }
  };

  useEffect(() => {
    // Always start at Level 1 when the page is reloaded
    GenerateLevel();
  }, []);

  const GenerateLevel = async () => {
    setLoadingLevel(true);
    const batchSize = 8;

    let next_level = currentLevel + 1;
    setCurrentLevel(next_level);

    let levelDetails = {
      levelNumber: currentLevel,
      nftPairNumbers: []
    };

    // Generate a valid random NFT number
    const randomNFTstartNum = getRandomNFTNumberWithBatch(
      1,
      Pudgy_penguin_max_nft_count,
      batchSize
    );

    let resp = await fetchNFTMetadata(randomNFTstartNum, 8);
    let pairs = [];
    for (let i = 0; i < resp.nfts.length; i++) {
      const element = resp.nfts[i];

      // NFT Detail
      let data = {
        number: element.tokenId,
        avatar: element.image.cachedUrl
      };
      pairs.push(data, data); // Add the pair twice
    }

    // Shuffle the NFT pairs to get random placement
    const shuffledPairs = shuffleArray(pairs);
    setCardPlacement(shuffledPairs);
    setCurrentLevelData(levelDetails);
    setLoadingLevel(false);
  };

  const handleOnPlay = async () => {
    setIsGameOn(true);
  };

  const handleOnReset = async () => {
    // First, reset the flipped state to make sure all cards are facing the front
    setFlippedState(Array(cardPlacement.length).fill(false));

    // Reset matched pairs
    setCurrentMatchedPairs(0);

    // Add a delay to allow the flipped state reset to take effect before shuffling
    setTimeout(() => {
      const shuffledCards = shuffleArray(cardPlacement);
      setCardPlacement(shuffledCards); // Shuffle and set the new card order
    }, 300); // 300ms delay (adjust as needed)
  };

  const handleOnPlayNext = () => {
    if (currentMatchedPairs === MaxPairs) {
      // First, reset the flipped state to make sure all cards are facing the front
      setFlippedState(Array(cardPlacement.length).fill(false));
      setCurrentMatchedPairs(0);
      setIsGameOn(false);
      GenerateLevel();
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-[url('/background.jpeg')] bg-cover bg-no-repeat relative">
      {/* Pudgy Penguin Mascot */}
      <Image
        src={"/Penguin_1.png"}
        width={400}
        height={400}
        className="fixed bottom-0 right-0"
      />
      {/* NavBar */}
      <nav className="fixed top-6 left-6 right-6 flex justify-between items-center">
        <Link
          href={"https://x.com/SocialSnubClub"}
          className={`px-3 py-2 text-2xl rounded-md bg-[#fbf7eb] border-4 border-[#00142d] ${tt.variable} font-typetype text-[#00142d]`}
        >
          twitter
        </Link>
        <button
          className={`px-3 py-2 text-2xl rounded-md bg-[#ffe092] border-4 border-[#00142d] ${tt.variable} font-typetype text-[#00142d]`}
        >
          LeaderBoard (Coming Soon)
        </button>
      </nav>

      <div className="w-fit h-fit flex flex-col gap-4 justify-center items-center z-50 pt-24 sm:pt-0">
        <div
          className={`text-8xl ${tt.variable} font-typetype text-white`}
          style={{ textShadow: "-5px 3px 0px black" }}
        >
          IceBerg Party
        </div>
        <div className="w-full bg-[#00142d] h-fit p-3 rounded-md text-white flex justify-between items-center">
          <div className={` text-lg ${kavant.variable} font-kavant text-white`}>
            Matched {currentMatchedPairs}/{MaxPairs}
          </div>
          <div className={` text-lg ${kavant.variable} font-kavant text-white`}>
            Level {currentLevel}
          </div>
        </div>
        {/* Grid */}
        <div className="w-fit h-fit grid grid-cols-2 sm:grid-cols-4 gap-4 p-3 bg-[#f5fdff] border-4 border-[#00142d] rounded-md">
          {loadingLevel
            ? Array.from({ length: 16 }).map((_, index) => (
                <div key={index} className="card-container w-32 h-32">
                  <div className="card">
                    <div className="card-front w-32 h-32 bg-cover bg-no-repeat bg-[url('/pudgySearch.gif')]"></div>
                    <div
                      className="card-back w-32 h-32 bg-cover bg-no-repeat"
                      style={{ backgroundImage: `url('/image.png')` }}
                    ></div>
                  </div>
                </div>
              ))
            : cardPlacement.map((nft, index) => (
                <div key={index} className="card-container w-32 h-32">
                  <div
                    className={`card ${flippedState[index] ? "flip" : ""}`}
                    onClick={() => handleFlip(index)}
                  >
                    <div
                      className="card-front w-32 h-32 bg-cover bg-no-repeat rounded-md"
                      style={{ backgroundImage: `url(/image.png)` }}
                    ></div>
                    <div
                      className="card-back w-32 h-32 bg-cover bg-no-repeat rounded-md"
                      style={{ backgroundImage: `url(${nft.avatar})` }}
                    ></div>
                  </div>
                </div>
              ))}
        </div>

        <div className="w-full flex justify-between items-center gap-3">
          {isGameOn ? (
            <button
              className={`px-3 py-2 w-full text-3xl rounded-md bg-[#ff8b8b] border-4 border-[#00142d] ${tt.variable} font-typetype text-white`}
              onClick={handleOnReset}
            >
              Reset
            </button>
          ) : (
            <button
              className={`px-3 py-2 w-full text-3xl rounded-md bg-[#477dfd] border-4 border-[#00142d] ${tt.variable} font-typetype text-white`}
              onClick={handleOnPlay}
            >
              Play!
            </button>
          )}

          <button
            className={`px-3 py-2 w-full text-3xl rounded-md bg-[#a9ff99] border-4 border-[#00142d] ${tt.variable} font-typetype text-[#00142d]`}
            onClick={handleOnPlayNext}
          >
            Next!
          </button>
        </div>
      </div>
    </div>
  );
}
