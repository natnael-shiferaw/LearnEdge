import { useState, useEffect, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Clock, Search, SortAsc } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

import { AuthContext } from "@/context/auth-context";
import {
  fetchStudentBoughtCoursesService,
  getCurrentCourseProgressService,
} from "@/services/studentService";

export default function MyCoursesPage() {
  const { auth } = useContext(AuthContext);
  const studentId = auth?.user?._id;

  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState("recent");
  const [boughtCourses, setBoughtCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ensure we only fetch per‐course progress once
  const [progressFetched, setProgressFetched] = useState(false);

  // Load your purchased courses, dedupe by ID
  useEffect(() => {
    if (!studentId) return;
    setLoading(true);
    fetchStudentBoughtCoursesService(studentId)
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          // map to our shape
          const mapped = res.data.map((c) => ({
            id: c.courseId,
            title: c.title,
            instructor: c.instructorName,
            image: c.courseImage?.url || "/placeholder.svg",
            // placeholders
            progress: 0,
            totalLectures: 0,
            completedLectures: 0,
            lastAccessed: c.dateOfPurchase || new Date().toISOString(),
          }));

          // dedupe by .id
          const unique = mapped.filter(
            (course, idx, arr) =>
              idx === arr.findIndex((c2) => c2.id === course.id)
          );

          setBoughtCourses(unique);
        } else {
          throw new Error("Failed to load your courses");
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Network error while fetching courses");
      })
      .finally(() => setLoading(false));
  }, [studentId]);

  // Fetch each course's actual progress *once*
  useEffect(() => {
    if (progressFetched || boughtCourses.length === 0) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      const updated = await Promise.all(
        boughtCourses.map(async (course) => {
          try {
            const res = await getCurrentCourseProgressService(
              studentId,
              course.id
            );
            if (res.success) {
              const { courseDetails, progress } = res.data;
              // flatten all lecture IDs
              const flatLectures = courseDetails.curriculum.flatMap((s) =>
                s.lectures.map((l) => l.id)
              );
              const completedCount = progress.length;
              const totalCount = flatLectures.length;
              // pick most recent dateViewed
              const lastViewed = progress.length
                ? progress
                    .map((p) => new Date(p.dateViewed))
                    .sort((a, b) => b - a)[0]
                    .toISOString()
                : course.lastAccessed;
              return {
                ...course,
                totalLectures: totalCount,
                completedLectures: completedCount,
                progress: Math.round((completedCount / totalCount) * 100),
                lastAccessed: lastViewed,
              };
            }
          } catch {
            // ignore errors per course
          }
          return course;
        })
      );
      if (mounted) {
        setBoughtCourses(updated);
        setProgressFetched(true);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [boughtCourses, progressFetched, studentId]);

  // filter + sort UI
  const filtered = useMemo(() => {
    let list = [...boughtCourses];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((c) =>
        c.title.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      if (sort === "recent")
        return new Date(b.lastAccessed) - new Date(a.lastAccessed);
      if (sort === "progress") return b.progress - a.progress;
      if (sort === "title") return a.title.localeCompare(b.title);
      return 0;
    });
    return list;
  }, [boughtCourses, searchQuery, sort]);

  if (loading)
    return (
      <main className="container py-12">
        <p>Loading your courses…</p>
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
            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold">My Courses</h1>
                <p className="text-muted-foreground">
                  Continue your learning journey
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search courses..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <SortAsc className="h-4 w-4" />
                      <span className="sr-only">Sort</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => setSort("recent")}>
                        Recently Accessed
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSort("progress")}>
                        Progress
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSort("title")}>
                        Title
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Grid/List */}
            <Tabs defaultValue="grid" className="mb-8">
              <TabsList>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>

              {/* Grid */}
              <TabsContent value="grid">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((c) => (
                    <Card key={c.id}>
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={c.image}
                          alt={c.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="line-clamp-2">
                          {c.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          By {c.instructor}
                        </p>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{c.progress}%</span>
                        </div>
                        <Progress value={c.progress} className="h-2 mt-1" />
                        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>
                            {c.completedLectures}/{c.totalLectures} lectures
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            Last accessed:{" "}
                            {new Date(c.lastAccessed).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button className="w-full" asChild>
                          <Link to={`/student/my-courses/course-progress/${c.id}`}>
                            {c.progress === 100
                              ? "Review Course"
                              : "Continue Learning"}
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* List */}
              <TabsContent value="list">
                <div className="space-y-4">
                  {filtered.map((c) => (
                    <Card key={c.id}>
                      <div className="flex p-4 gap-4">
                        <div className="h-32 w-48 overflow-hidden rounded-md">
                          <img
                            src={c.image}
                            alt={c.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 flex flex-col">
                          <h3 className="text-lg font-semibold">{c.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            By {c.instructor}
                          </p>
                          <div className="mt-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{c.progress}%</span>
                            </div>
                            <Progress value={c.progress} className="h-2 mt-1" />
                          </div>
                          <div className="mt-auto flex justify-between pt-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-3.5 w-3.5" />
                              <span>
                                {c.completedLectures}/{c.totalLectures}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-3.5 w-3.5" />
                              <span>
                                {new Date(c.lastAccessed).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="mt-4">
                            <Button className="w-full sm:w-auto" asChild>
                              <Link to={`/student/my-courses/course-progress/${c.id}`}>
                                {c.progress === 100
                                  ? "Review Course"
                                  : "Continue Learning"}
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
