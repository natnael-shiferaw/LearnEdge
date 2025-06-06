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
import HomePage from "./pages/home"
import CoursesPage from "./pages/courses"
import CourseDetailPage from "./pages/courses/[id]"
import CategoriesPage from "./pages/categories"
import MyCoursesPage from "./pages/student/my-courses"
import CourseProgressPage from "./pages/student/my-courses/course-progress/[id]"
import PaymentReturnPage from "./pages/student/payment-return"
import { ToastViewport } from "@/components/ui/toast"

function App() {
  const { auth } = useContext(AuthContext)

  return (
    <>
      <Header />
      <Routes>
        {/** Homepage */}
        <Route path="/"  element={<HomePage />} />
        <Route path="/home"  element={<HomePage />} />
        <Route path="/courses"  element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path='/categories' element={<CategoriesPage />} />

        {/** Authentication page */}
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
          <Route path="my-courses" element={<MyCoursesPage />}></Route>
        </Route>

        <Route
          path="/student/my-courses/course-progress/:id"
          element={
            <ProtectedRoute
              element={<CourseProgressPage />}
              authenticated={auth.authenticated}
              user={auth.user}
            />
          }
        />
        {/* payment Route */}
        <Route path="/payment-return" element={<PaymentReturnPage />} />
  
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

      <ToastViewport />
    </>
  )
}

export default App
