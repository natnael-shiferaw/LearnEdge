import { useState } from "react"
import {Link} from "react-router-dom"
import { ArrowUpDown, ChevronDown, Download, FileText, MoreHorizontal, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { InstructorSidebar } from "@/components/instructor-sidebar"
import { Progress } from "@/components/ui/progress"

export default function InstructorStudentsPage() {
  // Mock data for students
  const students = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      course: "Web Development Bootcamp",
      enrolledDate: "2023-05-12",
      progress: 65,
      lastActive: "2023-05-15",
    },
    {
      id: 2,
      name: "Emily Johnson",
      email: "emily.johnson@example.com",
      course: "JavaScript Advanced Concepts",
      enrolledDate: "2023-05-10",
      progress: 42,
      lastActive: "2023-05-14",
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael.brown@example.com",
      course: "React for Beginners",
      enrolledDate: "2023-05-08",
      progress: 78,
      lastActive: "2023-05-15",
    },
    {
      id: 4,
      name: "Sarah Davis",
      email: "sarah.davis@example.com",
      course: "Web Development Bootcamp",
      enrolledDate: "2023-05-05",
      progress: 23,
      lastActive: "2023-05-13",
    },
    {
      id: 5,
      name: "David Wilson",
      email: "david.wilson@example.com",
      course: "Node.js Masterclass",
      enrolledDate: "2023-05-03",
      progress: 51,
      lastActive: "2023-05-12",
    },
    {
      id: 6,
      name: "Jennifer Lee",
      email: "jennifer.lee@example.com",
      course: "Web Development Bootcamp",
      enrolledDate: "2023-05-01",
      progress: 92,
      lastActive: "2023-05-15",
    },
    {
      id: 7,
      name: "Robert Taylor",
      email: "robert.taylor@example.com",
      course: "JavaScript Advanced Concepts",
      enrolledDate: "2023-04-28",
      progress: 35,
      lastActive: "2023-05-10",
    },
    {
      id: 8,
      name: "Lisa Anderson",
      email: "lisa.anderson@example.com",
      course: "React for Beginners",
      enrolledDate: "2023-04-25",
      progress: 67,
      lastActive: "2023-05-14",
    },
  ]

  const [searchTerm, setSearchTerm] = useState("")

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <InstructorSidebar />
        <main className="flex-1 overflow-y-auto bg-muted/40 pb-16">
          <div className="container py-8">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Students</h1>
                <p className="text-muted-foreground">Manage and track your students' progress</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>All Students</CardTitle>
                    <CardDescription>Students enrolled in your courses</CardDescription>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search students..."
                        className="pl-8 sm:w-[300px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span>Filter</span>
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>All Students</DropdownMenuItem>
                          <DropdownMenuItem>Web Development Bootcamp</DropdownMenuItem>
                          <DropdownMenuItem>JavaScript Advanced Concepts</DropdownMenuItem>
                          <DropdownMenuItem>React for Beginners</DropdownMenuItem>
                          <DropdownMenuItem>Node.js Masterclass</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" /> Export
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">
                        <Button variant="ghost" className="flex items-center gap-1 p-0 font-medium">
                          Name <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" className="flex items-center gap-1 p-0 font-medium">
                          Course <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" className="flex items-center gap-1 p-0 font-medium">
                          Enrolled <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" className="flex items-center gap-1 p-0 font-medium">
                          Progress <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" className="flex items-center gap-1 p-0 font-medium">
                          Last Active <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{student.name}</div>
                            <div className="text-sm text-muted-foreground">{student.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{student.course}</TableCell>
                        <TableCell>{student.enrolledDate}</TableCell>
                        <TableCell>
                          <div className="flex w-[100px] flex-col gap-1">
                            <Progress value={student.progress} className="h-2" />
                            <div className="text-xs text-muted-foreground">{student.progress}% complete</div>
                          </div>
                        </TableCell>
                        <TableCell>{student.lastActive}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Link href={`/instructor/students/${student.id}`} className="flex w-full">
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>Send Message</DropdownMenuItem>
                              <DropdownMenuItem>View Progress</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Remove Student</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredStudents.length === 0 && (
                  <div className="my-12 flex flex-col items-center justify-center">
                    <p className="text-lg font-medium">No students found</p>
                    <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
