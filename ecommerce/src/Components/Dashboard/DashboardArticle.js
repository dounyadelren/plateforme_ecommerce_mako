import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../../assets/css/dashboard.css';

const Delete = () => {
    const [article, setArticle] = useState([]);
    const [adminRoles, setAdminRoles] = useState([]);
    
    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("users"));
        if (user.Response.roles[0] === "ROLE_ADMIN") {
            setAdminRoles(user.Response.roles[0])
        } else {
            return false;
        }
    }, [])

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("users"));
        if (user.Response.roles[0] === "ROLE_ADMIN") {
            fetch(`http://127.0.0.1:8000/articles`)
                .then(res => {
                    return res.json()
                })
                .then(result => {
                    const data = result.Response.article
                    setArticle(data);
                })
                .catch(error => {
                    console.log('error', error)
                });
        } else if (user.Response.roles[0] === "ROLE_SELLER") {
            fetch(`http://127.0.0.1:8000/articles/seller/${user.Response.id}`)
                .then(res => {
                    return res.json()
                })
                .then(result => {
                    const data = result.Response?.article || result.Response
                    setArticle(data);
                })
                .catch(error => {
                    console.log('error', error)
                });
        }
    }, [])

    const validated = article?.map((element, i) => {
        const onDelete = (event) => {
            event.preventDefault();

            const requestOptions = {
                method: 'POST',
            }

            fetch(`http://localhost:8000/articles/delete/${element.id}`, requestOptions)
                .then(() => {
                    window.location.reload(true);
                })
                .catch(error => {
                    console.log('error', error)
                });
            return false;
        }
        if (element.status === "VALIDATED") {
            return <div className="card mb-3" key={i}>
                <div className="row">
                    <div className="colDashboard col">
                        <ul>
                            <Link to={{ pathname: `/article/id=${element.id}` }}><li>{element.name}</li></Link>
                            <li>Id : {element.id}</li>
                            <li>Prix : {element.price}</li>
                            <li>MainTag : {element.mainTag}</li>
                            <li>Status : {element.status}</li>
                        </ul>
                    </div>
                    <div className="colBtnDelete col">
                        <form onSubmit={onDelete}>
                            <div className="formDelete">
                                <button className="btnDelete btn btn-danger form-control"><i className="fas fa-times"></i></button>
                            </div>
                        </form>
                        <div className="formUpdate">
                            <button className="btnUpdate btn btn-warning form-control"><Link to={{ pathname: `/update/article/id=${element.id}` }}><i className="fas fa-pen-alt"></i></Link></button>
                        </div>
                    </div>
                </div>
            </div>
        } else {
            return null
        }
    })


    const waiting = article?.map((element, i) => {
        const onDelete = (event) => {
            event.preventDefault();

            const requestOptions = {
                method: 'POST',
            }

            fetch(`http://localhost:8000/articles/delete/${element.id}`, requestOptions)
                .then(() => {
                    window.location.reload(true);
                })
                .catch(error => {
                    console.log('error', error)
                });
            return false;
        }

        const status = (event) => {
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

            fetch(`http://localhost:8000/articles/validation/${element.id}`, requestOptions)
                .then(() => {
                    window.location.reload(true);
                })
                .catch(error => {
                    console.log('error', error)
                });
            return false;
        }


        if (element.status === "WAITING") {
            return <div className="card mb-3" key={i}>
                <div className="row">
                    <div className="colDashboard col">
                        <ul>
                            <Link to={{ pathname: `/article/id=${element.id}` }}><li>{element.name}</li></Link>
                            <li>Id : {element.id}</li>
                            <li>Prix : {element.price}</li>
                            <li>MainTag : {element.mainTag}</li>
                            <li>Status : {element.status}</li>
                        </ul>
                    </div>
                    <div className="colBtnDelete col">
                        <div className="formDelete">
                            {
                                adminRoles === "ROLE_ADMIN" ?
                                    <form onSubmit={status}>
                                        <input type="hidden" name="status" value="VALIDATED" />
                                        <input type="submit" className="btn btn-success" value="valider" />
                                    </form>
                                    :
                                    <button className="btnDelete btn btn-danger form-control" onClick={onDelete}><i className="fas fa-times"></i></button>
                            }
                        </div>
                        <div className="formUpdate">
                            {
                                adminRoles === "ROLE_ADMIN" ?
                                    <form onSubmit={status}>
                                        <input type="hidden" name="status" value="REJECTED" />
                                        <input type="submit" className="btn btn-warning" value="rejeter" />
                                    </form>
                                    :
                                    <button className="btnUpdate btn btn-warning form-control"><Link to={{ pathname: `/update/article/id=${element.id}` }}><i className="fas fa-pen-alt"></i></Link></button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        } else {
            return null
        }
    })

    return (
        <>

            {
                adminRoles === "ROLE_ADMIN" ?
                    ""
                    :
                    <>
                        <div className="titlePages">
                            <h2>Article(s) validé(s)</h2>
                        </div>
                        <div className="blockArticle">
                            {validated}
                        </div>
                        <hr />
                    </>
            }
            <div className="titlePages">
                <h2>Article(s) en attente</h2>
            </div>
            <div className="blockArticle">
                {waiting}
            </div>
        </>
    )
}

export default Delete;