import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { Link, useNavigate } from "react-router-dom";

export const Home = () => {
	const navigate = useNavigate();
	const { store, actions } = useContext(Context);
	const [pet, setPet] = useState({ age: "", name: "", race: "", castrated: false, image_pet: "" });
	const [pets, setPets] = useState([]);
	const [editingPet, setEditingPet] = useState(null);


	useEffect(() => {
		getCurrentUserPets();
	}, [])


	// Función para manejar la selección de imagen
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		setPet({ ...pet, image_pet: file });
	};

	const getCurrentUserPets = async () => {
		try {
			const response = await fetch("https://3001-dedalovitor-jwtpractica-acyju4v31d4.ws-eu114.gitpod.io/api/pets", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + localStorage.getItem("token")
				}
			});

			if (!response.ok) {
				throw new Error("Failed to fetch pets");
			}

			const data = await response.json();
			setPets(data.results);
		} catch (error) {
			console.error("Error fetching pets:", error);
		}
	};

	/*
	 necesitas enviar la imagen al backend cuando se crea una mascota. Esto implicará utilizar FormData para enviar la imagen como parte de la solicitud. Aquí está la parte modificada del código para la función createPet:
	*/
	const createPet = async () => {
		const formData = new FormData();
		formData.append("name", pet.name);
		formData.append("age", pet.age);
		formData.append("race", pet.race);
		formData.append("castrated", pet.castrated);
		formData.append("image_pet", pet.image_pet);

		const response = await fetch("https://3001-dedalovitor-jwtpractica-acyju4v31d4.ws-eu114.gitpod.io/api/pet", {
			method: "POST",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("token")
			},
			body: formData
		});
		if (response.ok) {
			getCurrentUserPets();
		}
	}


	const deletePet = async (id) => {
		const response = await fetch("https://3001-dedalovitor-jwtpractica-acyju4v31d4.ws-eu114.gitpod.io/api/pet/" + id, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer " + localStorage.getItem("token")
			},
		});
		if (response.ok) getCurrentUserPets();
	}


	const editPet = async () => {
		const response = await fetch(`https://3001-dedalovitor-jwtpractica-acyju4v31d4.ws-eu114.gitpod.io/api/pet/${editingPet.id}`, {
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
		<div className="mt-3 text-center ">
			<div className="container text-center mb-3">

				{store.currentUserEmail ? "Hola usuario " + store.currentUserEmail : "Please register or login"}

			</div>
			{store.currentUserEmail ?
				<div className="container">
					<div className="row text-center">
						<div className="col">
							<div className="card p-3 col-10 col-sm-10 col-md-4 mb-3" >
								{Object.keys(pet).map((key, i) => {
									if (key === 'image_pet') {
										return (
											<div key={i} className="form-group">
												<label htmlFor="image_pet">Image</label>
												<input type="file" className="form-control" id="image_pet" onChange={handleImageChange} />
											</div>
										);
									} else if (typeof pet[key] != "boolean") {
										return <input className="m-1" placeholder={key} key={i} name={key} value={pet[key]} onChange={(e) => setPet({ ...pet, [key]: e.target.value })}></input>
									} else {
										return <>
											<span><label htmlFor="castrated">Castrated</label><input className="m-2" type="checkbox" key={i} name={key} checked={pet[key]} onChange={(e) => setPet({ ...pet, [key]: e.target.checked })}></input></span>

										</>
									}

								})}
								<button className="btn btn-success m-2" onClick={() => createPet()}>CREATE PET</button>
							</div>
						</div>
					</div>

					<div className="row text-center">
						{pets.map((x) => (
							<div key={x.id} className="card m-2" style={{ width: "18rem" }}>
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
											<button type="button" className="btn btn-primary m-2" onClick={() => editPet()}>Save</button>
											<button type="button" className="btn btn-secondary m-2" onClick={() => setEditingPet(null)}>Cancel</button>
										</form>
									) : (
										<>
											{x.image_pet_url ? (
												<img
													src={x.image_pet_url}
													className="card-img-top"
													alt={`Image of ${x.name}`}
												/>
											) : (
												// Si no hay imagen, muestra la imagen predeterminada
												<img
													src="https://img.freepik.com/fotos-premium/ilustracion-perro-dibujos-animados-3d-sobre-fondo-amarillo-pastel_639785-1211.jpg"
													className="card-img-top"
													alt="..."
												/>
											)}
											<p className="card-text">id: {x.id}</p>
											<p className="card-text">age: {x.age}</p>
											<p className="card-text">name: {x.name}</p>
											<p className="card-text">race: {x.race}</p>
											<p className="card-text">Castrated: {x.castrated ? 'Yes' : 'No'}</p>
											<button className="btn btn-danger m-2" onClick={() => deletePet(x.id)}>DEL</button>
											<button className="btn btn-primary m-2" onClick={() => setEditingPet({ ...x })}>Edit</button>
											<Link to={"single/" + x.id}>
												<button className="btn btn-primary m-2">Ir a detalles</button>
											</Link>
										</>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
				: "Please register a pet!"
			}

		</div >
	);
};
