import { LoginForm } from "./login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">Yönetici Girişi</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Lütfen e-posta ve şifrenizi giriniz
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
