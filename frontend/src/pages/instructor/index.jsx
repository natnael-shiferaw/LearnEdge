// src/pages/instructor/index.jsx
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  BookOpen,
  DollarSign,
  Users,
  Star,
  Plus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { InstructorSidebar } from "@/components/instructor-sidebar"
import { AddCourseDialog } from "@/components/instructor/add-course-dialog"
import { fetchInstructorCourseListService } from "@/services/instructorService"
import { getCurrentCourseProgressService } from "@/services/studentService"

export default function InstructorDashboardPage() {
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [recentStudents, setRecentStudents] = useState([])
  const [loadingRecent, setLoadingRecent] = useState(false)

  // 1) Load all instructor courses
  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchInstructorCourseListService()
      .then((res) => {
        if (!mounted) return
        if (res.success) setCourses(res.data)
        else setError("Failed to load your courses")
      })
      .catch(() => mounted && setError("Network error"))
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [])

  // 2) Once courses arrive, flatten last 5 enrollments and fetch their real progress
  useEffect(() => {
    if (!courses.length) return
    let mounted = true
    setLoadingRecent(true)

    // flatten enrollments
    const allEnrollments = courses.flatMap((course) =>
      (course.students || []).map((s) => ({
        studentId: s.studentId,
        name: s.studentName,
        email: s.studentEmail,
        courseId: course._id,
        courseTitle: course.title,
        totalLectures: course.curriculum.flatMap((sec) => sec.lectures).length,
      }))
    )

    // pick last 5
    const lastFive = allEnrollments.slice(-5).reverse()

    // fetch each one's progress
    Promise.all(
      lastFive.map(async (e) => {
        try {
          const progRes = await getCurrentCourseProgressService(e.studentId, e.courseId)
          if (progRes.success && Array.isArray(progRes.data.progress)) {
            const viewedCount = progRes.data.progress.length
            const pct = e.totalLectures
              ? Math.round((viewedCount / e.totalLectures) * 100)
              : 0
            return { ...e, progress: pct }
          }
        } catch {
          /* ignore errors */
        }
        return { ...e, progress: 0 }
      })
    )
      .then((arr) => {
        if (mounted) setRecentStudents(arr)
      })
      .finally(() => {
        if (mounted) setLoadingRecent(false)
      })

    return () => { mounted = false }
  }, [courses])

  // Stats
  const totalCourses = courses.length
  const totalStudents = courses.reduce((sum, c) => sum + (c.students?.length || 0), 0)
  const totalRevenue = courses.reduce((sum, c) => sum + ((Number(c.price) || 0) * (c.students?.length || 0)), 0)
  const averageRating = totalCourses
    ? courses.reduce((sum, c) => sum + (c.rating || 0), 0) / totalCourses
    : 0

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <InstructorSidebar />
        <main className="flex-1 overflow-y-auto bg-muted/40 pb-16">
          <div className="container py-8">
            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Instructor Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Manage your courses and students
                </p>
              </div>
              <Button onClick={() => setIsAddCourseOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Create New Course
              </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
              <StatCard title="Total Students" value={totalStudents} />
              <StatCard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} />
              <StatCard title="Total Courses" value={totalCourses} />
              <StatCard title="Average Rating" value={averageRating.toFixed(1)} />
            </div>

            {/* Recent Students */}
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Recent Students</CardTitle>
                <Link to="/instructor/students">
                  <Button variant="outline" size="sm">View All Students</Button>
                </Link>
              </CardHeader>
              <CardContent>
                {loadingRecent ? (
                  <p>Loading recent progress…</p>
                ) : recentStudents.length === 0 ? (
                  <p className="text-center text-muted-foreground">
                    No recent enrollments.
                  </p>
                ) : (
                  <div className="space-y-6">
                    {recentStudents.map((s, idx) => (
                      <div key={`${s.studentId}-${idx}`} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{s.name}</p>
                            <p className="text-sm text-muted-foreground">{s.email}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <strong>Course:</strong> {s.courseTitle}
                        </p>
                        <div>
                          <div className="mb-1 flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>{s.progress}%</span>
                          </div>
                          <Progress value={s.progress} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Courses Grid */}
            <div className="mt-12">
              <h1 className="text-3xl font-bold mb-4 md:mb-8">Your Courses</h1>
              {loading && <p>Loading your courses…</p>}
              {error && <p className="text-red-500">{error}</p>}
              {!loading && !error && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
                  {courses.map((course) => {
                    const enrolled = course.students?.length || 0
                    const revenue = (Number(course.price) || 0) * enrolled
                    return (
                      <Card key={course._id} className="overflow-hidden">
                        <div className="aspect-video w-full overflow-hidden">
                          <img
                            src={course.image.url}
                            alt={course.title}
                            className="h-full w-full object-cover transition-transform hover:scale-105"
                          />
                        </div>
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-lg">{course.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Enrolled</span>
                            <span className="font-medium">{enrolled}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Revenue</span>
                            <span className="font-medium">${revenue.toFixed(2)}</span>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-2">
                          <Link to={`/instructor/courses/${course._id}/edit`}>
                            <Button size="sm">Edit Course</Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    )
                  })}
                  {courses.length === 0 && (
                    <p className="col-span-full text-center text-muted-foreground">
                      You haven’t created any courses yet.
                    </p>
                  )}
                </div>
              )}
            </div>


          </div>
        </main>
      </div>
      <AddCourseDialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen} />
    </div>
  )
}

function StatCard({ title, value }) {
  return (
    <Card>
      <CardHeader className="px-4 pt-4 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
