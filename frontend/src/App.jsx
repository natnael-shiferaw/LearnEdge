import { Routes, Route } from "react-router-dom"
import AuthPage from "@/pages/auth"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

function App() {
  return (
    <>
     <Header />
     <Routes>
      <Route path="/auth" element={<AuthPage />} />
     </Routes>
     <Footer />
    </>
  )
}

export default App
