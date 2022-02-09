import React from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import "../../assets/css/co.css"
import Logo from "../../assets/images/ecologique.png"
import { useForm } from "react-hook-form";

const ForgotPassword = () => {

    const navigate = useNavigate()

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .required('Email obligatoire')
            .email('Email invalide'),
        confirmEmail: Yup.string()
            .required('Veuillez confirmer votre email')
            .email("format de l'email invalide")
            .oneOf([Yup.ref('email'), null], 'Les emails ne correspondent pas')
    });

    const formOptions = { resolver: yupResolver(validationSchema) };

    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;


    const onSubmit = (data) => {
        let form_data = new FormData();

        for (let key in data) {
            form_data.append(key, data[key]);
        }

        const requestOptions = {
            method: 'POST',
            body: form_data
        }
        fetch('http://localhost:8000/forgotPassword', requestOptions)
            .then(response => response.json())
            .then(navigate("/login"))
        return false;
    }

    return (
        <div>
            <section className="title">
                <Link className="link" to="/"><h3><img id="logoTitle" src={Logo} alt="logo du titre" />MAK'O</h3></Link>
            </section>

            <section className="formTitle">
                <h5>J'ai oublié mon mot de passe</h5>
            </section>
            <div className="containerFormLogin">
                <section className="sectionFormLogin">
                    <form id="formLogin" action="" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label className="form-label text-dark text-center" forhtml="email">Veuillez entrer votre email pour recevoir votre nouveau mot de passe</label>
                            <input className={`form-control ${errors.email ? 'is-invalid' : ''}`} type="email" name="email" id="email" {...register('email')} />
                            <div className="invalid-feedback">{errors.email?.message}</div>
                            <br></br>
                            <label className="form-label text-dark text-center" forhtml="confirmEmail">Confirmez votre email</label>
                            <input className={`form-control ${errors.confirmEmail ? 'is-invalid' : ''}`} type="email" name="confirmEmail" id="confirmEmail" {...register('confirmEmail')} />
                            <div className="invalid-feedback">{errors.confirmEmail?.message}</div>
                            <input type="submit" className="form-control btn btn-success" name="submit" id="submit" />
                            <span className="text-justify d-flex justify-content-center p-1" style={{ fontSize: 14 }}>Votre nouveau mot de passe sera généré par un admin, vous pourrez le changer directement par votre page profil une fois connecté</span>
                        </div>
                    </form>
                </section>
            </div>

        </div>
    );
}

export default ForgotPassword;
