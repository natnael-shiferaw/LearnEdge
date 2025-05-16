import { Skeleton } from "@/components/ui/skeleton";
import { checkAuthService, loginService, registerService } from "@/services";
import { createContext, useEffect } from "react";
import { useState } from "react"

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
    const [auth, setAuth] = useState({
        authenticated: false,
        user: null,
    })
    const [loading, setLoading] = useState(true);

    // Handle User register
    const handleRegisterUser = async () => {
        const data = await registerService(signUpFormData);
        console.log(data);
    }
    // Handle User login
    const handleLoginUser = async () => {
        const data = await loginService(signInFormData);
        // check if user is successfully logged in
        if (data.success) {
            sessionStorage.setItem('accessToken', JSON.stringify(data.data.accessToken));
            setAuth({ authenticated: true, user: data.data.user })
        } else {
            setAuth({ authenticated: false, user: null })
        }
    }
    // check auth user
    const checkAuthUser = async () => {
        try {
            const data = await checkAuthService();
            if (data.success) {
                setAuth({ authenticated: true, user: data.data.user })
                setLoading(false);
            } else {
                setAuth({ authenticated: false, user: null })
                setLoading(false);
            }
        } catch (error) {
            console.log(error)
            if(!error?.response?.data?.success) {
                setAuth({ authenticated: false, user: null })
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        checkAuthUser();
    }, [])

    console.log("This is auth data", auth);

    return (
        <AuthContext.Provider value={{
            signUpFormData, setSignUpFormData,
            signInFormData, setSignInFormData,
            handleRegisterUser,
            handleLoginUser,
            auth
        }}>{
                loading ? <Skeleton /> : children
            }
        </AuthContext.Provider>
    )
}
