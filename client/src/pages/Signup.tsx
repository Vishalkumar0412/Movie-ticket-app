"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { signupSchema, type SignupInput } from "@/shared/validator/user.validators"
import { useState } from "react"
import { useNavigate } from "react-router"
import { useAuth } from "@/context/AuthContext"
import { toast } from 'sonner'

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  })

  const passwordValue = watch("password")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { signup } = useAuth()

  const onSubmit = async (data: SignupInput) => {
    setError(null)
    setLoading(true)
    try {
      await signup(data)
      navigate('/login')
      toast.success('Account created successfully')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Signup failed'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">Signup</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Name */}
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" {...register("name")} placeholder="John Doe" />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} placeholder="m@example.com" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="********"
              />

              {/* Password rules → only show while typing */}
              {passwordValue && (
                <ul className="mt-2 text-xs space-y-1 bg-gray-50 p-2 rounded-md border">
                  <li className={/[a-z]/.test(passwordValue) ? "text-green-600" : "text-red-500"}>
                    • At least one lowercase letter
                  </li>
                  <li className={/[A-Z]/.test(passwordValue) ? "text-green-600" : "text-red-500"}>
                    • At least one uppercase letter
                  </li>
                  <li className={/\d/.test(passwordValue) ? "text-green-600" : "text-red-500"}>
                    • At least one number
                  </li>
                  <li className={/[@$!%*?&]/.test(passwordValue) ? "text-green-600" : "text-red-500"}>
                    • At least one special character
                  </li>
                  <li
                    className={
                      (passwordValue?.length ?? 0) >= 6 ? "text-green-600" : "text-red-500"
                    }
                  >
                    • Minimum 6 characters
                  </li>
                </ul>
              )}
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Signup'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 underline ml-1">
            Login
          </a>
        </CardFooter>
      </Card>
    </main>
  )
}
