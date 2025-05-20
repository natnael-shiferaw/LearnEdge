import { useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import {
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  Globe,
  Info,
  Play,
  Share2,
  ShoppingCart,
  Star,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

export default function CourseDetailPage() {
  const navigate = useNavigate()
  const { id: courseId } = useParams()
  const [isPurchased, setIsPurchased] = useState(false)

  // Mock course data
  const course = {
    id: courseId,
    title: "Web Development Bootcamp",
    instructor: "Sarah Johnson",
    rating: 4.8,
    students: 12453,
    hours: 42,
    level: "Beginner",
    image: "/placeholder.svg?height=400&width=800",
    price: "$89.99",
    category: "Development",
    lastUpdated: "May 2023",
    language: "English",
    description: `This comprehensive Web Development Bootcamp covers everything you need to know to become a full-stack web developer. You'll learn HTML, CSS, JavaScript, React, Node.js, Express, MongoDB, and more.
    
    Whether you're a complete beginner or have some experience, this course will take you from the basics to advanced concepts in web development. By the end, you'll be able to build complete, responsive websites and web applications from scratch.`,
    whatYouWillLearn: [
      "Build responsive websites using HTML, CSS, and JavaScript",
      "Create dynamic web applications with React",
      "Develop backend APIs with Node.js and Express",
      "Work with databases like MongoDB",
      "Deploy your applications to the web",
      "Implement authentication and authorization",
      "Use modern development tools and workflows",
      "Apply best practices for web development",
    ],
    requirements: [
      "A computer with internet access",
      "No prior programming experience required",
      "Basic computer skills",
      "Willingness to learn and practice",
    ],
    curriculum: [
      {
        id: 1,
        title: "Introduction to Web Development",
        lectures: [
          { id: 1, title: "Course Overview", duration: "10:15", isPreview: true },
          { id: 2, title: "How the Web Works", duration: "15:30", isPreview: true },
          { id: 3, title: "Setting Up Your Development Environment", duration: "20:45", isPreview: false },
        ],
      },
      {
        id: 2,
        title: "HTML Fundamentals",
        lectures: [
          { id: 4, title: "HTML Document Structure", duration: "18:20", isPreview: false },
          { id: 5, title: "HTML Elements and Attributes", duration: "25:10", isPreview: false },
          { id: 6, title: "Forms and Input Elements", duration: "22:35", isPreview: false },
          { id: 7, title: "Semantic HTML", duration: "19:45", isPreview: false },
        ],
      },
      {
        id: 3,
        title: "CSS Styling",
        lectures: [
          { id: 8, title: "CSS Selectors and Properties", duration: "24:15", isPreview: false },
          { id: 9, title: "Box Model and Layout", duration: "28:30", isPreview: false },
          { id: 10, title: "Flexbox and Grid", duration: "32:20", isPreview: false },
          { id: 11, title: "Responsive Design", duration: "26:45", isPreview: false },
          { id: 12, title: "CSS Animations and Transitions", duration: "22:10", isPreview: false },
        ],
      },
      {
        id: 4,
        title: "JavaScript Basics",
        lectures: [
          { id: 13, title: "Variables and Data Types", duration: "20:30", isPreview: false },
          { id: 14, title: "Operators and Expressions", duration: "18:45", isPreview: false },
          { id: 15, title: "Control Flow", duration: "25:15", isPreview: false },
          { id: 16, title: "Functions", duration: "30:20", isPreview: false },
          { id: 17, title: "Arrays and Objects", duration: "28:10", isPreview: false },
        ],
      },
      {
        id: 5,
        title: "DOM Manipulation",
        lectures: [
          { id: 18, title: "Selecting DOM Elements", duration: "22:45", isPreview: false },
          { id: 19, title: "Modifying DOM Elements", duration: "24:30", isPreview: false },
          { id: 20, title: "Event Handling", duration: "26:15", isPreview: false },
          { id: 21, title: "Creating and Removing Elements", duration: "20:40", isPreview: false },
        ],
      },
    ],
  }

  const handlePurchase = () => {
    toast({
      title: "Course purchased successfully!",
      description: "You now have access to all course content.",
      duration: 5000,
    })
    setIsPurchased(true)
  }

  const handleEnroll = () => {
    navigate(`/dashboard/courses/${courseId}`)
  }

  const totalLectures = course.curriculum.reduce((total, section) => total + section.lectures.length, 0)

  // Calculate total course duration
  const totalDuration = course.curriculum.reduce((total, section) => {
    return (
      total +
      section.lectures.reduce((sectionTotal, lecture) => {
        const [minutes, seconds] = lecture.duration.split(":").map(Number)
        return sectionTotal + minutes + seconds / 60
      }, 0)
    )
  }, 0)

  const totalHours = Math.floor(totalDuration / 60)
  const totalMinutes = Math.round(totalDuration % 60)

  return (
    <>
      <main className="flex-1">
        {/* Course Header */}
        <section className="bg-muted/50">
          <div className="container py-8 md:py-12">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <div className="mb-4 flex flex-wrap gap-2">
                  <Badge variant="outline">{course.category}</Badge>
                  <Badge variant="outline">{course.level}</Badge>
                </div>
                <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">{course.title}</h1>
                <p className="mb-6 text-lg text-muted-foreground">{course.description.split("\n\n")[0]}</p>

                <div className="mb-6 flex flex-wrap items-center gap-4">
                  <div className="flex items-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${star <= Math.round(course.rating) ? "fill-primary text-primary" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 font-medium">{course.rating}</span>
                    <span className="ml-1 text-muted-foreground">({course.students.toLocaleString()} students)</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{course.hours} hours</span>
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
                    Created by <span className="font-medium text-foreground">{course.instructor}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">Last updated {course.lastUpdated}</p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  {isPurchased ? (
                    <Button size="lg" onClick={handleEnroll}>
                      <Play className="mr-2 h-4 w-4" /> Start Learning
                    </Button>
                  ) : (
                    <Button size="lg" onClick={handlePurchase}>
                      <ShoppingCart className="mr-2 h-4 w-4" /> Purchase Course
                    </Button>
                  )}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="lg" variant="outline">
                          <Share2 className="mr-2 h-4 w-4" /> Share
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Share this course with friends</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <div className="relative aspect-video overflow-hidden rounded-lg border shadow-md">
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  className="object-cover h-full w-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button size="icon" className="h-16 w-16 rounded-full">
                    <Play className="h-8 w-8" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Content */}
        <section className="container py-12">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                  <TabsTrigger value="instructor">Instructor</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-6">
                  <div className="space-y-8">
                    <div>
                      <h2 className="mb-4 text-2xl font-bold">About This Course</h2>
                      <div className="space-y-4 text-muted-foreground">
                        {course.description.split("\n\n").map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-4 text-xl font-bold">What You'll Learn</h3>
                      <ul className="grid gap-3 sm:grid-cols-2">
                        {course.whatYouWillLearn.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="mb-4 text-xl font-bold">Requirements</h3>
                      <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                        {course.requirements.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                {/* Curriculum Tab */}
                <TabsContent value="curriculum" className="mt-6">
                  <div>
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold">Course Content</h2>
                        <p className="text-muted-foreground">
                          {totalLectures} lectures • {totalHours}h {totalMinutes}m total length
                        </p>
                      </div>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                      {course.curriculum.map((section) => (
                        <AccordionItem key={section.id} value={`section-${section.id}`}>
                          <AccordionTrigger className="hover:bg-muted/50 px-4 py-3 text-left">
                            <div>
                              <h3 className="font-medium">{section.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {section.lectures.length} lectures •
                                {section.lectures
                                  .reduce((total, lecture) => {
                                    const [min, sec] = lecture.duration.split(":").map(Number)
                                    return total + min + sec / 60
                                  }, 0)
                                  .toFixed(0)}{" "}
                                min
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
                                      <p className="font-medium">{lecture.title}</p>
                                      <p className="text-sm text-muted-foreground">{lecture.duration}</p>
                                    </div>
                                  </div>
                                  {lecture.isPreview && (
                                    <Button variant="ghost" size="sm">
                                      Preview
                                    </Button>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </TabsContent>

                {/* Instructor Tab */}
                <TabsContent value="instructor" className="mt-6">
                  <div className="space-y-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="relative h-24 w-24 overflow-hidden rounded-full">
                        <Image
                          src="/placeholder.svg?height=96&width=96"
                          alt={course.instructor}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{course.instructor}</h2>
                        <p className="text-muted-foreground">Web Development Instructor</p>
                        <div className="mt-2 flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            <span>4.8 Instructor Rating</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>24,500+ Students</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <span>8 Courses</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-2 text-xl font-bold">About the Instructor</h3>
                      <div className="space-y-4 text-muted-foreground">
                        <p>
                          Sarah Johnson is a full-stack web developer with over 10 years of experience in the industry.
                          She has worked with companies like Google, Facebook, and Amazon, and now focuses on teaching
                          the next generation of web developers.
                        </p>
                        <p>
                          Sarah specializes in modern JavaScript frameworks, responsive design, and building scalable
                          web applications. Her teaching approach focuses on practical, real-world examples that help
                          students build job-ready skills.
                        </p>
                        <p>
                          When not teaching, Sarah contributes to open-source projects and speaks at web development
                          conferences around the world.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews" className="mt-6">
                  <div className="space-y-8">
                    <div className="flex flex-col gap-6 md:flex-row">
                      <div className="md:w-1/3">
                        <div className="flex flex-col items-center justify-center rounded-lg border p-6 text-center">
                          <h3 className="text-5xl font-bold">{course.rating}</h3>
                          <div className="my-2 flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-5 w-5 ${star <= Math.round(course.rating) ? "fill-primary text-primary" : "text-muted-foreground"}`}
                              />
                            ))}
                          </div>
                          <p className="text-muted-foreground">Course Rating</p>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {course.students.toLocaleString()} students
                          </p>
                        </div>
                      </div>

                      <div className="flex-1 space-y-4">
                        {[5, 4, 3, 2, 1].map((rating) => {
                          // Mock percentages
                          const percentages = {
                            5: 78,
                            4: 15,
                            3: 5,
                            2: 1,
                            1: 1,
                          }
                          return (
                            <div key={rating} className="flex items-center gap-4">
                              <div className="flex items-center gap-1 w-20">
                                <Star className="h-4 w-4 fill-primary text-primary" />
                                <span>{rating}</span>
                              </div>
                              <div className="h-2 flex-1 rounded-full bg-muted">
                                <div
                                  className="h-2 rounded-full bg-primary"
                                  style={{ width: `${percentages[rating]}%` }}
                                />
                              </div>
                              <div className="w-12 text-right text-sm text-muted-foreground">
                                {percentages[rating]}%
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <Separator />

                    {/* Sample reviews */}
                    <div className="space-y-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="relative h-10 w-10 overflow-hidden rounded-full">
                              <img
                                src={`/placeholder.svg?height=40&width=40&text=${i}`}
                                alt={`Student ${i}`}
                                className="object-cover h-full w-full"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">Student Name {i}</h4>
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-3 w-3 ${star <= 5 ? "fill-primary text-primary" : "text-muted-foreground"}`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-muted-foreground">3 months ago</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-muted-foreground">
                            This course is amazing! I've learned so much about web development and feel confident in my
                            skills now. The instructor explains everything clearly and the projects are really helpful
                            for applying what you learn.
                          </p>
                        </div>
                      ))}

                      <Button variant="outline" className="w-full">
                        Load More Reviews
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Course Sidebar */}
            <div>
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="text-2xl">{course.price}</CardTitle>
                  <CardDescription>Lifetime access to all course content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isPurchased ? (
                    <Button className="w-full" size="lg" onClick={handleEnroll}>
                      <Play className="mr-2 h-4 w-4" /> Start Learning
                    </Button>
                  ) : (
                    <Button className="w-full" size="lg" onClick={handlePurchase}>
                      <ShoppingCart className="mr-2 h-4 w-4" /> Purchase Course
                    </Button>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span>{totalHours} hours of video content</span>
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

                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Share2 className="h-4 w-4" />
                    <span>Share this course</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Related Courses */}
        <section className="bg-muted/50 py-12">
          <div className="container">
            <h2 className="mb-8 text-2xl font-bold">Related Courses</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={`/placeholder.svg?height=200&width=350&text=${i}`}
                      alt={`Related Course ${i}`}
                      width={350}
                      height={200}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="line-clamp-2 text-lg">Related Web Development Course {i}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">By Course Instructor</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-4 w-4 fill-primary text-primary" />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">(1,234 students)</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-bold">$79.99</span>
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/courses/${i}`}>View Course</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
