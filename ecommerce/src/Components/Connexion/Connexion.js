import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
    Link, useNavigate
} from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import "../../assets/css/co.css"
import Logo from "../../assets/images/ecologique.png"
import { Helmet } from "react-helmet"


const Connexion = () => {

    const navigate = useNavigate()

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .required('Email obligatoire')
            .email('Email invalide'),
        password: Yup.string()
            .required('Mot de passe obligatoire')
    });

    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;
    const [dbError, setDbError] = useState('')

    function onSubmit(data) {

        let form_data = new FormData();

        for (let key in data) {
            form_data.append(key, data[key]);
        }

        const requestOptions = {
            method: 'POST',
            body: form_data
        }
        fetch('http://localhost:8000/users/connect', requestOptions)
            .then(response => response.json())
            .then(async (response) => {
                if (response.Response.email) {
                    sessionStorage.setItem('email', response.Response.email);
                    sessionStorage.setItem('id', response.Response.id)
                    sessionStorage.setItem('users', JSON.stringify(response));
                    navigate("/")
                    window.location.reload(true);
                } else {
                    switch (response.Response.error) {
                        case 'email':
                            setDbError('Aucun compte à cette adresse')
                            break;
                        default:
                            setDbError('Mot de passe incorect')
                    }
                }
            })
        return false;
    }

    return (

        <div>
            <Helmet>
                <title>Connexion</title>
                <meta name="title" content="Mak'o la plateforme e-commerce verte à la livraison ecoresponsable" />
                <meta name="description"
                    content="Bienvenue sur notre plateforme de vente Mak'o, venez acheter, vendre, des produits issus du commerce équitable, ecoresponsable, dont la production a été controllée ou certifiée commerce vert! Connectez vous pour accéder aux fonctionnalités de paiement ou de vente" />
            </Helmet>
            <section className="title">
                <Link className="link" to="/"><h3><img id="logoTitle" src={Logo} alt="logo du titre" />MAK'O</h3></Link>
            </section>
            <section className="formTitle">
                <h5>Se connecter</h5>
            </section>
            <div className="containerFormLogin">
                <section className="sectionFormLogin">
                    <div className="d-flex justify-content-center align-center" id="coregError">{dbError}</div>
                    <form id="formLogin" action="" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="emailLogin">Email :</label>
                            <input className={`form-control ${errors.email ? 'is-invalid' : ''}`} type="email" name="emailLogin" id="emailLogin" {...register('email')} />
                            <div className="invalid-feedback">{errors.email?.message}</div>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="password">Mot de passe :</label>
                            <input className={`form-control ${errors.password ? 'is-invalid' : ''}`} type="password" name="passwordLogin" id="passwordLogin" {...register('password')} />
                            <div className="invalid-feedback">{errors.password?.message}</div>
                        </div>
                        <div id="submitForm" className="form-group">
                            <input className="btn form-control" type="submit" name="submitLogin" id="submitLogin" value="Connexion" />
                        </div>
                        <div className="form-group">
                            <Link to="/forgot_password"><span className="text-light d-flex justify-content-center">Mot de passe oublié?</span></Link>
                        </div>
                        <hr />
                        <div className="form-group">
                            <Link to="/register" id="createAccount" className="btn form-control"><p>Créer un compte?</p></Link>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    )
}

export default Connexion;