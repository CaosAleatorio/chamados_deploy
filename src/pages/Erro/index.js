import { Link } from 'react-router-dom'; 
import './erro.css'; 

function Erro() {
    return (
        <div className="erro-container">
            <h1 className="erro-title">Erro 404</h1>
            <p className="erro-message">Página não encontrada</p>
            <Link to="/" className="erro-link">Voltar para a página inicial</Link>
        </div>
    );
}

export default Erro;