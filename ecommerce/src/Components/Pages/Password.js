import React, { useEffect, useState } from 'react'
import Nav from '../Home/Nav/Nav'
import Footer from '../Home/Footer/Footer'
import "../../assets/css/pages.css";
import {
    Link,
    useNavigate, useLocation
} from 'react-router-dom';

const Password = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const [role, setRole] = useState('')
    useEffect(() => {
        const userRole = location.state.user 
        setRole(userRole)
    }, [])

    const emailUser = sessionStorage.getItem("email");
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorSubmit, setErrorSubmit] = useState('')
    const [passwordChange, setPasswordChange] = useState('')

    const onChange = (event) => {
        event.preventDefault();
        if (oldPassword === '') {
            setErrorSubmit("Vous devez rentrer votre ancien mot de passe!")
            setTimeout(() => { setErrorSubmit('') }, 2000)
        } else {
            if (newPassword === '' && confirmPassword === '') {
                setErrorSubmit("Vous devez rentrer vos nouveaux mot de passe!")
                setTimeout(() => { setErrorSubmit('') }, 2000)
            } else {
                if (newPassword !== confirmPassword) {
                    setErrorSubmit("Les mots de passe de correspondent pas!")
                    setTimeout(() => { setErrorSubmit('') }, 2000)
                } else {
                    setPasswordChange("Mot de passe modifié!")
                    setTimeout(() => { setNewPassword('') }, 2000)
                    onSubmit(event);
                }
            }
        }
    }

    const onSubmit = async (event) => {

        event.preventDefault();
        const form_data = new FormData();
        for (let key in event.target.elements) {
            if (event.target.elements[key].tagName === 'INPUT' && event.target.elements[key].value !== '') {
                form_data.append(event.target.elements[key].name, event.target.elements[key].value);
            }
        }

        const requestOptions = {
            method: 'POST',
            body: form_data
        }

        fetch('http://localhost:8000/users/password', requestOptions)
            .then(response => response.json())
            .then(async (response) => {
                if (response.Status === "OK") {
                    navigate("/password");
                }
            })
        return false;
    }

    return (
        <>
            <Nav />
            <div className="titlePages">
                <h2>Modifier mon mot de passe</h2>
            </div>
            <div className="bg-light">
                <div className="row">
                    <div className="col-md d-flex justify-content-start">
                        <nav>
                            <ul className="sub_menu">
                                <Link to="/account"><li><h3 className="h6 p-4"><button className="btn btn-lg text-primary buttonStl">Mes informations générales</button></h3></li></Link>
                                {
                                    role === "ROLE_USER" ? <Link to="/user/order"><li><h3 className="h6 p-4"><button className="btn btn-lg text-primary buttonStl">Commandes</button></h3></li></Link> 
                                    : 
                                    ''
                                }     
                            </ul>
                        </nav>
                    </div>
                    <div className="col-md d-flex justify-content-center p-2">
                        <form onSubmit={onChange} className="form-control border-0">
                            <div className="d-flex justify-content-center align-center" id="passwordChange">{passwordChange}</div>
                            <ul>
                                <input type="hidden" name="email" value={emailUser} />
                                <li><label className="h5 m-3" forhtml="oldPassword">Ancien mot de passe</label></li>
                                <li><input type="password" name="oldPassword" className='form-control' onChange={e => setOldPassword(e.target.value)} /></li>
                                <li><label className="h5 m-3" forhtml="newPassword">Nouveau mot de passe</label></li>
                                <li><input type="password" name="newPassword" className='form-control' onChange={e => setNewPassword(e.target.value)} /></li>
                                <li><label className="h5 m-3" forhtml="confirm">Confirmez mot de passe</label></li>
                                <li><input type="password" name="confirm" className='form-control' onChange={e => setConfirmPassword(e.target.value)} /></li>
                            </ul>
                            <div className="d-flex justify-content-center align-center">
                                <button type="submit" className="btn btn-lg btn-warning m-3">Modifier</button>
                            </div>
                        </form>
                    </div>
                    <div className="col-md">
                    </div>
                    <div className="d-flex justify-content-center align-center" id="errorSubmit">{errorSubmit}</div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Password
