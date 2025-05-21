import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table"
import {
    ChevronDown,
    Plus,
    Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { InstructorSidebar } from "@/components/instructor-sidebar"
import { AddCourseDialog } from "@/components/instructor/add-course-dialog"

function InstructorCoursesPage() {
    const navigate = useNavigate()
    const [isAddCourseOpen, setIsAddCourseOpen] = useState(false)

    // Mock data for instructor courses
    const courses = [
        {
            id: 1,
            title: "Web Development Bootcamp",
            students: 542,
            revenue: "$5,420",
            rating: 4.9,
            published: true,
            lastUpdated: "2023-05-10",
            image: "/placeholder.svg?height=200&width=350",
        },
        {
            id: 2,
            title: "JavaScript Advanced Concepts",
            students: 328,
            revenue: "$3,280",
            rating: 4.7,
            published: true,
            lastUpdated: "2023-04-15",
            image: "/placeholder.svg?height=200&width=350",
        },
        {
            id: 4,
            title: "Node.js Masterclass",
            students: 160,
            revenue: "$1,600",
            rating: 4.6,
            published: true,
            lastUpdated: "2023-02-18",
            image: "/placeholder.svg?height=200&width=350",
        },
        {
            id: 5,
            title: "TypeScript Fundamentals",
            students: 0,
            revenue: "$0",
            rating: 0,
            published: false,
            lastUpdated: "2023-05-01",
            image: "/placeholder.svg?height=200&width=350",
        },
    ]

    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex flex-1">
                <InstructorSidebar />
                <div className="container py-8">
                    <div className='mb-6'>
                        <h1 className="text-3xl font-bold tracking-tight">All Courses</h1>
                        <p className="text-muted-foreground">Manage your courses</p>
                    </div>
                    <div className='space-y-6'>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">

                            <div className="flex items-center">
                                <Button onClick={() => setIsAddCourseOpen(true)}>
                                    <Plus className="mr-2 h-4 w-4" /> Add Course

                                </Button>

                            </div>

                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Enrolled</TableHead>
                                    <TableHead>Revenue</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead>Last Updated</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {courses.map((course) => (
                                    <TableRow key={course.id}>
                                        <TableCell className="font-medium">{course.title}</TableCell>
                                        <TableCell>{course.students}</TableCell>
                                        <TableCell>{course.revenue}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Star
                                                    className={`h-4 w-4 ${course.rating > 0 ? "fill-primary text-primary" : "text-muted-foreground"
                                                        }`}
                                                />
                                                <span>{course.rating > 0 ? course.rating : "N/A"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{course.lastUpdated}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <ChevronDown className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => navigate(`/instructor/courses/${course.id}/edit`)}>
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

            </div>
            <AddCourseDialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen} />
        </div>
    )
}

export default InstructorCoursesPage
