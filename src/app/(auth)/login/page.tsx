import { AuthSplit } from "@/features/view/components/Shells/AuthSplit";
import { LoginForm } from "@/features/view/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthSplit title="Iniciar sesión" subtitle="Ingresa tu correo y contraseña para continuar.">
      <LoginForm />
    </AuthSplit>
  );
}
