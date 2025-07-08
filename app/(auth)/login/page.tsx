import { LoginForm } from "@/components/admin/login-form"

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Login</h2>
          <p className=" text-center text-sm text-gray-600">Sign in to access the dashboard</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
