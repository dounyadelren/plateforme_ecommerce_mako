import React, { useEffect, useState } from "react";
import { useSearchParams } from 'react-router-dom';
import "../../assets/css/filtres.css"

const Filtres = (props) => {

    const [searchParams] = useSearchParams()
    const [noteChecked, setNoteChecked] = useState(searchParams.get('noteCheck') !== null ? true : false)

    useEffect(() => {
        let query = '?';
        searchParams.forEach((params, key) => {
            switch (key) {
                case 'nom':
                    query += `${key}=${params}&`
                    break
                case 'note':
                    query += `${key}=${params}&`
                    break
                case 'noteCheck':
                    query += `${key}=${params}&`
                    break
                case 'nouveau':
                    query += `${key}=${params}&`
                    break
                case 'promo':
                    query += `${key}=${params}&`
                    break
                case 'price[]':
                    query += `${key}=${params}&`
                    break
                default:
                    break;
            }
        });
        if (props.page.substring(0, 8) === 'articles') {
            query += `mainTag=${props.page.substring(8)}&`
        }

        query = query.substring(0, query.length - 1);
        fetch(`http://127.0.0.1:8000/articles/search${query}`)
            .then((res) => res.json())
            .then((response) => {
                props.sendResult(response);
            })
    }, [searchParams, props.page]);

    const changeNote = () => {
        setNoteChecked(!noteChecked)
    }

    return (
        <div className="filtres">
            <form>
                <input type="hidden" name='nom' value={searchParams.get('nom') == null ? '' : searchParams.get('nom')}></input>
                <ul>
                    <div className="slider">
                        <li><input type="checkbox" name="noteCheck" id="noteCheck" className="box" onChange={changeNote} defaultChecked={noteChecked} />
                            <label htmlFor='noteCheck'>Note (1 à 5)</label></li>
                        <li><input type="range" id="note" name="note" min="1" max="5" className="note" disabled={!noteChecked} defaultValue={searchParams.get('note') !== null ? searchParams.get('note') : 1} /></li>
                    </div>

                    <li><input type="checkbox" name="promo" id="promo" className="box" defaultChecked={searchParams.get('promo') !== null ? true : false} />
                        <label htmlFor='promo'>Promotions</label>
                    </li>
                    <li><input type="checkbox" name="nouveau" id="nouveau" className="box" defaultChecked={searchParams.get('nouveau') !== null ? true : false} />
                        <label htmlFor='nouveau'>Nouveautés</label>
                    </li>
                    <li><label htmlFor='price'>Prix</label></li>
                    <div>
                        <li>
                            <input type="checkbox" name="price[]" id="0-20" className="box" value="0*20" defaultChecked={searchParams.getAll('price[]').includes('0*20')} />
                            <label htmlFor='0-20'>0 - 20€</label>
                        </li>
                    </div>
                    <div>
                        <li>
                            <input type="checkbox" name="price[]" id="20-50" className="box" value="20*50" defaultChecked={searchParams.getAll('price[]').includes('20*50')} />
                            <label htmlFor='20-50'>20€ - 50€</label>
                        </li>
                    </div>
                    <div>
                        <li>
                            <input type="checkbox" name="price[]" id="50-100" className="box" value="50*100" defaultChecked={searchParams.getAll('price[]').includes('50*100')} />
                            <label htmlFor='50-100'>50€ - 100€</label>
                        </li>
                    </div>
                    <div>
                        <li>
                            <input type="checkbox" name="price[]" id="100" className="box" value="100" defaultChecked={searchParams.getAll('price[]').includes('100')} />
                            <label htmlFor='100'>100€ et +</label>
                        </li>
                    </div>
                </ul>
                <button className="btn btn-md btn-success mb-2 ml-1">Filtrer</button>
            </form>
        </div>
    )
}

export default Filtres
