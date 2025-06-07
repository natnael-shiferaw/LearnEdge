import { useState, useEffect, useContext, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CheckCircle,
  FileText,
  Award,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "@/hooks/use-toast";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { AuthContext } from "@/context/auth-context";

import {
  getCurrentCourseProgressService,
  markLectureAsViewedService,
  resetCourseProgressService,
} from "@/services/studentService";

export default function CourseProgressPage() {
  const { auth } = useContext(AuthContext);
  const userId = auth?.user?._id;
  const { id: courseId } = useParams();
  const videoRef = useRef(null);

  const [course, setCourse] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [currentLectureId, setCurrentLectureId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCongratulations, setShowCongratulations] = useState(false);

  // flatten all lecture IDs
  const allLectureIds = (course?.curriculum || []).flatMap((s) =>
    s.lectures.map((l) => Number(l.id))
  );

  // lookup current lecture + section
  const findLecture = (lid) => {
    for (const sec of course?.curriculum || []) {
      const lec = sec.lectures.find((l) => Number(l.id) === lid);
      if (lec) return { lecture: lec, section: sec };
    }
    return { lecture: null, section: null };
  };
  const { lecture: currentLecture, section: currentSection } =
    findLecture(currentLectureId);

  // load course & progress on mount
  useEffect(() => {
    let m = true;
    (async () => {
      setLoading(true);
      try {
        const res = await getCurrentCourseProgressService(userId, courseId);
        if (!m) return;
        if (!res.success) throw new Error(res.message || "Load failed");
        const { courseDetails, progress } = res.data;
        setCourse(courseDetails);
        setCompleted(progress.map((p) => Number(p.lectureId)));
        const first = Number(courseDetails.curriculum?.[0]?.lectures?.[0]?.id);
        setCurrentLectureId(first || null);
      } catch (e) {
        toast({ title: "Error", description: e.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      m = false;
    };
  }, [userId, courseId]);

  // whenever you click a new lecture, load & play it
  const goToLecture = (lid) => {
    setCurrentLectureId(lid);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play();
    }
  };

  // when video ends, mark it viewed
  const onVideoEnded = () => {
    if (!completed.includes(currentLectureId) && userId) {
      markLectureAsViewedService(userId, courseId, currentLectureId).then((res) => {
        if (res.success) {
          setCompleted((prev) => {
            const next = [...prev, currentLectureId];
            if (next.length === allLectureIds.length) setShowCongratulations(true);
            return next;
          });
        }
      });
    }
  };

  // reset progress
  const handleReset = async () => {
    await resetCourseProgressService(userId, courseId);
    setCompleted([]);
    setShowCongratulations(false);
    toast({ title: "Progress reset" });
  };

  if (loading) return <main className="container py-12">Loading…</main>;
  if (!course) return <main className="container py-12"><p className="text-red-500">Not found</p></main>;
  if (!currentLecture) return <main className="container py-12"><p>Lecture not found</p></main>;

  // progress percent
  const percent = Math.round((completed.length / allLectureIds.length) * 100);

  // video src
  const videoSrc =
    currentLecture.videoUrl

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto bg-muted/40">
          {/* Video */}
          <div className="relative bg-black aspect-video">
            <video
              ref={videoRef}
              src={videoSrc}
              controls
              className="object-contain h-full w-full"
              onEnded={onVideoEnded}
            />
          </div>

          {/* Header */}
          <div className="container py-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-2xl font-bold">{course.title}</h1>
                <p className="text-muted-foreground">
                  Instructor: {course.instructorName}
                </p>
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  disabled={completed.includes(currentLectureId)}
                  onClick={() => onVideoEnded()}
                >
                  <CheckCircle className="mr-1" />
                  {completed.includes(currentLectureId)
                    ? "Completed"
                    : "Mark Complete"}
                </Button>
                <Button variant="outline" asChild>
                  <Link to={`/courses/${courseId}`}>
                    <FileText className="mr-1" />
                    Details
                  </Link>
                </Button>
                <Button variant="destructive" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <span className="font-medium">Progress: {percent}%</span>
              <Progress value={percent} className="h-2 mt-1" />
              <p className="text-sm text-muted-foreground mt-1">
                {completed.length} of {allLectureIds.length} lectures completed
              </p>
            </div>

            {/* Curriculum */}
            <Tabs defaultValue="content">
              <TabsList>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="content" className="mt-4">
                <Accordion type="multiple" defaultValue={[`section-${currentSection.id}`]}>
                  {course.curriculum.map((sec) => (
                    <AccordionItem key={sec.id} value={`section-${sec.id}`}>
                      <AccordionTrigger>
                        <div className="flex justify-between">
                          <span>{sec.title}</span>
                          <span>{sec.lectures.length} lectures</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul>
                          {sec.lectures.map((lec) => {
                            const lid = Number(lec.id);
                            return (
                              <li
                                key={lid}
                                className={`py-2 flex justify-between ${
                                  lid === currentLectureId ? "bg-muted/30" : ""
                                }`}
                              >
                                <button
                                  className="flex-1 text-left"
                                  onClick={() => goToLecture(lid)}
                                >
                                  {lec.title}
                                </button>
                                {completed.includes(lid) && (
                                  <CheckCircle className="text-primary" />
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
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
            </Tabs>
          </div>
        </main>
      </div>

      {/* Congrats */}
      {showCongratulations && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-background p-6 rounded shadow-lg text-center">
            <Award className="mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold">Congratulations!</h2>
            <p className="mt-2">You’ve completed the course.</p>
            <div className="mt-4 space-x-2">
              <Button onClick={() => setShowCongratulations(false)}>
                Continue
              </Button>
              <Button variant="outline" asChild>
                <Link to="/student/my-courses">Back to My Courses</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
