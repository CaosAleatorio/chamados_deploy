import "./signup.css";

import logo from "../../assets/logo.png";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";

export default function SignUp() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { signUp, loadingAuth } = useContext(AuthContext);
    

    async function handlesubmit(e) {
        e.preventDefault();

        if (name !== '' && email !== '' && password !== '') {
            await signUp(name, email, password);
        }
    }

    return (
        <div className="container-center">
            <div className="login">
                <div className="login-area">
                    <img src={logo} alt="logo do sistema chamadas" />
                </div>

                <form onSubmit={handlesubmit}>
                    <h1>Nova Conta</h1>
                    <input
                        type="text"
                        placeholder="nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="email@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="*************"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">
                        {loadingAuth ? 'Carregando...' : 'Cadastrar'}
                    </button>
                </form>
                <Link to="/">Ja possui uma conta? Faça login</Link>
            </div>
        </div>
    );
}