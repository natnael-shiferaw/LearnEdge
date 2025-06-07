import { useState, useEffect, useMemo, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  Globe,
  Info,
  Play,
  ShoppingCart,
  Star,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"

import {
  fetchStudentViewCourseDetailsService,
  fetchStudentViewCourseListService,
  checkCoursePurchaseInfoService,
} from "@/services/studentService"
import { AuthContext } from "@/context/auth-context"
import { createPaymentService } from "@/services/paymentService"

export default function CourseDetailPage() {
  const navigate = useNavigate()
  const { auth } = useContext(AuthContext)
  const userId = auth?.user?._id
  const { id: courseId } = useParams()

  // State for single‐course details, all courses, loading, and error
  const [course, setCourse] = useState(null)
  const [allCourses, setAllCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [instructorCoursesCount, setInstructorCoursesCount] = useState(0);

  // Purchase/enroll state (for this main course)
  const [isPurchased, setIsPurchased] = useState(false)
  const [approvalUrl, setApprovalUrl] = useState("")

  // Track “checking” state for related courses
  const [checkingRelatedMap, setCheckingRelatedMap] = useState({})
  console.log(approvalUrl)

  // Fetch single course details AND all courses on mount
  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(null)

    // Fetch current course
    fetchStudentViewCourseDetailsService(courseId)
      .then(async (res) => {
        if (!isMounted) return
        if (res.success) {
          setCourse(res.data)
        } else {
          setError("Failed to load course details")
        }
        // Normalize into a plain array of courses:
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : []
        // Count how many belong to this instructor:
        const count = list.filter(
          (c) => String(c.instructorId) === String(course.instructorId)
        ).length
        console.log("Instructor Courses Count:",count)
      setInstructorCoursesCount(count);
      })
      .catch((err) => {
        console.error("Fetch error:", err)
        if (isMounted) setError("Network error")
      })

    // Fetch all courses for "Related Courses"
    fetchStudentViewCourseListService()
      .then((res) => {
        if (!isMounted) return
        if (res.success) {
          setAllCourses(res.data)
        }
      })
      .catch((err) => {
        console.error("Fetch all courses error:", err)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [courseId, course?.instructorId])

  //once we have both `course` and `userId`, check purchase ─
  useEffect(() => {
    if (!course?._id || !userId) return

    checkCoursePurchaseInfoService(course._id, userId)
      .then((res) => {
        if (res.success) {
          setIsPurchased(!!res.data)
        }
      })
      .catch(console.error)
  }, [course?._id, userId])

  // Compute "Related Courses" (same category, exclude current)
  const relatedCourses = useMemo(() => {
    if (!course) return []
    return allCourses
      .filter(
        (c) =>
          c.category === course.category &&
          String(c._id) !== String(course._id)
      )
      .slice(0, 4)
  }, [allCourses, course])

  // Early return for loading or error
  if (loading) {
    return (
      <main className="container py-12">
        <p>Loading course details…</p>
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
  if (!course) {
    return null
  }

  // Calculate total lectures and total duration
  const totalLectures = course.curriculum.reduce(
    (sum, section) => sum + section.lectures.length,
    0
  )

  let totalSeconds = 0
  course.curriculum.forEach((section) => {
    section.lectures.forEach((lec) => {
      totalSeconds += parseDurationToSeconds(lec.duration || "0:00")
    })
  })
  const totalHours = Math.floor(totalSeconds / 3600)
  const totalMinutes = Math.round((totalSeconds % 3600) / 60)

  // Find first preview lecture's videoUrl (if any)
  const previewLecture = course.curriculum
    .flatMap((section) => section.lectures)
    .find((lec) => lec.isPreview && lec.videoUrl)
  const previewUrl = previewLecture ? previewLecture.videoUrl : null

  // Button handlers for main course
  const handlePurchase = async () => {
    const PaymentPayload = {
      userId: auth?.user?._id,
      userName: auth?.user?.username,
      userEmail: auth?.user?.email,
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "initiated",
      orderDate: new Date(),
      paymentId: "",
      payerId: "",
      instructorId: course?.instructorId,
      instructorName: course?.instructorName,
      courseImage: course?.image,
      courseTitle: course?.title,
      courseId: course?._id,
      coursePricing: course?.price,
    }
    const response = await createPaymentService(PaymentPayload)
    if (response.success) {
      sessionStorage.setItem(
        "currentOrderId",
        JSON.stringify(response?.data?.orderId)
      )
      setApprovalUrl(response?.data?.approvalUrl)
      window.location.href = response.data.approveUrl
    } else {
      toast({
        title: "Payment error",
        description: response.message,
        variant: "destructive",
      })
    }
  }
  const handleStart = () => {
    navigate(`/student/my-courses/course-progress/${courseId}`)
  }

  // Handler for “Related Courses” click
  const handleRelatedClick = async (relId) => {
    if (!userId) {
      navigate(`/courses/${relId}`)
      return
    }

    // Mark as “checking” for this related course
    setCheckingRelatedMap((prev) => ({ ...prev, [relId]: true }))
    try {
      const res = await checkCoursePurchaseInfoService(relId, userId)
      if (res.success && res.data === true) {
        navigate(`/student/my-courses/course-progress/${relId}`)
      } else {
        navigate(`/courses/${relId}`)
      }
    } catch (e) {
      console.error("Related purchase‐check error:", e)
      navigate(`/courses/${relId}`)
    } finally {
      setCheckingRelatedMap((prev) => ({ ...prev, [relId]: false }))
    }
  }

  return (
    <>
      <main className="flex-1">
        {/* ── Course Header ── */}
        <section className="bg-muted/50">
          <div className="container py-8 md:py-12">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <div className="mb-4 flex flex-wrap gap-2">
                  <Badge variant="outline">{course.category}</Badge>
                  <Badge variant="outline">{course.level}</Badge>
                </div>
                <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                  {course.title}
                </h1>
                <p className="mb-6 text-lg text-muted-foreground">
                  {course.description.split("\n\n")[0]}
                </p>

                <div className="mb-6 flex flex-wrap items-center gap-4">
                  <div className="flex items-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= Math.round(course.rating)
                              ? "fill-primary text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 font-medium">{course.rating || 4.8}</span>
                    <span className="ml-1 text-muted-foreground">
                      ({(course.students || []).length.toLocaleString()} students)
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {totalHours}h {totalMinutes}m
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>{course.language}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{totalLectures} lectures</span>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-muted-foreground">
                    Created by{" "}
                    <span className="font-medium text-foreground">
                      {course.instructorName}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Last updated{" "}
                    {new Date(course.createdAt).toLocaleDateString(undefined, {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" onClick={isPurchased ? handleStart : handlePurchase}>
        {isPurchased ? (
          <>
            <Play className="mr-2 h-4 w-4" /> Start Learning
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-4 w-4" /> Purchase Course
          </>
        )}
      </Button>
                </div>
              </div>

              <div className="relative aspect-video overflow-hidden rounded-lg border shadow-md">
                <img
                  src={course.image?.url || "/placeholder.svg"}
                  alt={course.title}
                  className="object-cover h-full w-full"
                />
                {previewUrl && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      size="icon"
                      className="h-16 w-16 rounded-full bg-background/75 hover:bg-background"
                      asChild
                    >
                      <a
                        href={previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Play className="h-8 w-8" />
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Course Content ── */}
        <section className="container py-12">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                  <TabsTrigger value="instructor">Instructor</TabsTrigger>
                </TabsList>

                {/* ── Overview Tab ── */}
                <TabsContent value="overview" className="mt-6">
                  <div className="space-y-8">
                    <div>
                      <h2 className="mb-4 text-2xl font-bold">
                        About This Course
                      </h2>
                      <div className="space-y-4 text-muted-foreground">
                        {course.description
                          .split("\n\n")
                          .map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                          ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-4 text-xl font-bold">
                        What You'll Learn
                      </h3>
                      <ul className="grid gap-3 sm:grid-cols-2">
                        {course.learningObjectives.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                {/* ── Curriculum Tab ── */}
                <TabsContent value="curriculum" className="mt-6">
                  <div>
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold">Course Content</h2>
                        <p className="text-muted-foreground">
                          {totalLectures} lectures • {totalHours}h{" "}
                          {totalMinutes}m total length
                        </p>
                      </div>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                      {course.curriculum.map((section) => {
                        // Compute this section’s total minutes
                        const sectionSeconds = section.lectures.reduce(
                          (secSum, lecture) =>
                            secSum +
                            parseDurationToSeconds(lecture.duration || "0:00"),
                          0
                        )
                        const sectionLengthMin = Math.round(
                          sectionSeconds / 60
                        )

                        return (
                          <AccordionItem
                            key={section.id}
                            value={`section-${section.id}`}
                          >
                            <AccordionTrigger className="hover:bg-muted/50 px-4 py-3 text-left">
                              <div>
                                <h3 className="font-medium">
                                  {section.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {section.lectures.length} lectures •{" "}
                                  {sectionLengthMin} min
                                </p>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-0">
                              <ul className="divide-y">
                                {section.lectures.map((lecture) => (
                                  <li
                                    key={lecture.id}
                                    className="flex items-center justify-between px-4 py-3 hover:bg-muted/30"
                                  >
                                    <div className="flex items-start gap-3">
                                      <Play className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                      <div>
                                        <p className="font-medium">
                                          {lecture.title}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          {lecture.duration}
                                        </p>
                                      </div>
                                    </div>
                                    {lecture.isPreview && lecture.videoUrl && (
                                      <Button variant="ghost" size="sm">
                                        <a
                                          href={lecture.videoUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          Preview
                                        </a>
                                      </Button>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        )
                      })}
                    </Accordion>
                  </div>
                </TabsContent>

                {/* ── Instructor Tab ── */}
                <TabsContent value="instructor" className="mt-6">
                  <div className="space-y-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="relative h-24 w-24 overflow-hidden rounded-full">
                        <img
                          src={
                            course.instructorAvatar ||
                            "/placeholder.svg?height=96&width=96"
                          }
                          alt={course.instructorName}
                          className="object-cover h-full w-full"
                        />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">
                          {course.instructorName}
                        </h2>
                        <p className="text-muted-foreground">
                          {course.instructorBio || "Instructor"}
                        </p>
                        <div className="mt-2 flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            <span>
                              {course.instructorRating ?? 4.8} Instructor Rating
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{course.students.length ?? 0}+ Students</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <span>{instructorCoursesCount} Courses</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-2 text-xl font-bold">
                        About the Instructor
                      </h3>
                      <div className="space-y-4 text-muted-foreground">
                        <p>
                          {course.instructorBioLong ||
                            "This instructor is passionate about teaching and has years of experience."}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* ── Course Sidebar ── */}
            <div>
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    {typeof course.price === "number"
                      ? `$${course.price.toFixed(2)}`
                      : course.price}
                  </CardTitle>
                  <CardDescription>
                    Lifetime access to all course content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                <Button size="lg" onClick={isPurchased ? handleStart : handlePurchase}>
        {isPurchased ? (
          <>
            <Play className="mr-2 h-4 w-4" /> Start Learning
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-4 w-4" /> Purchase Course
          </>
        )}
      </Button>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span>
                        {totalHours}h {totalMinutes}m video content
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-muted-foreground" />
                      <span>{totalLectures} lectures</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-muted-foreground" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <span>Full lifetime access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-muted-foreground" />
                      <span>30-day money-back guarantee</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ── Related Courses ── */}
        <section className="bg-muted/50 py-12">
          <div className="container">
            <h2 className="mb-8 text-2xl font-bold">Related Courses</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedCourses.length > 0 ? (
                relatedCourses.map((rel) => {
                  const relEnrolled = Array.isArray(rel.students)
                    ? rel.students.length
                    : 0
                  const relRating = rel.rating ?? 0
                  const relPrice =
                    typeof rel.price === "number"
                      ? `$${rel.price.toFixed(2)}`
                      : rel.price || "Free"
                  const relImage = rel.image?.url || "/placeholder.svg"

                  return (
                    <Card key={rel._id} className="overflow-hidden">
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={relImage}
                          alt={rel.title}
                          width={350}
                          height={200}
                          className="h-full w-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="line-clamp-2 text-lg">
                          {rel.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">
                          By {rel.instructorName}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            <span className="ml-1 text-sm font-medium">
                              {relRating}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ({relEnrolled.toLocaleString()} students)
                          </span>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="font-bold">{relPrice}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRelatedClick(rel._id)}
                            disabled={!!checkingRelatedMap[rel._id]}
                          >
                            {checkingRelatedMap[rel._id]
                              ? "Checking…"
                              : "View Course"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              ) : (
                <p className="text-muted-foreground">No related courses found.</p>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

// ── Helper: parse “MM:SS” or “H:MM:SS” into total seconds
function parseDurationToSeconds(durationStr) {
  const parts = durationStr.split(":").map(Number)
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1]
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2]
  }
  return 0
}
