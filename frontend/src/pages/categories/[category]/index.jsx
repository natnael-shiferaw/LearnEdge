// src/pages/categories/[category].jsx
import { useState, useEffect, useMemo, useContext } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { ArrowUpDown, ChevronDown, Clock, Search, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AuthContext } from "@/context/auth-context"
import {
  fetchStudentViewCourseListService,
  checkCoursePurchaseInfoService,
} from "@/services/studentService"

export default function CategoryPage() {
  const { category: slug } = useParams()
  const navigate = useNavigate()
  const { auth } = useContext(AuthContext)
  const userId = auth?.user?._id

  // Derive display name: “data-science” → “Data Science”
  const categoryName = useMemo(() => {
    return slug
      .split("-")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" ")
  }, [slug])

  // State
  const [allCourses, setAllCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState("popular")
  const [checkingMap, setCheckingMap] = useState({})

  // 1) Fetch all courses
  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchStudentViewCourseListService()
      .then((res) => {
        if (!mounted) return
        if (res.success && Array.isArray(res.data)) {
          setAllCourses(res.data)
        } else {
          setError("Failed to load courses")
        }
      })
      .catch(() => {
        if (mounted) setError("Network error")
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  // 2) Filter by category
  const filteredCourses = useMemo(() => {
    return allCourses.filter(
      (c) =>
        c.category.toLowerCase() === categoryName.toLowerCase() &&
        (c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.instructorName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
    )
  }, [allCourses, categoryName, searchTerm])

  // 3) Sort
  const sortedCourses = useMemo(() => {
    return [...filteredCourses].sort((a, b) => {
      switch (sortOption) {
        case "popular": {
          const aCnt = Array.isArray(a.students) ? a.students.length : 0
          const bCnt = Array.isArray(b.students) ? b.students.length : 0
          return bCnt - aCnt
        }
        case "rating":
          return (b.rating || 0) - (a.rating || 0)
        case "newest":
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          )
        case "price-low":
          return Number(a.price) - Number(b.price)
        case "price-high":
          return Number(b.price) - Number(a.price)
        default:
          return 0
      }
    })
  }, [filteredCourses, sortOption])

  // Purchase check helper
  const handleViewCourse = async (cid) => {
    if (!userId) {
      navigate(`/courses/${cid}`)
      return
    }
    setCheckingMap((m) => ({ ...m, [cid]: true }))
    try {
      const res = await checkCoursePurchaseInfoService(cid, userId)
      if (res.success && res.data === true) {
        navigate(`/student/my-courses/course-progress/${cid}`)
      } else {
        navigate(`/courses/${cid}`)
      }
    } catch {
      navigate(`/courses/${cid}`)
    } finally {
      setCheckingMap((m) => ({ ...m, [cid]: false }))
    }
  }

  if (loading) {
    return (
      <main className="container py-12">
        <p>Loading courses…</p>
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
    <main className="container py-12">
      {/* Title + Search + Sort */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Category: {categoryName}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Showing {sortedCourses.length} of{" "}
          {filteredCourses.length} courses
        </p>
      </div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search in this category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Sort by
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {[
              ["popular", "Most Popular"],
              ["rating", "Highest Rated"],
              ["newest", "Newest"],
              ["price-low", "Price: Low to High"],
              ["price-high", "Price: High to Low"],
            ].map(([val, label]) => (
              <DropdownMenuCheckboxItem
                key={val}
                checked={sortOption === val}
                onCheckedChange={() => setSortOption(val)}
              >
                {label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Courses grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sortedCourses.map((course) => {
          // compute hours from curriculum durations if needed...
          return (
            <Card key={course._id} className="overflow-hidden">
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={course.image?.url || "/placeholder.svg"}
                  alt={course.title}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    {course.category}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {course.level}
                  </span>
                </div>
                <CardTitle className="mt-2 line-clamp-2 text-lg">
                  {course.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground">
                  By {course.instructorName}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="text-sm font-medium">
                    {course.rating?.toFixed(1) || "4.8"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({course.students.length})
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{course.totalDurationHours || 0}h</span>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between p-4 pt-0">
                <span className="font-bold">
                  {typeof course.price === "number"
                    ? `$${course.price.toFixed(2)}`
                    : course.price || "Free"}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewCourse(course._id)}
                  disabled={!!checkingMap[course._id]}
                >
                  {checkingMap[course._id] ? "Checking…" : "View Course"}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
        {sortedCourses.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground">
            No courses found in this category.
          </div>
        )}
      </div>
    </main>
  )
}
