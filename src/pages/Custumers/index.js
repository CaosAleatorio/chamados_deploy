import { FiUser } from "react-icons/fi";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { toast } from "react-toastify";

export default function Custumers() {

    const [name, setName] = useState('');
    const [nuit, setNuit] = useState('');
    const [endereco, setEndereco] = useState('');


    async function handleRegister(e) {
        e.preventDefault();
        if (name !== '' && nuit !== '' && endereco !== '') {
            await addDoc(collection(db, 'custumers'), {
                nomeAleatorio: name,
                nuit: nuit,
                endereco: endereco
            })
            .then(() => {
                setName('');
                setNuit('');
                setEndereco('');
                toast.success('Cadastrado com sucesso!');
            }).catch((err) => {
                console.log(err);
                toast.err('Erro ao cadastrar!');
            });
        } else {
            toast.error('Preencha todos os campos!');
        }

    }

    return (
        <div>
            <Header />
            <div className="content">
                <Title name={'Clientes'}>
                    <FiUser size={25} />
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={handleRegister}>
                        <label>Nome Aleatorio</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <label>Nuit</label>
                        <input
                            type="text"
                            value={nuit}
                            onChange={(e) => setNuit(e.target.value)}
                        />
                        <label>Endereço</label>
                        <input
                            type="text"
                            value={endereco}
                            onChange={(e) => setEndereco(e.target.value)}
                        />

                        <button type="submit">Cadastrar</button>
                    </form>
                </div>

            </div>
        </div>
    )
}