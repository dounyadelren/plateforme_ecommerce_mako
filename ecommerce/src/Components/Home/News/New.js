import React, { useState, useEffect } from 'react';
import styles from './new.module.css'
import { Link } from "react-router-dom";
import Stars from '../../../assets/images/new_star.png'
const New = () => {

    let stars = <i className="fas fa-star etoiles"></i>;
    let emptyStars = <i className="far fa-star etoilesVides"></i>;

    const [nouveaute, setNouveaute] = useState([]);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/articles/search?nouveau=true`)
            .then((res) => res.json())
            .then(async (result) => {
                const data = result.Response.article
                setNouveaute(data)
            })
            .catch(error => {
                console.log('error', error)
            });
    }, [])

    const article = nouveaute.slice(0, 4)

    return (
        <>
            <h2 className="titre mt-5">Nouveautés ! <img src={Stars} id={`${styles.stars}`} alt="nouveaute" /></h2>
            <div className="container bg-light">
                <div className={`row ${styles.NewRow}`}>
                    {
                        article?.map((element, i) => {
                            return <div className="col col-3 p-4" key={i}>
                                <Link to={{ pathname: `/article/id=${element.id}` }}>
                                    <section className="card rounded-0 border-0 border-bottom">
                                        <img id={`${styles.imgNew}`} src={`/uploads/${element.image}`} className="image_product_mini m-3" alt="Produit" />
                                        <span>{element.name}</span>
                                        {element?.promotion !== null
                                            ? <span><strike>{element?.oldPrice}</strike> <i className="fas fa-long-arrow-alt-right"></i> {element?.price}</span>
                                            : <span>{element?.price}</span>}
                                        <span>{element?.averageNotes !== null ?
                                            <p>
                                                <span>{element.averageNotes}/5 {stars}</span>
                                                {1.5 < element.averageNotes && <span>{stars}</span>}
                                                {2.5 < element.averageNotes && <span>{stars}</span>}
                                                {3.5 < element.averageNotes && <span>{stars}</span>}
                                                {4.5 < element.averageNotes && <span>{stars} </span>}
                                                {4.5 >= element.averageNotes && <span>{emptyStars} </span>}
                                                {3.5 >= element.averageNotes && <span>{emptyStars}</span>}
                                                {2.5 >= element.averageNotes && <span>{emptyStars}</span>}
                                                {1.5 >= element.averageNotes && <span>{emptyStars}</span>}
                                                ({element.totalNotes})
                                            </p>
                                            : <p>0 <span>{stars}</span></p>
                                        }</span>
                                    </section>
                                </Link>
                            </div>
                        })}
                </div>
            </div>
        </>
    );
}

export default New;
