import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

function ProtectedRoute({authenticated, user, element}) {
    const location = useLocation();
    // checks if user is not authenticated and the route they are accessing isn't '/auth'
    if (!authenticated && !location.pathname.includes('/auth')) {
        return <Navigate to='/auth' />
    }
    // checks if user is authenticated and isn't an admin and tries to access admin routes
    if (authenticated && user?.role !== 'admin' &&
        (location.pathname.includes('admin') || location.pathname.includes('/auth')))
        {
            return <Navigate to='/home' />   
        }
    if (authenticated && user?.role === 'admin' && !location.pathname.includes('admin')) {
        return <Navigate to='/admin' />
    }

  return <Fragment>{element}</Fragment>
}

export default ProtectedRoute
