import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";

export const Home = () => {
	const navigate = useNavigate();
	const { store, actions } = useContext(Context);


	return (
		<div className="text-center mt-5">
			{store.currentUserEmail ? "Hola usuario " + store.currentUserEmail : "Please register or login"}
		</div>
	);
};
