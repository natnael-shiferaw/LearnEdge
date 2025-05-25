import { useRef, useState } from "react"
import { File, Plus, Trash, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { VideoUploader } from "@/components/instructor/video-uploader"
import { uploadMedia } from "@/services/mediaService"

export function CurriculumBuilder({ sections, onChange }) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  function formatDuration(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0")
    const s = Math.round(seconds % 60).toString().padStart(2, "0")
    return `${m}:${s}`
  }
  // helper to update:
  function update(fn) {
    const next = fn(sections)
    onChange(next)
  }

  const handleAddSection = () => {
    const newSection = {
      id: Date.now(),
      title: `Section ${sections.length + 1}`,
      expanded: true,
      lectures: [],
    }
    update(secs => [...secs, newSection])
  }

  const handleSectionTitleChange = (sectionId, title) => {
    update(secs =>
      secs.map(s => s.id === sectionId ? { ...s, title } : s)
    )
  }

  const handleDeleteSection = (sectionId) => {
    update(secs => secs.filter(s => s.id !== sectionId))
  }

  const handleAddLecture = (sectionId) => {
    const newLecture = {
      id: Date.now(),
      title: "New Lecture",
      videoUrl: null,
      duration: "0:00",
      isPreview: false,
      publicId: null,
    }
    update(secs =>
      secs.map(s =>
        s.id === sectionId
          ? { ...s, lectures: [...s.lectures, newLecture] }
          : s
      )
    )
  }

  const handleLectureTitleChange = (sectionId, lectureId, title) => {
    update(secs =>
      secs.map(s =>
        s.id === sectionId
          ? {
            ...s,
            lectures: s.lectures.map(l =>
              l.id === lectureId ? { ...l, title } : l
            ),
          }
          : s
      )
    )
  }

  const handleDeleteLecture = (sectionId, lectureId) => {
    update(secs =>
      secs.map(s =>
        s.id === sectionId
          ? {
            ...s,
            lectures: s.lectures.filter(l => l.id !== lectureId),
          }
          : s
      )
    )
  }

  function handleTogglePreview(sectionId, lectureId) {
    update(secs =>
      secs.map(s =>
        s.id === sectionId
          ? {
            ...s,
            lectures: s.lectures.map(l =>
              l.id === lectureId
                ? { ...l, isPreview: !l.isPreview }
                : l
            ),
          }
          : s
      )
    )
  }

  const handleBulkFiles = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    setIsUploading(true)
    try {
      // get durations
      const fileInfos = await Promise.all(files.map(file =>
        new Promise(resolve => {
          const tmp = document.createElement("video")
          tmp.preload = "metadata"
          tmp.src = URL.createObjectURL(file)
          tmp.onloadedmetadata = () => {
            URL.revokeObjectURL(tmp.src)
            resolve({ file, duration: formatDuration(tmp.duration) })
          }
        })
      ))

      // upload each to Cloudinary, catch per‐file errors
      const uploadResults = await Promise.all(fileInfos.map(async ({ file, duration }) => {
        try {
          const { secure_url, public_id } = await uploadMedia(file)
          return { secure_url, public_id, duration }
        } catch (err) {
          console.error("Upload failed for file", file.name, err)
          return null
        }
      }))

      // filter out any that failed
      const successes = uploadResults.filter(r => r !== null)

      // merge into your last section
      update(secs => {
        const last = secs[secs.length - 1]
        const start = last.lectures.length + 1
        const newLectures = successes.map((info, i) => ({
          id: Date.now() + i,
          title: `Lecture ${start + i}`,
          videoUrl: info.secure_url,
          duration: info.duration,
          isPreview: false,
          publicId: info.public_id,
        }))
        return secs.map((s, idx) =>
          idx === secs.length - 1
            ? { ...s, lectures: [...s.lectures, ...newLectures] }
            : s
        )
      })
    } finally {
      setIsUploading(false)
      e.target.value = ""
    }
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Course Curriculum</h3>
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading
            ? "Uploading..."
            : <><Upload className="mr-2 h-4 w-4" /> Bulk Upload</>
          }
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
                    <div className="inline-flex items-center ml-4 space-x-2">
                      <Switch
                        checked={lecture.isPreview}
                        onCheckedChange={() => handleTogglePreview(section.id, lecture.id)}
                      />
                      <span className="text-sm">Free preview</span>
                    </div>
                    {lecture.duration !== "0:00" && (
                      <span className="text-xs text-muted-foreground">{lecture.duration}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <VideoUploader
                      currentVideo={lecture.videoUrl}
                      currentPublicId={lecture.publicId}

                      // single onUpload, capturing both URLs + publicId
                      onUpload={(url, duration, publicId) => {
                        update(secs =>
                          secs.map(s =>
                            s.id === section.id
                              ? {
                                ...s,
                                lectures: s.lectures.map(l =>
                                  l.id === lecture.id
                                    ? { ...l, videoUrl: url, duration, publicId }
                                    : l
                                ),
                              }
                              : s
                          )
                        );
                      }}
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
