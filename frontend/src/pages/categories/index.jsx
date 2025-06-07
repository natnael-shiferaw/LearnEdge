// src/pages/categories/index.jsx
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchStudentViewCourseListService } from "@/services/studentService";

export default function CategoriesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 1) Fetch all courses once
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetchStudentViewCourseListService();
        if (mounted) {
          if (res.success && Array.isArray(res.data)) {
            setCourses(res.data);
          } else {
            throw new Error("Failed to load courses");
          }
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError(err.message || "Network error");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // 2) Build categories + counts
  const categories = useMemo(() => {
    const counts = {};
    courses.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({
      name,
      value: name.toLowerCase().replace(/\s+/g, "-"),
      count,
    }));
  }, [courses]);

  if (loading) {
    return (
      <main className="container py-12">
        <p className="text-center">Loading categories…</p>
      </main>
    );
  }
  if (error) {
    return (
      <main className="container py-12">
        <p className="text-center text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main className="container py-12">
      {/* Page heading */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Course Categories
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Browse our wide range of courses by category
        </p>
      </div>

      {/* Categories grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((cat) => (
          <Card key={cat.value} className="overflow-hidden rounded-lg hover:cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{cat.name.toUpperCase()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {cat.count} course{cat.count !== 1 && "s"} available
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to={`/categories/${cat.value}`}>
                  Browse <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
