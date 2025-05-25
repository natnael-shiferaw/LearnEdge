import { useState, useEffect, useRef } from "react"
import { Play, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { uploadMedia, deleteMedia } from "@/services/mediaService"

export function VideoUploader({ onUpload, currentVideo , currentPublicId}) {
  const [videoFile, setVideoFile] = useState(null)
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(currentVideo)
  const [videoDuration, setVideoDuration] = useState(null)
  const [publicId, setPublicId] = useState(currentPublicId || null)
  const [isUploading, setUploading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
        if (isDialogOpen) {
          setVideoFile(null)
          setVideoDuration(null)
          setVideoPreviewUrl(currentVideo)
          setPublicId(currentPublicId || null)
        }
      }, [isDialogOpen, currentVideo, currentPublicId])

  // helper to format seconds as "MM:SS"
  function formatDuration(seconds) {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")
    const s = Math.round(seconds % 60)
      .toString()
      .padStart(2, "0")
    return `${m}:${s}`
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file)

      // create object URL & preview
      const url = URL.createObjectURL(file)
      setVideoPreviewUrl(url)

      // load metadata to compute duration
      const tmp = document.createElement("video")
      tmp.preload = "metadata"
      tmp.src = url
      tmp.onloadedmetadata = () => {
        URL.revokeObjectURL(url)
        setVideoDuration(formatDuration(tmp.duration))
      }
    }
  }

  const handleUpload = async () => {
        if (!videoFile) return
    
        setUploading(true)
        try {
          const duration = videoDuration ?? "0:00"
          // upload to cloudinary
          const { secure_url, public_id } = await uploadMedia(videoFile)
          // set public id
          setPublicId(public_id)
          // bubble up url/duration/publicId
          onUpload(secure_url, duration, public_id)
          // close dialog
          setIsDialogOpen(false)
        } catch (err) {
          console.error("Video upload failed:", err)
        } finally {
          setUploading(false)
        }
      }

  const handleRemoveVideo = async () => {
    // if we’d previously saved a publicId, ask backend to delete
    if (publicId) {
      await deleteMedia(publicId)
      setPublicId(null)
    }
    setVideoFile(null)
    setVideoDuration(null)
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl)
    setVideoPreviewUrl(null)
 
    // notify parent that video is gone
    onUpload(null, "0:00", null)
  } 

  const triggerFileInput = () => {
    if (!isUploading) fileInputRef.current?.click()
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {currentVideo ? (
            <>
              <Play className="mr-2 h-4 w-4" /> Preview
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" /> Upload
            </>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Lecture Video</DialogTitle>
          <DialogDescription>
            Upload a video file for this lecture. Supported formats: MP4, WebM.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <input
            type="file"
            ref={fileInputRef}
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {videoPreviewUrl ? (
            <div className="relative">
              <video
                src={videoPreviewUrl}
                controls
                className="aspect-video w-full rounded-md border"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2"
                onClick={handleRemoveVideo}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div
              className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-md border border-dashed"
              onClick={triggerFileInput}
            >
              <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium">Click to upload video</p>
              <p className="text-xs text-muted-foreground">
                MP4, WebM up to 2GB
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
        <Button
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>

          {isUploading ? (
   <Button disabled>Uploading…</Button>
 ) : videoFile
      ? <Button onClick={handleUpload}>Upload</Button>
      : <Button
          onClick={() => setIsDialogOpen(false)}
          disabled={!currentVideo}
        >
          Save
        </Button>
 }
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
