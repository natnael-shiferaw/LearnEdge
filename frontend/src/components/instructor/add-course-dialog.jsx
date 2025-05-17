import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Check, ChevronRight, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CurriculumBuilder } from "@/components/instructor/curriculum-builder"
import { CourseImageUpload } from "@/components/instructor/course-image-upload"

export function AddCourseDialog({ open, onOpenChange }) {
    const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [courseData, setCourseData] = useState({
    title: "",
    category: "",
    level: "",
    language: "English",
    subtitle: "",
    description: "",
    price: "",
    welcomeMessage: "",
    learningObjectives: ["", "", ""],
    image: null,
    curriculum: [],
  })

  const totalSteps = 3

  const handleChange = (field, value) => {
    setCourseData((prev) => ({ ...prev, [field]: value }))
  }

  const handleLearningObjectiveChange = (index, value) => {
    const newObjectives = [...courseData.learningObjectives]
    newObjectives[index] = value
    setCourseData((prev) => ({ ...prev, learningObjectives: newObjectives }))
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
  }

  const handleSubmit = () => {
    // Here you would typically send the data to your backend
    console.log("Course data:", courseData)
    onOpenChange(false)
    // Redirect to the course edit page
    navigate("/instructor/courses/new")
  }

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
          <DialogDescription>
            Fill in the details to create your new course. You can edit these details later.
          </DialogDescription>
        </DialogHeader>

        <div className="mb-6 flex items-center justify-between">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                  step === s
                    ? "bg-primary text-primary-foreground"
                    : step > s
                      ? "bg-primary/20 text-primary"
                      : "border bg-background text-muted-foreground",
                )}
              >
                {step > s ? <Check className="h-4 w-4" /> : s}
              </div>
              <div className={cn("ml-2 text-sm font-medium", step === s ? "text-foreground" : "text-muted-foreground")}>
                {s === 1 ? "Basic Info" : s === 2 ? "Curriculum" : "Settings"}
              </div>
              {s < totalSteps && (
                <ChevronRight className={cn("mx-2 h-4 w-4", s < step ? "text-primary" : "text-muted-foreground")} />
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
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
                className="min-h-[120px]"
                value={courseData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="welcome-message">Welcome Message</Label>
              <Textarea
                id="welcome-message"
                placeholder="A message to welcome students to your course"
                className="min-h-[80px]"
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
                    disabled={courseData.learningObjectives.length <= 1}
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
        )}

        {step === 2 && <CurriculumBuilder />}

        {step === 3 && (
          <div className="grid gap-6">
            <CourseImageUpload value={courseData.image} onChange={(image) => handleChange("image", image)} />

            <div className="grid gap-3">
              <Label>Course Preview</Label>
              <div className="rounded-md border p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-medium">{courseData.title || "Course Title"}</h3>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {courseData.level ? courseData.level.charAt(0).toUpperCase() + courseData.level.slice(1) : "Level"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {courseData.subtitle || "Course subtitle will appear here"}
                </p>
                <div className="mt-4">
                  <p className="text-sm font-medium">What you'll learn:</p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                    {courseData.learningObjectives.map(
                      (objective, index) => objective && <li key={index}>{objective}</li>,
                    )}
                  </ul>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-medium">Price: </span>
                    {courseData.price ? `$${courseData.price}` : "Free"}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Language: </span>
                    {courseData.language}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex items-center justify-between">
          <Button type="button" variant="outline" onClick={step === 1 ? () => onOpenChange(false) : handleBack}>
            {step === 1 ? "Cancel" : "Back"}
          </Button>
          <Button type="button" onClick={step === totalSteps ? handleSubmit : handleNext}>
            {step === totalSteps ? "Create Course" : "Next"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
