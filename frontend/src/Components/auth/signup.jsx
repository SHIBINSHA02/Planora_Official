// frontend/src/Components/auth/signup.jsx
import { SignUp } from "@clerk/clerk-react";

export default function Signup() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <SignUp
        appearance={{
          elements: {
            card: "shadow-lg border rounded-lg",
            formButtonPrimary:
              "bg-indigo-600 hover:bg-indigo-700 text-white",
          },
        }}
        redirectUrl="/dashboard"
      />
    </div>
  );
}
