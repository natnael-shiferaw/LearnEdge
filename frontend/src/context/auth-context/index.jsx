import { createContext } from "react";
import {useState} from "react"

export const AuthContext = createContext(null);

const initialSignUpFormData = {
    username: "",
    email: "",
    password: ""
}

const initialSignInFormData = {
    email: "",
    password: ""
}

export default function AuthProvider({ children }) {
    const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
    const [signInFormData, setSignInFormData] = useState(initialSignInFormData);

    return (
        <AuthContext.Provider value={{
            signUpFormData, setSignUpFormData,
            signInFormData, setSignInFormData
        }}>{children}</AuthContext.Provider>
    )
}
