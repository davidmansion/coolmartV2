import { 
    useContract, 
    useNFT, 
    Web3Button,
    useCancelDirectListing,
    useCancelEnglishAuction,
    useValidDirectListings,
    useValidEnglishAuctions 
  } from "@thirdweb-dev/react";
  import { DirectListingV3, EnglishAuction } from "@thirdweb-dev/sdk";
  import Link from "next/link";
  import React from "react";
  import { MARKETPLACE_ADDRESS, NFT_COLLECTION_ADDRESS } from "../../const/contractAddresses";
  import styles from "../../styles/Buy.module.css";
  import NFT from "../NFT/NFT";
  import Skeleton from "../Skeleton/Skeleton";
  import toast, { Toaster } from "react-hot-toast";
  import toastStyle from "../../util/toastConfig";
  
  type Props = {
    listing: DirectListingV3 | EnglishAuction;
      
  };
  
  /**
   * Accepts a listing and renders the associated NFT for it
   */
  export default function ListingWrapper({ listing }: Props) {
  
    const { contract: nftCollection } = useContract(NFT_COLLECTION_ADDRESS);
    
    const { data: nft, isLoading} = useNFT(nftCollection, listing.asset.id);
  
    const { contract: marketplace, isLoading: loadingContract } = useContract(
      MARKETPLACE_ADDRESS,
      "marketplace-v3"
    );
  
    const { data: directListing, isLoading: loadingDirect } =
      useValidDirectListings(marketplace, {
        tokenContract: NFT_COLLECTION_ADDRESS
      });
  
    // 2. Load if the NFT is for auction
    const { data: auctionListing, isLoading: loadingAuction } =
      useValidEnglishAuctions(marketplace, {
        tokenContract: NFT_COLLECTION_ADDRESS,
      });
  
      function getCurrentEpochTime() {
        return Math.floor(Date.now() / 1000);
      }
  
  
      const {
        mutateAsync: cancelDirectListing,
        
      } = useCancelDirectListing(marketplace);
  
      const {
        mutateAsync: cancelAuctionListing,
        
      } = useCancelEnglishAuction(marketplace);
  
      async function cancelAuction() {
        if (listing.endTimeInSeconds > getCurrentEpochTime()) {
          throw new Error("Cannot cancel auction with active bids");
        }
    
        return await cancelAuctionListing(listing.id);
      }
    
      // Separate async function to cancel a direct listing
      async function cancelDirect() {
        console.log("Cancel direct clicked");
        return await cancelDirectListing(listing.id);
      }
  
      const isAuction = "buyoutBidAmount" in listing;
  
  
    if (isLoading) {
      return (
        <div className={styles.nftContainer}>
          <Skeleton width={"100%"} height="312px" />
        </div>
      );
    }
  
    if (!nft) return null;
    
    
  
    return (
    <>
    <Toaster position="bottom-center" reverseOrder={false} />
     <div>
      
      <Link
        href={`/token/${NFT_COLLECTION_ADDRESS}/${nft.metadata.id}`}
        key={nft.metadata.id}
        className={styles.nftContainerListing}
      >
        <NFT nft={nft} />
      </Link>
      
      <Web3Button
    contractAddress={MARKETPLACE_ADDRESS}
    action={isAuction ? cancelAuction : cancelDirect}
    className="btn btn-lg btn-round btn-light btn-glow animated"
    onSuccess={() => {
      toast(`Cancellation success!`, {
        icon: "✅",
        style: toastStyle,
        position: "bottom-center",
      });
    }}
    onError={(error) => {
      const errorMessage = (error as Error).message || "Unknown error occurred";
      toast(`Cancellation failed! Reason: ${errorMessage}`, {
        icon: "❌",
        style: toastStyle,
        position: "bottom-center",
      });
    }}
  >
    Cancel Listing
  </Web3Button>
      </div>
  </>
    );
  }