import React from "react";
import Link from "next/link";
import styles from "./navStyle.module.scss";

interface IProps {
    children: React.ReactNode;
  }

export default function NavPage({children}: IProps){
    return (
        <div className={styles.root}>
            <div className={styles.navBar}>
                <h1>Tissue Tracker</h1>
            
                <Link href={"/"} passHref>
                    <a className={styles.navButton}>Home</a>
                </Link>
                <Link href={"/dashboard"} passHref>
                    <a className={styles.navButton}>Dashboard</a>
                </Link>      
                <Link href={"/profile"} passHref>
                    <a className={styles.navButton}>Profile</a>
                </Link>
            </div>
            
            <div id="body">
                {children}
            </div>
        </div>
    );
}