import {Link} from "react-router-dom"
import { ArrowRight, CheckCircle, Clock, Star, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HomePage() {
  // Mock data for featured courses
  const featuredCourses = [
    {
      id: 1,
      title: "Web Development Bootcamp",
      instructor: "Sarah Johnson",
      rating: 4.8,
      students: 12453,
      hours: 42,
      level: "Beginner",
      image: "/placeholder.svg?height=200&width=350",
      price: "$89.99",
      category: "Development",
    },
    {
      id: 2,
      title: "Data Science Fundamentals",
      instructor: "Michael Chen",
      rating: 4.7,
      students: 8765,
      hours: 38,
      level: "Intermediate",
      image: "/placeholder.svg?height=200&width=350",
      price: "$94.99",
      category: "Data Science",
    },
    {
      id: 3,
      title: "UX/UI Design Masterclass",
      instructor: "Emma Rodriguez",
      rating: 4.9,
      students: 6542,
      hours: 35,
      level: "All Levels",
      image: "/placeholder.svg?height=200&width=350",
      price: "$79.99",
      category: "Design",
    },
    {
      id: 4,
      title: "Machine Learning A-Z",
      instructor: "David Kim",
      rating: 4.8,
      students: 9876,
      hours: 45,
      level: "Advanced",
      image: "/placeholder.svg?height=200&width=350",
      price: "$99.99",
      category: "Data Science",
    },
  ]

  // Mock data for categories
  const categories = [
    { name: "Development", count: 425, icon: "💻" },
    { name: "Business", count: 320, icon: "📊" },
    { name: "Design", count: 215, icon: "🎨" },
    { name: "Marketing", count: 180, icon: "📱" },
    { name: "Data Science", count: 250, icon: "📈" },
    { name: "Personal Development", count: 190, icon: "🧠" },
  ]

  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-background">
        <div className="container flex flex-col items-center justify-between py-16 md:flex-row md:py-24">
          <div className="mb-8 max-w-md text-center md:mb-0 md:text-left">
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Learn Without <span className="text-primary">Limits</span>
            </h1>
            <p className="mb-6 text-lg text-muted-foreground md:text-xl">
              Discover thousands of courses taught by industry experts and take your skills to the next level.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button size="lg" asChild>
                <Link to="/courses">Explore Courses</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/auth">Join for Free</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[300px] w-full max-w-md md:h-[400px]">
            <img
              src="/placeholder.svg?height=400&width=500"
              alt="Students learning online"
              className="object-contain"
            />
          </div>
        </div>
        <div className="container py-8 md:py-12">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">1000+ Courses</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Expert Instructors</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Lifetime Access</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Money-back Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="container py-12 md:py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Featured Courses</h2>
          <Link to="/courses" className="flex items-center text-sm font-medium text-primary">
            View all courses <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All Categories</TabsTrigger>
            <TabsTrigger value="development">Development</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="data-science">Data Science</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={course.image || "/placeholder.svg"}
                      alt={course.title}
                      width={350}
                      height={200}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">{course.category}</span>
                      <span className="text-xs font-medium text-muted-foreground">{course.level}</span>
                    </div>
                    <CardTitle className="line-clamp-2 text-lg">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">By {course.instructor}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="ml-1 text-sm font-medium">{course.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({course.students.toLocaleString()} students)
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{course.hours} hours</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between p-4 pt-0">
                    <span className="font-bold">{course.price}</span>
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/courses/${course.id}`}>View Course</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="development" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredCourses
                .filter((course) => course.category === "Development")
                .map((course) => (
                  <Card key={course.id} className="overflow-hidden">
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={course.image || "/placeholder.svg"}
                        alt={course.title}
                        width={350}
                        height={200}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <CardHeader className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">{course.category}</span>
                        <span className="text-xs font-medium text-muted-foreground">{course.level}</span>
                      </div>
                      <CardTitle className="line-clamp-2 text-lg">{course.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground">By {course.instructor}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span className="ml-1 text-sm font-medium">{course.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ({course.students.toLocaleString()} students)
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{course.hours} hours</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between p-4 pt-0">
                      <span className="font-bold">{course.price}</span>
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/courses/${course.id}`}>View Course</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
          {/* Similar TabsContent for other categories */}
        </Tabs>
      </section>

      {/* Categories Section */}
      <section className="bg-muted/50 py-12 md:py-16">
        <div className="container">
          <h2 className="mb-8 text-2xl font-bold tracking-tight md:text-3xl">Browse Categories</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/categories/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="flex flex-col items-center rounded-lg bg-background p-6 text-center shadow-sm transition-colors hover:bg-primary/5"
              >
                <span className="mb-2 text-3xl">{category.icon}</span>
                <h3 className="mb-1 font-medium">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.count} courses</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container py-12 md:py-16">
        <h2 className="mb-8 text-2xl font-bold tracking-tight md:text-3xl">What Our Students Say</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="mb-4 flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mb-4 text-muted-foreground">
                  "LearnEdge has completely transformed my career. The courses are comprehensive and the instructors are
                  top-notch. I've learned more in a few months than I did in years of traditional education."
                </p>
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${i}`} alt="Student" />
                    <AvatarFallback>ST</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Student Name</p>
                    <p className="text-sm text-muted-foreground">Web Developer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
  )
}

// Avatar component for testimonials
function Avatar({ className, children }) {
  return <div className={`relative overflow-hidden rounded-full ${className}`}>{children}</div>
}

function AvatarImage({ src, alt }) {
  return <img src={src || "/placeholder.svg"} alt={alt}  className="object-cover" />
}

function AvatarFallback({ children }) {
  return <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">{children}</div>
}
