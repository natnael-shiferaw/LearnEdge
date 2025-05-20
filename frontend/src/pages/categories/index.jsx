import {Link} from "react-router-dom"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function CategoriesPage() {
  // Mock data for categories
  const categories = [
    { name: "Development", count: 425, icon: "💻", description: "Web, Mobile, and Game Development courses" },
    { name: "Business", count: 320, icon: "📊", description: "Finance, Marketing, and Entrepreneurship" },
    { name: "Design", count: 215, icon: "🎨", description: "UI/UX, Graphic Design, and Animation" },
    { name: "Marketing", count: 180, icon: "📱", description: "Digital Marketing, SEO, and Social Media" },
    { name: "Data Science", count: 250, icon: "📈", description: "Machine Learning, AI, and Data Analysis" },
    {
      name: "Personal Development",
      count: 190,
      icon: "🧠",
      description: "Productivity, Leadership, and Communication",
    },
    { name: "Photography", count: 120, icon: "📷", description: "Digital Photography, Editing, and Composition" },
    { name: "Music", count: 150, icon: "🎵", description: "Instruments, Production, and Music Theory" },
    { name: "Health & Fitness", count: 135, icon: "💪", description: "Nutrition, Workout, and Wellness" },
    { name: "Language Learning", count: 165, icon: "🗣️", description: "English, Spanish, Chinese, and more" },
    { name: "Academics", count: 210, icon: "📚", description: "Math, Science, History, and Literature" },
    { name: "Career Development", count: 175, icon: "💼", description: "Job Search, Resume Building, and Interviews" },
  ]

  return (
    <main className="container py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Course Categories</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Browse our wide range of courses across different categories
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => (
          <Card key={category.name} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="mb-2 text-3xl">{category.icon}</div>
              <CardTitle>{category.name}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{category.count} courses available</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to={`/categories/${category.name.toLowerCase().replace(/\s+/g, "-")}`}>
                  Browse Courses <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  )
}
