import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";

export const Single = props => {
	const { store, actions } = useContext(Context);
	const params = useParams();

	const [petDetails, setPetDetails] = useState([]);


	useEffect(() => {
		getPetDetails();
	}, [])


	const getPetDetails = async () => {
		try {
			const response = await fetch(`https://3001-dedalovitor-jwtpractica-acyju4v31d4.ws-eu114.gitpod.io/api/pet/${params.id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + localStorage.getItem("token")
				}
			});
			const data = await response.json();
			if (response.ok) {
				// Asegúrate de que data realmente contiene los detalles de la mascota
				if (data.result) {
					setPetDetails(data.result);
				} else {
					console.error("No se encontraron detalles de mascota en la respuesta del servidor.");
				}
			} else {
				console.error("Error al obtener detalles de mascota:", data);
			}
		} catch (error) {
			console.error("Error en la solicitud de detalles de mascota:", error);
		}

	}


	return (
		<div className="container mt-4">
			{store.currentUserEmail ? "Hola usuario " + store.currentUserEmail : "Please register or login"}

			<div className="row mt-4 text-center">
				{petDetails.image_pet ? (
					<div className="crop-container">
						<img
							src={`data:image/jpeg;base64,${petDetails.image_pet}`}
							className="card-img-top cropped-image"
							alt={`Image of ${petDetails.name}`}
						/>
					</div>
				) : (
					// Si no hay imagen, muestra la imagen predeterminada
					<img
						src="https://img.freepik.com/fotos-premium/ilustracion-perro-dibujos-animados-3d-sobre-fondo-amarillo-pastel_639785-1211.jpg"
						className="card-img-top"
						alt="..."
					/>
				)}
				<h2 className="card-text">name: {petDetails.name}</h2>
				<p className="card-text">id: {petDetails.id}</p>

				<p className="card-text">age: {petDetails.age}</p>

				<p className="card-text">race: {petDetails.race}</p>
				<p className="card-text">Castrated: {petDetails.castrated ? 'Yes' : 'No'}</p>
				<div className="text-center">
					<button className="btn btn-danger m-2 col-4" onClick={() => deletePet(x.id)}>DEL</button>
					<button className="btn btn-primary m-2 col-4" onClick={() => setEditingPet({ ...x })}>Edit</button>
				</div>

			</div>
		</div>
	);
};


