import { useState, useEffect } from 'react'
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
import { fetchInstructorCourseListService, deleteCourseByIdService } from "@/services/instructorService"

function InstructorCoursesPage() {
    const navigate = useNavigate()
    const [isAddCourseOpen, setIsAddCourseOpen] = useState(false)
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let isMounted = true

        async function loadCourses() {
            setLoading(true)
            setError(null)
            try {
                const result = await fetchInstructorCourseListService()
                if (result.success) {
                    if (isMounted) setCourses(result.data)
                } else {
                    if (isMounted) setError("Failed to load courses")
                }
            } catch (err) {
                console.error("Error fetching courses:", err)
                if (isMounted) setError("Network error")
            } finally {
                if (isMounted) setLoading(false)
            }
        }

        loadCourses()
        return () => {
            isMounted = false
        }
    }, [])

    // function to hanle delete
    const handleDelete = async (courseIdToDelete) => {
        if (!confirm("Are you sure you want to delete this course?")) {
          return
        }
    
        try {
          const res = await deleteCourseByIdService(courseIdToDelete)
          if (res.success) {
            // Remove the deleted course from local state so UI updates immediately
            setCourses(prev => prev.filter(c => c._id !== courseIdToDelete))
          } else {
            console.error("Failed to delete course on server:", res.message)
            alert("Could not delete course. Please try again.")
          }
        } catch (err) {
          console.error("Delete API error:", err)
          alert("Network error while deleting course.")
        }
      }

    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex flex-1">
                <InstructorSidebar />
                <div className="container py-8">
                    {loading && <p>Loading…</p>}
                    {error && <p className="text-red-500">{error}</p>}

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
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {!loading && !error && courses.length === 0 && (
                                    <p>You don’t have any courses yet.</p>
                                )}
                                {!loading && !error && courses.length > 0 && (
                                    
                                        courses.map((course) => {
                                            const enrolledCount = Array.isArray(course.students)
                                            ? course.students.length
                                            : 0
                                        
                                          // calculate revenue based on price and enrolled count
                                          const priceNumber = Number(course.price) || 0
                                          const revenue = priceNumber * enrolledCount
                                            return (
                                            <TableRow key={course._id}>
                                                <TableCell className="font-medium">{course.title}</TableCell>
                                                <TableCell>{enrolledCount}</TableCell>
                                                <TableCell>${revenue.toFixed(1)}</TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <ChevronDown className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => navigate(`/instructor/courses/${course._id}/edit`)} className='hover:cursor-pointer'>
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => handleDelete(course._id)} className="text-destructive hover:cursor-pointer">Delete</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        )})
                                    )}
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
