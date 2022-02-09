import React from "react";
import {
    Link
} from 'react-router-dom';
import styles from "../Footer/footer.module.css"
import Facebook from "../../../assets/images/facebook.png"
import Instagram from "../../../assets/images/instagram.png"
import Linkedin from "../../../assets/images/linkedin.png"
import Twitter from "../../../assets/images/twitter.png"

const Footer = () => {

    return (
        <>
            <footer className={`${styles.footer}`}>
                <div className={`${styles.footer1}`}>
                    <div className="d-flex justify-content-between">
                        <div className={`${styles.listFooter}`}>
                            <ul>
                                <h3 className={`${styles.title}`}>AGIR</h3>
                                <li><Link to="#">Le recyclage</Link></li>
                                <li><Link to="/eco_livraison">Pourquoi l'eco-Livraison</Link></li>
                                <li><Link to="#">Sauver la planète</Link></li>
                            </ul>
                        </div>
                        <div className={`${styles.listFooter}`}>
                            <ul>
                                <h3 className={`${styles.title}`}>PRESSE</h3>
                                <li><Link to="#">Ils parlent de nous</Link></li>
                            </ul>
                        </div>
                        <div className={`${styles.listFooter}`}>
                            <ul id={`${styles.listIcons}`}>
                                <h3 className={`${styles.title}`}>SUIVEZ-NOUS</h3>
                                <div className="d-flex">
                                    <li><Link to="#"><img className={`${styles.icon}`} src={Facebook} alt="Facebook logo" /></Link></li>
                                    <li><Link to="#"><img className={`${styles.icon}`} src={Twitter} alt="Twitter logo" /></Link></li>
                                    <li><Link to="#"><img className={`${styles.icon}`} src={Instagram} alt="Instagram logo" /></Link></li>
                                    <li><Link to="#"><img className={`${styles.icon}`} src={Linkedin} alt="Linkedin logo" /></Link></li>
                                </div>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={`${styles.footer2}`}>
                    <div className="col">
                        <ul className="d-flex justify-content-center">
                            <li className="p-2"><Link to="#" className="text-light">Nous contacter</Link></li>
                            <li className="p-2"><Link to="#" className="text-light">Mentions légales</Link></li>
                            <li clLinkssNLinkme="p-2"><Link to="#" className="text-light">Cookie et données personnelles</Link></li>
                            <li className="p-2"><Link to="#" className="text-light">CGU</Link></li>
                        </ul>
                    </div>
                </div>
            </footer>

        </>
    )
}

export default Footer;