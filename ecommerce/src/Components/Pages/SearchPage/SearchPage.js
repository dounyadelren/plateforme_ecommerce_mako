import React, { useState } from "react";
import { Link } from 'react-router-dom';
import Filtres from "../../Filtres/Filtres";
import Footer from "../../Home/Footer/Footer";
import Nav from "../../Home/Nav/Nav";
import styles from "../SearchPage/searchpage.module.css"


const SearchPage = () => {

	const [articles, setarticles] = useState(null);
	let stars = <i className="fas fa-star etoiles"></i>;
	let emptyStars = <i className="far fa-star etoilesVides"></i>;

	const passingResult = (result) => {
		setarticles(result.Response.article);
	}

	const sorting = (event) => {
		let temp;
		switch (event.target.value) {
			case 'price-+':
				temp = [...articles].sort((a, b) => (parseFloat(a.price.slice(0, -1)) - parseFloat(b.price.slice(0, -1))));
				break;
			case 'price+-':
				temp = [...articles].sort((a, b) => (parseFloat(b.price.slice(0, -1)) - parseFloat(a.price.slice(0, -1))));
				break;
			case 'note-+':
				temp = [...articles].sort((a, b) => (a.averageNotes - b.averageNotes));
				break;
			case 'note+-':
				temp = [...articles].sort((a, b) => (b.averageNotes - a.averageNotes));
				break;
			default:
				temp = [...articles];
		}
		setarticles(temp)
	}

	return (
		<>
			<Nav />
			<Filtres sendResult={passingResult} page='search' />
			<h1 className="h3 text-center">Search</h1>
			<div id={`${styles.selectBlock}`}>
				<select className={`form-select ${styles.selectPrice}`} onChange={sorting}>
					<option value="DEFAULT">Trier par</option>
					<option value='price-+'>Prix croissant</option>
					<option value='price+-'>Prix decroissant</option>
					<option value='note-+'>Note croissante</option>
					<option value='note+-'>Note decroissante</option>
				</select>
			</div>
			<div id="articlesCards" className="bg-light">
				{Array.isArray(articles) ?
					articles?.map((article, index) =>
						<div className="card p-2 border-0 border-bottom rounded-0" key={index}>
							<ul>
								<li><img src={`/uploads/${article.image}`} className="image_product_mini align-self-center" alt="produit" /></li>
								<Link to={{ pathname: `/article/id=${article.id}` }}><li>{article.name}</li></Link>
								{article?.promotion !== null
									? <li><strike>{article?.oldPrice}</strike> <i className="fas fa-long-arrow-alt-right"></i> {article?.price}</li>
									: <li>{article?.price}</li>}
								<li>{article?.averageNotes !== null ?
									<p>
										<span>{article.averageNotes}/5 {stars}</span>
										{1.5 < article.averageNotes && <span>{stars}</span>}
										{2.5 < article.averageNotes && <span>{stars}</span>}
										{3.5 < article.averageNotes && <span>{stars}</span>}
										{4.5 < article.averageNotes && <span>{stars} </span>}
										{4.5 >= article.averageNotes && <span>{emptyStars} </span>}
										{3.5 >= article.averageNotes && <span>{emptyStars}</span>}
										{2.5 >= article.averageNotes && <span>{emptyStars}</span>}
										{1.5 >= article.averageNotes && <span>{emptyStars}</span>}
										({article.totalNotes})
									</p>
									: <p>0 <span>{stars}</span></p>
								}</li>
							</ul>
						</div>
					)
					:
					<div className={`${styles.noarticles}`}>
						<h1>{articles}</h1></div>
				}
			</div>
			<div className={`${styles.stickyFooter}`}>
				<Footer />
			</div>
		</>
	);
}

export default SearchPage;