import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function CourseImageUpload({ value, onChange }) {
  const [previewUrl, setPreviewUrl] = useState(value)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      onChange(url)
    }
  }

  const handleRemoveImage = () => {
    setPreviewUrl(null)
    onChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="grid gap-3">
      <Label>Course Image</Label>
      <p className="text-sm text-muted-foreground">
        Upload a high-quality image that represents your course. Recommended size: 1280x720 pixels.
      </p>

      <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} className="hidden" />

      {previewUrl ? (
        <div className="relative">
          <div className="aspect-video w-full overflow-hidden rounded-md border">
          <img
              src={previewUrl || "/placeholder.svg"}
              alt="Course preview"
              className="h-full w-full object-cover"
            />
          </div>
          <Button variant="destructive" size="icon" className="absolute right-2 top-2" onClick={handleRemoveImage}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-md border border-dashed"
          onClick={triggerFileInput}
        >
          <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">Click to upload course image</p>
          <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
        </div>
      )}
    </div>
  )
}
