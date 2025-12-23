// frontend/src/Components/auth/login.jsx
import { SignIn } from "@clerk/clerk-react";

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <SignIn
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
