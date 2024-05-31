import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Droppable, Draggable } from 'react-beautiful-dnd';

const Row = ({ pet, index, petOrder, pets, setEditingPet }) => {
    return (
        <Droppable key={index} droppableId={`droppable-${index}`} direction="horizontal">
            {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="row">
                    {petOrder.map((petId, index) => {
                        const pet = pets.find((pet) => pet.order_number === petId);
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
                                            {/* Aquí renderiza los detalles de la mascota */}
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
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        );
                    })}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
};

export default Row;
