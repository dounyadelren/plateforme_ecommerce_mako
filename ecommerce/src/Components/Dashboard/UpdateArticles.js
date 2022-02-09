import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Nav from "../Home/Nav/Nav";
import Footer from "../Home/Footer/Footer";
import '../../assets/css/dashboard.css';
import ImageGallery from 'react-image-gallery';


const UpdateArticle = () => {

    let { id } = useParams();
    let subId = id.replace("id=", "");

    const [article, setArticle] = useState([]);
    const [images, setImages] = useState([]);
    const [valid, setValid] = useState(false);
    const [errorSubmit, setErrorSubmit] = useState('');

    useEffect(() => {

        fetch(`http://127.0.0.1:8000/articles?article=${subId}`)
            .then(res => {
                return res.json()
            })
            .then(async (result) => {
                const data = result.Response.article
                const images = data.images
                setArticle(data)
                setImages(images.map(element => (
                    {
                        original: `/uploads/${element}`,
                        thumbnail: `/uploads/${element}`
                    }
                )));
            })
            .catch(error => {
                console.log('error', error)
            });
    }, [subId])

    const onChange = (event) => {
        event.preventDefault();
        if (valid === false) {
            setErrorSubmit("Cochez la case")
            setTimeout(() => { setErrorSubmit('') }, 2000)
        } else {
            onSubmit(event)
        }
    }

    function onSubmit(event) {
        // console.log(event.target.elements.price);
        event.preventDefault();
        // return;
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

        console.log(...form_data)
        // return true

        const requestOptions = {
            method: 'POST',
            body: form_data
        }
        fetch(`http://localhost:8000/articles/update/${subId}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                window.location.reload(true);
            })
            .catch(error => {
                console.log('error', error)
            });
        return false;
    }

    const navigate = useNavigate()

    function onDelete(event) {
        event.preventDefault();

        const requestOptions = {
            method: 'POST',
        }

        fetch(`http://localhost:8000/articles/delete/${subId}`, requestOptions)
            .then(() => {
                navigate("/dashboard");
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

    return (
        <>
            <Nav />
            <div className="titlePages">
                <h2>{article?.name}</h2>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-md d-flex justify-content-center align-items-center">
                    <ImageGallery items={images} />
                        <div className="info_article">
                            <form action="" onSubmit={onChange} id="formUpdate">
                                <label forhtml="productName" className="form-label">Nom du produit</label>
                                <input className="form-control" type="text" id="productName" name="productName" placeholder={article.name} />
                                <br />
                                <label forhtml="productPrice" className="form-label">Prix</label>
                                <input className="form-control" id="productPrice" type="number" step="0.01" name="price" placeholder={article.price} />
                                <br />
                                <label forhtml="productStock" className="form-label">Quantité en stock</label>
                                <input className="form-control" id="productStock" type="number" name="quantity" placeholder={article.stock} />
                                <br />
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
                                                <input type="text" name="tags[]" className="form-control border-success" value={tag} />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <br />
                                {article.promotion ?
                                    <>
                                        <label forhtml="promotion" className="form-label">Promotions sur cet article</label>
                                        <input className="form-control" type="number" id="promotion" name="promotion" placeholder={article.promotion} />
                                    </>
                                    :
                                    ""
                                }
                                <br />
                                <label forhtml="images" className="form-label">Ajoutez des images</label>
                                <input type="file" id="images" name="images[]" multiple className="form-control" />
                                <br />
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" name="confirmer" id="confirmer" onChange={e => setValid(true)} />
                                    <label className="form-check-label" htmlFor="confirmer">Cochez cette case pour valider vos modifications</label>
                                </div>
                                <br />
                                <button type="submit" className="btn btn-success form-control">Modifier</button>
                            </form>
                            <hr />
                            <form onSubmit={onDelete}>
                                <button className="btn btn-warning form-control">Supprimer</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-center align-center" id="errorSubmit">{errorSubmit}</div>
            <Footer />
        </>
    )
}

export default UpdateArticle;