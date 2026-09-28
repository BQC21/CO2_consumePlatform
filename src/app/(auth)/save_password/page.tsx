import { AuthSplit } from "@/features/view/components/auth/AuthSplit";
import { SavePasswordForm } from "@/features/view/components/auth/SavePasswordForm";

export default function SavePasswordPage() {
  return (
    <AuthSplit title="Nueva contraseña" subtitle="Elige la contraseña con la que volverás a ingresar.">
      <SavePasswordForm />
    </AuthSplit>
  );
}
