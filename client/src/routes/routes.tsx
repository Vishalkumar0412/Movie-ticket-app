
import MainLayout from '@/Layouts/MainLayout'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import MoviesPage from '@/pages/MoviesPage'
import MovieDetails from '@/pages/MovieDetails'
// import MyBookings from '@/pages/MyBookings'
import PageNotFound from '@/pages/PageNotFound'
import Profile from '@/pages/Profile'
import Signup from '@/pages/Signup'
import {createBrowserRouter} from 'react-router'
import RequireAuth from './RequireAuth'
import RequireAdmin from './RequireAdmin'
import Admin from '@/pages/admin/Admin'
import AddMovie from '@/pages/admin/AddMovie'
import AddTheater from '@/pages/admin/AddTheater'
import AddShowtime from '@/pages/admin/AddShowtime'
import MyBookings from '@/pages/MyBookings'
// import RequireAuth from '@/routes/RequireAuth'

export const router = createBrowserRouter([
    {
        path:"",
        element:<MainLayout/>,
        children:[
            {
                path:"/",
                element:<Home/>
            },
            {
                path:'/login',
                element:<Login/>
            },
            {
                path:"/signup",
                element:<Signup/>
            },
            {
                path:"/profile",
                element:<Profile/>
            },
            { path:"/movies", element:<MoviesPage/> },
            { path:"/movies/:movieId", element:<RequireAuth><MovieDetails/></RequireAuth> },
            { path:"/my-bookings", element:<RequireAuth><MyBookings/></RequireAuth> },
            { path:"/admin", element:<RequireAdmin><Admin/></RequireAdmin> },
            { path:"/admin/add-movie", element:<RequireAdmin><AddMovie/></RequireAdmin> },
            { path:"/admin/add-theater", element:<RequireAdmin><AddTheater/></RequireAdmin> },
            { path:"/admin/add-show", element:<RequireAdmin><AddShowtime/></RequireAdmin> },
            {
                path:"*",
                element:<PageNotFound/>
            }
        ]
    }
])