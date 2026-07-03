import { LoginForm } from "./login-form"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 page-enter">
      <div className="w-full max-w-sm space-y-8">
        {/* Dekoratif üst alan */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 mb-8">
            <span className="text-2xl font-bold tracking-tight">
              yusuf<span className="text-primary">izzet</span>
            </span>
            <span className="inline-block size-1.5 rounded-full bg-primary" />
          </Link>
          <h2 className="text-2xl font-bold tracking-tight">Yönetici Girişi</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Lütfen e-posta ve şifrenizi giriniz
          </p>
        </div>
        <LoginForm />
        <div className="text-center text-sm text-muted-foreground">
          Hesabınız yok mu?{" "}
          <Link href="/kayit" className="font-medium text-primary hover:underline">
            Kayıt Ol
          </Link>
        </div>
      </div>
    </div>
  )
}
