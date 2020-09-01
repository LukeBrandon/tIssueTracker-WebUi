import React from "react";
import styles from "./index.module.css";
import NavPage from "../layouts/navPage";

export default function HomePage() {

  return(
    <div className={styles.application}>
      <NavPage>
        <p>Welcome to tIssue Tracker, made by Luke Brandon during the COVID-19 Pandemic.  This project is far from complete but was enought to keep me busy for a couple of weeks. Feel free to sign up and create a board and test out the app, however I recommmend <b>using a made up email and password.</b></p>
        <br/>
        <p>The name of this project is a joke that stemmed from the toilet paper (tissue) shortage at the start of the Covid-19 Pandemic.</p>
      </NavPage>
    </div>
  );
}