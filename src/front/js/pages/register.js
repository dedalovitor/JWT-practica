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
    const [passwordRequirements, setPasswordRequirements] = useState(false);
    const [emailRequirements, setEmailRequirements] = useState(false);

    const sendRegisterCredential = async () => {
        const response = await fetch("https://3001-dedalovitor-jwtpractica-acyju4v31d4.ws-eu114.gitpod.io/api/register", {
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
        } else if (response.status === 300) {
            setError(data.response);
        }
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?\":{}|<>]).{8,}$/;
        setPasswordRequirements(passwordRegex.test(e.target.value));
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        setEmailRequirements(emailRegex.test(e.target.value));
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
                        handleEmailChange(e);
                    }}></input>
                    {email && !emailRequirements && <p className="alert alert-danger">Invalid email address</p>}
                </div>
                <div className="mb-2">
                    <label className="me-1" htmlFor="password">Password</label>
                    <input name="password" placeholder="password" value={password} onChange={(e) => {
                        setError(false);
                        handlePasswordChange(e);
                    }}></input>
                    {password && !passwordRequirements && (
                        <p className="alert alert-danger">
                            Password must be at least 8 characters long and contain at least one digit, one uppercase letter, one lowercase letter, and one special character
                        </p>
                    )}
                </div>
                <button className="btn btn-primary" onClick={() => sendRegisterCredential()}>Register</button>
                {error ? <p className="alert alert-danger">{error}</p> : null}
            </div>
        </div >
    );
};

