import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    ChevronDown,
    FileText,
    Plus,
    Search,
    Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
                    <div className='mb-8'>
                        <h1 className="text-3xl font-bold tracking-tight">All Courses</h1>
                        <p className="text-muted-foreground">Manage your courses</p>
                    </div>
                    <div className='space-y-6'>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />

                                <Input

                                    type="search"

                                    placeholder="Search courses..."

                                    className="w-full pl-8 sm:w-[300px] md:w-[400px]"

                                />

                            </div>

                            <div className="flex items-center gap-2">

                                <DropdownMenu>

                                    <DropdownMenuTrigger asChild>

                                        <Button variant="outline" className="flex items-center gap-2">

                                            <FileText className="h-4 w-4" />

                                            <span>Filter</span>

                                            <ChevronDown className="h-4 w-4" />

                                        </Button>

                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end">

                                        <DropdownMenuLabel>Filter by</DropdownMenuLabel>

                                        <DropdownMenuSeparator />

                                        <DropdownMenuItem>All Courses</DropdownMenuItem>

                                        <DropdownMenuItem>Published</DropdownMenuItem>

                                        <DropdownMenuItem>Draft</DropdownMenuItem>

                                        <DropdownMenuItem>Most Enrolled</DropdownMenuItem>

                                        <DropdownMenuItem>Highest Rated</DropdownMenuItem>

                                    </DropdownMenuContent>

                                </DropdownMenu>

                                <Button onClick={() => setIsAddCourseOpen(true)}>

                                    <Plus className="mr-2 h-4 w-4" /> Add Course

                                </Button>

                            </div>

                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {courses.map((course) => (
                                <Card key={course.id} className="overflow-hidden">
                                    <div className="aspect-video w-full overflow-hidden bg-muted">
                                        <img
                                            src={course.image || "/placeholder.svg"}
                                            alt={course.title}
                                            className="h-full w-full object-cover transition-transform hover:scale-105"
                                        />
                                    </div>
                                    <CardHeader className="p-4">
                                        <div className="flex items-center justify-between">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${course.published

                                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"

                                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"

                                                    }`}
                                            >
                                                {course.published ? "Published" : "Draft"}
                                            </span>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <ChevronDown className="h-4 w-4" />
                                                        <span className="sr-only">Actions</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => navigate(`/instructor/courses/${course.id}/edit`)}>
                                                        Edit Course
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => navigate(`/instructor/courses/${course.id}/curriculum`)}
                                                    >
                                                        Manage Curriculum
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => navigate(`/instructor/courses/${course.id}/students`)}
                                                    >
                                                        View Students
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => navigate(`/instructor/courses/${course.id}/analytics`)}
                                                    >
                                                        Analytics
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive">Delete Course</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <CardTitle className="line-clamp-2 text-lg">{course.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-2 gap-4 p-4 pt-0">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Students</p>
                                            <p className="font-medium">{course.students}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Revenue</p>
                                            <p className="font-medium">{course.revenue}</p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-muted-foreground">Rating</p>
                                            <div className="flex items-center">
                                                <Star
                                                    className={`h-4 w-4 ${course.rating > 0 ? "fill-primary text-primary" : "text-muted-foreground"

                                                        }`}
                                                />
                                                <span className="ml-1 text-sm font-medium">
                                                    {course.rating > 0 ? course.rating : "N/A"}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-sm text-muted-foreground">Last Updated</p>
                                            <p className="text-sm">{course.lastUpdated}</p>
                                        </div>
                                    </CardContent>

                                    <div className="flex border-t p-4">
                                        <Button
                                            className="flex-1"
                                            variant={course.published ? "outline" : "default"}
                                            onClick={() => navigate(`/instructor/courses/${course.id}/edit`)}
                                        >
                                            {course.published ? "Edit Course" : "Continue Setup"}
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                            {/* Add New Course Card */}
                            <Card className="flex aspect-[3/4] flex-col items-center justify-center overflow-hidden border-dashed">
                                <div className="flex flex-col items-center justify-center p-6 text-center">
                                    <div className="mb-4 rounded-full bg-primary/10 p-3">
                                        <Plus className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-medium">Create New Course</h3>
                                    <p className="mb-4 text-sm text-muted-foreground">
                                        Start building your next course and share your knowledge
                                    </p>
                                    <Button onClick={() => setIsAddCourseOpen(true)}>Get Started</Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>

            </div>
            <AddCourseDialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen} />
        </div>
    )
}

export default InstructorCoursesPage
