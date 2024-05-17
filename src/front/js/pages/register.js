import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";

export const Register = () => {
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const sendRegisterCredential = async () => {
        const response = await fetch("https://3001-4geeksacade-reactflaskh-1gboru965s5.ws-eu114.gitpod.io/api/register", {
            method: "POST",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
            })
        });
        const data = await response.json();
        if (response.ok) {
            navigate("/login");
        } else if (response.status == 300) {
            setError(data.response);
        }
    }


    return (
        <div className="text-center mt-5">
            REGISTER
            <div>
                <div className="mb-2">
                    <label className="me-1" htmlFor="name">Name</label>
                    <input name="name" placeholder="name" value={name} onChange={(e) => {
                        setError(false);
                        setName(e.target.value);
                    }}></input>
                </div>
                <div className="mb-2">
                    <label className="me-1" htmlFor="email">Email</label>
                    <input name="email" placeholder="email" value={email} onChange={(e) => {
                        setError(false);
                        setEmail(e.target.value);
                    }}></input>
                </div>
                <div className="mb-2">
                    <label className="me-1" htmlFor="password">Password</label>
                    <input name="password" placeholder="password" value={password} onChange={(e) => {
                        setError(false);
                        setPassword(e.target.value);
                    }}></input>
                </div>
                <button className="btn btn-primary" onClick={() => sendRegisterCredential()}>Register</button>
                {error ? <p className="alert alert-danger">{error}</p> : null}
            </div>
        </div >
    );
};
