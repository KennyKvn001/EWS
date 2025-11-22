import { SignIn } from '@clerk/clerk-react'
import LandingPage from './LandingPage'

export default function Login() {
  return (
    <LandingPage>
      <div className="w-full max-w-md">
        {/* Clerk Sign In Component - Preserving original internal UI */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 p-6">
          <SignIn
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
            path="/login"
            signUpUrl="/sign-up"
          />
        </div>
      </div>
    </LandingPage>
  )
}
