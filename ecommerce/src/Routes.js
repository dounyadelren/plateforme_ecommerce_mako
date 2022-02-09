import React, { useState, useEffect } from "react";
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";
import './assets/css/App.css';
import './assets/css/bootstrap-minty.min.css';
import Connexion from './Components/Connexion/Connexion'
import Inscription from './Components/Inscription/Inscription';
import Home from './Components/Home/Home';
import Contact from "./Components/Pages/Contact";
import About from "./Components/Pages/About";
import Help from "./Components/Pages/Help";
import Account from "./Components/Pages/Account";
import Password from "./Components/Pages/Password";
import Article from './Components/Articles/Article';
import Articles from './Components/Articles/Articles';
import NotFound from './Components/NotFound/NotFound';
import Top from './Components/Top/Top';
import Dashboard from "./Components/Dashboard/Dashboard";
import UpdateArticle from "./Components/Dashboard/UpdateArticles";
import SearchPage from "./Components/Pages/SearchPage/SearchPage";
import Panier from "./Components/Panier/Panier";
import Orders from "./Components/orders/Orders";
import InscriptionVendeur from "./Components/Inscription/InscriptionVendeur";
import Commandes from "./Components/Pages/Commandes";
import OrdersInfo from "./Components/Dashboard/OrdersInfo";
import EcoLivraison from './Components/Home/EcoLivraison';
import ForgotPassword from "./Components/Connexion/ForgotPassword";

const Path = () => {

    const [connected, setConnected] = useState(false);
    const [admin, setAdmin] = useState(false);
    const [seller, setSeller] = useState(false);

    useEffect(() => {

        const loggedInUser = sessionStorage.getItem("email");
        if (loggedInUser) {
            setConnected(true);
        } else {
            setConnected(false);
        }
    }, [])

    useEffect(() => {
        const userInfo = JSON.parse(sessionStorage.getItem("users"));
        const roleUser = userInfo?.Response.roles[0];
        if (roleUser === "ROLE_ADMIN") {
            setAdmin(true);
        } else if (roleUser === "ROLE_SELLER") {
            setSeller(true)
        }
    }, [])

    return (
        <BrowserRouter>
            <Top />
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/article/:id" element={<Article />} />
                <Route path="/articles/:mainTag" element={<Articles />} />
                <Route path="/help" element={<Help />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/eco_livraison" element={<EcoLivraison />} />
                <Route path="/forgot_password" element={<ForgotPassword />} />
                {
                    connected ?
                        <>
                            <Route path="/login" element={<Home />} />
                            <Route path="/register" element={<Home />} />
                            <Route path="/account" element={<Account />} />
                            <Route path="/password" element={<Password />} />
                            <Route path="/user/order" element={< Commandes />} />
                            {
                                admin === true || seller === true ?
                                    <>
                                        <Route path="/panier" element={<Home />} />
                                        <Route path="/panier/orders" element={<Home />} />
                                        <Route path="/dashboard" element={<Dashboard />} />
                                        {
                                            admin === true ?
                                                <Route path="/admin/orders/:id" element={<OrdersInfo />} />
                                                :
                                                <Route path="/admin/orders/:id" element={<Home />} />
                                        }
                                        {
                                            seller === true ?
                                                <Route path="/update/article/:id" element={<UpdateArticle />} />
                                                :
                                                <Route path="/update/article/:id" element={<Home />} />
                                        }
                                    </>
                                    :
                                    <>
                                        <Route path="/panier" element={<Panier />} />
                                        <Route path="/panier/orders" element={<Orders />} />
                                        <Route path="/dashboard" element={<Home />} />
                                    </>
                            }
                        </>
                        :
                        <>
                            <Route path="/login" element={<Connexion />} />
                            <Route path="/register" element={<Inscription />} />
                            <Route path="/panier" element={<Connexion />} />
                            <Route path="/panier/orders" element={<Connexion />} />
                            <Route path="/register/vendor" element={<InscriptionVendeur />} />
                        </>
                }
            </Routes>
        </BrowserRouter>
    )

}

export default Path;