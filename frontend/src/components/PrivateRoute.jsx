import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

// This component guards routes that require login.
// If user is not logged in it redirects to /login.
// If user is logged in it renders the child route (Outlet).
function PrivateRoute() {
    const { user } = useSelector((state) => state.auth)
    return user ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoute
