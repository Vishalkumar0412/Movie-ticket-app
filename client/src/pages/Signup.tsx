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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
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
              <div className="relative">
                <Input
                  id="password"
                  type={isPasswordVisible ? "text" : "password"}
                  {...register("password")}
                  placeholder="********"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  tabIndex={-1}
                >
                  {isPasswordVisible ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.122-6.13m1.664-1.664A9.96 9.96 0 0112 3c5.523 0 10 4.477 10 10 0 2.21-.713 4.253-1.922 5.91M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18M9.88 9.88A3 3 0 0115 12m-3 3a3 3 0 01-3-3m0 0a3 3 0 013-3m0 0a3 3 0 013 3m0 0a3 3 0 01-3 3m0 0a3 3 0 01-3-3m0 0a3 3 0 013-3m0 0a3 3 0 013 3" /></svg>
                  )}
                </button>
              </div>

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
