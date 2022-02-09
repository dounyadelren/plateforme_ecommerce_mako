import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Nav from "../Home/Nav/Nav";
import Footer from "../Home/Footer/Footer";
import "../../assets/css/articles.css"
import Filtres from '../Filtres/Filtres.js'

const Articles = () => {

    const [article, setArticle] = useState([]);
    let { mainTag } = useParams();

    let stars = <i className="fas fa-star etoiles"></i>;
    let emptyStars = <i className="far fa-star etoilesVides"></i>;

    const passingResult = (result) => {
        setArticle(result.Response.article);
    }

    const sorting = (event) => {
        let temp;
        switch (event.target.value) {
            case 'price-+':
                temp = [...article].sort((a, b) => (parseFloat(a.price.slice(0, -1)) - parseFloat(b.price.slice(0, -1))));
                break;
            case 'price+-':
                temp = [...article].sort((a, b) => (parseFloat(b.price.slice(0, -1)) - parseFloat(a.price.slice(0, -1))));
                break;
            case 'note-+':
                temp = [...article].sort((a, b) => (a.averageNotes - b.averageNotes));
                break;
            case 'note+-':
                temp = [...article].sort((a, b) => (b.averageNotes - a.averageNotes));
                break;
            default:
                temp = [...article];
        }
        setArticle(temp)
    }

    return (
        <>
            <div className="sticky">
                <Nav />
            </div>
            {
                mainTag ?
                    <h1 className="h3 text-center">{mainTag}</h1>
                    :
                    <h1 className="h3 text-center">Tout</h1>
            }
            <Filtres sendResult={passingResult} page={`articles${mainTag}`} />

            <div id='selectBlock'>
                <select className='form-select selectPrice' onChange={sorting}>
                    <option value="DEFAULT">Trier par</option>
                    <option value='price-+'>Prix croissant</option>
                    <option value='price+-'>Prix decroissant</option>
                    <option value='note-+'>Note croissante</option>
                    <option value='note+-'>Note decroissante</option>
                </select>
            </div>

            {Array.isArray(article) ?
                <div id="articlesCards" className="bg-light">
                    {
                        article.map((article, index) =>
                            <div className="card m-2 border-0 border-bottom " key={index}>
                                <ul>
                                    <li><img src={`/uploads/${article.image}`} className="image_product_mini align-self-center" alt="produit" /></li>
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
                        )
                    }
                </div>
                :
                <div id="noResult">
                    <h1>{article}</h1>
                </div>
            }
            <Footer />
        </>
    )
}

export default Articles;
