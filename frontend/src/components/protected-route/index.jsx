import { React, Fragment } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

function ProtectedRoute({ authenticated, user, element }) {
    const location = useLocation();

    // checks if user is not authenticated
    if (!authenticated && !location.pathname.includes('/auth')) {
        return <Navigate to='/home' />
    }
    // checks if user is authenticated and isn't an instructor and tries to access instructor routes
    if (authenticated && user?.role !== 'instructor' &&
        (location.pathname.includes('instructor') || location.pathname.includes('/auth'))) {
        return <Navigate to='/student' />
    }
    if (authenticated && user?.role === 'instructor' && !location.pathname.includes('instructor')) {
        return <Navigate to='/instructor' />
    }

    return <Fragment>{element}</Fragment>
}

export default ProtectedRoute
