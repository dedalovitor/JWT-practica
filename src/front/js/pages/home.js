import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";

export const Home = () => {
	const navigate = useNavigate();
	const { store, actions } = useContext(Context);
	const [pet, setPet] = useState({ age: "", name: "", race: "", castrated: false });
	const [pets, setPets] = useState([]);
	const [editingPet, setEditingPet] = useState(null);


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
		if (response.ok) {
			getCurrentUserPets();
		}
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


	const editPet = async () => {
		const response = await fetch(`https://3001-4geeksacade-reactflaskh-1gboru965s5.ws-eu111.gitpod.io/api/pet/${editingPet.id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer " + localStorage.getItem("token")
			},
			body: JSON.stringify(editingPet)
		});
		if (response.ok) {
			getCurrentUserPets();
			setEditingPet(null);
		}
	};


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
						{pets.map((x) => (
							<div key={x.id} className="card m-2" style={{ width: "18rem" }}>
								<img src="https://img.freepik.com/fotos-premium/ilustracion-perro-dibujos-animados-3d-sobre-fondo-amarillo-pastel_639785-1211.jpg" className="card-img-top" alt="..." />
								<div className="card-body">
									{editingPet && editingPet.id === x.id ? (
										<form>
											<div className="form-group">
												<label htmlFor="name">Name</label>
												<input type="text" className="form-control" id="name" value={editingPet.name} onChange={(e) => setEditingPet({ ...editingPet, name: e.target.value })} />
											</div>
											<div className="form-group">
												<label htmlFor="age">Age</label>
												<input type="number" className="form-control" id="age" value={editingPet.age} onChange={(e) => setEditingPet({ ...editingPet, age: e.target.value })} />
											</div>
											<div className="form-group">
												<label htmlFor="race">Race</label>
												<input type="text" className="form-control" id="race" value={editingPet.race} onChange={(e) => setEditingPet({ ...editingPet, race: e.target.value })} />
											</div>
											<div className="form-check">
												<input type="checkbox" className="form-check-input" id="castrated" checked={editingPet.castrated} onChange={(e) => setEditingPet({ ...editingPet, castrated: e.target.checked })} />
												<label className="form-check-label" htmlFor="castrated">Castrated</label>
											</div>
											<button type="button" className="btn btn-primary mt-2" onClick={() => editPet()}>Save</button>
											<button type="button" className="btn btn-secondary mt-2" onClick={() => setEditingPet(null)}>Cancel</button>
										</form>
									) : (
										<>
											<p className="card-text">age: {x.age}</p>
											<p className="card-text">name: {x.name}</p>
											<p className="card-text">race: {x.race}</p>
											<p className="card-text">Castrated: {x.castrated ? 'Yes' : 'No'}</p>
											<button className="btn btn-danger" onClick={() => deletePet(x.id)}>DEL</button>
											<button className="btn btn-primary ml-2" onClick={() => setEditingPet({ ...x })}>Edit</button>
										</>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
				: "Please register a pet!"
			}

		</div>
	);
};
