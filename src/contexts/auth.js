import { createContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../services/firebaseConnection";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


export const AuthContext = createContext({});

function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            const storageUser = localStorage.getItem('@ticketsPRO');

            if (storageUser) {
                setUser(JSON.parse(storageUser));
                setLoading(false);
            }
            setLoading(false);
        }
        loadUser();
    }, []);

    async function signIn(email, password) {
        setLoadingAuth(true)

        await signInWithEmailAndPassword(auth, email, password)
            .then(async (value) => {
                let uid = value.user.uid;

                const docRef = doc(db, "users", uid);
                const docSnap = await getDoc(docRef)

                let data = {
                    uid: uid,
                    name: docSnap.data().name,
                    email: value.user.email,
                    avatarUrl: docSnap.data().avatarUrl,
                }

                setUser(data);
                storageUser(data);
                setLoadingAuth(false)
                toast.success("Bem-vindo de volta!!!")
                navigate("/dashboard")
            }).catch((err) => {
                console.log(err);
                setLoadingAuth(false)
                toast.error("ops! Algo deu errado")
            });

    }

    async function signUp(name, email, password) {
        setLoadingAuth(true);

        await createUserWithEmailAndPassword(auth, email, password)
            .then(async (value) => {
                let uid = value.user.uid;

                await setDoc(doc(db, "users", uid), {
                    name: name,
                    avatarUrl: null
                })
                    .then(() => {
                        let data = {
                            uid: uid,
                            name: name,
                            email: value.user.email,
                            avatarUrl: null,
                        };

                        setUser(data);
                        storageUser(data);
                        setLoadingAuth(false);
                        toast.success('Bem vindo a plataforma!');
                        navigate('/dashboard');
                    })

            })
            .catch((err) => {
                console.log(err);
                setLoadingAuth(false);
            });
    }

    function storageUser(data) {
        localStorage.setItem('@ticketsPRO', JSON.stringify(data));
    }

    async function logOut() {
        await signOut(auth);
        localStorage.removeItem('@ticketsPRO');
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                signed: !!user,
                user,
                signIn,
                signUp,
                logOut,
                loadingAuth,
                loading,
                storageUser,
                setUser
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;