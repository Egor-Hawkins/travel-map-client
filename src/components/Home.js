import React from "react";
import {NavLink} from "react-router-dom";
import "../css/Background.css";
import styles from "../css/Home.module.css";

export default class Home extends React.Component {
    render() {
        return (
            <div className="Home">
                <div id="bg"/>
                <div className={styles.menu}>
                    Nu tupa travel map ebat<br/><br/>
                    <NavLink to="/map" className={styles.link}>Map</NavLink><br/><br/>
                    <NavLink to="/registration" className={styles.link}>Register</NavLink><br/><br/>
                    <NavLink to="/login" className={styles.link}>Login</NavLink><br/><br/>
                    <NavLink to="/logout" className={styles.link}>Logout</NavLink><br/><br/>
                </div>
            </div>
        );
    }
}
