import{ Link} from "react-router-dom"
import { BookOpen, Clock, Play, Search} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function StudentDashboardPage() {
  // Mock data for enrolled courses
  const enrolledCourses = [
    {
      id: 1,
      title: "Web Development Bootcamp",
      instructor: "Sarah Johnson",
      progress: 65,
      image: "/placeholder.svg?height=200&width=350",
      lastLesson: "CSS Flexbox and Grid",
      category: "Development",
    },
    {
      id: 2,
      title: "Data Science Fundamentals",
      instructor: "Michael Chen",
      progress: 32,
      image: "/placeholder.svg?height=200&width=350",
      lastLesson: "Introduction to Python",
      category: "Data Science",
    },
    {
      id: 3,
      title: "UX/UI Design Masterclass",
      instructor: "Emma Rodriguez",
      progress: 18,
      image: "/placeholder.svg?height=200&width=350",
      lastLesson: "User Research Methods",
      category: "Design",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto bg-muted/40 pb-16">
          <div className="container py-8">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, John! Continue your learning journey.</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search courses..."
                    className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[300px]"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">+1 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Hours Learned</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24.5</div>
                  <p className="text-xs text-muted-foreground">+5.5 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Completed Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                  <p className="text-xs text-muted-foreground">+1 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Certificates Earned</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                    <path d="M12 2v2" />
                    <path d="M12 8v2" />
                    <path d="M9.29 4.3 7.87 2.87" />
                    <path d="M16.13 2.87 14.7 4.3" />
                    <path d="M12 22v-8" />
                    <path d="M15 18.5 12 22l-3-3.5" />
                    <path d="M19 13a7 7 0 1 0-13.6-2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                  <p className="text-xs text-muted-foreground">+1 from last month</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Your Courses</CardTitle>
                  <CardDescription>Continue where you left off</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {enrolledCourses.map((course) => (
                      <div key={course.id} className="flex flex-col gap-4 sm:flex-row">
                        <div className="aspect-video h-24 w-full overflow-hidden rounded-md sm:w-40">
                          <img
                            src={course.image || "/placeholder.svg"}
                            alt={course.title}
                            width={160}
                            height={90}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <h3 className="font-semibold">{course.title}</h3>
                            <p className="text-sm text-muted-foreground">{course.instructor}</p>
                          </div>
                          <div className="mt-2">
                            <div className="mb-1 flex items-center justify-between text-sm">
                              <span>Progress</span>
                              <span>{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">Last: {course.lastLesson}</span>
                              <Button size="sm" asChild>
                                <Link to={`/student/my-courses/course-progress/${course.id}`}>
                                  <Play className="mr-1 h-3 w-3" /> Continue
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/student/my-courses">View all courses</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Courses</CardTitle>
                  <CardDescription>Based on your interests and learning history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="overflow-hidden">
                        <div className="aspect-video w-full overflow-hidden">
                          <img
                            src={`/placeholder.svg?height=200&width=350&text=${i}`}
                            alt="Course thumbnail"
                            width={350}
                            height={200}
                            className="h-full w-full object-cover transition-transform hover:scale-105"
                          />
                        </div>
                        <CardHeader className="p-4">
                          <CardTitle className="line-clamp-1 text-lg">Recommended Course {i}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="line-clamp-2 text-sm text-muted-foreground">
                            This course is recommended based on your learning history and interests.
                          </p>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Button size="sm" variant="outline" className="w-full" asChild>
                            <Link to={`/courses/${i}`}>View Course</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
