import { FiPlusCircle } from "react-icons/fi";
import Header from "../../components/Header";
import Title from "../../components/Title";
import './new.css';
import { useContext, useEffect, useState } from "react";
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { toast } from "react-toastify";
import { AuthContext } from "../../contexts/auth";
import { useNavigate, useParams } from "react-router-dom";

export default function New() {
    const [customers, setCustomers] = useState([]);
    const [loadCustomer, setLoadCustomer] = useState(true);
    const [customerSelected, setCustomerSelected] = useState(0);
    const [complemento, setComplemento] = useState('');
    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus] = useState('Aberto');
    const [idCustomers, setIdCustomers] = useState(false);

    const listRef = collection(db, "custumers");
    const navigate = useNavigate();

    const { user } = useContext(AuthContext);
    const { id } = useParams();

    function handleOptionChange(e) {
        setStatus(e.target.value);
    }

    function handleChangeSelect(e) {
        setAssunto(e.target.value);
    }

    async function loadId(lista) {
        const docRef = doc(db, "chamados", id);
        try {
            const snapshot = await getDoc(docRef);
            setAssunto(snapshot.data().assunto);
            setStatus(snapshot.data().status);
            setComplemento(snapshot.data().complemento);

            let index = lista.findIndex(item => item.id === snapshot.data().clientId);
            setCustomerSelected(index);
            setIdCustomers(true);
        } catch (err) {
            console.log(err);
            setIdCustomers(false);
        }
    }

    useEffect(() => {
        async function loadCustomers() {
            try {
                const snapshot = await getDocs(listRef);
                let lista = [];

                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        nomeAleatorio: doc.data().nomeAleatorio,
                    });
                });

                if (lista.length === 0) {
                    console.log("Nenhuma informação encontrada");
                    setCustomers([{ id: '1', nomeAleatorio: 'Cliente Teste' }]);
                } else {
                    setCustomers(lista);
                }

                if (id) {
                    loadId(lista);
                }
            } catch (err) {
                console.log(err);
                setCustomers([{ id: '1', nomeAleatorio: 'Cliente Teste' }]);
            } finally {
                setLoadCustomer(false);
            }
        }

        loadCustomers();
    }, [id]);

    function handleChangeCustomer(e) {
        setCustomerSelected(e.target.value);
        console.log(customers[e.target.value].nomeAleatorio);
    }

    async function handleRegister(e) {
        e.preventDefault();

        if (customerSelected < 0 || customerSelected >= customers.length) {
            toast.error("Cliente selecionado é inválido");
            return;
        }

        if (idCustomers) {
            // Atualizando registro
            const docRef = doc(db, "chamados", id);
            try {
                await updateDoc(docRef, {
                    cliente: customers[customerSelected].nomeAleatorio,
                    clienteId: customers[customerSelected].id,
                    assunto: assunto,
                    complemento: complemento,
                    status: status,
                    userId: user.uid,
                });
                toast.success("Chamado Atualizado");
                setCustomerSelected(0);
                setComplemento('');
                navigate('/dashboard');
            } catch (err) {
                console.log(err);
                toast.error("Erro ao Atualizar");
            }
            return;
        }

        try {
            await addDoc(collection(db, "chamados"), {
                created: new Date(),
                cliente: customers[customerSelected].nomeAleatorio,
                clientId: customers[customerSelected].id,
                assunto: assunto,
                complemento: complemento,
                status: status,
                userId: user.uid,
            });
            toast.success("Chamado Registrado");
            setComplemento('');
            setCustomerSelected(0);
        } catch (err) {
            toast.error("Algo deu Errado");
            console.log(err);
        }
    }

    return (
        <div>
            <Header />

            <div className="content">
                <Title name="Novo Chamado">
                    <FiPlusCircle size={25} />
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={handleRegister}>
                        <label>Clientes</label>
                        {loadCustomer ? (
                            <input type="text" disabled={true} value="Carregando clientes..." />
                        ) : (
                            <select value={customerSelected} onChange={handleChangeCustomer}>
                                {customers.map((item, index) => {
                                    return (
                                        <option key={index} value={index}>
                                            {item.nomeAleatorio}
                                        </option>
                                    );
                                })}
                            </select>
                        )}

                        <label>Assuntos</label>
                        <select value={assunto} onChange={handleChangeSelect}>
                            <option value="Suporte">Suporte</option>
                            <option value="Visita Tecnica">Visita Tecnica</option>
                            <option value="Financas">Financas</option>
                        </select>
                        <label>Status</label>
                        <div className="status">
                            <input
                                type="radio"
                                name="radio"
                                value="Aberto"
                                onChange={handleOptionChange}
                                checked={status === 'Aberto'}
                            />
                            <span>Em Aberto</span>
                            <input
                                type="radio"
                                name="radio"
                                value="Progresso"
                                onChange={handleOptionChange}
                                checked={status === 'Progresso'}
                            />
                            <span>Progresso</span>
                            <input
                                type="radio"
                                name="radio"
                                value="Atendido"
                                onChange={handleOptionChange}
                                checked={status === 'Atendido'}
                            />
                            <span>Atendido</span>
                        </div>

                        <label>Complemento</label>
                        <textarea
                            type="text"
                            placeholder="Descreva seu problema (opcional)"
                            value={complemento}
                            onChange={(e) => setComplemento(e.target.value)}
                        />
                        <button type="submit">Registrar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}