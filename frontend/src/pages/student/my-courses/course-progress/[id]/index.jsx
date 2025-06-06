import { useState, useEffect } from "react"
import {Link, useParams} from "react-router-dom"
import {
  ArrowLeft,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Flag,
  List,
  Pause,
  Play,
  Settings,
  Share2,
  ThumbsUp,
  Volume2,
  VolumeX,
  Award,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/hooks/use-toast"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function CourseProgressPage() {
  const { id: courseId} = useParams()

  const [currentLectureId, setCurrentLectureId] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(80)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [completedLectures, setCompletedLectures] = useState([])
  const [showCongratulations, setShowCongratulations] = useState(false)

  // Mock course data
  const course = {
    id: courseId,
    title: "Web Development Bootcamp",
    instructor: "Sarah Johnson",
    image: "/placeholder.svg?height=200&width=350",
    totalLectures: 42,
    curriculum: [
      {
        id: 1,
        title: "Introduction to Web Development",
        lectures: [
          {
            id: 1,
            title: "Course Overview",
            duration: "10:15",
            videoUrl: "/placeholder.svg?height=720&width=1280",
            description:
              "Welcome to the Web Development Bootcamp! In this lecture, we'll go over what you'll learn in this course and how to get the most out of it.",
            resources: [
              { name: "Course Syllabus", type: "pdf" },
              { name: "Setup Instructions", type: "pdf" },
            ],
          },
          {
            id: 2,
            title: "How the Web Works",
            duration: "15:30",
            videoUrl: "/placeholder.svg?height=720&width=1280",
            description:
              "Learn about the fundamental concepts of how the web works, including HTTP, browsers, and servers.",
            resources: [
              { name: "Web Architecture Diagram", type: "pdf" },
              { name: "Additional Reading", type: "link" },
            ],
          },
          {
            id: 3,
            title: "Setting Up Your Development Environment",
            duration: "20:45",
            videoUrl: "/placeholder.svg?height=720&width=1280",
            description:
              "In this lecture, we'll set up all the tools you need for web development, including code editors, browsers, and developer tools.",
            resources: [
              { name: "Development Tools Checklist", type: "pdf" },
              { name: "VS Code Extensions", type: "link" },
            ],
          },
        ],
      },
      {
        id: 2,
        title: "HTML Fundamentals",
        lectures: [
          {
            id: 4,
            title: "HTML Document Structure",
            duration: "18:20",
            videoUrl: "/placeholder.svg?height=720&width=1280",
            description:
              "Learn about the basic structure of HTML documents, including doctype, head, and body elements.",
            resources: [
              { name: "HTML Template", type: "html" },
              { name: "HTML5 Cheat Sheet", type: "pdf" },
            ],
          },
          {
            id: 5,
            title: "HTML Elements and Attributes",
            duration: "25:10",
            videoUrl: "/placeholder.svg?height=720&width=1280",
            description: "Explore the various HTML elements and attributes that form the building blocks of web pages.",
            resources: [
              { name: "Elements Reference", type: "pdf" },
              { name: "Practice Exercises", type: "zip" },
            ],
          },
          {
            id: 6,
            title: "Forms and Input Elements",
            duration: "22:35",
            videoUrl: "/placeholder.svg?height=720&width=1280",
            description: "Learn how to create interactive forms using HTML form elements and input types.",
            resources: [
              { name: "Form Examples", type: "html" },
              { name: "Input Types Reference", type: "pdf" },
            ],
          },
          {
            id: 7,
            title: "Semantic HTML",
            duration: "19:45",
            videoUrl: "/placeholder.svg?height=720&width=1280",
            description:
              "Understand the importance of semantic HTML and how to use semantic elements for better accessibility and SEO.",
            resources: [
              { name: "Semantic HTML Guide", type: "pdf" },
              { name: "Before/After Examples", type: "html" },
            ],
          },
        ],
      },
      {
        id: 3,
        title: "CSS Styling",
        lectures: [
          {
            id: 8,
            title: "CSS Selectors and Properties",
            duration: "24:15",
            videoUrl: "/placeholder.svg?height=720&width=1280",
            description: "Learn about CSS selectors and how to apply styles to HTML elements using various properties.",
            resources: [
              { name: "CSS Selectors Cheat Sheet", type: "pdf" },
              { name: "CSS Properties Reference", type: "pdf" },
            ],
          },
          {
            id: 9,
            title: "Box Model and Layout",
            duration: "28:30",
            videoUrl: "/placeholder.svg?height=720&width=1280",
            description: "Understand the CSS box model and how to create layouts using various positioning techniques.",
            resources: [
              { name: "Box Model Diagram", type: "png" },
              { name: "Layout Examples", type: "zip" },
            ],
          },
        ],
      },
    ],
  }

  // Find current lecture
  const findLecture = (lectureId) => {
    for (const section of course.curriculum) {
      const lecture = section.lectures.find((l) => l.id === lectureId)
      if (lecture) {
        return { lecture, section }
      }
    }
    return { lecture: null, section: null }
  }

  const { lecture: currentLecture, section: currentSection } = findLecture(currentLectureId)

  // Calculate total lectures
  const totalLectures = course.curriculum.reduce((total, section) => total + section.lectures.length, 0)

  // Calculate course progress
  const progress = Math.round((completedLectures.length / totalLectures) * 100)

  // Find next and previous lectures
  const findAdjacentLectures = () => {
    const allLectures = []
    course.curriculum.forEach((section) => {
      section.lectures.forEach((lecture) => {
        allLectures.push(lecture.id)
      })
    })

    const currentIndex = allLectures.indexOf(currentLectureId)
    const prevLectureId = currentIndex > 0 ? allLectures[currentIndex - 1] : null
    const nextLectureId = currentIndex < allLectures.length - 1 ? allLectures[currentIndex + 1] : null

    return { prevLectureId, nextLectureId }
  }

  const { prevLectureId, nextLectureId } = findAdjacentLectures()

  // Handle lecture completion
  const markLectureAsCompleted = (lectureId) => {
    if (!completedLectures.includes(lectureId)) {
      const newCompletedLectures = [...completedLectures, lectureId]
      setCompletedLectures(newCompletedLectures)

      // Check if all lectures are completed
      if (newCompletedLectures.length === totalLectures) {
        setShowCongratulations(true)
        toast({
          title: "Congratulations!",
          description: "You have completed the entire course!",
          duration: 5000,
        })
      }
    }
  }

  // Handle lecture navigation
  const navigateToLecture = (lectureId) => {
    setCurrentLectureId(lectureId)
    setCurrentTime(0)
    setIsPlaying(true)
  }

  // Format time (seconds to MM:SS)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  // Parse duration (MM:SS to seconds)
  const parseDuration = (durationString) => {
    const [minutes, seconds] = durationString.split(":").map(Number)
    return minutes * 60 + seconds
  }

  // Simulate video playback
  useEffect(() => {
    if (currentLecture) {
      setDuration(parseDuration(currentLecture.duration))
    }

    let interval
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => {
          if (prevTime >= duration) {
            setIsPlaying(false)
            markLectureAsCompleted(currentLectureId)
            return duration
          }
          return prevTime + 1
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isPlaying, currentLectureId, currentLecture, duration])

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  // Handle volume change
  const handleVolumeChange = (value) => {
    setVolume(value[0])
    if (value[0] === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  // Handle seek
  const handleSeek = (value) => {
    setCurrentTime(value[0])
  }

  // Handle complete button click
  const handleCompleteClick = () => {
    markLectureAsCompleted(currentLectureId)
    toast({
      title: "Lecture completed",
      description: "Your progress has been updated.",
      duration: 3000,
    })
  }

  if (!currentLecture) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1">
          <DashboardSidebar />
          <main className="flex-1 overflow-y-auto bg-muted/40 p-8">
            <div className="container flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold">Lecture not found</h1>
                <p className="mt-2 text-muted-foreground">The lecture you're looking for doesn't exist.</p>
                <Button className="mt-4" asChild>
                  <Link to="/student/my-courses">Back to My Courses</Link>
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto bg-muted/40">
          {/* Video Player Section */}
          <div className="relative bg-black">
            <div
              className="relative aspect-video w-full"
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
            >
              <img
                src={currentLecture.videoUrl || "/placeholder.svg"}
                alt={currentLecture.title}
                className="object-contain h-full w-full"
              />

              {/* Video Controls */}
              {showControls && (
                <div className="absolute inset-0 flex flex-col justify-between bg-black/40 p-4">
                  <div className="flex items-center justify-between">
                    <Button variant="ghost" size="icon" className="text-white" asChild>
                      <Link to="/student/my-courses">
                        <ArrowLeft className="h-5 w-5" />
                      </Link>
                    </Button>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-white">
                        {currentSection.title}
                      </Badge>
                      <Button variant="ghost" size="icon" className="text-white">
                        <Settings className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white"
                        disabled={!prevLectureId}
                        onClick={() => navigateToLecture(prevLectureId)}
                      >
                        <ChevronLeft className="h-8 w-8" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-white h-16 w-16" onClick={togglePlayPause}>
                        {isPlaying ? <Pause className="h-10 w-10" /> : <Play className="h-10 w-10" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white"
                        disabled={!nextLectureId}
                        onClick={() => navigateToLecture(nextLectureId)}
                      >
                        <ChevronRight className="h-8 w-8" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-sm text-white">{formatTime(currentTime)}</span>
                      <Slider
                        value={[currentTime]}
                        max={duration}
                        step={1}
                        className="flex-1"
                        onValueChange={handleSeek}
                      />
                      <span className="text-sm text-white">{currentLecture.duration}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="text-white" onClick={toggleMute}>
                          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                        </Button>
                        <Slider
                          value={[isMuted ? 0 : volume]}
                          max={100}
                          step={1}
                          className="w-24"
                          onValueChange={handleVolumeChange}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-white">
                                <Flag className="h-5 w-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Report an issue</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-white">
                                <Share2 className="h-5 w-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Share this lecture</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Course Content */}
          <div className="container py-6">
            <div className="mb-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{course.title}</h1>
                  <p className="text-muted-foreground">Instructor: {course.instructor}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCompleteClick}
                    disabled={completedLectures.includes(currentLectureId)}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {completedLectures.includes(currentLectureId) ? "Completed" : "Mark as Complete"}
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to={`/courses/${courseId}`}>
                      <FileText className="mr-2 h-4 w-4" />
                      Course Details
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Course Progress</span>
                  <span className="text-sm">{progress}% Complete</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {completedLectures.length} of {totalLectures} lectures completed
                </p>
              </div>
            </div>

            <Tabs defaultValue="content" className="mt-6">
              <TabsList>
                <TabsTrigger value="content">Course Content</TabsTrigger>
                <TabsTrigger value="notes">My Notes</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
              </TabsList>

              {/* Course Content Tab */}
              <TabsContent value="content" className="mt-4">
                <div className="mb-4">
                  <h2 className="text-xl font-bold">{currentLecture.title}</h2>
                  <p className="text-muted-foreground">{currentLecture.description}</p>
                </div>

                <Separator className="my-4" />

                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-medium">Course Curriculum</h3>
                    <Button variant="ghost" size="sm">
                      <List className="mr-2 h-4 w-4" />
                      Collapse All
                    </Button>
                  </div>

                  <Accordion type="multiple" defaultValue={[`section-${currentSection.id}`]} className="w-full">
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
                                className={`flex items-center justify-between px-4 py-3 hover:bg-muted/30 ${
                                  lecture.id === currentLectureId ? "bg-muted/50" : ""
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  {completedLectures.includes(lecture.id) ? (
                                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                  ) : (
                                    <Play className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                  )}
                                  <div>
                                    <button
                                      className="font-medium text-left hover:underline"
                                      onClick={() => navigateToLecture(lecture.id)}
                                    >
                                      {lecture.title}
                                    </button>
                                    <p className="text-sm text-muted-foreground">{lecture.duration}</p>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </TabsContent>

              {/* Notes Tab */}
              <TabsContent value="notes" className="mt-4">
                <div className="rounded-lg border p-4">
                  <h3 className="mb-4 text-lg font-medium">My Notes for "{currentLecture.title}"</h3>
                  <textarea
                    className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Take notes for this lecture..."
                  />
                  <div className="mt-4 flex justify-end">
                    <Button>Save Notes</Button>
                  </div>
                </div>
              </TabsContent>

              {/* Resources Tab */}
              <TabsContent value="resources" className="mt-4">
                <div className="rounded-lg border p-4">
                  <h3 className="mb-4 text-lg font-medium">Lecture Resources</h3>
                  {currentLecture.resources && currentLecture.resources.length > 0 ? (
                    <ul className="space-y-2">
                      {currentLecture.resources.map((resource, index) => (
                        <li key={index} className="flex items-center justify-between rounded-md border p-3">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <span>{resource.name}</span>
                            <Badge variant="outline">{resource.type.toUpperCase()}</Badge>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No resources available for this lecture.</p>
                  )}
                </div>
              </TabsContent>

              {/* Discussion Tab */}
              <TabsContent value="discussion" className="mt-4">
                <div className="rounded-lg border p-4">
                  <h3 className="mb-4 text-lg font-medium">Lecture Discussion</h3>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-start gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full">
                          <img src="/placeholder.svg?height=40&width=40" alt="User"  className="object-cover h-full w-full" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">John Doe</h4>
                            <span className="text-xs text-muted-foreground">2 days ago</span>
                          </div>
                          <p className="mt-1 text-sm">
                            Great explanation of the concepts! I was wondering if there are any additional resources for
                            learning more about responsive design?
                          </p>
                          <div className="mt-2 flex items-center gap-4">
                            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                              <ThumbsUp className="h-3.5 w-3.5" />
                              <span>12</span>
                            </button>
                            <button className="text-xs text-muted-foreground hover:text-foreground">Reply</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="flex items-start gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full">
                          <img
                            src="/placeholder.svg?height=40&width=40&text=SJ"
                            alt="Instructor"
                            className="object-cover h-full w-full"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">
                              Sarah Johnson <Badge>Instructor</Badge>
                            </h4>
                            <span className="text-xs text-muted-foreground">1 day ago</span>
                          </div>
                          <p className="mt-1 text-sm">
                            Hi John! Yes, I've added some additional resources in the Resources tab. Check out the
                            "Responsive Design Guide" PDF.
                          </p>
                          <div className="mt-2 flex items-center gap-4">
                            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                              <ThumbsUp className="h-3.5 w-3.5" />
                              <span>5</span>
                            </button>
                            <button className="text-xs text-muted-foreground hover:text-foreground">Reply</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full">
                        <img src="/placeholder.svg?height=40&width=40" alt="User"  className="object-cover h-full w-full" />
                      </div>
                      <div className="flex-1">
                        <textarea
                          className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Add to the discussion..."
                        />
                        <div className="mt-2 flex justify-end">
                          <Button>Post Comment</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Congratulations Modal */}
      {showCongratulations && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-w-md rounded-lg bg-background p-6 shadow-lg">
            <div className="mb-4 flex flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <Award className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Congratulations!</h2>
              <p className="mt-2 text-muted-foreground">You've completed the entire "{course.title}" course.</p>
            </div>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button onClick={() => setShowCongratulations(false)}>Continue Learning</Button>
              <Button variant="outline" asChild>
                <Link to="/student/my-courses">Back to My Courses</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
