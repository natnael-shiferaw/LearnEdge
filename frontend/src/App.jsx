import { Routes, Route } from "react-router-dom"
import AuthPage from "@/pages/auth"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import ProtectedRoute from "./components/protected-route"
import { useContext } from "react"
import { AuthContext } from "./context/auth-context"
import InstructorDashboardPage from "./pages/instructor"
import StudentViewLayout from "./components/student-view/layout"
import StudentHomepage from "./pages/student/home"

function App() {
  const { auth } = useContext(AuthContext)

  return (
    <>
      <Header />
      <Routes>
        <Route path="/auth" element={<ProtectedRoute
          element={<AuthPage />}
          authenticated={auth?.authenticated}
          user={auth?.user} />} >
        </Route>

        <Route path="/instructor" element={<ProtectedRoute
          element={<InstructorDashboardPage />}
          authenticated={auth?.authenticated}
          user={auth?.user} />} >
        </Route>

        <Route path="/" element={<ProtectedRoute
          element={<StudentViewLayout />}
          authenticated={auth?.authenticated}
          user={auth?.user} />}>
          <Route path="" element={<StudentHomepage />}></Route>
          <Route path="home" element={<StudentHomepage />}></Route>
        </Route>
      </Routes>
      <Footer />
    </>
  )
}

export default App
