import React from 'react'
import { Outlet } from 'react-router-dom'

function InstructorViewLayout() {
    return (
        <div>
            <Outlet />
        </div>
    )
}

export default InstructorViewLayout
