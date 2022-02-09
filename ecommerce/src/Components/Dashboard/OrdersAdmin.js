import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../../assets/css/dashboard.css';

const OrdersAdmin = () => {

    const [commandes, setCommandes] = useState([])

    useEffect(() => {

        fetch(`http://127.0.0.1:8000/orders`)
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
    }, [])

    return (
        <>
            <h1 className="text-dark">Commandes du site</h1>
            <div id="blockOrdersDashboard" className="text-start col text-start border">
                <br />
                {
                    commandes.map((element, i) => (
                        <table className="table-hover" key={i}>
                            <thead>
                                <tr>
                                    <th><span className='text-dark p-2'>Commandes n* :</span></th>
                                    <th><span className="text-dark p-2">Adresse :</span></th>
                                    <th><span className="text-dark p-2">Frais de port :</span></th>
                                    <th><span className="text-dark p-2">Expédition :</span></th>
                                    <th><span className="text-dark p-2">Livraison estimée :</span></th>
                                    <th><span className="text-dark p-2">Status :</span></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th><span className="p-2"><b>{element.orderNumber}</b></span></th>
                                    <th><span className="p-2">{element.deliveryAdress} {element.deliveryPostalCode} {element.deliveryCity}, {element.deliveryCountry}</span></th>
                                    <th><span className="p-2">{element.deliveryPrice}</span></th>
                                    <th><span className="p-2">{element.expeditionDate}</span></th>
                                    <th><span className="p-2">{element.estimatedArrivalDate}</span></th>
                                    {
                                        element.status === "CANDELED" ?
                                            <th><span className="text-danger p-2">{element.status}</span></th>
                                            :
                                            <th><span className="text-warning p-2">{element.status}</span></th>
                                    }
                                    <th><Link to={{ pathname: `/admin/orders/id=${element.id}` }}><li>Voir</li></Link></th>
                                </tr>
                            </tbody>
                        </table>
                    ))
                }
            </div>
        </>
    )

}

export default OrdersAdmin;