import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from './random.module.css'
import Pouce from '../../../assets/images/pouce.png'

const Random = () => {

    let stars = <i className="fas fa-star etoiles"></i>;
    let emptyStars = <i className="far fa-star etoilesVides"></i>;

    const [randomName, setRandomName] = useState([]);

    useEffect(() => {

        fetch(`http://127.0.0.1:8000/articles/random`)
            .then(res => {
                return res.json()
            })
            .then(async (result) => {
                const data = result.Response.articles
                setRandomName(data);
            })
    }, [])

    return (
        <>
            <h2 className="titre mt-5"><img src={Pouce} id={`${styles.pouce}`} alt="nouveaute" />Vous aimerez aussi</h2>
            <div className="container">
                <div className={`row ${styles.randomRow}`}>
                    {randomName.map((element, i) => (
                        <div className="col col-3 p-4" key={i}>
                            <Link to={{ pathname: `/article/id=${element.id}` }}>
                                <section className="card rounded-0 border-0 border-bottom">
                                    <img id={`${styles.imgRandom}`} src={`/uploads/${element.image}`} className="image_product_mini m-3" alt="Produit" />
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
                    ))}
                </div>
            </div>
        </>
    )
}

export default Random;