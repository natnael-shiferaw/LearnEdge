import { GraduationCap } from 'lucide-react'
import React from 'react'
import {Link} from 'react-router-dom'

function Header() {
  return (
    <header className='sticky z-50 top-0 bg-gray-50 flex items-center border-b border-gray-300 px-4 lg:px-6 h-14'>
        <Link to={'/'} className='text-gray-900 flex items-center justify-center space-x-1'>
            <GraduationCap className='h-6 w-6 '/>
            <span className='text-xl font-extrabold'>
                LearnEdge
            </span>
        </Link>
    </header>
  )
}

export default Header
