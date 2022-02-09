import React, { useState, useEffect, useRef } from 'react'
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Nav from '../Home/Nav/Nav'
import Footer from '../Home/Footer/Footer'
import "../../assets/css/pages.css";
import {
    Link,
    useLocation,
    useNavigate
} from 'react-router-dom';

const Commandes = () => {

    const location = useLocation()
    const navigate = useNavigate()
    const user = JSON.parse(sessionStorage.getItem('users'))
    const userId = user.Response.id;

    const [commandes, setCommandes] = useState([])

    useEffect(() => {

        fetch(`http://127.0.0.1:8000/orders/users/${userId}`)
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
    }, [userId])

    const status = (event, id) => {
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

        fetch(`http://localhost:8000/orders/update/${id}`, requestOptions)
            .then(() => {
                window.location.reload(true);
            })
            .catch(error => {
                console.log('error', error)
            });
        return false;
    }

    const inputRef = useRef(null);
    const printDocument = () => {
        html2canvas(inputRef.current).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            var imgWidth = (canvas.width * 60) / 440;
            var imgHeight = (canvas.height * 70) / 440;
            const pdf = new jsPDF('p', 'mm', 'a4');
            pdf.text("Facture Mak'o", 10, 10)
            pdf.addImage(imgData, "JPEG", 10, 15, imgWidth, imgHeight);
            window.open(pdf.output('bloburl'))
        });
    }

    const getUser = () => {
        navigate('/password', { state: { user: user.Response.roles[0] } });
    }

    return (
        <>
            <Nav />
            <div className="titlePages">
                <h2>Commandes</h2>
                <h4 id='messageValidated'>{location?.state?.message}</h4>
            </div>
            <div className="bg-light">
                <div className="row">
                    <div className="col-md d-flex justify-content-start sub_menu" id='orderSubMenu'>
                        <nav>
                            <ul className="sub_menu">
                                <Link to="/account"><li><h3 className="h6 p-4"><button className="btn btn-lg text-primary buttonStl">Mes informations générales</button></h3></li></Link>
                                <li><h3 className="h6 p-4"><button onClick={getUser} className="btn btn-lg text-primary buttonStl">Modifier mon mot de passe</button></h3></li>
                            </ul>
                        </nav>
                    </div>
                    <div className="col-md" id='gridOrders'>
                        {
                            commandes.length > 0 ?
                            commandes?.map((element, i) => (
                                <div className="card m-2 border-0 border-bottom p-2 mt-3" key={i}>
                                    <div id="divToPrint" ref={inputRef}>
                                        <h3 className='h4 text-dark'>Commande numéro: <b>{element.orderNumber}</b></h3>
                                        <span className='text-dark'><b>Client:</b> {element.firstNameReceiver} {element.nameReceiver}</span>
                                        <hr />
                                        {
                                            element.purchases.map((element, i) => (
                                                <div key={i}>
                                                    <span className='text-dark'><b>Article(s):</b> {element.article} x {element.quantity} </span>
                                                    <br />
                                                    <span className='text-dark'><b>Prix:</b> {element.price}</span>
                                                    <hr />
                                                </div>
                                            ))
                                        }
                                        <span className='text-dark'><b>Adresse de livraison:</b> {element.deliveryAdress}
                                            <br />
                                            {element.deliveryPostalCode} {element.deliveryCity}, {element.deliveryCountry}</span>
                                        <br />
                                        <span className='text-dark'><b>Prix de livraison:</b> {element.deliveryPrice}</span>
                                        <br />
                                        <span className='text-dark'><b>Date d'expédition:</b> {element.expeditionDate}</span>
                                    </div>
                                    <br />
                                    <span className='text-dark'><b>Date de livraison estimée:</b> {element.estimatedArrivalDate}</span>
                                    <br />
                                    <span className='text-dark'><b>Statut:</b> {element.status}</span>
                                    {
                                        element.status === "CANCELED" || element.status === "SHIPPED" || element.status === "DELIVRED" ?
                                            ""
                                            :
                                            <form onSubmit={(e) => { status(e, element.id) }}>
                                                <input type="hidden" name="status" value="CANCELED" />
                                                <button className='btn btn-warning w-100 mt-2' type="submit">Annuler</button>
                                            </form>
                                    }
                                    <button className="btn btn-info mt-2" onClick={printDocument}>Télécharger la facture</button>
                                </div>
                            ))
                            :
                            <h4 className="text-center mt-5 text-warning">Pas de commandes en cours</h4>
                        }
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
export default Commandes
