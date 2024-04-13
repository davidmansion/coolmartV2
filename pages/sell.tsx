import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  ConnectWallet,
  ThirdwebNftMedia,
  useAddress,
  useContract,
  useOwnedNFTs,
} from '@thirdweb-dev/react';
import Container from '../components/Container/Container';
import NFTGrid from '../components/NFT/NFTGrid';
import { NFT_COLLECTION_ADDRESS } from '../const/contractAddresses';
import tokenPageStyles from '../styles/Token.module.css';
import { NFT as NFTType } from '@thirdweb-dev/sdk';
import SaleInfo from '../components/SaleInfo/SaleInfo';
import styles from '../styles/Home.module.css';
import { motion } from 'framer-motion'; // Import motion from framer-motion

export default function Sell() {
  const router = useRouter();
  const currentPage = parseInt(router.query.page as string) || 1;
  const { contract } = useContract(NFT_COLLECTION_ADDRESS);
  const address = useAddress();
  const { data, isLoading } = useOwnedNFTs(contract, address);
  const [selectedNft, setSelectedNft] = useState<NFTType>();

  const [nftsPerPage] = useState(30);
  const totalPages = data ? Math.ceil(data.length / nftsPerPage) : 0;
  const indexOfLastNft = currentPage * nftsPerPage;
  const indexOfFirstNft = indexOfLastNft - nftsPerPage;
  const currentNfts = data ? data.slice(indexOfFirstNft, indexOfLastNft) : [];

  const setCurrentPage = (page: number) => {
    router.push({
      pathname: '/sell',
      query: { page }
    });
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <motion.div // Wrap the entire component with motion.div
      initial={{ opacity: 0, y: 20 }} // Initial animation state
      animate={{ opacity: 1, y: 0 }} // Animation on component mount
      transition={{ duration: 1 }} // Animation duration
      className={styles.background}
    >
      {/* Video Background */}
      {/* <video autoPlay muted loop playsInline className={styles.backgroundVideo}>
        <source src={videoSource} type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}

      <Container maxWidth="lg">
        <div className={styles.connectWalletButton}>
          <ConnectWallet />
        </div>
        <motion.h1 // Wrap the heading with motion.h1
          initial={{ opacity: 0, y: -20 }} // Initial animation state
          animate={{ opacity: 1, y: 0 }} // Animation on component mount
          transition={{ duration: 0.5, delay: 0.5 }} // Animation duration and delay
        >
          Sell DANA NFTs
        </motion.h1>
        {/* Pagination Controls */}
        <motion.div // Wrap the pagination controls with motion.div
          initial={{ opacity: 0, x: -20 }} // Initial animation state
          animate={{ opacity: 1, x: 0 }} // Animation on component mount
          transition={{ duration: 0.5, delay: 0.7 }} // Animation duration and delay
        >
          <div>
            <button onClick={() => paginate(1)} disabled={currentPage === 1}>
              First
            </button>
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
              Prev
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
            <button onClick={() => paginate(totalPages)} disabled={currentPage === totalPages}>
              Last
            </button>
          </div>
        </motion.div>

        {!selectedNft ? (
          <>
            <motion.p // Wrap the paragraph with motion.p
              initial={{ opacity: 0, y: 20 }} // Initial animation state
              animate={{ opacity: 1, y: 0 }} // Animation on component mount
              transition={{ duration: 0.5, delay: 0.9 }} // Animation duration and delay
            >
              Select which NFT you&rsquo;d like to sell below.
            </motion.p>
            <NFTGrid
              data={currentNfts}
              isLoading={isLoading}
              overrideOnclickBehavior={(nft) => {
                setSelectedNft(nft);
              }}
              emptyText={
                "Looks like you don't own any NFTs in this collection. Head to the buy page to buy some!"
              }
            />
          </>
        ) : (
          <div className={tokenPageStyles.container} style={{ marginTop: 0 }}>
            <div className={tokenPageStyles.metadataContainer}>
              <div className={tokenPageStyles.imageContainer}>
                <ThirdwebNftMedia
                  metadata={selectedNft.metadata}
                  className={tokenPageStyles.image}
                />
                <button
                  onClick={() => {
                    setSelectedNft(undefined);
                  }}
                  className={tokenPageStyles.crossButton}
                >
                  X
                </button>
              </div>
            </div>

            <div className={tokenPageStyles.listingContainer}>
              <p>You&rsquo;re about to list the following item for sale.</p>
              <h1 className={tokenPageStyles.title}>
                {selectedNft.metadata.name}
              </h1>
              <p className={tokenPageStyles.collectionName}>
                Token ID #{selectedNft.metadata.id}
              </p>

              <div className={tokenPageStyles.pricingContainer}>
                <SaleInfo nft={selectedNft} />
              </div>
            </div>
          </div>
        )}

        {/* Pagination Controls */}
        <motion.div // Wrap the pagination controls with motion.div
          initial={{ opacity: 0, x: -20 }} // Initial animation state
          animate={{ opacity: 1, x: 0 }} // Animation on component mount
          transition={{ duration: 0.5, delay: 1.1 }} // Animation duration and delay
        >
          <div>
            <button onClick={() => paginate(1)} disabled={currentPage === 1}>
              First
            </button>
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
              Prev
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
            <button onClick={() => paginate(totalPages)} disabled={currentPage === totalPages}>
              Last
            </button>
          </div>
        </motion.div>
      </Container>
    </motion.div>
  );
}
