import React, {useState, useEffect} from "react";
import Link from "next/link";
import styles from "./navStyle.module.scss";

interface IProps {
    children: React.ReactNode;
  }

export default function NavPage({children}: IProps){

    const [loggedInState, setloggedInState] = useState<boolean>(false)
    let userId;


    function fetchUserId(): boolean{
        userId = localStorage.getItem("tissuetracker-userId")
        if(userId != null){
            setloggedInState(true);
            return true;
        } else{ 
            setloggedInState(false);
            return false;
        }
    }

    function logout(){
        localStorage.removeItem("tissuetracker-userId");
        setloggedInState(false);
        
    }

    useEffect(() => {
        fetchUserId();
    }, [loggedInState]);

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

                { !loggedInState && <Link href={"/login"} passHref>
                    <a className={styles.navButton}>Login</a>
                </Link>}
                { loggedInState && <a onClick={logout} className={styles.navButton}>Logout</a>}
            </div>
            
            <div id="body">
                {children}
            </div>
        </div>
    );
}