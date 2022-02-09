import React, { useState, useEffect } from "react";
import Nav from "../Home/Nav/Nav";
import Footer from "../Home/Footer/Footer";
import DashboardArticle from './DashboardArticle';
import OrdersAdmin from './OrdersAdmin';
import Modal from 'react-modal';
import '../../assets/css/dashboard.css';

const Create = () => {

    const [nameMainTag, setNameMainTag] = useState('');
    const [nameArticle, setNameArticle] = useState('');
    const [priceArticle, setPriceArticle] = useState('');
    const [deliveryPriceArticle, setDeliveryPriceArticle] = useState('');
    const [descArticle, setDescArticle] = useState('');
    const [imageArticle, setImageArticle] = useState('');
    const [errorSubmit, setErrorSubmit] = useState('');
    const user = JSON.parse(sessionStorage.getItem("users"));
    const [adminRoles, setAdminRoles] = useState([]);
    const [emailCreator, setEmailCreator] = useState('')
    const [modalIsOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setEmailCreator(user.Response.email)
        if (user.Response.roles[0] === "ROLE_ADMIN") {
            setAdminRoles(user?.Response.roles[0])
        }
    }, [user])

    const onChange = (event) => {
        console.log(event.target.elements.price);
        event.preventDefault();
        if (descArticle === '') {
            setErrorSubmit("Vous devez entrer une description!")
            setTimeout(() => { setErrorSubmit('') }, 2000)
        } else {
            if (nameArticle === '') {
                setErrorSubmit("Vous devez entrée un nom d'article!")
                setTimeout(() => { setErrorSubmit('') }, 2000)
            } else {
                if (priceArticle === '') {
                    setErrorSubmit("Vous devez entrer un prix d'article!")
                    setTimeout(() => { setErrorSubmit('') }, 2000)
                } else {
                    if (nameMainTag === '') {
                        setErrorSubmit("Veuillez entrer un main tag")
                        setTimeout(() => { setErrorSubmit('') }, 2000)
                    } else {
                        if (imageArticle === '') {
                            setErrorSubmit("Vous devez choisir au moins une image!")
                            setTimeout(() => { setErrorSubmit('') }, 2000)
                        } else {
                            if (deliveryPriceArticle === '') {
                                setErrorSubmit("Vous devez entrer un prix d'achat!")
                                setTimeout(() => { setErrorSubmit('') }, 2000)
                            } else {
                                onSubmit(event)
                            }
                        }
                    }
                }
            }
        }
    }

    function onSubmit(event) {
        event.preventDefault();

        let form_data = new FormData();

        for (let key in event.target.elements) {
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.elements[key].tagName) && event.target.elements[key].value !== '') {
                if (event.target.elements[key].type === 'file') {
                    Array.from(event.target.elements[key].files).forEach(element => {
                        form_data.append(event.target.elements[key].name, element)
                    });
                } else {
                    form_data.append(event.target.elements[key].name, event.target.elements[key].value);
                }
            }
        }

        const requestOptions = {
            method: 'POST',
            body: form_data
        }
        fetch('http://localhost:8000/articles/create', requestOptions)
            .then(response => response.json())
            .then(data => {
                window.location.reload(true);
            })
            .catch(error => {
                console.log('error', error)
            });
        return false;
    }

    const [tags, setTags] = useState([]);
    const addTags = event => {
        if (event.key === "Enter" && event.target.value !== "") {
            setTags([...tags, event.target.value]);
            event.target.value = "";
        }
    };

    const [components, setComponents] = useState([]);
    const addComponents = event => {
        if (event.key === "Enter" && event.target.value !== "") {
            setComponents([...components, event.target.value]);
            event.target.value = "";
        }
    };

    const [waitingSeller, setWaitingSeller] = useState([]);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/seller/request`)
            .then(res => {
                return res.json()
            })
            .then(async (result) => {
                const data = result.Status
                setWaitingSeller(data)
            })
            .catch(error => {
                console.log('error', error)
            });
    }, [])

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            borderRadius: "30px",
            display: "block",
            width: '40%',
            height: '40%',
            overlay: {
                background: "#FFFF00"
            },
        },
        overlay: {
            background: "rgba(0, 0, 0, 0.5)"
        }
    };

    function openModal(description) {
        setdescribe(description)
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        setIsOpen(false);
        document.body.style.overflow = 'unset';
    }

    const Download = () => {
        window.open("http://127.0.0.1:8000/excel", "_blank");
    }

    const [describe, setdescribe] = useState('');

    const enAttente = waitingSeller?.map((element, index) => {

        const Valider = (event) => {
            event.preventDefault()
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
            fetch(`http://localhost:8000/seller/status/${element.id}`, requestOptions)
                .then(() => {
                    window.location.reload(true);
                })
                .catch(error => {
                    console.log('error', error)
                });
            return false;
        }
        if (element.status === "WAITING") {
            return <table className="table-hover" id="tableSellerWaiting" key={index}>
                <thead>
                    <tr>
                        <th className="p-3" scope="col">Id</th>
                        <th className="p-3" scope="col">Nom</th>
                        <th className="p-3" scope="col">Email</th>
                        <th className="p-3" scope="col">Statut</th>
                        <th className="p-3" scope="col">Description</th>
                        <th className="p_3" scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="p-3">{element.id}</td>
                        <td className="p-3">{element.companyName}</td>
                        <td className="p-3">{element.email}</td>
                        <td className="p-3">{element.status}</td>
                        <td className="p-3"><span id="showDescriptionModal" onClick={() => openModal(element.description)}>Voir</span></td>
                        <Modal
                            isOpen={modalIsOpen}
                            style={customStyles}
                            contentLabel="Modal cartAdd"
                        >
                            <h1 className="text-success">Description</h1>
                            <div id="descriptionModal">{describe}</div>
                            <button onClick={closeModal} style={{ marginLeft: "85%", borderRadius: "30px" }} className="btn btn-danger">OK</button>
                        </Modal>
                        <td>
                            <form onSubmit={Valider}>
                                <input type="hidden" name="status" value="VALIDATED" />
                                <input type="submit" className="btn btn-sm btn-info" value="valider" />
                            </form>
                            <form onSubmit={Valider}>
                                <input type="hidden" name="status" value="REJECTED" />
                                <input type="submit" className="btn btn-sm btn-danger mt-1 mb-2" value="rejeter" />
                            </form>
                        </td>
                    </tr>
                </tbody>
            </table >
        } else {
            return null
        }
    })
    
    return (
        <>
            <Nav />
            <div className="row m-5" id="rowCreate">
                <div className="col">
                    <DashboardArticle />
                </div>
                {
                    adminRoles === "ROLE_ADMIN" ?
                        <>
                            <div className="col">
                                <div className="titlePages">
                                    <h2>Vendeurs en attente</h2>
                                </div>
                                <div className="colSellerStatus col text-start border">
                                    {enAttente}
                                </div>
                                <button className="btn btn-primary" onClick={Download}>Télécharger le fichier excel</button>
                            </div>
                            <OrdersAdmin />
                        </>
                        :
                        <>
                            <div className="col">
                                <div className="titlePages">
                                    <h2>Publier un article</h2>
                                </div>
                                <form action="" onSubmit={onChange} id="formCreate">
                                    <input type="hidden" name="emailCreator" placeholder="email du vendeur" value={emailCreator} />
                                    <input className="form-control" type="text" name="productName" placeholder="nom de l'article" onChange={e => setNameArticle(e.target.value)} />
                                    <br />
                                    <input className="form-control" type="number" step="0.01" name="price" placeholder="prix de l'article" onChange={e => setPriceArticle(e.target.value)} />
                                    <br />
                                    <input className="form-control" type="number" step="0.01" name="deliveryPrice" placeholder="frais de livraison" onChange={e => setDeliveryPriceArticle(e.target.value)} />
                                    <br />
                                    <textarea className="form-control" name="description" cols="30" rows="3" placeholder="description de votre article" onChange={e => setDescArticle(e.target.value)}></textarea>
                                    <br />
                                    <select name="mainTag" className="form-control" onChange={e => setNameMainTag(e.target.value)}>
                                        <option value="default">Choisir un mainTag</option>
                                        <option value="maison">Maison</option>
                                        <option value="fashion">Fashion</option>
                                        <option value="loisirs">Loisirs</option>
                                        <option value="high_tech">High_tech</option>
                                        <option value="yummy">Yummy</option>
                                        <option value="cosmetiques">Cosmétiques</option>
                                    </select>
                                    <br />
                                    <input type="file" name="images[]" multiple className="form-control" onChange={e => setImageArticle(e.target.value)} />
                                    <div className="tags-input">
                                        <input
                                            type="text"
                                            onKeyUp={event => addTags(event)}
                                            className="form-control"
                                            placeholder="Tapez sur entrée pour valider votre tag"
                                        />
                                        <ul>
                                            {tags.map((tag, index) => (
                                                <li key={index}>
                                                    <input type="text" name="tags[]" className="form-control border-success" value={tag} disabled />
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="components-input">
                                        <input
                                            type="text"
                                            onKeyUp={event => addComponents(event)}
                                            className="form-control"
                                            placeholder="Tapez sur entrée pour valider vos composents"
                                        />
                                        <ul>
                                            {components.map((component, index) => (
                                                <li key={index}>
                                                    <input type="text" name="components[]" className="form-control border-success" value={component} disabled />
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <button type="submit" className="btn btn-success form-control">Publier</button>
                                </form>
                            </div>
                        </>
                }
            </div>
            <div className="d-flex justify-content-center align-center" id="errorSubmit">{errorSubmit}</div>
            <Footer />
        </>
    )
}

export default Create;