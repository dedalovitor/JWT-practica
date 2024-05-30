import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { Link, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export const Home = () => {
	const navigate = useNavigate();
	const { store, actions } = useContext(Context);
	const [pet, setPet] = useState({ age: "", name: "", race: "", castrated: false, image_pet: "" });
	const [pets, setPets] = useState([]);
	const [editingPet, setEditingPet] = useState({ age: "", name: "", race: "", castrated: false, image_pet: "" });
	const [petOrder, setPetOrder] = useState([]);


	useEffect(() => {
		getCurrentUserPets();
	}, [])

	useEffect(() => {
		console.log("Pets:", pets);
	}, [pets]);

	useEffect(() => {
		console.log("Pet Order:", petOrder);
	}, [petOrder]);


	// Función para manejar la selección de imagen
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		setPet({ ...pet, image_pet: file });
	};

	const handleImageChange1 = (e) => {
		const file = e.target.files[0];
		setEditingPet({ ...editingPet, image_pet: file });
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
			const petOrder = data.results.map(pet => pet.order_number); // Obtener solo los IDs de las mascotas
			setPetOrder(petOrder); // Inicializar petOrder con los order number de las mascotas
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
		// Obtener el último número de orden
		const lastOrderNumber = petOrder.length > 0 ? petOrder.length : 0;
		// Agregar el índice de orden al FormData y Asignar el nuevo número de orden
		formData.append("order_number", lastOrderNumber);

		const response = await fetch("https://3001-dedalovitor-jwtpractica-acyju4v31d4.ws-eu114.gitpod.io/api/pet", {
			method: "POST",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("token")
			},
			body: formData
		});
		if (response.ok) {
			getCurrentUserPets();
			setPet({ age: "", name: "", race: "", castrated: false, image_pet: "" });
			// La siguiente línea de código se ejecutará después de que el estado se haya actualizado
			console.log("Campos del formulario vaciados");

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
		const formData = new FormData();
		formData.append("name", editingPet.name);
		formData.append("age", editingPet.age);
		formData.append("race", editingPet.race);
		formData.append("castrated", editingPet.castrated);
		formData.append("image_pet", editingPet.image_pet);


		const response = await fetch(`https://3001-dedalovitor-jwtpractica-acyju4v31d4.ws-eu114.gitpod.io/api/pet/${editingPet.id}`, {
			method: "PUT",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("token")
			},
			body: formData
		});
		if (response.ok) {

			// Actualiza la lista de mascotas para reflejar los cambios
			getCurrentUserPets();
			setEditingPet({ age: "", name: "", race: "", castrated: false, image_pet: "" });
		}
	};

	const handleDragEnd = async (result) => {
		if (!result.destination) return; // El elemento se soltó fuera de un droppable

		const startIndex = result.source.index;
		const endIndex = result.destination.index;

		const newPetOrder = Array.from(petOrder);
		const [removed] = newPetOrder.splice(startIndex, 1);
		newPetOrder.splice(endIndex, 0, removed);

		setPetOrder(newPetOrder);
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


					<div className="container ">
						<div className="row d-flex flex-wrap justify-content-center">
							<DragDropContext onDragEnd={handleDragEnd}>
								<Droppable droppableId="droppable" direction="horizontal">
									{(provided) => (
										<div ref={provided.innerRef} {...provided.droppableProps} className="row">
											{petOrder.map((petOrder, index) => {
												const pet = pets.find((pet) => pet.order_number === petOrder);
												if (!pet) {
													return null;
												}
												return (
													<Draggable key={pet.id} draggableId={pet.id.toString()} index={index}>
														{(provided) => (
															<div
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}
																className="col-md-3" // Define el tamaño de la columna
															>
																<div key={index} className="card m-2" style={{ width: "18rem" }}>
																	<div className="card-body">
																		{editingPet && editingPet.id === pet.id ? (
																			<form>
																				<div className="form-group">
																					<label htmlFor="image_pet">Image</label>
																					<input type="file" className="form-control" id="image_pet" onChange={handleImageChange1} />
																				</div>
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
																				{pet.image_pet_url ? (
																					<img
																						src={pet.image_pet_url}
																						className="card-img-top"
																						alt={`Image of ${pet.name}`}
																					/>
																				) : (
																					// Si no hay imagen, muestra la imagen predeterminada
																					<img
																						src="https://img.freepik.com/fotos-premium/ilustracion-perro-dibujos-animados-3d-sobre-fondo-amarillo-pastel_639785-1211.jpg"
																						className="card-img-top"
																						alt="..."
																					/>
																				)}
																				<div className="row mt-3">
																					<div className="col text-start">
																						<p className="card-text">order: {pet.order_number}</p>
																					</div>
																				</div>
																				<div className="row">
																					<div className="col text-start">
																						<p className="card-text">id: {pet.id}</p>
																					</div>
																					<div className="col text-start">
																						<p className="card-text">age: {pet.age}</p>
																					</div>
																				</div>
																				<div className="row">
																					<div className="col text-start">
																						<p className="card-text">name: {pet.name}</p>
																					</div>
																					<div className="col text-start">
																						<p className="card-text">race: {pet.race}</p>
																					</div>
																				</div>

																				<p className="card-text text-start">Castrated: {pet.castrated ? 'Yes' : 'No'}</p>

																				<div className="row">
																					<div className="col"><button className="btn btn-primary " onClick={() => setEditingPet({ ...pet })}>Edit</button></div>
																					<div className="col">
																						<Link to={"single/" + pet.id}>
																							<button className="btn btn-primary">Details</button>
																						</Link>
																					</div>
																					<div className="col"><button className="btn btn-danger" onClick={() => deletePet(pet.id)}>DEL</button></div>
																				</div>


																			</>
																		)}
																	</div>
																</div>
															</div>
														)}
													</Draggable>
												);
											})}
											{provided.placeholder}
										</div>
									)
									}
								</Droppable>
							</DragDropContext>
						</div>
					</div >

				</div > : "please register a pet"}
		</div >
	);
};
