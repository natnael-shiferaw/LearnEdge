import React from 'react'
import { Outlet } from 'react-router-dom'

function StudentViewLayout() {
    return (
        <div>
            StudentViewLayout
            <Outlet />
        </div>
    )
}

export default StudentViewLayout
