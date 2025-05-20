import { useState } from "react"
import {Link} from "react-router-dom"
import { ArrowUpDown, ChevronDown, Clock, Search, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export default function CoursesPage() {
  // Mock data for courses
  const allCourses = [
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
    {
      id: 5,
      title: "JavaScript Advanced Concepts",
      instructor: "Sarah Johnson",
      rating: 4.6,
      students: 7654,
      hours: 28,
      level: "Intermediate",
      image: "/placeholder.svg?height=200&width=350",
      price: "$69.99",
      category: "Development",
    },
    {
      id: 6,
      title: "Digital Marketing Masterclass",
      instructor: "Jessica Lee",
      rating: 4.7,
      students: 5432,
      hours: 32,
      level: "Beginner",
      image: "/placeholder.svg?height=200&width=350",
      price: "$84.99",
      category: "Marketing",
    },
    {
      id: 7,
      title: "Python for Data Analysis",
      instructor: "Michael Chen",
      rating: 4.8,
      students: 8765,
      hours: 36,
      level: "Intermediate",
      image: "/placeholder.svg?height=200&width=350",
      price: "$89.99",
      category: "Data Science",
    },
    {
      id: 8,
      title: "Graphic Design Fundamentals",
      instructor: "Emma Rodriguez",
      rating: 4.7,
      students: 4321,
      hours: 30,
      level: "Beginner",
      image: "/placeholder.svg?height=200&width=350",
      price: "$74.99",
      category: "Design",
    },
  ]

  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState([0, 100])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedLevels, setSelectedLevels] = useState([])
  const [sortOption, setSortOption] = useState("popular")

  // Filter courses based on search term, price range, categories, and levels
  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPrice =
      Number.parseInt(course.price.replace("$", "")) >= priceRange[0] &&
      Number.parseInt(course.price.replace("$", "")) <= priceRange[1]
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(course.category)
    const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(course.level)

    return matchesSearch && matchesPrice && matchesCategory && matchesLevel
  })

  // Sort courses based on selected option
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortOption) {
      case "popular":
        return b.students - a.students
      case "rating":
        return b.rating - a.rating
      case "newest":
        return b.id - a.id
      case "price-low":
        return Number.parseInt(a.price.replace("$", "")) - Number.parseInt(b.price.replace("$", ""))
      case "price-high":
        return Number.parseInt(b.price.replace("$", "")) - Number.parseInt(a.price.replace("$", ""))
      default:
        return 0
    }
  })

  // Get unique categories and levels for filters
  const categories = [...new Set(allCourses.map((course) => course.category))]
  const levels = [...new Set(allCourses.map((course) => course.level))]

  return (
    <main className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">All Courses</h1>
        <p className="mt-2 text-muted-foreground">Browse our collection of courses taught by industry experts</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Filters Sidebar */}
        <div className="space-y-6">
          <div>
            <h3 className="mb-4 text-lg font-medium">Filters</h3>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search courses..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium">Price Range</h4>
            <div className="space-y-4">
              <Slider defaultValue={[0, 100]} max={100} step={1} value={priceRange} onValueChange={setPriceRange} />
              <div className="flex items-center justify-between">
                <span className="text-sm">${priceRange[0]}</span>
                <span className="text-sm">${priceRange[1]}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium">Categories</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCategories([...selectedCategories, category])
                      } else {
                        setSelectedCategories(selectedCategories.filter((c) => c !== category))
                      }
                    }}
                  />
                  <Label htmlFor={`category-${category}`}>{category}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium">Level</h4>
            <div className="space-y-2">
              {levels.map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox
                    id={`level-${level}`}
                    checked={selectedLevels.includes(level)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedLevels([...selectedLevels, level])
                      } else {
                        setSelectedLevels(selectedLevels.filter((l) => l !== level))
                      }
                    }}
                  />
                  <Label htmlFor={`level-${level}`}>{level}</Label>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setSearchTerm("")
              setPriceRange([0, 100])
              setSelectedCategories([])
              setSelectedLevels([])
            }}
          >
            Reset Filters
          </Button>
        </div>

        {/* Courses Grid */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{sortedCourses.length}</span> of{" "}
              <span className="font-medium">{allCourses.length}</span> courses
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  Sort by
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={sortOption === "popular"}
                  onCheckedChange={() => setSortOption("popular")}
                >
                  Most Popular
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortOption === "rating"}
                  onCheckedChange={() => setSortOption("rating")}
                >
                  Highest Rated
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortOption === "newest"}
                  onCheckedChange={() => setSortOption("newest")}
                >
                  Newest
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortOption === "price-low"}
                  onCheckedChange={() => setSortOption("price-low")}
                >
                  Price: Low to High
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortOption === "price-high"}
                  onCheckedChange={() => setSortOption("price-high")}
                >
                  Price: High to Low
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedCourses.map((course) => (
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
                    <span className="text-xs text-muted-foreground">({course.students.toLocaleString()} students)</span>
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

          {sortedCourses.length === 0 && (
            <div className="mt-12 text-center">
              <h3 className="text-lg font-medium">No courses found</h3>
              <p className="mt-2 text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
