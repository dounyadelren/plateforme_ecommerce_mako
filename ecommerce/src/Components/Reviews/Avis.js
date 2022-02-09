import React, { useState, useEffect } from "react";
import {
    Link,
    useParams
} from "react-router-dom";

const Reviews = () => {

    let { id } = useParams();
    let subId = id.replace("id=", "");

    const [connected, setConnected] = useState(false);
    const loggedInUser = sessionStorage.getItem("email");
    const [reviews, setReviews] = useState('');
    const [errorSubmit, setErrorSubmit] = useState('');
    const [submitValide, setSubmitValide] = useState('');

    useEffect(() => {

        if (loggedInUser) {
            setConnected(true);
        } else {
            setConnected(false);
        }

    }, [loggedInUser])

    const onChange = (event) => {
        event.preventDefault(event);
        if (reviews === '') {
            setErrorSubmit('Vous devez rédiger un avis.')
            setTimeout(() => { setErrorSubmit('') }, 2000)
        } else {
            setSubmitValide('Votre avis à bien été publié!')
            setTimeout(() => { setSubmitValide('') }, 2000)
            onSubmit(event);
        }
    }

    const onSubmit = async () => {

        var form = document.querySelector('form');
        var formData = new FormData(form);

        const requestOptions = {
            method: 'POST',
            body: formData
        }

        fetch(`http://127.0.0.1:8000/reviews/create`, requestOptions)
            .then(res => res.json())
            .then(data => {
                window.location.reload(true);
            })
            .catch(error => {
                console.log('error', error)
            });
    }

    return (
        <>
            <form onSubmit={onChange}>
                <ul>
                    <li><input type="hidden" name="email" value={loggedInUser} /></li>
                    <li><input type="hidden" name="idArticle" value={subId} /></li>
                    <li><label forhtml="stars">Quelle note donneriez vous à cet article ?</label></li>
                    <li><input type="range" name="stars" id="price" min="1" max="5" /></li>
                    <li><label htmlFor="reviews">Rédigez votre avis :</label></li>
                    <li><textarea id="textArea" name="review" className="form-control" rows="8" onChange={e => setReviews(e.target.value)}></textarea></li>
                    <li><div className="d-flex justify-content-center align-center">
                        {
                            connected ?
                                <button type="submit" className="btn btn-lg btn-warning m-3">Envoyer</button>
                                :
                                <Link to="/login"><button type="submit" className="btn btn-lg btn-warning m-3">Envoyer</button></Link>
                        }
                    </div></li>
                </ul>
            </form>
            <div className="d-flex justify-content-center align-center" id="errorSubmit">{errorSubmit}</div>
            <div className="d-flex justify-content-center align-center" id="submitValid">{submitValide}</div>
        </>
    )
}

export default Reviews;