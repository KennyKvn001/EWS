import { SignUp } from '@clerk/clerk-react'
import { GraduationCap } from 'lucide-react'

export default function SignUpPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#d4d4d4]/30 via-gray-50 to-[#d4d4d4]/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2563eb] to-[#1e40af] shadow-lg mb-4">
            <GraduationCap className="size-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            EWS
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Early Warning System
          </p>
        </div>

        {/* Clerk Sign Up Component */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 p-6">
          <SignUp
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-none bg-transparent border-none",
                headerTitle: "text-2xl font-semibold text-gray-900 dark:text-white",
                headerSubtitle: "text-gray-600 dark:text-gray-400",
                socialButtonsBlockButton:
                  "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer",
                formButtonPrimary:
                  "bg-gradient-to-r from-[#2563eb] to-[#1e40af] hover:from-[#1d4ed8] hover:to-[#1e3a8a] text-white shadow-md hover:shadow-lg transition-all cursor-pointer",
                formFieldInput:
                  "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20",
                formFieldLabel: "text-gray-700 dark:text-gray-300",
                footerActionLink: "text-[#2563eb] hover:text-[#1e40af] cursor-pointer",
                identityPreviewEditButton: "text-[#2563eb] hover:text-[#1e40af] cursor-pointer",
                dividerLine: "bg-gray-200 dark:bg-gray-700",
                dividerText: "text-gray-500 dark:text-gray-400",
              },
              variables: {
                colorPrimary: "#2563eb",
                colorText: "#111827",
                colorTextSecondary: "#6b7280",
                colorBackground: "#ffffff",
                colorInputBackground: "#ffffff",
                colorInputText: "#111827",
                borderRadius: "0.625rem",
                fontFamily: "system-ui, -apple-system, sans-serif",
              },
            }}
            routing="path"
            path="/sign-up"
            signInUrl="/login"
          />
        </div>
      </div>
    </div>
  )
}

