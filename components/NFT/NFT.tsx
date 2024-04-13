import {
    useContract,
    useValidDirectListings,
    useValidEnglishAuctions,
  } from "@thirdweb-dev/react";
  import { NFT } from "@thirdweb-dev/sdk";
  import React from "react";
  import RetryImage from "./RetryImage"; // Assuming RetryImage is in the same directory; adjust the path accordingly
  import {
    MARKETPLACE_ADDRESS,
    NFT_COLLECTION_ADDRESS,
  } from "../../const/contractAddresses";
  import Skeleton from "../Skeleton/Skeleton";
  import styles from "./NFT.module.css";
  import { ThirdwebNftMedia } from "@thirdweb-dev/react";
  type Props = {
    nft: NFT;
  };
  
  export default function NFTComponent({ nft }: Props) {
    const { contract: marketplace, isLoading: loadingContract } = useContract(
      MARKETPLACE_ADDRESS,
      "marketplace-v3"
    );
  
    // 1. Load if the NFT is for direct listing
    const { data: validDirectListing, isLoading: loadingDirect } =
      useValidDirectListings(marketplace, {
        tokenContract: NFT_COLLECTION_ADDRESS,
        tokenId: nft.metadata.id,
      });
  
    // 2. Load if the NFT is for auction
    const { data: auctionListing, isLoading: loadingAuction } =
      useValidEnglishAuctions(marketplace, {
        tokenContract: NFT_COLLECTION_ADDRESS,
        tokenId: nft.metadata.id,
      });
  
    return (
      <>
        {" "}
        <RetryImage
          src={nft?.metadata.image}
          alt={`NFT ${nft.metadata.id}`}
          className={styles.nftImage}
        />
        <p className={styles.nftTokenId}>Token ID #{nft?.metadata.id}</p>
        <p className={styles.nftName}>{nft?.metadata.name}</p>
        <div className={styles.priceContainer}>
          {loadingContract || loadingDirect || loadingAuction ? (
            <Skeleton width="100%" height="100%" />
          ) : validDirectListing && validDirectListing[0] ? (
            <div className={styles.nftPriceContainer}>
              <div>
                <p className={styles.nftPriceLabel}>Price</p>
                <p className={styles.nftPriceValue}>
                  {`${validDirectListing[0]?.currencyValuePerToken.displayValue}
            ${validDirectListing[0]?.currencyValuePerToken.symbol}`}
                </p>
              </div>
            </div>
          ) : auctionListing && auctionListing[0] ? (
            <div className={styles.nftPriceContainer}>
              <div>
                <p className={styles.nftPriceLabel}>Minimum Bid</p>
                <p className={styles.nftPriceValue}>
                  {`${auctionListing[0]?.minimumBidCurrencyValue}
            ${auctionListing[0]?.minimumBidCurrencyValue.symbol}`}
                </p>
              </div>
            </div>
          ) : (
            <div className={styles.nftPriceContainer}>
              <div>
                <p className={styles.nftPriceLabel}>Price</p>
                <p className={styles.nftPriceValue}>Not for sale</p>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
  