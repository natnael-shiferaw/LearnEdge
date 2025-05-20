import { Routes, Route } from "react-router-dom"
import AuthPage from "@/pages/auth"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import ProtectedRoute from "./components/protected-route"
import { useContext } from "react"
import { AuthContext } from "./context/auth-context"
import InstructorDashboardPage from "./pages/instructor"
import StudentViewLayout from "./components/student-view/layout"
import StudentDashboardPage from "./pages/student/dashboard"
import NotFoundPage from "./pages/not-found"
import InstructorCoursesPage from "./pages/instructor/courses"
import InstructorViewLayout from "./components/instructor/layout"
import InstructorStudentsPage from "./pages/instructor/students"
import CourseEditPage from "./pages/instructor/courses/[id]/edit"

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

        {/** Instructor Routes */}
        <Route path="/instructor" element={<ProtectedRoute
          element={<InstructorViewLayout />}
          authenticated={auth?.authenticated}
          user={auth?.user} />} >
          <Route path="" element={<InstructorDashboardPage />}></Route>
          <Route path="courses" element={<InstructorCoursesPage />}>
            {/* dynamic course id */}
            {/* <Route path=":id"> */}
            {/* <Route path="edit" element={<CourseEditPage />} /> */}
            {/* </Route> */}
          </Route>
          <Route path="students" element={<InstructorStudentsPage />}></Route>
        </Route>

        {/** Student Routes */}
        <Route path="/student" element={<ProtectedRoute
          element={<StudentViewLayout />}
          authenticated={auth?.authenticated}
          user={auth?.user} />}>
          <Route path="" element={<StudentDashboardPage />}></Route>
          <Route path="dashboard" element={<StudentDashboardPage />}></Route>
        </Route>

        <Route
          path="/instructor/courses/:id/edit"
          element={
            <ProtectedRoute
              element={<CourseEditPage />}
              authenticated={auth.authenticated}
              user={auth.user}
            />
          }
        />
        {/** 404 page route */}
        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>
      <Footer />
    </>
  )
}

export default App
