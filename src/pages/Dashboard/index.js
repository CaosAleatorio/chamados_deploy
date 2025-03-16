import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../contexts/auth"
import Header from '../../components/Header'
import Title from "../../components/Title";
import './dashboard.css'
import { FiEdit2, FiMessageSquare, FiPlus, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { collection, getDoc, getDocs, limit, orderBy, query, startAfter } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { format } from 'date-fns'
import Modal from "../../components/Modal";

export default function Dashboard() {

    const listRef = collection(db, 'chamados');

    const [chamados, setChamados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [empty, setEmpty] = useState(false);
    const [lastDocs, setLastDocs] = useState();
    const [loadingMore, setLoadingMore] = useState(false);
    const [showPostModal, setshowPostModal] = useState(false);
    const [detail, setDetail] = useState({});

    useEffect(() => {
        async function loadingChamados() {
            const q = query(listRef, orderBy('created', 'desc'), limit(5));

            const querySnapshot = await getDocs(q);
            setChamados([]);
            await updateState(querySnapshot);

            setLoading(false);

        }
        loadingChamados();

        return () => {

        }
    }, []);

    async function updateState(querySnapshot) {
        const isCollectionEmpyt = querySnapshot.size === 0;

        if (!isCollectionEmpyt) {
            let lista = [];

            querySnapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    cliente: doc.data().cliente,
                    assunto: doc.data().assunto,
                    created: doc.data().created.toDate(),
                    createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    status: doc.data().status,
                    complemento: doc.data().complemento,
                    userId: doc.data().userId
                })
            });

            const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
            setChamados(chamados => [...chamados, ...lista]);
            setLastDocs(lastDoc);
        } else {
            setEmpty(true);
        }
        setLoadingMore(false);
    }

    if (loading) {
        return (
            <div>
                <Header />

                <div className="content">
                    <Title name={"Tickets"}>
                        <FiMessageSquare size={25} />
                    </Title>

                    <div className="container dashboard">
                        <span>Buscando Chamados...</span>
                    </div>
                </div>
            </div>
        )
    }

    async function handleMore() {
        setLoadingMore(true);
        const q = query(listRef, orderBy('created', 'desc'), limit(5), startAfter(lastDocs));
        const querySnapshot = await getDocs(q);
        await updateState(querySnapshot);
    }

    function toggleModal(item) {
        setshowPostModal(!showPostModal);
        setDetail(item);
    }

    return (
        <div>
            <Header />

            <div className="content">
                <Title name={"Tickets"}>
                    <FiMessageSquare size={25} />
                </Title>

                <>
                    {chamados.length === 0 ? (
                        <div className="container dashboard">
                            <span>Nenhum chamado encontrado...</span>
                            <Link to="/new" className="new">
                                <FiPlus size={25} />
                                Novo Chamado
                            </Link>
                        </div>
                    ) : (
                        <>
                            <Link to="/new" className="new">
                                <FiPlus size={25} />
                                Novo Chamado
                            </Link>

                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col">Clientes</th>
                                        <th scope="col">Assuntos</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Cadastrado em</th>
                                        <th scope="col">#</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {chamados.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td data-label="Cliente">{item.cliente}</td>
                                                <td data-label="Assuntos">{item.assunto}</td>
                                                <td data-label="Status">
                                                    <span className="badge" style={{ backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999' }}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td data-label="Cadastrado">{item.createdFormat}</td>
                                                <td data-label="#">
                                                    <button className="action" style={{ backgroundColor: '#3583f6' }} onClick={() => toggleModal(item)}>
                                                        <FiSearch color="#fff" size={17} />
                                                    </button>
                                                    <Link to={`/new/${item.id}`} className="action" style={{ backgroundColor: '#f6a935' }}>
                                                        <FiEdit2 color="#fff" size={17} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>

                            </table>

                            {loadingMore && <h3>Buscando dados...</h3>}
                            {!loadingMore && !empty && (
                                <button className="btn-more" onClick={handleMore}>Buscar mais</button>
                            )}

                        </>
                    )}



                </>

            </div>
            {showPostModal && (
                <Modal
                    conteudo={detail}
                    close={() => setshowPostModal(!showPostModal)}
                />
            )}
        </div>
    )
}