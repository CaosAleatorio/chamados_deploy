import { FiSettings, FiUpload } from "react-icons/fi";
import Header from "../../components/Header";
import Title from "../../components/Title";
import avatar from "../../assets/avatar.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/auth";
import axios from 'axios';

import './profile.css';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { toast } from "react-toastify";

export default function Profile() {

    const { user, storageUser, setUser, logOut } = useContext(AuthContext);

    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [imgAvatar, setImgAvatar] = useState(null);

    const [name, setName] = useState(user && user.name);
    const [email, setEmail] = useState(user && user.email);

    function handleFile(e) {
        if (e.target.files[0]) {
            const img = e.target.files[0];

            if (img.type === `image/jpeg` || img.type === `image/png`) {
                setAvatarUrl(URL.createObjectURL(img));
                setImgAvatar(img);
            } else {
                alert("PNG ou JPG")
                setImgAvatar(null);
                return;
            }
        }
    }

    async function handleUpload() {
        if (imgAvatar) {
            const formData = new FormData();
            formData.append('avatar', imgAvatar);

            try {
                const response = await axios.post('http://localhost:5000/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                const filePath = response.data.filePath;

                // Atualizar o avatarUrl no estado e no Firestore
                const docRef = doc(db, 'users', user.uid);
                await updateDoc(docRef, {
                    avatarUrl: filePath,
                    name: name,
                });

                let data = {
                    ...user,
                    avatarUrl: filePath,
                    name, name,
                };

                setUser(data);
                storageUser(data);
                setAvatarUrl(filePath); // Atualizar o estado com o caminho correto
                toast.success("Avatar atualizado com sucesso!");
            } catch (error) {
                console.error("Erro ao fazer upload do arquivo:", error);
                toast.error("Erro ao fazer upload do arquivo");
            }
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (imgAvatar === null && name !== '' ) {
            // Atualizar apenas o nome do user
            const docRef = doc(db, 'users', user.uid);
            await updateDoc(docRef, {
                name: name,
            })
            .then(() => {
                let data = {
                    ...user,
                    name: name,
                };
                setUser(data);
                storageUser(data);
                toast.success("Atualizado com sucesso!");
            });
        } else if(name !== '' && imgAvatar !== null) {
            // Atualizar o avatar e o nome do user
            handleUpload();
        }
    }

    return (
        <div>
            <Header />
            <div className="content">
                <Title name={'Minha Conta'}>
                    <FiSettings color="#000" size={25} />
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={handleSubmit}>
                        <label className="label-avatar">
                            <span>
                                <FiUpload color="#fff" size={25} />
                            </span>
                            <input type="file" accept="image/*" onChange={handleFile} /> <br />
                            {avatarUrl === null ? (
                                <img src={avatar} alt="Foto de Perfil" width={250} height={250} />
                            ) : (
                                <img src={`http://localhost:5000${avatarUrl}`} alt="Foto de Perfil" width={250} height={250} />)}
                        </label>

                        <label>Nome: </label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

                        <label>E-mail: </label>
                        <input type="email" value={email} disabled={true} />
                        <button type="submit">Salvar</button>
                    </form>
                </div>

                <div className="container">
                    <button className="logout-btn" onClick={() => logOut()}>Sair</button>
                </div>

            </div>
        </div>
    );
}