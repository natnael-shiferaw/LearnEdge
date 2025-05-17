import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  BarChart,
  BookOpen,
  ChevronDown,
  DollarSign,
  Download,
  FileText,
  Plus,
  Search,
  Star,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { InstructorSidebar } from "@/components/instructor-sidebar"
import { AddCourseDialog } from "@/components/instructor/add-course-dialog"

export default function InstructorDashboardPage() {
  const navigate = useNavigate()
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false)

  // Mock data for instructor stats
  const stats = {
    totalStudents: 1245,
    totalRevenue: "$12,450",
    totalCourses: 5,
    averageRating: 4.8,
  }

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

  // Mock data for recent students
  const recentStudents = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      course: "Web Development Bootcamp",
      enrolledDate: "2023-05-12",
      progress: 65,
    },
    {
      id: 2,
      name: "Emily Johnson",
      email: "emily.johnson@example.com",
      course: "JavaScript Advanced Concepts",
      enrolledDate: "2023-05-10",
      progress: 42,
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael.brown@example.com",
      course: "React for Beginners",
      enrolledDate: "2023-05-08",
      progress: 78,
    },
    {
      id: 4,
      name: "Sarah Davis",
      email: "sarah.davis@example.com",
      course: "Web Development Bootcamp",
      enrolledDate: "2023-05-05",
      progress: 23,
    },
    {
      id: 5,
      name: "David Wilson",
      email: "david.wilson@example.com",
      course: "Node.js Masterclass",
      enrolledDate: "2023-05-03",
      progress: 51,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <InstructorSidebar />
        <main className="flex-1 overflow-y-auto bg-muted/40 pb-16">
          <div className="container py-8">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Instructor Dashboard</h1>
                <p className="text-muted-foreground">Manage your courses and students</p>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={() => setIsAddCourseOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Create New Course
                </Button>
              </div>
            </div>

            <Tabs defaultValue="dashboard" className="space-y-6">

              <TabsList className="grid w-full grid-cols-2 md:w-[400px]">

                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>

                <TabsTrigger value="courses">Courses</TabsTrigger>

              </TabsList>



              {/* Dashboard Tab Content */}

              <TabsContent value="dashboard" className="space-y-6">

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

                  <Card>

                    <CardHeader className="flex flex-row items-center justify-between pb-2">

                      <CardTitle className="text-sm font-medium">Total Students</CardTitle>

                      <Users className="h-4 w-4 text-muted-foreground" />

                    </CardHeader>

                    <CardContent>

                      <div className="text-2xl font-bold">{stats.totalStudents}</div>

                      <p className="text-xs text-muted-foreground">+24 from last month</p>

                    </CardContent>

                  </Card>

                  <Card>

                    <CardHeader className="flex flex-row items-center justify-between pb-2">

                      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>

                      <DollarSign className="h-4 w-4 text-muted-foreground" />

                    </CardHeader>

                    <CardContent>

                      <div className="text-2xl font-bold">{stats.totalRevenue}</div>

                      <p className="text-xs text-muted-foreground">+$1,430 from last month</p>

                    </CardContent>

                  </Card>

                  <Card>

                    <CardHeader className="flex flex-row items-center justify-between pb-2">

                      <CardTitle className="text-sm font-medium">Total Courses</CardTitle>

                      <BookOpen className="h-4 w-4 text-muted-foreground" />

                    </CardHeader>

                    <CardContent>

                      <div className="text-2xl font-bold">{stats.totalCourses}</div>

                      <p className="text-xs text-muted-foreground">+1 from last month</p>

                    </CardContent>

                  </Card>

                  <Card>

                    <CardHeader className="flex flex-row items-center justify-between pb-2">

                      <CardTitle className="text-sm font-medium">Average Rating</CardTitle>

                      <Star className="h-4 w-4 text-muted-foreground" />

                    </CardHeader>

                    <CardContent>

                      <div className="text-2xl font-bold">{stats.averageRating}</div>

                      <p className="text-xs text-muted-foreground">+0.2 from last month</p>

                    </CardContent>

                  </Card>

                </div>



                <div className="grid gap-6 md:grid-cols-2">

                  <Card className="col-span-1">

                    <CardHeader>

                      <div className="flex items-center justify-between">

                        <div>

                          <CardTitle>Recent Students</CardTitle>

                          <CardDescription>Students who recently enrolled in your courses</CardDescription>

                        </div>

                        <Button variant="outline" size="sm">

                          <Download className="mr-2 h-4 w-4" /> Export

                        </Button>

                      </div>

                    </CardHeader>

                    <CardContent>

                      <div className="space-y-6">

                        {recentStudents.map((student) => (

                          <div key={student.id} className="flex flex-col gap-2">

                            <div className="flex items-center justify-between">

                              <div>

                                <p className="font-medium">{student.name}</p>

                                <p className="text-sm text-muted-foreground">{student.email}</p>

                              </div>

                              <Button variant="ghost" size="sm" asChild>

                                <Link href={`/instructor/students/${student.id}`}>View</Link>

                              </Button>

                            </div>

                            <div>

                              <p className="text-sm">

                                <span className="text-muted-foreground">Course: </span>

                                {student.course}

                              </p>

                              <p className="text-sm">

                                <span className="text-muted-foreground">Enrolled: </span>

                                {student.enrolledDate}

                              </p>

                            </div>

                            <div>

                              <div className="mb-1 flex items-center justify-between text-sm">

                                <span>Progress</span>

                                <span>{student.progress}%</span>

                              </div>

                              <Progress value={student.progress} className="h-2" />

                            </div>

                          </div>

                        ))}

                      </div>

                      <div className="mt-6 text-center">

                        <Button variant="outline" asChild>

                          <Link href="/instructor/students">View All Students</Link>

                        </Button>

                      </div>

                    </CardContent>

                  </Card>



                  <Card className="col-span-1">

                    <CardHeader>

                      <CardTitle>Course Performance</CardTitle>

                      <CardDescription>Revenue and enrollment statistics</CardDescription>

                    </CardHeader>

                    <CardContent>

                      <div className="h-[300px] w-full">

                        {/* Chart would go here - using placeholder for now */}

                        <div className="flex h-full items-center justify-center rounded-md border border-dashed">

                          <div className="flex flex-col items-center text-center">

                            <BarChart className="mb-2 h-10 w-10 text-muted-foreground" />

                            <p className="text-sm font-medium">Course Performance Chart</p>

                            <p className="text-xs text-muted-foreground">

                              Showing revenue and enrollment data for your courses

                            </p>

                          </div>

                        </div>

                      </div>

                    </CardContent>

                  </Card>

                </div>

              </TabsContent>



              {/* Courses Tab Content */}

              <TabsContent value="courses" className="space-y-6">

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

              </TabsContent>

            </Tabs>
          </div>
        </main>
      </div>

      <AddCourseDialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen} />
    </div>
  )
}
