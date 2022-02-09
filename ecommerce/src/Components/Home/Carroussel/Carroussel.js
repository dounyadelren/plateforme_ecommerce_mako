import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Banniere0 from '../../../assets/images/promo-pub.png'
import Banniere1 from "../../../assets/images/mako-banniere.png"
import Banniere2 from "../../../assets/images/cafe-pub.png"
import Banniere3 from "../../../assets/images/smart-trash.png"
import Banniere4 from "../../../assets/images/the-pub.jpg"
import "../../../assets/css/App.css";

const Carroussel = () => {
    return (
        <>
            <div style={{ display: 'flex', flexDirection: "column", alignContent: "center", width: "80%" }}>
                <Carousel nextIcon={<i className="fas fa-caret-right flecheDroite"></i>} prevIcon={<i className="fas fa-caret-left flecheGauche"></i>}>
                    <Carousel.Item interval={4000}>
                        <img
                            className="d-block w-100"
                            src={Banniere0}
                            alt="baniere zero"
                        />
                    </Carousel.Item>
                    <Carousel.Item interval={4000}>
                        <img
                            className="d-block w-100"
                            src={Banniere1}
                            alt="baniere une"
                        />
                    </Carousel.Item>
                    <Carousel.Item interval={4000}>
                        <img
                            className="d-block w-100"
                            src={Banniere2}
                            alt="baniere deux"
                        />
                    </Carousel.Item>
                    <Carousel.Item interval={4000}>
                        <img
                            className="d-block w-100"
                            src={Banniere3}
                            alt="baniere trois"
                        />
                    </Carousel.Item>
                    <Carousel.Item interval={4000}>
                        <img
                            className="d-block w-100"
                            src={Banniere4}
                            alt="baniere quatre"
                        />
                    </Carousel.Item>
                </Carousel>
            </div>
        </>
    )
}

export default Carroussel;