"use client";

import { AuthPanel } from "@/components/AuthPanel";
import { TextField } from "@/components/FormField";
import { SubmitButton } from "@/components/SubmitButton";
import { api } from "@/lib/api";
import { saveSession } from "@/lib/session";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.register({ name, email, password });
      saveSession(response.token, response.user);
      router.replace("/dashboard");
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "Unable to create account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthPanel
      title="Create your account"
      subtitle="Keep every generated itinerary private to your own dashboard."
      footerText="Already have an account?"
      footerHref="/login"
      footerAction="Sign in"
    >
      <form className="space-y-5" onSubmit={submit}>
        <TextField label="Name" value={name} onChange={(event) => setName(event.target.value)} minLength={2} required />
        <TextField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={8}
          required
        />
        {error ? <p className="rounded-md bg-coral/10 px-3 py-2 text-sm text-coral">{error}</p> : null}
        <SubmitButton loading={loading} className="w-full">
          <UserPlus size={17} aria-hidden />
          Create account
        </SubmitButton>
      </form>
    </AuthPanel>
  );
}
