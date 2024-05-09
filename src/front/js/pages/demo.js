import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { Context } from "../store/appContext";

export const Demo = () => {
	const { store, actions } = useContext(Context);

	useEffect(() => {
		actions.getCurrentUserEmail();
	}, [])

	return (
		<div className="container">
			HOLA USUARIO {store.getCurrentUserEmail}
		</div>
	);
};
