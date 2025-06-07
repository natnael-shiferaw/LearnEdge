import { useState, useEffect, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Clock, Play, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

import { AuthContext } from "@/context/auth-context";
import {
  fetchStudentBoughtCoursesService,
  getCurrentCourseProgressService,
  fetchStudentViewCourseListService,
} from "@/services/studentService";

export default function StudentDashboardPage() {
  const { auth } = useContext(AuthContext);
  const studentId = auth?.user?._id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bought, setBought] = useState([]);        // enriched purchases
  const [allCourses, setAllCourses] = useState([]); // full catalog
  const [searchQuery, setSearchQuery] = useState("");

  // Load purchased courses + progress + curriculum + category
  useEffect(() => {
    if (!studentId) return;
    (async () => {
      setLoading(true);
      try {
        const listRes = await fetchStudentBoughtCoursesService(studentId);
        if (!listRes.success) throw new Error("Failed to load purchases");

        // dedupe
        const unique = Array.from(
          new Map(listRes.data.map((c) => [c.courseId, c])).values()
        );

        const detailed = await Promise.all(
          unique.map(async (c) => {
            const progRes = await getCurrentCourseProgressService(
              studentId,
              c.courseId
            );
            if (progRes.success) {
              const { courseDetails, progress } = progRes.data;
              return {
                id: c.courseId,
                title: courseDetails.title,
                instructor: courseDetails.instructorName,
                image: courseDetails.image.url,
                category: courseDetails.category,
                curriculum: courseDetails.curriculum,
                lecturesProgress: progress,
                progress: Math.round(
                  (progress.length /
                    courseDetails.curriculum.flatMap((s) => s.lectures).length) *
                    100
                ),
              };
            } else {
              return {
                id: c.courseId,
                title: c.title,
                instructor: c.instructorName,
                image: c.courseImage?.url,
                category: c.category,
                curriculum: [],
                lecturesProgress: [],
                progress: 0,
              };
            }
          })
        );
        setBought(detailed);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [studentId]);

  // Load all courses for recommendations (including category)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchStudentViewCourseListService();
        if (res.success && Array.isArray(res.data)) {
          setAllCourses(
            res.data.map((c) => ({
              id: c._id,
              title: c.title,
              image: c.image.url,
              category: c.category,
              instructorName: c.instructorName,
            }))
          );
        }
      } catch {
        // ignore
      }
    })();
  }, []);

  // stats
  const coursesEnrolled = bought.length;
  const completedCourses = bought.filter((c) => c.progress === 100).length;
  const certificatesEarned = completedCourses;
  const hoursLearned = useMemo(() => {
    let totalSeconds = 0;
    bought.forEach((c) => {
      c.curriculum.forEach((sec) =>
        sec.lectures.forEach((lec) => {
          if (
            c.lecturesProgress.find((p) => Number(p.lectureId) === lec.id)
          ) {
            const [m, s] = lec.duration.split(":").map(Number);
            totalSeconds += m * 60 + s;
          }
        })
      );
    });
    return (totalSeconds / 3600).toFixed(1);
  }, [bought]);

  // filter your courses by search
  const yourCourses = useMemo(
    () =>
      bought.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [bought, searchQuery]
  );

  // recommended: match any purchased category, exclude bought, then search
  const recommended = useMemo(() => {
    const cats = new Set(bought.map((c) => c.category));
    return allCourses
      .filter(
        (c) =>
          cats.has(c.category) &&
          !bought.find((b) => b.id === c.id) &&
          c.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 6);
  }, [allCourses, bought, searchQuery]);

  if (loading)
    return (
      <main className="container py-12">
        <p>Loading dashboard…</p>
      </main>
    );
  if (error)
    return (
      <main className="container py-12">
        <p className="text-red-500">{error}</p>
      </main>
    );

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto bg-muted/40 pb-16">
          <div className="container py-8">
            {/* header */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back, {auth.user.name}! Continue your learning
                  journey.
                </p>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 md:w-[200px] lg:w-[300px]"
                />
              </div>
            </div>

            {/* stats */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex justify-between pb-2">
                  <CardTitle className="text-sm">Courses Enrolled</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{coursesEnrolled}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex justify-between pb-2">
                  <CardTitle className="text-sm">Hours Learned</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{hoursLearned}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex justify-between pb-2">
                  <CardTitle className="text-sm">Completed Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {completedCourses}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex justify-between pb-2">
                  <CardTitle className="text-sm">
                    Certificates Earned
                  </CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {certificatesEarned}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* your courses */}
            <div className="mt-8 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Your Courses</CardTitle>
                  <CardDescription>
                    Continue where you left off
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {yourCourses.map((c) => {
                    const last = c.lecturesProgress
                      .map((p) => new Date(p.dateViewed))
                      .sort((a, b) => b - a)[0];
                    return (
                      <div
                        key={c.id}
                        className="flex flex-col gap-4 sm:flex-row"
                      >
                        <div className="aspect-video h-24 w-full overflow-hidden rounded-md sm:w-40">
                          <img
                            src={c.image}
                            alt={c.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <h3 className="font-semibold">{c.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              By {c.instructor}
                            </p>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{c.progress}%</span>
                            </div>
                            <Progress
                              value={c.progress}
                              className="h-2 mt-1"
                            />
                            <div className="mt-2 flex justify-between">
                              <span className="text-xs text-muted-foreground">
                                Last viewed:{" "}
                                {last ? last.toLocaleDateString() : "—"}
                              </span>
                              <Button size="sm" asChild>
                                <Link
                                  to={`/student/my-courses/course-progress/${c.id}`}
                                >
                                  <Play className="mr-1 h-3 w-3" /> Continue
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/student/my-courses">View all courses</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* recommendations */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Courses</CardTitle>
                  <CardDescription>
                    Based on your interests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {recommended.map((c) => (
                      <Card key={c.id} className="overflow-hidden">
                        <div className="aspect-video w-full overflow-hidden">
                          <img
                            src={c.image}
                            alt={c.title}
                            className="h-full w-full object-cover hover:scale-105 transition"
                          />
                        </div>
                        <CardHeader className="p-4">
                          <CardTitle className="line-clamp-1">
                            {c.title}
                          </CardTitle>
                          <CardDescription className="text-sm text-muted-foreground">
                            By {c.instructorName}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter className="p-4 pt-0">
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            asChild
                          >
                            <Link to={`/courses/${c.id}`}>View Course</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                    {recommended.length === 0 && (
                      <p className="text-muted-foreground p-4 col-span-full">
                        No recommendations at the moment.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
