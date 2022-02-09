import React from "react";
import '../../assets/css/App.css';
import '../../assets/css/eco_livraison.css';
import Nav from "./Nav/Nav";
import Footer from "./Footer/Footer";
import Carroussel from "./Carroussel/Carroussel";
import velo from '../../assets/images/velo.png'
import voilier from '../../assets/images/voilier.png'
import oiseau from '../../assets/images/cigogne.png'
import { Helmet } from "react-helmet"

const EcoLivraison = () => {
    return (
        <>
            <Helmet>
                <title>Livraisons</title>
                <meta name="title" content="Mak'o la plateforme e-commerce verte à la livraison ecoresponsable" />
                <meta name="description" content="Bienvenue sur notre plateforme de vente Mak'o, nos livraisons sont vertes, ecoresponsables, non polluantes, un plus pour la planète" />
            </Helmet>
            <Nav />
            <section id="carroussel">
                <Carroussel />
            </section>
            <br></br>
            <div className="all">

                <h3 className="titre" id="titre">Mak'O, La livraison Eco-responsable</h3>
                <br></br>
                <div className="text_titre_un">
                    <p>La livraison écologique by MAK'O se définit comme un mode de livraison qui recourt
                        à des véhicules propres et non-polluants : vélo, voilier, oiseau, etc.
                        Respectueux de la nature, ce type de livraison
                        alternatif offre de nombreux avantages par rapport à une livraison classique.</p>
                </div>
                <br></br>
                <div className="txt_et_img">
                    <div className="contain">
                        <div>
                            <img className="img" src={velo} alt="velo" />
                        </div>
                        <div className="livraison">
                            <h4 className="titre">VEL'O</h4>
                            <br></br>
                            <p>Le vélo permet de rester neutre en émission de Co2, et l’équipe MAK'O
                                souhaite que ses clients en beneficient,
                                en proposant le velo comme moyen de livraions.
                                Un combat d’une génération consciente de l’urgence écologique.</p>
                        </div>
                    </div>
                    <div className="contain">
                        <div>
                            <img className="img" src={voilier} alt="voilier" />
                        </div>
                        <div className="livraison">
                            <h4 className="titre">VOILIER</h4>
                            <br></br>
                            <p>Le voilier cargo qui transporte vos produits sans polluer,
                                Pour importer des produits mondialisés tout en limitant ses émissions de CO2,
                                l’entreprise Mak'O a conçu un cargo à voiles capable de traverser Ocean et Mer.
                                En transportant vin, café et cacao dans une cale de 50 tonnes, elle prouve que la décarbonation
                                du commerce maritime est possible.
                            </p>
                        </div>
                    </div>
                    <div className="contain">
                        <div className="img">
                            <img className="img" src={oiseau} alt="oiseau" />
                        </div>
                        <div className="livraison">
                            <h4 className="titre">OISEAU</h4>
                            <br></br>
                            <p>L'oiseau va devenir le meilleur amis de l'Homme.
                                MAK'O ECXPLOITE LES ANIMAUX A DES FIN COMMERCIALS, ZERO RESPECT POUR CES JEUNES OISEAUX
                                MIGRATEUR, PERSONNE NE SE SOUCIS D'EUX !
                                AUTANT LES FAIRES BOSSER !
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default EcoLivraison;