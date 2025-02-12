import LoginForm from "@/components/LoginForm";
// import dynamic from "next/dynamic";

// const LoginForm = dynamic(() => import("@/components/LoginForm"), {
//   ssr: false,
// });

export default function LoginPage() {
  // return <h2>Login</h2>;
  return <LoginForm />;
}
