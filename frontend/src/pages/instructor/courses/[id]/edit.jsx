import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Check, Save, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InstructorSidebar } from "@/components/instructor-sidebar"
import { CurriculumBuilder } from "@/components/instructor/curriculum-builder"
import { CourseImageUpload } from "@/components/instructor/course-image-upload"
import {
  fetchInstructorCourseDetailsService,
  updateCourseByIdService,
} from "@/services/instructorService"

export default function CourseEditPage() {
  const navigate = useNavigate()
  let { id } = useParams()
  const courseId = id

  // Keep track of loading/fetch state
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  // ③ courseData state exactly matches the fields the API expects.
  const [courseData, setCourseData] = useState({
    title: "",
    category: "",
    level: "",
    language: "English",
    subtitle: "",
    description: "",
    price: "",
    welcomeMessage: "",
    learningObjectives: [""],      // start with a single blank objective
    image: null,                   // will become { url, publicId } once uploaded
    curriculum: [],                // will become array of sections/lectures
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null)

  // Helper to update any primitive field
  const handleChange = (field, value) => {
    setCourseData(prev => ({ ...prev, [field]: value }))
    setSaveStatus(null)
  }

  // Learning‐objective handlers
  const handleLearningObjectiveChange = (index, value) => {
    const newObjectives = [...courseData.learningObjectives]
    newObjectives[index] = value
    setCourseData(prev => ({ ...prev, learningObjectives: newObjectives }))
    setSaveStatus(null)
  }

  const handleAddLearningObjective = () => {
    setCourseData(prev => ({
      ...prev,
      learningObjectives: [...prev.learningObjectives, ""],
    }))
    setSaveStatus(null)
  }

  const handleRemoveLearningObjective = (index) => {
    const newObjectives = [...courseData.learningObjectives]
    newObjectives.splice(index, 1)
    setCourseData(prev => ({ ...prev, learningObjectives: newObjectives }))
    setSaveStatus(null)
  }

  // When “Save Changes” is clicked: call the update service
  const handleSave = async () => {
    setIsSaving(true)
    try {
      // If this is an “existing” course, call updateCourseByIdService
      if (courseId !== "new") {
        await updateCourseByIdService(courseId, courseData)
        setSaveStatus("success")
        // wait a second (so the user sees “Saved successfully”), then redirect:
      setTimeout(() => {
        navigate("/instructor/courses");
      }, 1000);
      } else {
        // For now, we’ll just return.
        setSaveStatus("success")
      }
    } catch (err) {
      console.error("Error saving course:", err)
      setSaveStatus("error")
    } finally {
      setIsSaving(false)
      // Clear the success/error message after a short delay
      setTimeout(() => setSaveStatus(null), 3000)
    }
  }

  // On mount (and whenever courseId changes), fetch real data if not “new”
  useEffect(() => {
    if (courseId === "new") {
      setIsLoading(false)
      return
    }

    let isMounted = true
    setIsLoading(true)
    setLoadError(null)

    fetchInstructorCourseDetailsService(courseId)
      .then(res => {
        if (!isMounted) return
        if (res.success) {
          // The API returns res.data as the saved course object.
          // Overwrite courseData with exactly what the backend sent.
          setCourseData({
            title: res.data.title || "",
            category: res.data.category || "",
            level: res.data.level || "",
            language: res.data.language || "English",
            subtitle: res.data.subtitle || "",
            description: res.data.description || "",
            price: res.data.price?.toString() || "",
            welcomeMessage: res.data.welcomeMessage || "",
            learningObjectives: res.data.learningObjectives || [""],
            image: res.data.image || null,                 // expects { url, publicId }
            curriculum: res.data.curriculum || [],           // expects array of sections
          })
        } else {
          setLoadError("Failed to fetch course details")
        }
      })
      .catch(err => {
        console.error("Network error fetching course:", err)
        if (isMounted) setLoadError("Network error")
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [courseId])

  //  While fetching, show a loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <InstructorSidebar />
        <div className="container py-8">
          <p>Loading course details…</p>
        </div>
      </div>
    )
  }

  // If fetch failed, show an error
  if (loadError) {
    return (
      <div className="flex min-h-screen">
        <InstructorSidebar />
        <div className="container py-8">
          <p className="text-red-500">{loadError}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <InstructorSidebar />
        <main className="flex-1 overflow-y-auto bg-muted/40 pb-16">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-6 py-3">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/instructor/courses")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-semibold">
                {courseId === "new" ? "Create New Course" : "Edit Course"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {saveStatus === "success" && (
                <div className="flex items-center text-sm text-green-600">
                  <Check className="mr-1 h-4 w-4" /> Saved successfully
                </div>
              )}
              {saveStatus === "error" && (
                <div className="flex items-center text-sm text-red-600">
                  <X className="mr-1 h-4 w-4" /> Save failed
                </div>
              )}
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  "Saving…"
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="container py-8">
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              {/* ──────────────────────────────────────── BASIC INFO TAB ──────────────────────────────────────── */}
              <TabsContent value="basic" className="space-y-6">
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="title">Course Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Complete Web Development Bootcamp"
                      value={courseData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="grid gap-3">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={courseData.category}
                        onValueChange={(value) =>
                          handleChange("category", value)
                        }
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="development">
                            Development
                          </SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="data-science">
                            Data Science
                          </SelectItem>
                          <SelectItem value="personal-development">
                            Personal Development
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="level">Level</Label>
                      <Select
                        value={courseData.level}
                        onValueChange={(value) =>
                          handleChange("level", value)
                        }
                      >
                        <SelectTrigger id="level">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="all-levels">
                            All Levels
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="grid gap-3">
                      <Label htmlFor="language">Primary Language</Label>
                      <Select
                        value={courseData.language}
                        onValueChange={(value) =>
                          handleChange("language", value)
                        }
                      >
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Spanish">Spanish</SelectItem>
                          <SelectItem value="French">French</SelectItem>
                          <SelectItem value="German">German</SelectItem>
                          <SelectItem value="Chinese">Chinese</SelectItem>
                          <SelectItem value="Japanese">Japanese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="e.g., 49.99"
                        value={courseData.price}
                        onChange={(e) =>
                          handleChange("price", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="subtitle">Course Subtitle</Label>
                    <Input
                      id="subtitle"
                      placeholder="A brief description of your course"
                      value={courseData.subtitle}
                      onChange={(e) =>
                        handleChange("subtitle", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="description">Course Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide a detailed description of your course"
                      className="min-h-[200px]"
                      value={courseData.description}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="welcome-message">Welcome Message</Label>
                    <Textarea
                      id="welcome-message"
                      placeholder="A message to welcome students to your course"
                      className="min-h-[120px]"
                      value={courseData.welcomeMessage}
                      onChange={(e) =>
                        handleChange("welcomeMessage", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label>Learning Objectives</Label>
                    <p className="text-sm text-muted-foreground">
                      What will students learn in your course?
                    </p>
                    {courseData.learningObjectives.map((objective, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          placeholder={`Learning objective ${index + 1}`}
                          value={objective}
                          onChange={(e) =>
                            handleLearningObjectiveChange(
                              index,
                              e.target.value
                            )
                          }
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveLearningObjective(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2"
                      onClick={handleAddLearningObjective}
                    >
                      Add Learning Objective
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* ──────────────────────────────────────── CURRICULUM TAB ──────────────────────────────────────── */}
              <TabsContent value="curriculum" className="space-y-6">
                {/* ⑩ Pass the existing curriculum array into CurriculumBuilder */}
                <CurriculumBuilder
                  sections={courseData.curriculum}
                  onChange={(updated) =>
                    setCourseData(prev => ({
                      ...prev,
                      curriculum: updated,
                    }))
                  }
                />
              </TabsContent>

              {/* ──────────────────────────────────────── SETTINGS TAB ──────────────────────────────────────── */}
              <TabsContent value="settings" className="space-y-6">
                <CourseImageUpload
                  value={courseData.image?.url || null}
                  onChange={(img) => handleChange("image", img)}
                />

              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

// Simple Checkbox component
function Checkbox({ id, ...props }) {
  return (
    <input
      type="checkbox"
      id={id}
      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
      {...props}
    />
  )
}
