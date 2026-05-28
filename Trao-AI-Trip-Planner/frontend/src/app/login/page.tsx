"use client";

import { AuthPanel } from "@/components/AuthPanel";
import { TextField } from "@/components/FormField";
import { SubmitButton } from "@/components/SubmitButton";
import { api } from "@/lib/api";
import { saveSession } from "@/lib/session";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.login({ email, password });
      saveSession(response.token, response.user);
      router.replace("/dashboard");
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "Unable to log in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthPanel
      title="Welcome back"
      subtitle="Sign in to continue planning and editing your saved itineraries."
      footerText="New to Trao?"
      footerHref="/register"
      footerAction="Create account"
    >
      <form className="space-y-5" onSubmit={submit}>
        <TextField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        {error ? <p className="rounded-md bg-coral/10 px-3 py-2 text-sm text-coral">{error}</p> : null}
        <SubmitButton loading={loading} className="w-full">
          <LogIn size={17} aria-hidden />
          Sign in
        </SubmitButton>
      </form>
    </AuthPanel>
  );
}
