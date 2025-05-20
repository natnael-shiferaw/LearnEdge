import React from 'react'
import { Outlet } from 'react-router-dom'

function StudentViewLayout() {
    return (
        <div>
            <Outlet />
        </div>
    )
}

export default StudentViewLayout
