import { useState } from "react"
import { Link } from "react-router-dom"
import {
  BarChart,
  BookOpen,
  DollarSign,
  Download,
  Plus,
  Users,
  Star
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { InstructorSidebar } from "@/components/instructor-sidebar"
import { AddCourseDialog } from "@/components/instructor/add-course-dialog"

export default function InstructorDashboardPage() {
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false)

  // Mock data for instructor stats
  const stats = {
    totalStudents: 1245,
    totalRevenue: "$12,450",
    totalCourses: 5,
    averageRating: 4.8,
  }
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

            <div className="space-y-6">
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
                        <Link to="/instructor/students">View All Students</Link>
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
            </div>
          </div>
        </main>
      </div>

      <AddCourseDialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen} />
    </div>
  )
}
