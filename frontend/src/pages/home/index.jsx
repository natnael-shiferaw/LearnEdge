// src/pages/home/index.jsx
import { useState, useEffect, useMemo, useContext } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Clock, PlayIcon, SearchIcon, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchStudentViewCourseListService } from "@/services/studentService";
import { AuthContext } from "@/context/auth-context";

export default function HomePage() {
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { auth } = useContext(AuthContext);

  // Fetch everything once
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchStudentViewCourseListService();
        if (res.success && Array.isArray(res.data)) {
          // normalize minimal fields
          setAllCourses(
            res.data.map((c) => ({
              id: c._id,
              title: c.title,
              instructor: c.instructorName,
              rating: c.rating ?? 4.8,
              students: c.students.length ?? 0,
              hours: c.totalDurationHours ?? 0,
              level: c.level,
              image: c.image.url,
              price: `$${c.price.toFixed(2)}`,
              category: c.category,
            }))
          );
        } else {
          throw new Error("Failed to load courses");
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // pick the first 4 as “featured”
  const featuredCourses = useMemo(() => allCourses.slice(0, 4), [allCourses]);

  // build category list + counts
  const categories = useMemo(() => {
    const counts = {};
    allCourses.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      value: name.toLowerCase().replace(/\s+/g, "-"),
    }));
  }, [allCourses]);

  if (loading) {
    return (
      <main className="container py-16">
        <p className="text-center">Loading courses…</p>
      </main>
    );
  }
  if (error) {
    return (
      <main className="container py-16">
        <p className="text-center text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-background overflow-hidden">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/5 pointer-events-none" />

        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between py-24 relative z-10">
          {/* Left: Headline & CTAs */}
          <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Learn Without <span className="text-primary">Limits</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg mx-auto md:mx-0">
              Discover thousands of courses taught by industry experts and take your skills to
              the next level—at your own pace, on your own schedule.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg" asChild>
                <Link to="/courses">Explore Courses</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/auth">
                  {auth?.user ? "Go to Dashboard" : "Join for Free"}
                </Link>
              </Button>
            </div>
          </div>

          {/* Right: Vertical stats */}
          <div className="md:w-1/2 md:pr-8 flex flex-col gap-6">
            <StatRow
              icon={<CheckCircle />}
              label="Courses"
              value={`${allCourses.length}+`}
            />
            <StatRow
              icon={<Users />}
              label="Instructors"
              value="Experts"
            />
            <StatRow
              icon={<Clock />}
              label="Lifetime Access"
              value="✔️"
            />
            <StatRow
              icon={<CheckCircle />}
              label="Money-back"
              value="✔️"
            />
          </div>
        </div>
      </section>




      {/* Featured */}
      <section className="container py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Featured Courses</h2>
          <Link to="/courses" className="flex items-center text-primary">
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value}>
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <CourseGrid courses={featuredCourses} />
          </TabsContent>
          {categories.map((cat) => (
            <TabsContent key={cat.value} value={cat.value} className="mt-6">
              <CourseGrid
                courses={featuredCourses.filter((c) => c.category === cat.name)}
              />
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* Categories */}
      <section className="bg-muted/50 py-12">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8">Browse Categories</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.value}
                to={`/categories/${cat.value}`}
                className="flex flex-col items-center p-6 bg-background rounded-lg hover:bg-primary/5 transition"
              >
                <h3 className="font-medium">{cat.name.toUpperCase()}</h3>
                <p className="text-sm text-muted-foreground">
                  {cat.count} courses
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="relative container py-12 md:py-16">
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">About LearnEdge</h2>
            <p className="mb-4 text-muted-foreground">
              At LearnEdge, our mission is to empower anyone, anywhere, to
              learn new skills and advance their careers. We partner with top
              industry experts to build hands-on courses that deliver real-world
              impact.
            </p>
            <p className="text-muted-foreground">
              Whether you're starting from scratch or leveling up, our
              comprehensive curriculum and supportive community will help you
              succeed.
            </p>
          </div>
          <div className="relative w-full max-w-lg h-64 md:h-80 overflow-hidden rounded-2xl shadow-2xl mx-auto">
            <img
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&auto=format&fit=crop&q=60"
              alt="About us illustration"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* subtle overlay */}
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/50 py-12 md:py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader className="flex justify-center">
                <SearchIcon className="h-8 w-8 text-primary" />
              </CardHeader>
              <CardTitle className="text-center">Find a Course</CardTitle>
              <CardContent className="text-center text-muted-foreground">
                Browse our catalog and filter by topic, level, and more.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex justify-center">
                <PlayIcon className="h-8 w-8 text-primary" />
              </CardHeader>
              <CardTitle className="text-center">Learn Online</CardTitle>
              <CardContent className="text-center text-muted-foreground">
                Watch video lessons, complete exercises, and build projects.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex justify-center">
                <ProgressIndicator />
              </CardHeader>
              <CardTitle className="text-center">Track Progress</CardTitle>
              <CardContent className="text-center text-muted-foreground">
                See your progress dashboard and earn certificates on completion.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex justify-center">
                <AwardIcon />
              </CardHeader>
              <CardTitle className="text-center">Get Certified</CardTitle>
              <CardContent className="text-center text-muted-foreground">
                Receive industry-recognized certificates to showcase your skills.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground">
        <div className="container py-12 md:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Ready to Start Learning?</h2>
            <p className="mb-6 text-primary-foreground/80">
              Join thousands of students already learning on LearnEdge. Start your journey today.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/auth">Sign Up for Free</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-primary">{icon}</div>
      <div>
        <div className="font-bold">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function CourseGrid({ courses }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {courses.map((course) => (
        <Card key={course.id} className="overflow-hidden">
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover hover:scale-105 transition"
            />
          </div>
          <CardHeader className="p-4">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{course.category}</span>
              <span>{course.level}</span>
            </div>
            <CardTitle className="mt-2 line-clamp-2">{course.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <p className="text-sm text-muted-foreground">
              By {course.instructor}
            </p>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 fill-primary text-primary" />
              {course.rating.toFixed(1)}
              <span className="text-muted-foreground">
                ({course.students.toLocaleString()})
              </span>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-2 flex justify-between items-center">
            <span className="font-bold">{course.price}</span>
            <Button size="sm" variant="outline" asChild>
              <Link to={`/courses/${course.id}`}>View Course</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
      {courses.length === 0 && (
        <p className="col-span-full text-center text-muted-foreground">
          No courses in this category.
        </p>
      )}
    </div>
  );
}

// placeholder icons for How It Works
function ProgressIndicator() {
  return <Clock className="h-8 w-8 text-primary" />;
}
function AwardIcon() {
  return <CheckCircle className="h-8 w-8 text-primary" />;
}

function StatRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-end gap-4">
      <div className="text-primary">{icon}</div>
      <div className="text-right">
        <div className="font-bold text-lg sm:text-xl">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
