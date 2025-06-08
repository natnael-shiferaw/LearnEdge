// src/pages/instructor/students/index.jsx
import { useState, useEffect } from "react"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { InstructorSidebar } from "@/components/instructor-sidebar"
import { fetchInstructorCourseListService } from "@/services/instructorService"

export default function InstructorStudentsPage() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchInstructorCourseListService()
      .then((res) => {
        if (!mounted) return
        if (res.success && Array.isArray(res.data)) {
          // flatten every course’s students into one big array
          const all = res.data.flatMap((course) =>
            (course.students || []).map((s) => ({
              studentId:   s.studentId,
              name:        s.studentName,
              email:       s.studentEmail,
              courseTitle: course.title,
            }))
          )
          // dedupe by `${studentId}|${courseTitle}`
          const seen = new Set()
          const unique = []
          for (const stu of all) {
            const key = `${stu.studentId}|${stu.courseTitle}`
            if (!seen.has(key)) {
              seen.add(key)
              unique.push(stu)
            }
          }
          setStudents(unique)
        } else {
          setError("Failed to load courses")
        }
      })
      .catch((e) => {
        console.error("Fetch error:", e)
        if (mounted) setError("Network error")
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <InstructorSidebar />
        <main className="container py-8">
          <h1 className="text-3xl font-bold mb-4">All Students</h1>
          {loading && <p>Loading…</p>}
          {error   && <p className="text-red-500">{error}</p>}

          {!loading && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Course Enrolled</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((stu) => (
                  <TableRow key={`${stu.studentId}-${stu.courseTitle}`}>
                    <TableCell>{stu.name}</TableCell>
                    <TableCell>{stu.email}</TableCell>
                    <TableCell>{stu.courseTitle}</TableCell>
                  </TableRow>
                ))}
                {students.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No students enrolled yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </main>
      </div>
    </div>
  )
}
