import { RouterProvider } from "react-router"
import { router } from "./routes/routes"
import { AuthProvider } from "./context/AuthContext"
import { Toaster } from 'sonner'


function App() {
  return (
    <AuthProvider>
      <Toaster richColors position="top-right" />
      <RouterProvider router={router}/>
    </AuthProvider>
  )
}

export default App