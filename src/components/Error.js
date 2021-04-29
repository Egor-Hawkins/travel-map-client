import React from "react";
import "../css/Background.css";
import Sidebar from "./Sidebar.js";
import styles from "../css/Home.module.scss";

export default class Error extends React.Component {
    render() {
        return (
            <div className="Error">
                <Sidebar/>
                <div id="bg"/>
                <h1 className={styles.centered}>
                    Error: Page does not exist!
                </h1>
            </div>
        );
    }
}
