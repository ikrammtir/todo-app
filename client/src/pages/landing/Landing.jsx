import React from "react";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import landing from "../../assets/landing.png";
import styles from "./Landing.module.css";

function Landing() {
  return (
    <div>
      <Navbar active={"home"}/>

      <div className={styles.landing_wrapper}>
        <div className={styles.landing_text}>
          <h1>Schedule Your Daily Tasks</h1>
<div className='btnWrapper'>
          <Link to="/register" className="primaryBtn">Register</Link>
          <Link to="/login" className="secondaryBtn">Login</Link>
        </div>
        </div>

        <div className={styles.landingImage}>
          <img src={landing} alt="landing" />
        </div>
      </div>
    </div>
  );
}

export default Landing;