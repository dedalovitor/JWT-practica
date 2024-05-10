import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";

export const Home = () => {
	const navigate = useNavigate();
	const { store, actions } = useContext(Context);
	const [pet, setPet] = useState({ age: "", name: "", race: "", castrated: false });
	const [pets, setPets] = useState([]);

	useEffect(() => {
		getCurrentUserPets();
	}, [])


	const getCurrentUserPets = async () => {
		const response = await fetch("https://3001-4geeksacade-reactflaskh-1gboru965s5.ws-eu111.gitpod.io/api/pets", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer " + localStorage.getItem("token")
			}
		});
		const data = await response.json();
		setPets(data.results);
	}


	const createPet = async () => {
		const response = await fetch("https://3001-4geeksacade-reactflaskh-1gboru965s5.ws-eu111.gitpod.io/api/pet", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer " + localStorage.getItem("token")
			},
			body: JSON.stringify(pet)
		});
		if (response.ok) getCurrentUserPets();
	}


	const deletePet = async (id) => {
		const response = await fetch("https://3001-4geeksacade-reactflaskh-1gboru965s5.ws-eu111.gitpod.io/api/pet/" + id, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer " + localStorage.getItem("token")
			},
		});
		if (response.ok) getCurrentUserPets();
	}



	return (
		<div className="text-center mt-5">
			{store.currentUserEmail ? "Hola usuario " + store.currentUserEmail : "Please register or login"}

			{store.currentUserEmail ?
				<div className="container">
					<div className="card w-25 p-3">
						{Object.keys(pet).map((key, i) => {
							if (typeof pet[key] != "boolean") {
								return <input className="m-1" placeholder={key} key={i} name={key} value={pet[key]} onChange={(e) => setPet({ ...pet, [key]: e.target.value })}></input>
							} else {
								return <>
									<input type="checkbox" key={i} name={key} checked={pet[key]} onChange={(e) => setPet({ ...pet, [key]: e.target.checked })}></input>
								</>
							}

						})}
						<button className="btn btn-success m-2" onClick={() => createPet()}>CREATE PET</button>
					</div>

					<div className="row">
						{pets.map((x) => {
							return <div key={x.id} className="card m-2" style={{ width: "18rem" }}>
								<img src="https://img.freepik.com/fotos-premium/ilustracion-perro-dibujos-animados-3d-sobre-fondo-amarillo-pastel_639785-1211.jpg" className="card-img-top" alt="..." />
								<div className="card-body">
									<p className="card-text">age: {x.age}</p>
									<p className="card-text">name: {x.name}</p>
									<p className="card-text">race: {x.race}</p>
									castrated: <input type="checkbox" disabled className="card-text" checked={x.castrated} />
								</div>
								<div className="card-footer">
									<button className="btn btn-danger" onClick={() => deletePet()}>DEL</button>
								</div>
							</div>
						})}
					</div>
				</div>


				: "Please register a pet!"
			}

		</div>
	);
};
