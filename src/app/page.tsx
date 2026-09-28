import { redirect } from "next/navigation";
import { createClient } from "@/features/model/supabase/server";

export default async function HomePage() {
  let destination = "/login";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    destination = user ? "/dashboard" : "/login";
  } catch {
    destination = "/login";
  }
  redirect(destination);
}
