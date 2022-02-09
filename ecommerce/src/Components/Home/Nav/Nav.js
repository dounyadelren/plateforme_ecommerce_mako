import React, { useState, useEffect } from 'react';
import {
    Link, useNavigate, useSearchParams
} from 'react-router-dom';
import styles from './nav.module.css';
import Logo from '../../../assets/images/ecologique.png';
import { destroy } from 'cart-localstorage';

const Nav = () => {

    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [connected, setConnected] = useState(false);
    const [search, setSearch] = useState('');

    React.useEffect(() => {

        const loggedInUser = sessionStorage.getItem("email");

        if (loggedInUser) {
            setConnected(true);
        } else {
            setConnected(false);
        }

    }, [])

    const [admin, setAdmin] = useState(false);
    const [seller, setSeller] = useState(false);

    useEffect(() => {
        const userInfo = JSON.parse(sessionStorage.getItem("users"));
        const roleUser = userInfo?.Response.roles[0];
        if (roleUser === "ROLE_ADMIN") {
            setAdmin(true);
        } else if (roleUser === "ROLE_SELLER") {
            setSeller(true)
        }
    }, [])

    const logout = (event) => {
        event.preventDefault();
        destroy();
        sessionStorage.clear();
        navigate('/login')
        window.location.reload(true);
    }

    const handleSearch = event => {
        setSearch(event.target.value)
    }

    const focus = event => {
            if (event.code === 'Enter') {
                navigate(`/search?nom=${search}`)
            }
    }

    return (
        <div>
            <nav className={`${styles.nav}`}>
                <Link to="/">
                    <div className={`${styles.element}`}>
                        <img src={Logo} className={`${styles.logo}`} alt="logo" />
                        <h1 className={`${styles.title}`}>Mak'O</h1>
                    </div>
                </Link>
                <div className={`${styles.element}`}>
                    <input className={`${styles.searchbar}`} type="search" placeholder="Rechercher..." onChange={handleSearch} onKeyDown={focus} defaultValue={searchParams.get('nom')}></input>
                    <Link to={`/search?nom=${search}`} style={{ zIndex: 7 }}><i className={`${styles.loupe} fas fa-search`}></i></Link>
                </div>
                <div className={`${styles.element}`}>
                    {
                        connected ?
                            <>
                                {
                                    admin === true || seller === true ?
                                        <>
                                            <li><Link to="/dashboard"><i className={`${styles.icon} fas fa-columns`}></i></Link></li>
                                        </>
                                        :
                                        <Link to="/panier"><i className={`${styles.icon} fas fa-shopping-cart`}></i></Link>
                                }
                                <Link to="/account"><i className={`${styles.icon} fas fa-user`}></i></Link>
                                <button className="btn btn-success" onClick={logout}>Deconnexion</button>
                            </>
                            :
                            <>
                                <Link to="/panier"><i className={`${styles.icon} fas fa-shopping-cart`}></i></Link>
                                <Link to="/login"><i className={`${styles.icon} fas fa-user`}></i></Link>
                            </>
                    }
                </div>
            </nav>
            <nav className={`${styles.filtres}`}>
                <div className="row">
                    <div className="col" id={`${styles.col1}`}>
                        <ul>
                            <li><Link to="/articles/maison">Maison</Link></li>
                            <li><Link to="/articles/high_tech">High-Tech</Link></li>
                            <li><Link to="/articles/yummy">Yummy</Link></li>
                            <li><Link to="/articles/fashion">Fashion</Link></li>
                            <li><Link to="/articles/loisirs">Loisir</Link></li>
                            <li><Link to="/articles/cosmetiques">Cosmétiques</Link></li>
                        </ul>
                    </div>
                    <div className="col" id={`${styles.col2}`}>
                        <ul>
                            <li><Link to="/about">Qui sommes nous?</Link></li>
                            <li><Link to="/help">A l'aide!</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Nav
