import { AuthSplit } from "@/features/view/components/auth/AuthSplit";
import { RegisterForm } from "@/features/view/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthSplit title="Crear cuenta" subtitle="Registro para el equipo de TEC Energy Solutions.">
      <RegisterForm />
    </AuthSplit>
  );
}
