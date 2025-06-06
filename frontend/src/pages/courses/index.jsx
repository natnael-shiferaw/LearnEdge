import { useState, useEffect, useMemo, useContext } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowUpDown,
  ChevronDown,
  Clock,
  Search,
  Star,
} from "lucide-react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

import { AuthContext } from "@/context/auth-context"
import {
  fetchStudentViewCourseListService,
  checkCoursePurchaseInfoService,
} from "@/services/studentService"

export default function CoursesPage() {
  const navigate = useNavigate()
  const { auth } = useContext(AuthContext)
  const userId = auth?.user?._id

  // State for fetched courses, loading, and any error
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters & sort state
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState([0, 100])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedLevels, setSelectedLevels] = useState([])
  const [sortOption, setSortOption] = useState("popular")

  // Track which course‐IDs are currently being “checked” for purchase
  const [checkingMap, setCheckingMap] = useState({})

  // Fetch from backend on mount
  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(null)

    fetchStudentViewCourseListService()
      .then((res) => {
        if (!isMounted) return
        if (res.success) {
          setCourses(res.data)
        } else {
          setError("Failed to load courses")
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err)
        if (isMounted) setError("Network error")
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Derive “unique categories” and “unique levels” from fetched `courses`
  const categories = useMemo(
    () => [...new Set(courses.map((c) => c.category))],
    [courses]
  )
  const levels = useMemo(
    () => [...new Set(courses.map((c) => c.level))],
    [courses]
  )

  // Filter logic
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.instructorName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())

      // Convert price to number before comparing
      const coursePriceNumber = Number(course.price) || 0
      const matchesPrice =
        coursePriceNumber >= priceRange[0] && coursePriceNumber <= priceRange[1]

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(course.category)

      const matchesLevel =
        selectedLevels.length === 0 || selectedLevels.includes(course.level)

      return (
        matchesSearch && matchesPrice && matchesCategory && matchesLevel
      )
    })
  }, [courses, searchTerm, priceRange, selectedCategories, selectedLevels])

  // Sort logic
  const sortedCourses = useMemo(() => {
    return [...filteredCourses].sort((a, b) => {
      switch (sortOption) {
        case "popular": {
          // “popular” = most students enrolled → length of students array
          const aCount = Array.isArray(a.students) ? a.students.length : 0
          const bCount = Array.isArray(b.students) ? b.students.length : 0
          return bCount - aCount
        }
        case "rating": {
          // If you have a rating field in your Course schema
          const aRating = Number(a.rating) || 0
          const bRating = Number(b.rating) || 0
          return bRating - aRating
        }
        case "newest": {
          // If you have a createdAt timestamp
          const aDate = new Date(a.createdAt).getTime()
          const bDate = new Date(b.createdAt).getTime()
          return bDate - aDate
        }
        case "price-low": {
          return Number(a.price) - Number(b.price)
        }
        case "price-high": {
          return Number(b.price) - Number(a.price)
        }
        default: {
          return 0
        }
      }
    })
  }, [filteredCourses, sortOption])

  // Helper: convert "MM:SS" (or "H:MM:SS") strings into total seconds
  function parseDurationToSeconds(durationStr) {
    // e.g. "5:23" → [ "5", "23" ] or "1:05:23" → [ "1", "05", "23" ]
    const parts = durationStr.split(":").map((p) => Number(p))
    if (parts.length === 2) {
      // MM:SS
      return parts[0] * 60 + parts[1]
    } else if (parts.length === 3) {
      // H:MM:SS
      return parts[0] * 3600 + parts[1] * 60 + parts[2]
    }
    return 0
  }

  // Called when a student clicks “View Course”
  const handleViewCourse = async (courseId) => {
    if (!userId) {
      // If not logged in for some reason, fallback to course detail
      navigate(`/courses/${courseId}`)
      return
    }

    // Mark this ID as “checking” so we can disable its button/spinner
    setCheckingMap((prev) => ({ ...prev, [courseId]: true }))
    try {
      const res = await checkCoursePurchaseInfoService(courseId, userId)
      if (res.success) {
        if (res.data === true) {
          // Student already bought → send to progress
          navigate(`/student/my-courses/course-progress/${courseId}`)
        } else {
          // Not purchased → send to course detail
          navigate(`/courses/${courseId}`)
        }
      } else {
        // On API error, just default to detail page
        navigate(`/courses/${courseId}`)
      }
    } catch (e) {
      console.error("Purchase‐check error:", e)
      navigate(`/courses/${courseId}`)
    } finally {
      setCheckingMap((prev) => ({ ...prev, [courseId]: false }))
    }
  }

  // Show “Loading” or “Error” states first
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
      {/* ── Page Title ── */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          All Courses
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse our collection of courses taught by industry experts
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* ── Filters Sidebar ── */}
        <div className="space-y-6">
          <div>
            <h3 className="mb-4 text-lg font-medium">Filters</h3>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search courses..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium">Price Range</h4>
            <div className="space-y-4">
              <Slider
                defaultValue={[0, 100]}
                max={100}
                step={1}
                value={priceRange}
                onValueChange={setPriceRange}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm">${priceRange[0]}</span>
                <span className="text-sm">${priceRange[1]}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium">Categories</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCategories([...selectedCategories, category])
                      } else {
                        setSelectedCategories(
                          selectedCategories.filter((c) => c !== category)
                        )
                      }
                    }}
                  />
                  <Label htmlFor={`category-${category}`}>{category}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium">Level</h4>
            <div className="space-y-2">
              {levels.map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox
                    id={`level-${level}`}
                    checked={selectedLevels.includes(level)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedLevels([...selectedLevels, level])
                      } else {
                        setSelectedLevels(
                          selectedLevels.filter((l) => l !== level)
                        )
                      }
                    }}
                  />
                  <Label htmlFor={`level-${level}`}>{level}</Label>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setSearchTerm("")
              setPriceRange([0, 100])
              setSelectedCategories([])
              setSelectedLevels([])
            }}
          >
            Reset Filters
          </Button>
        </div>

        {/* ── Courses Grid ── */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium">{sortedCourses.length}</span> of{" "}
              <span className="font-medium">{courses.length}</span> courses
            </p>
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
                <DropdownMenuCheckboxItem
                  checked={sortOption === "popular"}
                  onCheckedChange={() => setSortOption("popular")}
                >
                  Most Popular
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortOption === "rating"}
                  onCheckedChange={() => setSortOption("rating")}
                >
                  Highest Rated
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortOption === "newest"}
                  onCheckedChange={() => setSortOption("newest")}
                >
                  Newest
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortOption === "price-low"}
                  onCheckedChange={() => setSortOption("price-low")}
                >
                  Price: Low to High
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortOption === "price-high"}
                  onCheckedChange={() => setSortOption("price-high")}
                >
                  Price: High to Low
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedCourses.map((course) => {
              // Compute “total seconds” from every lecture’s duration
              let totalSeconds = 0
              course.curriculum.forEach((section) => {
                section.lectures.forEach((lec) => {
                  totalSeconds += parseDurationToSeconds(lec.duration || "0:00")
                })
              })
              // Convert to hours (decimal), then round to one decimal
              const hoursDecimal = totalSeconds / 3600
              const courseHours = hoursDecimal.toFixed(1)
              const enrolledCount = Array.isArray(course.students)
                ? course.students.length
                : 0
              const ratingValue = course.rating ?? 0
              const imageUrl = course.image?.url || "/placeholder.svg"
              const priceString =
                typeof course.price === "number"
                  ? `$${course.price.toFixed(2)}`
                  : course.price || "Free"

              return (
                <Card key={course._id} className="overflow-hidden">
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={course.title}
                      width={350}
                      height={200}
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
                    <CardTitle className="line-clamp-2 text-lg">
                      {course.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">
                      By {course.instructorName}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="ml-1 text-sm font-medium">
                          {ratingValue}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({enrolledCount.toLocaleString()} students)
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{courseHours} hours</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between p-4 pt-0">
                    <span className="font-bold">{priceString}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewCourse(course._id)}
                      disabled={!!checkingMap[course._id]}
                    >
                      {checkingMap[course._id]
                        ? "Checking…"
                        : "View Course"}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>

          {sortedCourses.length === 0 && (
            <div className="mt-12 text-center">
              <h3 className="text-lg font-medium">No courses found</h3>
              <p className="mt-2 text-muted-foreground">
                Try adjusting your filters
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
