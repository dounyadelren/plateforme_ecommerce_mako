import React, { useState } from "react";
import Nav from "../Home/Nav/Nav";
import "../../assets/css/pages.css";
import {
    Link, useNavigate
} from 'react-router-dom';
import Footer from "../Home/Footer/Footer";
import { Helmet } from "react-helmet"

const Account = () => {

    const navigate = useNavigate()

    const [account, setAccount] = useState();
    const [user, setUser] = useState([]);
    const [errorSubmit, setErrorSubmit] = useState('');

    const [fName, setfName] = useState('');
    const [lName, setlName] = useState('');
    const [phone, setPhone] = useState('');
    const [adress, setAdress] = useState('');
    const [postal, setPostal] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');


    let digitRegex = /^\d{5}$/
    let phoneRegex = /^((\+)33|0|0033)[1-9](\d{2}){4}$/g

    React.useEffect(() => {

        const loggedInUser = sessionStorage.getItem("email");
        const user = JSON.parse(sessionStorage.getItem("users"));

        if (loggedInUser) {
            setAccount(loggedInUser);
            setUser([user.Response]);

        } else {
            setAccount("");
            setUser("");
        }

    }, [])

    const getUser = () => {
        navigate('/password', { state: { user: user[0].roles[0] } });
    }

    const onChange = (event) => {
        event.preventDefault();
        if (fName === '' && lName === '' && phone === '' && adress === '' && postal === '' && city === '' && country === '') {
            setErrorSubmit("Vous devez modifier au moins une information!")
        } else if (postal.match(digitRegex) === null && phone.match(phoneRegex) === null) {
            setErrorSubmit("Votre numéro de téléphone ou votre code postal ne sont pas au bon format")
        } else {
            onSubmit(event);
        }
    }

    function onSubmit(event) {

        const form_data = new FormData();

        for (let key in event.target.elements) {
            if (event.target.elements[key].tagName === 'INPUT' && event.target.elements[key].value !== '') {
                form_data.append(event.target.elements[key].name, event.target.elements[key].value);
            }
        }

        const requestOptions = {
            method: 'POST',
            body: form_data
        }
        fetch('http://localhost:8000/users/update', requestOptions)
            .then(response => response.json())
            .then(async (response) => {
                if (response.Status === "OK") {
                    sessionStorage.setItem('users', JSON.stringify(response));
                    window.location.reload(true);
                }
            })
        return false;
    }
    return (
        <>
            <Helmet>
                <title>Profil</title>
                <meta name="profil" content="page de profil du site Mak'o" />
            </Helmet>
            <Nav />
            <div className="titlePages">
                <h2>Mes informations générales</h2>
            </div>
            <div className="bg-light">
                <div className="row">
                    <div className="col-md d-flex justify-content-start">
                        <nav>
                            {
                                user.map((user, i) => {
                                    return <ul className="sub_menu" key={i}>
                                        <li><h3 className="h6 p-4"><button onClick={getUser} className="btn btn-lg text-primary buttonStl">Modifier mon mot de passe</button></h3></li>
                                        {
                                            user.roles[0] === "ROLE_USER" ?
                                                <li><Link to="/user/order"><h3 className="h6 p-4"><button className="btn btn-lg text-primary buttonStl">Commandes</button></h3></Link></li>
                                                :
                                                ""
                                        }
                                    </ul>
                                })
                            }
                        </nav>
                    </div>
                    <div className="col-md d-flex justify-content-center p-2">
                        <form onSubmit={onChange} className="form-control border-0">
                            {user.map((user, index) =>
                                <ul key={index}>
                                    {
                                        user.roles[0] === "ROLE_SELLER" ?
                                            <>
                                                <li><label className="h5 m-3" forhtml="company">Nom de l'entreprise</label></li>
                                                <li className="liAccount"><input id="CompanyFarInput" type="text" name="company" className="form-control" placeholder={user.company} disabled /></li>
                                            </>
                                            :
                                            <>
                                                <li><label className="h5 m-3" forhtml="nom">Nom</label></li>
                                                <li className="liAccount"><input id="lastNameFarInput" type="text" name="nom" className="form-control" placeholder={user.lastName} onChange={e => setfName(e.target.value)} /></li>
                                                <li><label className="h5 m-3" forhtml="prenom">Prénom</label></li>
                                                <li className="liAccount"><input id="firstNameFarInput" type="text" name="prenom" className="form-control" placeholder={user.firstName} onChange={e => setlName(e.target.value)} /></li>
                                            </>
                                    }

                                    <li><label className="h5 m-3" forhtml="email">Adresse email</label></li>
                                    <li><input id="emailFarInput" type="text" name="email" className="form-control" disabled value={account} /></li>
                                    <li><label className="h5 m-3" forhtml="adresse">Adresse postale</label></li>
                                    <li className="liAccount"><input id="adresseFarInput" type="text" name="adresse" className="form-control" placeholder={user.adress} onChange={e => setAdress(e.target.value)} /></li>
                                    <li><label className="h5 m-3" forhtml="codePostal">Code postal</label></li>
                                    <li className="liAccount"><input id="codePostalFarInput" type="text" name="codePostal" className="form-control" placeholder={user.postalCode} onChange={e => setPostal(e.target.value)} /></li>
                                    <li><label className="h5 m-3" forhtml="ville">Ville</label></li>
                                    <li className="liAccount"><input id="villeFarInput" type="text" name="ville" className="form-control" placeholder={user.city} onChange={e => setCity(e.target.value)} /></li>
                                    <li><label className="h5 m-3" forhtml="pays">Pays</label></li>
                                    <li className="liAccount"><input id="paysFarInput" type="text" name="pays" className="form-control" placeholder={user.country} onChange={e => setCountry(e.target.value)} /></li>
                                    <li><label className="h5 m-3" forhtml="tel">Numéro de téléphone</label></li>
                                    <li className="liAccount"><input id="telFarInput" type="text" name="tel" className="form-control" placeholder={user.phone} onChange={e => setPhone(e.target.value)} /></li>
                                </ul>
                            )}
                            <input className="btn btn-warning form-control" type="submit" value="Send" id="send" />
                        </form>
                    </div>
                    <div className="col-md">
                    </div>
                    <div className="d-flex justify-content-center align-center" id="errorSubmit">{errorSubmit}</div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Account;