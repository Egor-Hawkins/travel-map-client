import React from "react";
import {NavLink} from "react-router-dom";
import "../css/Background.css";
import styles from "../css/Home.module.scss";
import Sidebar from "./Sidebar.js";

export default class Home extends React.Component {
    render() {
        return (
            <div className="Home">
                <Sidebar/>
                <div id="bg"/>
                <div className={styles.centered}>
                    <h1 className={styles.header}>Travel map</h1>
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
