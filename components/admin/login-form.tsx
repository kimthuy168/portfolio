"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { loginAction } from "@/app/api/auth/action"

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("") // 🆕 Error message state
  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrorMessage("") // Clear error on input change
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage("")

    const result = await loginAction(formData)

    if (result.error) {
      setErrorMessage(result.error) // Show inline message
      toast({
        title: "Login failed",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Login successful",
        description: "Redirecting...",
      })
      router.refresh()
      router.push(`/dashboard/${result.userId}`)
    }

    setLoading(false)
  }

  return (
    <>
      {errorMessage && (
        <div className="text-sm text-red-500">{errorMessage}</div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="text-center mt-4 text-sm text-muted-foreground">
        Don’t have an account?{" "}
        <Link
          href="/register"
          className="text-primary hover:underline font-medium"
        >
          Sign up
        </Link>
      </div>
    </>
  )
}
