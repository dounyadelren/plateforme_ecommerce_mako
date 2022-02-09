import React from "react";
import '../../assets/css/App.css';
import Nav from "./Nav/Nav";
import Footer from "./Footer/Footer";
import RandomArticles from './RandomArticles/RandomArticles';
import Carroussel from "./Carroussel/Carroussel";
import Schema from '../../assets/images/schema.png'
import New from "./News/New";
import Lampe from '../../assets/images/lampe.png'
import { Helmet } from "react-helmet"

const Home = () => {
    return (
        <>
            <Helmet>
                <title>Mak'o</title>
                <meta name="title" content="Mak'o la plateforme e-commerce verte à la livraison ecoresponsable" />
                <meta name="description"
                    content="Bienvenue sur notre plateforme de vente Mak'o, venez acheter, vendre, des produits issus du commerce équitable, ecoresponsable, dont la production a été controllée ou certifiée commerce vert!" />
            </Helmet>
            <Nav />
            <section id="carroussel">
                <Carroussel />
            </section>
            <New />
            <RandomArticles />
            <div className="d-flex justify-content-evenly align-items-center mt-4">
                <img id="schema" src={Schema} alt="schema" />
                <div className="presentation bg-light">
                    <h3 className="titre">Mak'O, kesako?<img src={Lampe} alt="lampe" style={{ width: 50, height: 50, verticalAlign: "sub", marginLeft: 5 }} /></h3><br></br>
                    <h4 className="text-center">Une vraie alternative écologique à vos besoins</h4>
                    <p>Développé dans le but d'avoir une emprunte carbone quasi nulle,
                        Mak'O garanti que la production, manufaction,
                        livraison de ses produits se fait dans le respect de notre environnement</p>
                    <h4 className="text-center">Comment le garantir?</h4>
                    <p>Nous avons pensé à tout les détails possibles,
                        nos usines sont certifiées développement durable,
                        nos fournisseurs sont des petits commerçants issus de l'Union Européenne auxquels nous versons une part juste et équitable du bénéfice de chaque vente</p>
                    <h4 className="text-center">Vous êtes un commerçant?</h4>
                    <p>Publier vos articles et produits,
                        sous tenue qu'ils respectent notre étique,
                        Mak'O ajoutera une nouvelle plateforme de vente à votre entreprise et la visibilité qui va avec.</p>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Home;