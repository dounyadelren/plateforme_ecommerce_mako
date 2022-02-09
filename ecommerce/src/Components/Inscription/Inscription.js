import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
    Link, useNavigate
} from 'react-router-dom';
import "../../assets/css/co.css"
import Logo from "../../assets/images/ecologique.png"
import { useState } from "react";
import { Helmet } from "react-helmet"


const Inscription = () => {

    const navigate = useNavigate()

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .required('Email obligatoire')
            .email('Email invalide'),
        password: Yup.string()
            .min(6, 'Le mot de passe doit avoir au moins 6 caractères')
            .required('Mot de passe obligatoire'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Les mots de passes ne correspondent pas')
            .required('Confirmation de mot de passe obligatoire'),
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
        fetch('http://localhost:8000/users/register', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.Response.error) {
                    setDbError('Cet email est déjà utilisé')
                } else {
                    navigate("/login")
                }
            })
        return false;
    }

    return (

        <div>
            <Helmet>
                <title>Inscription</title>
                <meta name="title" content="Mak'o la plateforme e-commerce verte à la livraison ecoresponsable" />
                <meta name="description" content="Bienvenue sur notre plateforme de vente Mak'o, venez acheter, vendre, des produits issus du commerce équitable, ecoresponsable, dont la production a été controllée ou certifiée commerce vert! Inscrivez vous pour accéder aux fonctionnalités de paiement ou de vente" />
            </Helmet>
            <section className="title">
                <Link className="link" to="/"><h3><img id="logoTitle" src={Logo} alt="logo du titre" />MAK'O</h3></Link>
            </section>
            <section className="formTitle">
                <h5>S'inscrire</h5>
            </section>
            <div className="containerFormRegister">
                <section className="sectionFormRegister">
                    <div className="d-flex justify-content-center align-center" id="coregError">{dbError}</div>
                    <form id="formRegister" action="" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Email :</label>
                            <input className={`form-control ${errors.email ? 'is-invalid' : ''}`} type="email" name="emaiRegister" id="emaiRegister" {...register('email')} />
                            <div className="invalid-feedback">{errors.email?.message}</div>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="password">Mot de passe :</label>
                            <input className={`form-control ${errors.password ? 'is-invalid' : ''}`} type="password" name="passwordRegister" id="passwordRegister" {...register('password')} />
                            <div className="invalid-feedback">{errors.password?.message}</div>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="password">Confirmer mot de passe :</label>
                            <input className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} type="password" name="passwordRegisterConfirm" id="passwordRegisterConfirm" {...register('confirmPassword')} />
                            <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
                            <input name="role" value="user" type="hidden" {...register('role')} />
                        </div>
                        <div id="submitForm" className="form-group">
                            <input className="btn form-control" type="submit" name="submitRegister" id="submitRegister" value="Inscription" />
                        </div>
                        <hr />
                        <div className="form-group submitForm">
                            <Link to="/register/vendor" id="pro" className="btn form-control btn-info border-0"><p className="text-light">Vous êtes professionnel?</p></Link>
                            <Link to="/login" id="connect" className="btn form-control btn-warning border-0 mt-3"><p>Se connecter?</p></Link>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    )
}

export default Inscription;