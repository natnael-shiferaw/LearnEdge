import { useState, useEffect, useContext, useMemo } from "react"
import { Link } from "react-router-dom"
import { BookOpen, Clock, Search, SortAsc } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

import { AuthContext } from "@/context/auth-context"
import { fetchStudentBoughtCoursesService } from "@/services/studentService"

export default function MyCoursesPage() {
  const { auth } = useContext(AuthContext)
  const studentId = auth?.user?._id

  const [searchQuery, setSearchQuery] = useState("")
  const [sort, setSort] = useState("recent")
  const [boughtCourses, setBoughtCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!studentId) return

    setLoading(true)
    setError(null)

    fetchStudentBoughtCoursesService(studentId)
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const mapped = res.data.map((c) => ({
            id: c.courseId,
            title: c.title,
            instructor: c.instructorName,
            image: c.courseImage?.url || "/placeholder.svg",
            progress: 0,
            lastLesson: "",
            lastAccessed: c.dateOfPurchase || new Date().toISOString(),
            totalLectures: 0,
            completedLectures: 0,
          }))
          setBoughtCourses(mapped)
        } else {
          setError("Failed to load your courses")
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err)
        setError("Network error while fetching your courses")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [studentId])

  const filteredCourses = useMemo(() => {
    let result = [...boughtCourses]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((course) =>
        course.title.toLowerCase().includes(q)
      )
    }

    result.sort((a, b) => {
      switch (sort) {
        case "recent":
          return new Date(b.lastAccessed) - new Date(a.lastAccessed)
        case "progress":
          return b.progress - a.progress
        case "title":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    return result
  }, [boughtCourses, searchQuery, sort])

  if (loading) {
    return (
      <main className="container py-12">
        <p>Loading your courses…</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="container py-12">
        <p className="text-red-500">{error}</p>
      </main>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto bg-muted/40 pb-16">
          <div className="container py-8">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
                <p className="text-muted-foreground">Continue your learning journey</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search courses..."
                    className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[300px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <SortAsc className="h-4 w-4" />
                      <span className="sr-only">Sort</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => setSort("recent")}>
                        Recently Accessed
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSort("progress")}>
                        Progress
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSort("title")}>
                        Title
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <Tabs defaultValue="grid" className="mb-8">
              <TabsList>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>

              {/* Grid View */}
              <TabsContent value="grid">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden">
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="h-full w-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="line-clamp-2 text-lg">{course.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">By {course.instructor}</p>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>{course.completedLectures}/{course.totalLectures} lectures completed</span>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Last accessed: {new Date(course.lastAccessed).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button className="w-full" asChild>
                          <Link to={`/student/my-courses/course-progress/${course.id}`}>
                            {course.progress === 100 ? "Review Course" : "Continue Learning"}
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* List View */}
              <TabsContent value="list">
                <div className="space-y-4">
                  {filteredCourses.map((course) => (
                    <Card key={course.id}>
                      <div className="flex flex-col gap-4 p-4 sm:flex-row">
                        <div className="aspect-video h-32 w-full overflow-hidden rounded-md sm:h-auto sm:w-48">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <h3 className="mb-1 text-lg font-semibold">{course.title}</h3>
                          <p className="text-sm text-muted-foreground">By {course.instructor}</p>
                          <div className="mt-2">
                            <div className="mb-1 flex items-center justify-between text-sm">
                              <span>Progress</span>
                              <span>{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>
                          <div className="mt-auto flex flex-col gap-2 pt-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <BookOpen className="h-3.5 w-3.5" />
                              <span>{course.completedLectures}/{course.totalLectures} lectures completed</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" />
                              <span>Last accessed: {new Date(course.lastAccessed).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="mt-4">
                            <Button className="w-full sm:w-auto" asChild>
                              <Link to={`/student/my-courses/course-progress/${course.id}`}>
                                {course.progress === 100 ? "Review Course" : "Continue Learning"}
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
