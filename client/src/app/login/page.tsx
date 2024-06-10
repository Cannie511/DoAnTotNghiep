import { Metadata } from "next";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title:'Freet | Login',
  description:'Login Page'
}

export default function Login() {
  return (
    <div>
      <LoginForm/>
    </div>
  )
}
