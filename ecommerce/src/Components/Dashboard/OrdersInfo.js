import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import Nav from "../Home/Nav/Nav";
import Footer from "../Home/Footer/Footer";

const InfoOrders = () => {

    let { id } = useParams();
    let subId = id.replace("id=", "");

    const [commandes, setCommandes] = useState([])

    useEffect(() => {

        fetch(`http://127.0.0.1:8000/orders/${subId}`)
            .then(res => {
                return res.json()
            })
            .then(async (result) => {
                const data = result.Response
                setCommandes(data);
            })
            .catch(error => {
                console.log('error', error)
            });
    }, [subId])

    const status = (event) => {
        event.preventDefault();

        let form_data = new FormData();

        for (let key in event.target.elements) {
            if (['INPUT'].includes(event.target.elements[key].tagName) && event.target.elements[key].value !== '') {
                form_data.append(event.target.elements[key].name, event.target.elements[key].value);
            }
        }

        const requestOptions = {
            method: 'POST',
            body: form_data
        }

        fetch(`http://localhost:8000/orders/update/${commandes.id}`, requestOptions)
            .then(() => {
                console.log(res => res.json());
                window.location.reload(true);
            })
            .catch(error => {
                console.log('error', error)
            });
        return false;
    }

    return (
        <>
            <Nav />
            <div id="ordersInfoBlock">
                <h1 className="h4">Commandes numéro : {commandes.orderNumber}</h1>
                <div id="infoOrders" className="bg-light">
                    <div className="mt-4 mb-4">
                        <p className='text-dark'><b>Client:</b> {commandes.firstNameReceiver} {commandes.nameReceiver}</p>
                        {
                            commandes.purchases?.map((element, i) => (
                                <div key={i}>
                                    <p className='text-dark'><b>Article(s):</b> {element.article}</p>
                                    <p className='text-dark'><b>Prix:</b> {element.price}</p>
                                    <p className='text-dark'><b>Nombres d'articles:</b> {element.quantity}</p>
                                </div>
                            ))
                        }
                        <p className='text-dark'><b>Adresse de livraison:</b> {commandes.deliveryAdress} {commandes.deliveryPostalCode} {commandes.deliveryCity}, {commandes.deliveryCountry}</p>
                        <p className='text-dark'><b>Prix de livraison:</b> {commandes.deliveryPrice}</p>
                        <p className='text-dark'><b>Date d'expédition:</b> {commandes.expeditionDate}</p>
                        <p className='text-dark'><b>Date de livraison estimée:</b> {commandes.estimatedArrivalDate}</p>
                        <p className='text-dark'><b>Transport:</b> {commandes.transport?.types}</p>
                        {
                            commandes.status === "CANDELED" ?
                                <p className="text-dark">Status: <span className="text-danger">{commandes.status}</span></p>
                                :
                                <p className="text-dark">Status : <span className="text-warning">{commandes.status}</span></p>
                        }
                        <div className="d-flex flex-direction-row">
                            <form onSubmit={ status }>
                                <input type="hidden" name="status" value="SHIPPED" />
                                <input className="btn btn-info" type="submit" value="expedié" />
                            </form>
                            <form onSubmit={ status }>
                                <input type="hidden" name="status" value="DELIVRED" />
                                <input className="btn btn-info" type="submit" value="livré" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default InfoOrders;