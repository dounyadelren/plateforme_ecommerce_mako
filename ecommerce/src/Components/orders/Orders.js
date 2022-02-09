import React, { useState, useEffect } from "react";
import Nav from "../Home/Nav/Nav";
import Footer from "../Home/Footer/Footer";
import '../../assets/css/orders.css'
import Un from '../../assets/images/un.png'
import Deux from '../../assets/images/deux.png'
import Trois from '../../assets/images/trois.png'
import Quatre from '../../assets/images/quatre.png'
import Panier from '../../assets/images/panier_boutique.png'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import '../../assets/css/pages.css'
import { Link, useNavigate, useLocation } from "react-router-dom";
import { destroy } from 'cart-localstorage'

const Orders = () => {

    const navigate = useNavigate();
    const location = useLocation()
    const [articlePanier, setArticlePanier] = useState([])
    const [user, setUser] = useState([]);
    const [userAdress, setUserAdress] = useState('');
    const [emailUser, setEmailUser] = useState([]);
    const [deliveryAdress, setDeliveryAdress] = useState("")
    const [deliveryPostalCode, setDeliveryPostalCode] = useState("")
    const [deliveryCity, setDeliveryCity] = useState("")
    const [deliveryCountry, setDeliveryCountry] = useState("")
    const [userfName, setUserfName] = useState("")
    const [userlName, setUserlName] = useState("")
    const [error, setError] = useState("")
    const [deliveryTypes, setDeliveryTypes] = useState([])
    const defaultAdress = document.getElementById("defaultAdress");
    const newAdress = document.getElementById('newAdress')
    // const [totalDeliveryCart, setTotalDeliveryCart] = useState(0);

    useEffect(() => {
        const articleLocal = location.state.articlePanier
        setArticlePanier(articleLocal)
    }, [location.state.articlePanier])

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("users"));
        const userEmail = sessionStorage.getItem("email");
        setEmailUser(userEmail);
        setUser([user.Response]);
        setUserAdress(user.Response.adress)
    }, [])

    useEffect(() => {
        fetch('http://localhost:8000/orders/deliveryTypes')
            .then(response => response.json())
            .then(types => {
                setDeliveryTypes(types.Response)
            })
    }, [])

    const onChange = () => {
        if (defaultAdress.checked === false && userfName === '' && userlName === '' && deliveryAdress === '' && deliveryPostalCode === '' && deliveryCountry === '' && deliveryCity === '') {
            setError("Vous devez entièrement remplir le formulaire afin de compléter votre commande")
        }
    }

    function onSubmit(event) {
        onChange()
        event.preventDefault()
        const form_data = new FormData()
        form_data.append("cart", JSON.stringify(arrayObj));
        form_data.append("emailUser", emailUser);
        if (defaultAdress.checked === true && newAdress.checked === false) {
            form_data.append('adress', defaultAdress.value);
        } else if (defaultAdress.checked === false && newAdress.checked === true) {
            for (let key in event.target.elements) {
                if (event.target.elements[key].tagName === 'INPUT' && event.target.elements[key].type !== 'radio' && event.target.elements[key].value !== '') {
                    form_data.append(event.target.elements[key].name, event.target.elements[key].value);
                }
            }
        }
        let delivery = event.target.elements.delivery.value.split('/')
        form_data.append('deliveryPrice', delivery[1]);
        form_data.append('deliveryType', delivery[0]);

        const requestOptions = {
            method: 'POST',
            body: form_data
        }
        fetch('http://localhost:8000/orders/create', requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                navigate('/user/order', { state: { message: 'Merci pour votre commande' } })
            })
            .catch(error => {
                console.log('error', error)
            });
        return false;
    }

    let array = [];
    let totalDelivery = [];

    let arrayObj = [];

    const articleFinal = articlePanier?.map((element, i) => {

        let quantity = element.quantity;
        let quantityObj = element.quantity
        let name = element.name;
        let price = element.price;
        let id = element.id;

        const priceNbrArticle = quantity *= parseFloat(price.substr(0, price.length - 1));
        array.push(priceNbrArticle)
        const deliveryNbrArticle = quantity * parseFloat(element.deliveryPrice.substr(0, element.deliveryPrice.length - 1));
        totalDelivery.push(deliveryNbrArticle / 100)
        arrayObj.push({ id, name, priceNbrArticle, quantityObj })

        return <tr key={i}>
            <td><p>{element.name}</p></td>
            <td><p>qté: {element.quantity}</p></td>
            <td><p>Prix : {element.price}</p></td>
            <td><p>Prix total : {Math.round(priceNbrArticle * 100) / 100}€</p></td>
        </tr>
    })

    const totalPrice = array.filter(x => x > 0).reduce((x, y) => x + y, 0)
    const resTotalPrice = Math.round(totalPrice * 100) / 100
    const sumDelivery = Math.round(totalDelivery.filter(x => x > 0).reduce((x, y) => x + y, 0) * 100) / 100

    return (
        <>
            <Nav />
            <h2 className="titlePages">Finalisez votre commande</h2>
            <form action="" onSubmit={onSubmit} className="grid">
                <div className="blockRecap">
                    <img className="panier" src={Panier} alt="panier boutique" />
                    <table className="table">
                        <thead>
                            <tr className="d-flex justify-content-center mt-5">
                                <td><h3 id="thRecap"><img className="step" src={Un} alt="stepone" />Récapulatif de votre commande</h3></td>
                            </tr>
                        </thead>
                        <tbody id="recapArticle" className="mb-5">
                            {articleFinal}
                        </tbody>
                        <tfoot id="blockTotalCart">
                            <tr className="h4 text-dark" id="totalCart"><td>Total du panier : <strong>{resTotalPrice}€</strong></td></tr>
                        </tfoot>
                    </table>
                </div>
                <div className="blockAdress">
                    <h3 className="titleOrder"><img className="step" src={Deux} alt="steptwo" />Choisissez une adresse</h3>
                    <h4>Adresse par défaut</h4>
                    <>
                        {
                            userAdress !== null ?
                                <div>
                                    <input id="defaultAdress" className="mr-2" type="radio" defaultChecked name="adress" value="defaut" />
                                    <label htmlFor="defaultAdress">
                                        {user?.map((user, index) => {
                                            return <div key={index}>
                                                <h6>{user.firstName} {user.lastName} {user.adress} {user.postalCode} {user.city} {user.country}</h6>
                                            </div>
                                        })}
                                    </label>
                                </div>
                                :
                                <h6 className="text-muted">Veuillez renseigner une adresse par défaut sur la page <Link to="/account">profil</Link></h6>
                        }
                    </>
                    <br />
                    <h4>Nouvelle adresse</h4>
                    <label htmlFor="newAdress">
                        <input id="newAdress" type="radio" name="adress" value="new_adress" />
                        <input type="text" name="name" placeholder="Prénom" onChange={e => setUserfName(e.target.value)} />
                        <input type="text" name="lastname" placeholder="Nom" onChange={e => setUserlName(e.target.value)} />
                        <input type="text" name="deliveryAdress" placeholder="Adresse" onChange={e => setDeliveryAdress(e.target.value)} />
                        <input type="text" name="deliveryPostalCode" placeholder="Code postal" onChange={e => setDeliveryPostalCode(e.target.value)} />
                        <input type="text" name="deliveryCity" placeholder="Ville" onChange={e => setDeliveryCity(e.target.value)} />
                        <input type="text" name="deliveryCountry" placeholder="Pays" onChange={e => setDeliveryCountry(e.target.value)} />
                    </label>
                </div>
                <div className="blockDelivery">
                    <h3 className="titleOrder"><img className="step" src={Trois} alt="stepthree" />Choisissez un moyen de livraison</h3>
                    {deliveryTypes.map((dType, index) => {
                        return <div key={index}>
                            {/* onChange={(e) => { setTotalDeliveryCart(dType.price * (sumDelivery) + resTotalPrice)}} */}
                            <input type="radio" name="delivery" id="delivery" value={dType.types + '/' + (dType.price * (sumDelivery))}/>
                            <label className="text-dark" forhtml="delivery" >{dType.types} : {Math.round(dType.price * sumDelivery * 100) / 100}€ *</label>
                        </div>
                    })}
                    <p className="text-muted">* Si la commande contient un meuble, la livraison aérienne n'est pas disponible</p>
                </div>
                <div className="blockPaypal">
                    <h3 id="titlePaypal"><img className="step" src={Quatre} alt="stepfor" />Paiement</h3>
                    <div style={{ width: "200px" }}>
                        <PayPalScriptProvider options={{ "client-id": "Ac3A_q-9N4TPbVx9P6K3g81fIzgc-oXsAVLBmIPrFmzm--lwF_Xrzk8RYwjSP3YUU_I6m050clAvx30p", currency: "EUR" }}>
                            <PayPalButtons
                                style={{
                                    layout: 'horizontal',
                                    color: 'black',
                                    shape: 'pill',
                                    label: 'paypal',
                                    tagline: 'false',
                                    height: 40,
                                }}
                                createOrder={(data, actions) => {
                                    return actions.order.create({
                                        purchase_units: [
                                            {
                                                amount: {
                                                    value: resTotalPrice
                                                },
                                            }
                                        ],
                                        application_context: {
                                            shipping_preference: "NO_SHIPPING"
                                        }
                                    });
                                }}
                                onApprove={(data, actions) => {
                                    return actions.order.capture().then((details) => {
                                        document.getElementById('btnSubmit').click();
                                        destroy()
                                    });
                                }}
                            />
                        </PayPalScriptProvider>
                    </div>
                </div>
                <div className="btnCommand" style={{ visibility: "hidden" }}>
                    <button type="submit" id="btnSubmit" className="btn btn-success btn-lg">Valider ma commande</button>
                </div>
                <div className="d-flex justify-content-center align-center text-danger" id="errorSubmit">{error}</div>
            </form >
            <Footer />
        </>
    )
}

export default Orders;