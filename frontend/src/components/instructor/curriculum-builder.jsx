import { useRef } from "react"
import { useState } from "react"
import { File, Plus, Trash, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { VideoUploader } from "@/components/instructor/video-uploader"

export function CurriculumBuilder() {
  const [sections, setSections] = useState([
    {
      id: 1,
      title: "Introduction",
      expanded: true,
      lectures: [
        {
          id: 1,
          title: "Welcome to the Course",
          videoUrl: null,
          duration: "0:00",
          isPreview: false,
        },
      ],
    },
  ])

  const handleAddSection = () => {
    const newSection = {
      id: Date.now(),
      title: `Section ${sections.length + 1}`,
      expanded: true,
      lectures: [],
    }
    setSections([...sections, newSection])
  }

  const handleSectionTitleChange = (sectionId, title) => {
    setSections(sections.map((section) => (section.id === sectionId ? { ...section, title } : section)))
  }

  const handleDeleteSection = (sectionId) => {
    setSections(sections.filter((section) => section.id !== sectionId))
  }

  const handleAddLecture = (sectionId) => {
    const newLecture = {
      id: Date.now(),
      title: "New Lecture",
      videoUrl: null,
      duration: "0:00",
      isPreview: false,
    }
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            lectures: [...section.lectures, newLecture],
          }
          : section,
      ),
    )
  }

  const handleLectureTitleChange = (sectionId, lectureId, title) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            lectures: section.lectures.map((lecture) => (lecture.id === lectureId ? { ...lecture, title } : lecture)),
          }
          : section,
      ),
    )
  }

  const handleDeleteLecture = (sectionId, lectureId) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            lectures: section.lectures.filter((lecture) => lecture.id !== lectureId),
          }
          : section,
      ),
    )
  }

  const handleVideoUpload = (sectionId, lectureId, videoUrl, duration) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            lectures: section.lectures.map((lecture) =>
              lecture.id === lectureId ? { ...lecture, videoUrl, duration } : lecture,
            ),
          }
          : section,
      ),
    )
  }
  // handle toggle preview
  function handleTogglePreview(sectionId, lectureId) {
    setSections(sections.map(section =>
      section.id === sectionId
        ? {
          ...section,
          lectures: section.lectures.map(lec =>
            lec.id === lectureId ? { ...lec, isPreview: !lec.isPreview } : lec
          ),
        }
        : section
    ))
  }

  const fileInputRef = useRef(null)

  const handleBulkUploadClick = () => fileInputRef.current?.click()

  const handleBulkFiles = (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    setSections(sections.map(section => {
      // append into last section:
      if (section.id !== sections[sections.length - 1].id) return section

      const startIndex = section.lectures.length + 1
      const newLectures = files.map((file, i) => {
        const url = URL.createObjectURL(file)
        return {
          id: Date.now() + i,
          title: `Lecture ${startIndex + i}`,
          videoUrl: url,
          duration: "0:00",
          isPreview: false,
        }
      })

      return {
        ...section,
        lectures: [...section.lectures, ...newLectures],
      }
    }))

    e.target.value = ""
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Course Curriculum</h3>
        <Button variant="outline" onClick={handleBulkUploadClick}>
          <Upload className="mr-2 h-4 w-4" /> Bulk Upload
        </Button>
        <input
          type="file"
          accept="video/*"
          multiple
          ref={fileInputRef}
          className="hidden"
          onChange={handleBulkFiles}
        />
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="rounded-md border">
            <div className="flex items-center justify-between p-4">
              <div className="flex flex-1 items-center gap-2">
                <Input
                  value={section.title}
                  onChange={(e) => handleSectionTitleChange(section.id, e.target.value)}
                  className="max-w-[300px]"
                />
                <span className="text-sm text-muted-foreground">
                  {section.lectures.length} lecture
                  {section.lectures.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleDeleteSection(section.id)}>
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete section</span>
                </Button>
              </div>
            </div>

            <div className="border-t px-4 py-2">
              {section.lectures.map((lecture) => (
                <div key={lecture.id} className="flex flex-col border-b py-3 last:border-0 sm:flex-row sm:items-center">
                  <div className="mb-2 flex flex-1 items-center gap-2 sm:mb-0">
                    <File className="h-4 w-4 text-muted-foreground" />
                    <Input
                      value={lecture.title}
                      onChange={(e) => handleLectureTitleChange(section.id, lecture.id, e.target.value)}
                      className="max-w-[300px]"
                    />
                    {/* Free preview toggle */}
                    <label className="inline-flex items-center ml-4">
                      <input
                        type="checkbox"
                        checked={lecture.isPreview}
                        onChange={() => handleTogglePreview(section.id, lecture.id)}
                        className="mr-1 h-5 w-5"
                      />
                      <span className="text-sm">Free preview</span>
                    </label>
                    {lecture.duration !== "0:00" && (
                      <span className="text-xs text-muted-foreground">{lecture.duration}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <VideoUploader
                      onUpload={(videoUrl, duration) => handleVideoUpload(section.id, lecture.id, videoUrl, duration)}
                      currentVideo={lecture.videoUrl}
                    />
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteLecture(section.id, lecture.id)}>
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete lecture</span>
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                variant="ghost"
                className="my-2 w-full justify-start"
                onClick={() => handleAddLecture(section.id)}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Lecture
              </Button>
            </div>
          </div>
        ))}

        <Button variant="outline" className="w-full" onClick={handleAddSection}>
          <Plus className="mr-2 h-4 w-4" /> Add Section
        </Button>
      </div>
    </div>
  )
}
