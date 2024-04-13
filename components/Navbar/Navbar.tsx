import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Navbar.module.css";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";

export function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const address = useAddress();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={styles.navContainer}>
      <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.mobileMenuOpen : ""}`}>
        <div className={styles.navLeft}>
          <Link href="/">
            <div className={`${styles.homeLink} ${styles.navLeft}`}>
              <Image
                src="/logo.png"
                width={64}
                height={48}
                alt="NFT marketplace sample logo"
              />
            </div>
          </Link>
        </div>

        <div className={`${styles.navMiddle} ${isMobileMenuOpen ? styles.mobileMenuOpen : ""}`}>
          <Link href="/buy">
            <div className={styles.link}>BUY</div>
          </Link>
          <Link href="/sell">
            <div className={styles.link}>SELL</div>
          </Link>
          <Link href="https://daveynakamoto.lol/buy-sell-crypto/">
            <div className={styles.link}>DANA EXCHANGE</div>
          </Link>
          <Link href="https://daveynakamoto.lol/">
            <div className={styles.link}>MAIN WEBSITE</div>
          </Link>
          <a
            href="https://daveynakamoto.lol/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            NFT STAKING
          </a>
        </div>

        <div className={styles.navRight}>
          <div className={styles.navConnect}>
            <ConnectWallet theme="dark" btnTitle="Connect Wallet" />
          </div>
          {address && (
            <Link href={`/profile/${address}`}>
              <div className={styles.link}>
                <Image
                  className={styles.profileImage}
                  src="/user-icon.png"
                  width={42}
                  height={42}
                  alt="Profile"
                />
              </div>
            </Link>
          )}
        </div>

        <div className={styles.mobileMenuButton} onClick={toggleMobileMenu}>
          <div className={`${styles.menuIcon} ${isMobileMenuOpen ? styles.open : ""}`}>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
          </div>
        </div>
      </nav>
    </div>
  );
}
