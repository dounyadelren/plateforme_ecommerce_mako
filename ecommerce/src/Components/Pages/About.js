import React from "react";
import { Link } from "react-router-dom"
import Nav from "../Home/Nav/Nav";
import "../../assets/css/pages.css"
import Ecologique from '../../assets/images/ecologique.png';
import Dounya from '../../assets/images/dounya.png'
import Corentin from '../../assets/images/corentinAvatar.png'
import Leandre from '../../assets/images/leandreAvatar.png'
import Elyess from '../../assets/images/elyess.png'
import { Helmet } from "react-helmet"

const About = () => {
    return (
        <>
            <Helmet>
                <title>Qui sommes nous?</title>
                <meta name="title" content="Découvrez les développeurs du projet" />
                <meta name="description"
                    content="Nos développeurs ont publié leur profil LinkedIn, portfolio ou GitHub, n'hésitez pas à leur faire parvenir vos impressions et vos retours" />
            </Helmet>
            <Nav />
            <div className="titlePages">
                <h2>Qui sommes nous?</h2>
                <div className="container contentContact bg-light pt-5">
                    <div className="row firstRow">
                        <div className="col colOne">
                            <div className="card">
                                <img className="card-img-top" src={Dounya} alt="Bitmoji" />
                                <h4>Dounya</h4>
                                <hr />
                                <Link to="https://www.linkedin.com/in/dounya-derlen/"><span className="card-text">Linkedin</span></Link>
                                <hr />
                                <Link to="https://github.com/dounyadelren" className="mb-3"><span className="card-text">Portfolio</span></Link>
                            </div>
                        </div>
                        <div className="col colTwo">
                            <div className="card">
                                <img className="card-img-top" src={Corentin} alt="Bitmoji" />
                                <h4>Corentin</h4>
                                <hr />
                                <Link to="https://www.linkedin.com/in/corentinnordmann/"><span className="card-text">Linkedin</span></Link>
                                <hr />
                                <Link to="https://corentinnrd.github.io/CorentinNordmann/"><span className="card-text">Portfolio</span></Link>
                            </div>
                        </div>
                    </div>
                    <div className="row secondRow">
                        <div className="col colThree">
                            <div className="card">
                                <img className="card-img-top" src={Ecologique} alt="Bitmoji" />
                                <h4>Cédric</h4>
                                <hr />
                                <span className="card-text">Linkedin :</span>
                                <a href="...">lien linkedin</a>
                                <hr />
                                <span className="card-text">Portfolio :</span>
                                <a href="..." className="mb-3">lien portfolio</a>
                            </div>
                        </div>
                        <div className="col colFour">
                            <div className="card">
                                <img className="card-img-top" src={Leandre} alt="Bitmoji" />
                                <h4>Léandre</h4>
                                <hr />
                                <Link to="https://github.com/LeandreChrt" className="mb-3"><span className="card-text">Github</span></Link>
                            </div>
                        </div>
                    </div>
                    <div className="row  threeRow">
                        <div className="col colFive">
                            <div className="card">
                                <img className="card-img-top" src={Elyess} alt="Bitmoji" />
                                <h4>Elyess</h4>
                                <hr />
                                <Link to=" https://www.linkedin.com/in/elyess-rjafellah-111124223"><span className="card-text">Linkedin</span></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default About;