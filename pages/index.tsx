import React from "react";
import styles from "./index.module.css";
import NavPage from "../layouts/navPage";

export default function HomePage() {

  return(
    <div className={styles.application}>
      <NavPage>
        <p>Welcome to tIssue Tracker, made by Luke Brandon during the COVID-19 Pandemic.</p>
      </NavPage>
    </div>
  );
}