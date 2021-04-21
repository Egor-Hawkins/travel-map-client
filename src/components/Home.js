import React from "react";
import {NavLink} from "react-router-dom";
import "../css/Background.css";
import styles from "../css/Home.module.scss";

export default class Home extends React.Component {
    render() {
        return (
            <div className="Home">
                <div id="bg"/>
                <div className={styles.centered}>
                    <h1>Travel map</h1>
                    <div className={styles.loginLinkContainer}>
                        <NavLink className={styles.link} to="/login">
                            <button className={styles.loginBtn}>
                                Login
                            </button>
                        </NavLink>
                    </div>
                    <NavLink className={styles.link} to="/registration">
                        <button className={styles.registerBtn}>
                            Register
                        </button>
                    </NavLink>
                </div>
            </div>
        );
    }
}
