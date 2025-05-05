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
import { Label } from "@/components/ui/label";
import React, { useState } from "react";

function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <div className="flex min-h-screen bg-gray-200">
      {/* Left Column - Image */}
      <div className="relative w-1/2 hidden md:block">
        <img
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Auth Background"
          className="object-cover w-full h-full rounded-lg"
        />
      </div>
      {/* Right Column - Form */}
      <div className="w-full md:w-1/2 flex flex-col gap-8 items-center p-4">
        <h2 className="text-3xl lg:text-4xl font-bold  text-sky-700">Welcome to LearnEdge</h2>
        <Card className="w-full max-w-lg p-6 space-y-4 transition-all duration-300 ease-in-out border-gray-300 shadow-3xl">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold text-center transition-colors duration-300">{isSignIn ? "Sign In" : "Sign Up"}</CardTitle>
            <CardDescription className="text-center text-gray-500">
            {isSignIn ? "Sign in to your account" : "Create a new account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="">
          <form onSubmit={handleSumbit}>
            {!isSignIn && (
              <div className="grid w-full items-center">
                <div className="flex flex-col space-y-1.5 mb-4">
                  <Label htmlFor="username"
                         className="text-gray-900 font-extrabold">Username</Label>
                  <Input id="username" placeholder="Enter Username" value={username}
                         onChange={(e) => setUsername(e.target.value)}
                         className="py-5 text-lg border-cyan-700 shadow-xl"/>
                </div>
              </div>
            )}
            <div className="grid w-full items-center">
              <div className="flex flex-col space-y-1.5 mb-4">
                <Label htmlFor="email"
                       className="text-gray-900 font-extrabold">Email</Label>
                <Input
                  id="email"
                  placeholder="Enter Email"
                  type="email"
                  value={username}
                  className="py-5 text-lg border-cyan-700 shadow-xl"
                />
              </div>
            </div>
            <div className="grid w-full items-center">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password"
                       className="text-gray-900 font-extrabold">Password</Label>
                <Input
                  id="password" placeholder="Enter Password" type="password" className="py-5 text-lg border-cyan-700 shadow-xl"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-gray-800 hover:bg-gray-900 text-white transition-colors duration-300 cursor-pointer">
            {isSignIn ? "Sign In" : "Sign Up"}
          </Button>
            <Button
              variant="outline"
              className="w-full border-gray-800 text-gray-800 hover:bg-gray-50 transition-colors duration-300 cursor-pointer"
              onClick={toggleForm}
            >
            {isSignIn ? (
              "Don't have an account? Sign Up"
            ) : (
              "Already have an account? Sign In"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
      </div>
  );
}

export default AuthPage;
