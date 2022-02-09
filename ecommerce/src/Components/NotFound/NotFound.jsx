import React from "react";
import { Link } from "react-router-dom";
import styles from './NotFound.module.css';

const NotFound = () => {

    return (
        <div className="bg-primary">
            <h1 className="text-center text-light" style={{fontSize: "60px"}}>PAGE NOT FOUND</h1>
            <div className="d-flex justify-content-center">
                <span className="text-light" style={{fontSize: "40px", marginTop: "20%"}}>Désolé la page que vous recherchez n'existe pas!</span>
            </div>
            <div className="d-flex justify-content-center">
                <Link style={{fontSize: "20px", marginTop: "20%"}} className={`${styles.backHome}`} to="/">Retour à l'accueil</Link>
            </div>
            <div style={{height: "70px"}}></div>
        </div>
    )
}

export default NotFound;