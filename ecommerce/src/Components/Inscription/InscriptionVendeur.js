import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
    Link, useNavigate
} from 'react-router-dom';
import "../../assets/css/co.css"
import Logo from "../../assets/images/ecologique.png"
import { Helmet } from "react-helmet"


const InscriptionVendeur = () => {
    const navigate = useNavigate()

    const validationSchema = Yup.object().shape({
        companyName: Yup.string()
            .required('Ce champ est obligatoire'),
        email: Yup.string()
            .required('Ce champ est obligatoire')
            .email('Email invalide'),
        adress: Yup.string()
            .required('Ce champ est obligatoire'),
        codePostal: Yup.string()
            .required('Ce champ est obligatoire'),
        city: Yup.string()
            .required('Ce champ est obligatoire'),
        pays: Yup.string()
            .required('Ce champ est obligatoire'),
        tel: Yup.number()
            .required('Ce champs est obligatoire')
            .min(10, 'le numéro de téléphone doit avoir au moins 10 chiffres'),
        description: Yup.string()
            .required('Ce champ est obligatoire')
            .max(280, 'La description ne doit pas dépasser 280 caractères')
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
        fetch('http://localhost:8000/sellers/register', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.Status === 'KO') {
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
            <div className="formTitle">
                <h4>Espace professionnel</h4>
                <h6>Je suis un professionnel et je souhaite vendre mes articles</h6>
            </div>
            <div className="containerFormRegister">
                <section className="sectionFormRegister">
                    <div className="d-flex justify-content-center align-center" id="coregError">{dbError}</div>
                    <form id="formRegister" action="" onSubmit={handleSubmit(onSubmit)} >
                        <div className="form-group">
                            <label className="form-label" htmlFor="e-name">Nom de l'entreprise :</label>
                            <input type="text" id="companyName" name="companyName" className={`form-control ${errors.name ? 'is-invalid' : ''}`} {...register('companyName')} />
                            <div className="invalid-feedback">{errors.name?.message}</div>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="emailRegister">Email de l'entreprise :</label>
                            <input className={`form-control ${errors.email ? 'is-invalid' : ''}`} type="email" name="emaiRegister" id="emaiRegister" {...register('email')} />
                            <div className="invalid-feedback">{errors.email?.message}</div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="adress">Adresse</label>
                            <input type="text" id="adress" name="adress" className={`form-control ${errors.adress ? 'is-invalid' : ''}`} {...register('adress')} />
                            <div className="invalid-feedback">{errors.adress?.message}</div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="codePostal">Code Postal</label>
                            <input type="text" id="codePostal" name="codePostal" className={`form-control ${errors.codePostal ? 'is-invalid' : ''}`} {...register('codePostal')} />
                            <div className="invalid-feedback">{errors.codePostal?.message}</div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="city">Ville</label>
                            <input type="text" id="city" name="city" className={`form-control ${errors.city ? 'is-invalid' : ''}`} {...register('city')} />
                            <div className="invalid-feedback">{errors.city?.message}</div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="pays">Pays</label>
                            <input type="text" id="pays" name="pays" className={`form-control ${errors.pays ? 'is-invalid' : ''}`} {...register('pays')} />
                            <div className="invalid-feedback">{errors.pays?.message}</div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="tel">Téléphone</label>
                            <input type="text" id="tel" name="tel" className={`form-control ${errors.tel ? 'is-invalid' : ''}`} {...register('tel')} />
                            <div className="invalid-feedback">{errors.tel?.message}</div>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="description">Décrivez nous votre activité en quelques mots (max 280 caractères) :</label>
                            <textarea className={`form-control ${errors.description ? 'is-invalid' : ''}`} id="description" name="description" {...register('description')} />
                            <div className="invalid-feedback">{errors.description?.message}</div>
                        </div>
                        <div id="submitForm" className="form-group">
                            <input className="btn form-control" type="submit" name="submitRegister" id="submitRegister" value="Inscription *" />
                        </div>
                        <hr />
                        <div className="form-group submitForm">
                            <Link to="/login" id="connect" className="btn form-control btn-warning border-0 mt-3"><p>Se connecter?</p></Link>
                        </div>
                    </form>
                    <p className="text-center text-muted">* vous pourrez vous connecter, mais devrez attendre la validation d'un admin pour que votre compte soit migré sur un compte vendeur</p>
                </section>
            </div>
        </div >
    );
}

export default InscriptionVendeur;
