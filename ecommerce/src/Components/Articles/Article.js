import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import Nav from "../Home/Nav/Nav";
import { useParams, Link } from 'react-router-dom';
import '../../assets/css/article.css'
import Footer from "../Home/Footer/Footer";
import Reviews from "../Reviews/Avis";
import ImageGallery from 'react-image-gallery';
import { add } from 'cart-localstorage'
import "react-image-gallery/styles/css/image-gallery.css";

const addCartOk = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        borderRadius: "30px",
        width: '400px',
        height: '210px',
    },
    overlay: {
        background: "rgba(0, 0, 0, 0.5)"
    }
};

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
        width: '400px',
        height: '210px',
        overlay: {
            background: "#FFFF00"
        },
    },
    overlay: {
        background: "rgba(0, 0, 0, 0.5)"
    }
};

Modal.setAppElement('#root');

const Article = () => {


    let { id } = useParams();
    let subId = id.replace("id=", "");
    let stars = <i className="fas fa-star etoiles"></i>;
    let emptyStars = <i className="far fa-star etoilesVides"></i>;

    const [article, setArticle] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [images, setImages] = useState([]);
    const [tags, setTags] = useState([]);
    const [similarArticles, setSimilarArticles] = useState([])

    const [modalIsOpen, setIsOpen] = useState(false);
    const [modalIsOpenStock, setIsOpenTock] = useState(false);

    function openModal() {
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        setIsOpen(false);
        document.body.style.overflow = 'unset';
    }

    function stockOpenModal() {
        setIsOpenTock(true)
        document.body.style.overflow = 'hidden';
    }

    function stockCloseModal() {
        setIsOpenTock(false);
        document.body.style.overflow = 'unset';
    }

    useEffect(() => {

        fetch(`http://127.0.0.1:8000/articles?article=${subId}`)
            .then(res => {
                return res.json()
            })
            .then(async (result) => {
                const data = result.Response.article
                const reviews = data.reviews
                const images = data.images
                const tags = data.tags

                setArticle(data)
                setReviews(reviews)
                setImages(images.map(element => (
                    {
                        original: `/uploads/${element}`,
                        thumbnail: `/uploads/${element}`
                    }
                )));
                setTags(tags)
                fetch(`http://127.0.0.1:8000/articles/recommendation/${subId}`)
                    .then(res => {
                        return res.json()
                    })
                    .then(result => {
                        setSimilarArticles(result.Response)
                    })
            })
            .catch(error => {
                console.log('error', error)
            });

    }, [subId])

    const addCart = (selectedArticle) => {
        if (article.stock !== null) {
            add(selectedArticle)
            openModal()
        } else {
            stockOpenModal()
        }
    }

    return (
        <div>
            <Nav />
            <Modal
                isOpen={modalIsOpen}
                style={addCartOk}
                contentLabel="Modal cartAdd"
            >
                <h1 className="text-success">Article ajouté</h1>
                <h2 className="h4">Vous retrouverez votre article dans botre panier</h2>
                <button onClick={closeModal} style={{ marginLeft: "85%", borderRadius: "30px" }} className="btn btn-danger">OK</button>
            </Modal>
            <Modal
                isOpen={modalIsOpenStock}
                style={customStyles}
                contentLabel="Modal stockNull"
            >
                <h1 className="text-warning">Plus de stock</h1>
                <h2 className="h4">Une prochaine fois!</h2>
                <button onClick={stockCloseModal} style={{ marginLeft: "85%", borderRadius: "30px" }} className="btn btn-danger">OK</button>
            </Modal>
            <div className="titlePages">
                <h2>{article?.name}</h2>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-md d-flex justify-content-center">
                        <ImageGallery items={images} />
                        <div className="info_article">
                            <ul>
                                <li>
                                    {article?.promotion !== null
                                        ? <h1 className="h5"><strike>{article?.oldPrice}</strike> -{article?.promotion} <i className="fas fa-long-arrow-alt-right"></i> {article?.price}</h1>
                                        : <h1 className="h5">{article?.price}</h1>
                                    }
                                </li>
                                <li>{
                                    article?.averageNotes !== null ?
                                    <h1 className="h5">
                                            <span>{article.averageNotes}/5 {stars}</span>
                                            {1.5 < article.averageNotes && <span>{stars}</span>}
                                            {2.5 < article.averageNotes && <span>{stars}</span>}
                                            {3.5 < article.averageNotes && <span>{stars}</span>}
                                            {4.5 < article.averageNotes && <span>{stars} </span>}
                                            {1.5 >= article.averageNotes && <span>{emptyStars}</span>}
                                            {2.5 >= article.averageNotes && <span>{emptyStars}</span>}
                                            {3.5 >= article.averageNotes && <span>{emptyStars}</span>}
                                            {4.5 >= article.averageNotes && <span>{emptyStars} </span>}
                                            <p className="h6">({article.totalNotes + " utilisateur" + (reviews.length === 1 ? " a" : "s ont") + " noté cet article"})</p>
                                        </h1>
                                        : <p>0 <span>{stars}</span> Aucun avis</p>
                                    }</li>
                                <li><h1 className="h5">Vendu par:</h1></li>
                                <li><h1 className="h6">{article?.user?.company}</h1></li>
                                <li><h1 className="h5">Description: </h1></li>
                                <div className="description"><li><p >{article?.description}</p></li></div>
                                <li><h1 className="h5">Composition:</h1></li>
                                <li>
                                    {article?.components?.map((item, i) =>
                                        <ul key={i}>
                                            <li>{item}</li>
                                        </ul>
                                    )}
                                </li>
                                <li><h1 className="h5">Tags:</h1></li>
                                <li className="description">
                                    {tags.map((item, i) =>
                                        <ul className="tags" key={i}>
                                            <li>{"#" + item}</li>
                                        </ul>
                                    )}
                                </li>
                                <li><h1 className="h5">Stock: {article.stock ? <i className="fas fa-circle" id="green" ></i> : <i id="red" className="fas fa-circle"></i>} </h1></li>
                                <p></p>
                                <li><button className="btn btn-lg btn-warning" onClick={() => { addCart(article); }}>Panier <i className="fas fa-cart-plus"></i></button></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="row m-5">
                    <div className="col-md">
                    </div>
                    <div className="col-md">
                        <h1 className="h5">Laissez une evaluation</h1>
                        <Reviews />
                    </div>
                    <div className="col-md"></div>
                </div>
                <div className="row" id="rowReviews">
                    {reviews.length > 0 ?
                        <div className="col-md divReviews">
                            <h2 className="h4">Avis</h2>
                            <div className="blockReviews card">
                                {reviews.map((item, i) => (
                                    <div key={i}>
                                        <div className="card cardReviews">
                                            <h3 className="h6 p-4">Laissé par: {item.firstName}</h3>
                                            <span className="p-4"> Avis: {item.review}</span>
                                            <span className="p-4">Note: {item.stars}</span>
                                            <span id="separator"></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        : ""}
                    <div className="col-md divReviews" style={{ oveflow: "scroll" }}>
                        <h3 className="h4">Produits similaires</h3>
                        <div className="card bg-light blockReviews">
                            {similarArticles?.map((article, index) =>
                                <div className="card m-2 border-0 border-bottom " key={index}>
                                    <ul>
                                        <li><img src={`/uploads/${article.image}`} className="image_product_mini" alt="produit" /></li>
                                        <Link to={{ pathname: `/article/id=${article.id}` }}><li>{article.name}</li></Link>
                                        {article?.promotion !== null
                                            ? <li><strike>{article?.oldPrice}</strike> <i className="fas fa-long-arrow-alt-right"></i> {article?.price}</li>
                                            : <li>{article?.price}</li>}
                                        <li>{article?.averageNotes !== null ?
                                            <p>
                                                <span>{article.averageNotes}/5 {stars}</span>
                                                {1.5 < article.averageNotes && <span>{stars}</span>}
                                                {2.5 < article.averageNotes && <span>{stars}</span>}
                                                {3.5 < article.averageNotes && <span>{stars}</span>}
                                                {4.5 < article.averageNotes && <span>{stars} </span>}
                                                {4.5 >= article.averageNotes && <span>{emptyStars} </span>}
                                                {3.5 >= article.averageNotes && <span>{emptyStars}</span>}
                                                {2.5 >= article.averageNotes && <span>{emptyStars}</span>}
                                                {1.5 >= article.averageNotes && <span>{emptyStars}</span>}
                                                ({article.totalNotes})
                                            </p>
                                            : <p>0 <span>{stars}</span></p>
                                        }</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
export default Article
