import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useParams } from 'react-router-dom'
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

export default function CourseEditPage() {
  const navigate = useNavigate()
  let { id } = useParams()
  const courseId = id

  // Mock course data -  fetched  from your API
  const [courseData, setCourseData] = useState({
    title: courseId === "new" ? "" : "Web Development Bootcamp",
    category: courseId === "new" ? "" : "development",
    level: courseId === "new" ? "" : "beginner",
    language: courseId === "new" ? "English" : "English",
    subtitle: courseId === "new" ? "" : "Learn web development from scratch to advanced concepts",
    description:
      courseId === "new"
        ? ""
        : "This comprehensive course covers HTML, CSS, JavaScript, React, and Node.js to help you become a full-stack web developer.",
    price: courseId === "new" ? "" : "89.99",
    welcomeMessage:
      courseId === "new" ? "" : "Welcome to the Web Development Bootcamp! I'm excited to have you on board.",
    learningObjectives:
      courseId === "new"
        ? ["", "", ""]
        : [
            "Build responsive websites using HTML, CSS, and JavaScript",
            "Create dynamic web applications with React",
            "Develop backend APIs with Node.js and Express",
          ],
    image: courseId === "new" ? null : "/placeholder.svg?height=720&width=1280",
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null)

  const handleChange = (field, value) => {
    setCourseData((prev) => ({ ...prev, [field]: value }))
    setSaveStatus(null)
  }

  const handleLearningObjectiveChange = (index, value) => {
    const newObjectives = [...courseData.learningObjectives]
    newObjectives[index] = value
    setCourseData((prev) => ({ ...prev, learningObjectives: newObjectives }))
    setSaveStatus(null)
  }

  const handleAddLearningObjective = () => {
    setCourseData((prev) => ({
      ...prev,
      learningObjectives: [...prev.learningObjectives, ""],
    }))
  }

  const handleRemoveLearningObjective = (index) => {
    const newObjectives = [...courseData.learningObjectives]
    newObjectives.splice(index, 1)
    setCourseData((prev) => ({ ...prev, learningObjectives: newObjectives }))
    setSaveStatus(null)
  }

  const handleSave = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setSaveStatus("success")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveStatus(null)
      }, 3000)
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <InstructorSidebar />
        <main className="flex-1 overflow-y-auto bg-muted/40 pb-16">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-6 py-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => navigate("/instructor")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-semibold">{courseId === "new" ? "Create New Course" : "Edit Course"}</h1>
            </div>
            <div className="flex items-center gap-2">
              {saveStatus === "success" && (
                <div className="flex items-center text-sm text-green-600">
                  <Check className="mr-1 h-4 w-4" /> Saved successfully
                </div>
              )}
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  "Saving..."
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
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
              </TabsList>

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
                      <Select value={courseData.category} onValueChange={(value) => handleChange("category", value)}>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="development">Development</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="data-science">Data Science</SelectItem>
                          <SelectItem value="personal-development">Personal Development</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="level">Level</Label>
                      <Select value={courseData.level} onValueChange={(value) => handleChange("level", value)}>
                        <SelectTrigger id="level">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="all-levels">All Levels</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="grid gap-3">
                      <Label htmlFor="language">Primary Language</Label>
                      <Select value={courseData.language} onValueChange={(value) => handleChange("language", value)}>
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
                        onChange={(e) => handleChange("price", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="subtitle">Course Subtitle</Label>
                    <Input
                      id="subtitle"
                      placeholder="A brief description of your course"
                      value={courseData.subtitle}
                      onChange={(e) => handleChange("subtitle", e.target.value)}
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="description">Course Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide a detailed description of your course"
                      className="min-h-[200px]"
                      value={courseData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="welcome-message">Welcome Message</Label>
                    <Textarea
                      id="welcome-message"
                      placeholder="A message to welcome students to your course"
                      className="min-h-[120px]"
                      value={courseData.welcomeMessage}
                      onChange={(e) => handleChange("welcomeMessage", e.target.value)}
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label>Learning Objectives</Label>
                    <p className="text-sm text-muted-foreground">What will students learn in your course?</p>
                    {courseData.learningObjectives.map((objective, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          placeholder={`Learning objective ${index + 1}`}
                          value={objective}
                          onChange={(e) => handleLearningObjectiveChange(index, e.target.value)}
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
                    <Button type="button" variant="outline" className="mt-2" onClick={handleAddLearningObjective}>
                      Add Learning Objective
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="curriculum" className="space-y-6">
                <CurriculumBuilder />
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <CourseImageUpload value={courseData.image} onChange={(image) => handleChange("image", image)} />

                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="course-url">Course URL</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">learnedge.com/courses/</span>
                      <Input
                        id="course-url"
                        placeholder="web-development-bootcamp"
                        value={courseData.title ? courseData.title.toLowerCase().replace(/\s+/g, "-") : ""}
                        readOnly
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This URL is automatically generated from your course title.
                    </p>
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="course-visibility">Course Visibility</Label>
                    <Select defaultValue="draft">
                      <SelectTrigger id="course-visibility">
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft (not visible to students)</SelectItem>
                        <SelectItem value="published">Published (visible to all)</SelectItem>
                        <SelectItem value="private">Private (visible with link only)</SelectItem>
                        <SelectItem value="scheduled">Scheduled (publish on a future date)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="course-requirements">Course Requirements</Label>
                    <Textarea
                      id="course-requirements"
                      placeholder="What should students know before taking this course?"
                      className="min-h-[120px]"
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="course-tags">Course Tags</Label>
                    <Input id="course-tags" placeholder="e.g., web development, javascript, react" />
                    <p className="text-xs text-muted-foreground">
                      Separate tags with commas. These help students find your course.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-6">
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="course-price">Regular Price ($)</Label>
                    <Input
                      id="course-price"
                      type="number"
                      placeholder="e.g., 49.99"
                      value={courseData.price}
                      onChange={(e) => handleChange("price", e.target.value)}
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="course-sale-price">Sale Price ($)</Label>
                    <Input id="course-sale-price" type="number" placeholder="e.g., 39.99" />
                    <p className="text-xs text-muted-foreground">Leave empty if not on sale.</p>
                  </div>

                  <div className="grid gap-3">
                    <Label>Pricing Options</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="subscription" />
                        <Label htmlFor="subscription">Include in subscription plans</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="team-pricing" />
                        <Label htmlFor="team-pricing">Enable team pricing</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="bulk-pricing" />
                        <Label htmlFor="bulk-pricing">Enable bulk purchase discounts</Label>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="course-coupons">Coupon Codes</Label>
                    <Button variant="outline">Manage Coupon Codes</Button>
                  </div>
                </div>
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
