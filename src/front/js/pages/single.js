import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import Carousel from 'react-bootstrap/Carousel';
import Modal from 'react-bootstrap/Modal'; // Importa el componente Modal de Bootstrap
import Button from 'react-bootstrap/Button'; // Importa el componente Button de Bootstrap
import "../../styles/index.css";// Importa tus estilos CSS aquí


export const Single = props => {
	const { store, actions } = useContext(Context);
	const params = useParams();

	const [petDetails, setPetDetails] = useState([]);
	const [images, setImages] = useState([]);
	const [selectedImageIndex, setSelectedImageIndex] = useState(null);
	const [selectedImageUrl, setSelectedImageUrl] = useState("");

	useEffect(() => {
		getPetDetails();
	}, [])

	const handleImageClick = index => {
		setSelectedImageIndex(index); // Actualiza el índice de la imagen seleccionada
		const selectedImage = petDetails.images[index];
		setSelectedImageUrl(selectedImage.url); // Actualiza la URL de la imagen seleccionada
		console.log(selectedImageUrl); // Agregar salida de consola para verificar la URL seleccionada
	};

	const handleCloseImage = () => {
		setSelectedImageIndex(null);
		setSelectedImageUrl(""); // Restablece el estado de la URL de la imagen seleccionada al cerrar el modal
	};

	const handleImageChange = event => {
		setImages([...event.target.files]);
	};

	const handleImageUpload = async () => {
		const formData = new FormData();
		images.forEach(image => {
			formData.append("images", image);
		});

		try {
			const response = await fetch(`https://3001-dedalovitor-jwtpractica-acyju4v31d4.ws-eu114.gitpod.io/api/pet/${params.id}/images`, {
				method: "POST",
				body: formData,
				headers: {
					Authorization: "Bearer " + localStorage.getItem("token")
				}
			});
			if (response.ok) {
				// Manejar la respuesta si es necesario
			} else {
				// Manejar errores de la respuesta
			}
		} catch (error) {
			console.error("Error uploading images:", error);
		}
	};

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
					console.log(data.result.images); // Verifica la estructura de petDetails.images
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
		<div className="container mt-4 mb-5">
			{store.currentUserEmail ? "Hola usuario " + store.currentUserEmail : "Please register or login"}

			<div className="row mt-4 text-center">
				{petDetails.image_pet_url ? (
					<div className="container">
						<img
							src={petDetails.image_pet_url}
							className="card-img-top"
							alt={`Image of ${petDetails.name}`}
							style={{ width: "300px", height: "300px" }} // Estilos en línea para establecer el tamaño de la imagen
						/>
					</div>
				) : (
					// Si no hay imagen, muestra la imagen predeterminada
					<div className="container">
						<img
							src="https://img.freepik.com/fotos-premium/ilustracion-perro-dibujos-animados-3d-sobre-fondo-amarillo-pastel_639785-1211.jpg"
							className="card-img-top"
							alt="..."
							style={{ width: "300px", height: "300px" }} // Estilos en línea para establecer el tamaño de la imagen
						/>
					</div>
				)}
				<h2 className="card-text">name: {petDetails.name}</h2>
				<p className="card-text">id: {petDetails.id}</p>

				<p className="card-text">age: {petDetails.age}</p>

				<p className="card-text">race: {petDetails.race}</p>
				<p className="card-text">Castrated: {petDetails.castrated ? 'Yes' : 'No'}</p>
				<div className="text-center">
					<button className="btn btn-danger m-2 col-2" onClick={() => deletePet(x.id)}>DEL</button>
					<button className="btn btn-primary m-2 col-2" onClick={() => setEditingPet({ ...x })}>Edit</button>
				</div>
				<div className="container mt-2">
					<h2>Upload Images</h2>
					<input type="file" multiple onChange={handleImageChange} />
					<button onClick={handleImageUpload}>Upload Images</button>
				</div>
			</div>

			{selectedImageIndex !== null && ( // Solo muestra el modal si se ha seleccionado una imagen del carrusel

				<Modal show={true} onHide={handleCloseImage} dialogClassName="modal-fullscreen">
					<Modal.Header closeButton>
						<Modal.Title>Selected Image</Modal.Title>
					</Modal.Header>
					<Modal.Body className="d-flex justify-content-center align-items-center">
						<img src={selectedImageUrl} alt="Selected Image" className="modal-image" />
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleCloseImage}>Close</Button>
					</Modal.Footer>
				</Modal>

			)}

			{/* Carrusel */}
			{petDetails.images && petDetails.images.length > 0 && (
				<div className="container mt-2 mb-5">
					<h2>Image Carousel</h2>
					<Carousel interval={null}> {/* Establece interval en null para deshabilitar el avance automático */}
						{petDetails.images.map((image, index) => {
							if (index % 4 === 0) {
								return (
									<Carousel.Item key={index}>
										<div className="row">
											{petDetails.images.slice(index, index + 4).map((img, idx) => (
												<div key={idx} className="col">
													<img
														className="d-block w-100 carousel-image" // Agrega la clase CSS para estilos adicionales del carrusel
														src={img.url}
														alt={`Image ${idx}`}
														style={{ maxHeight: "300px", maxWidth: "300px" }} // Ajusta la altura máxima de la imagen
														onClick={() => handleImageClick(index + idx)} // Aquí se llama a la función handleImageClick
													/>
												</div>
											))}
										</div>
									</Carousel.Item>
								);
							} else {
								return null; // No renderizar elementos adicionales si no es el comienzo de un nuevo grupo de imágenes
							}
						})}
					</Carousel>
				</div>
			)}
			<div className="row m-5"></div>
			<div className="row m-5"></div>
		</div>
	);
};


