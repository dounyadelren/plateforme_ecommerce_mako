import React, { useState, useEffect } from "react";
import { remove, destroy, quantity } from 'cart-localstorage'
import Nav from "../Home/Nav/Nav";
import Footer from "../Home/Footer/Footer";
import '../../assets/css/panier.css';
import { Link, useNavigate } from 'react-router-dom';

const Panier = () => {

    const [articlePanier, setArticlePanier] = useState([])
    const navigate = useNavigate()
    const [testSwitch, setTestSwitch] = useState(true)

    useEffect(() => {
        const articleLocal = localStorage.getItem('__cart');
        setArticlePanier(JSON.parse(articleLocal));
    }, [testSwitch])

    const removeArticle = (id) => {
        remove(id)
        window.location.reload(true);
    }

    const destroyCart = () => {
        destroy()
        window.location.reload(true);
    }

    let array = [];


    const articleFinal = articlePanier?.map((element, i) => {

        const moreQuantity = () => {
            quantity(element.id, 1)
            setTestSwitch(!testSwitch)
        }

        const lessQuantity = () => {
            quantity(element.id, -1)
            setTestSwitch(!testSwitch)
        }

        let number = element.quantity;
        let price = element.price;
        const priceNbrArticle = number *= parseFloat(price.substr(0, price.length - 1));
        array.push(priceNbrArticle)

        return <tbody key={i}>
            <tr id="trPanier">
                <td><Link to={{ pathname: `/article/id=${element.id}` }}><img id="imgPanier" src={`/uploads/${element.images[0]}`} alt="article" /></Link></td>
                <td><br /><Link to={{ pathname: `/article/id=${element.id}` }}><div id="test"><span id="titleArticle">{element.name}</span></div></Link></td>
                <td><button className="btn btn-success" style={{ width: "40px", height: "40px", borderRadius: "50%", marginTop: "75px" }} onClick={(e) => lessQuantity()}>-</button></td>
                <td><br /><p>qté:</p></td>
                <td><br /><p>{element.quantity}</p></td>
                <td><button className="btn btn-success" style={{ width: "40px", height: "40px", borderRadius: "50%", marginTop: "75px" }} onClick={(e) => moreQuantity()}>+</button></td>
                <td><br /><p>Prix:</p></td>
                <td><br /><p>{element.price}</p></td>
                <td><br /><p>Total:</p></td>
                <td><br /><p>{Math.round(priceNbrArticle * 100) / 100}€</p></td>
                <td><button id="deleteArticle" className="btn btn-danger" style={{ marginTop: "80px" }} onClick={() => removeArticle(element.id)}><i className="fas fa-times"></i></button></td>
            </tr>
        </tbody>
    })

    const totalPrice = array.filter(x => x > 0).reduce((x, y) => x + y, 0)
    const resTotalPrice = Math.round(totalPrice * 100) / 100

    const validated = () => {
        navigate('/panier/orders', { state: { resTotalPrice, articlePanier } });
    }

    return (
        <>
            <Nav />
            <div className="titlePages">
                <h2>Panier</h2>
            </div>
            {
                resTotalPrice ?
                    <div id="panier" className="bg-light pt-2 pb-2">
                        <div className="row">
                            <div className="col">
                                <div className="blockPanier">
                                    <table className="table m-2">
                                        <thead>
                                            <tr>
                                                <th scope="col"></th>
                                            </tr>
                                        </thead>
                                        {articleFinal}
                                    </table>
                                </div>
                                <button className="btn btn-danger" id="btnDestroy" onClick={() => destroyCart()}>Vider mon panier</button>
                            </div>
                            <div className="col">
                                <div id="blockPrice">
                                    <h3>Total du panier : {resTotalPrice}€</h3>
                                    <form action="">
                                        <input type="checkbox" value="gift" name="gift" id="gift" />
                                        <label htmlFor="gift" className="text-dark">Souhaitez vous un tissu cadeau*? * *</label>
                                        <p className="text-muted">* tissu réutilisable</p>
                                        <p className="text-muted">* * non disponible pour les objets volumineux</p><br />
                                        <button className="btn btn-success" onClick={validated}>Valider mon panier</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div id="emptyCart">
                        <h3 className="text-dark">Votre panier est vide</h3>
                    </div>
            }
            <Footer />
        </>
    )

}

export default Panier;