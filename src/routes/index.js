import { Routes, Route } from "react-router-dom";


import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import Dashboard from "../pages/Dashboard";
import { Private } from "./Private";
import Profile from "../pages/Profile";
import Custumers from "../pages/Custumers";
import New from "../pages/New";
import Erro from "../pages/Erro";

function RoutesApp() {
    return (
        <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
            <Route path="/profile" element={<Private><Profile /></Private>} />
            <Route path="/custumers" element={<Private><Custumers /></Private>} />
            <Route path="/new" element={<Private><New /></Private>} />
            
            <Route path="/new/:id" element={<Private><New /></Private>} />

            <Route path="*" element={<Erro />} /> 
        </Routes>
    )
}

export default RoutesApp;