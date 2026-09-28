import { AuthSplit } from "@/features/view/components/auth/AuthSplit";
import { UpdatePasswordForm } from "@/features/view/components/auth/UpdatePasswordForm";

export default function UpdatePasswordPage() {
  return (
    <AuthSplit title="Recuperar contraseña" subtitle="Te enviaremos un enlace al correo corporativo.">
      <UpdatePasswordForm />
    </AuthSplit>
  );
}
