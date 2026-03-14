import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../services/api";
import { useAuthStore } from "../store/authStore";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof schema>;

const setupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1, "Name is required").optional(),
});

type SetupValues = z.infer<typeof setupSchema>;

export const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const login = useAuthStore((s) => s.login);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showSetup, setShowSetup] = useState(false);
  const [setupLoading, setSetupLoading] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [setupSuccess, setSetupSuccess] = useState(false);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/admin/auth/login", values);
      login(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message ?? "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const onSetupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("setup-email") as HTMLInputElement)?.value;
    const password = (form.elements.namedItem("setup-password") as HTMLInputElement)?.value;
    const name = (form.elements.namedItem("setup-name") as HTMLInputElement)?.value;
    const parsed = setupSchema.safeParse({ email, password, name: name || undefined });
    if (!parsed.success) {
      setSetupError(parsed.error.errors.map((e) => e.message).join(" "));
      return;
    }
    setSetupLoading(true);
    setSetupError(null);
    setSetupSuccess(false);
    try {
      const res = await api.post("/admin/auth/setup", {
        email: parsed.data.email,
        password: parsed.data.password,
        name: parsed.data.name || "Admin",
      });
      login(res.data.data);
      setSetupSuccess(true);
    } catch (err: any) {
      const msg = err.response?.data?.error?.message ?? err.response?.status === 403
        ? "An admin already exists. Use the form above to sign in."
        : "Setup failed.";
      setSetupError(msg);
    } finally {
      setSetupLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#050316] via-[#05021A] to-[#0B061F]">
      <div className="w-full max-w-md rounded-3xl bg-card/80 shadow-2xl shadow-purple-900/40 border border-purple-500/20 p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            AstraDaily Admin
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to manage daily horoscopes.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full rounded-xl bg-muted/60 border border-purple-500/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full rounded-xl bg-muted/60 border border-purple-500/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-red-400">{errors.password.message}</p>
            )}
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary px-4 py-2 text-sm font-medium shadow-lg shadow-purple-900/40 hover:bg-purple-500 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="border-t border-purple-500/20 pt-4">
          <button
            type="button"
            onClick={() => { setShowSetup(!showSetup); setSetupError(null); setSetupSuccess(false); }}
            className="text-sm text-purple-400 hover:text-purple-300"
          >
            {showSetup ? "Hide first-time setup" : "First time? Create admin account"}
          </button>
          {showSetup && (
            <form className="mt-4 space-y-3" onSubmit={onSetupSubmit}>
              <div className="space-y-1">
                <label className="text-sm font-medium">Name</label>
                <input
                  name="setup-name"
                  type="text"
                  placeholder="Admin"
                  className="w-full rounded-xl bg-muted/60 border border-purple-500/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Email</label>
                <input
                  name="setup-email"
                  type="email"
                  required
                  className="w-full rounded-xl bg-muted/60 border border-purple-500/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Password (min 6)</label>
                <input
                  name="setup-password"
                  type="password"
                  required
                  minLength={6}
                  className="w-full rounded-xl bg-muted/60 border border-purple-500/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              {setupError && <p className="text-xs text-red-400">{setupError}</p>}
              {setupSuccess && <p className="text-xs text-emerald-400">Account created. Redirecting...</p>}
              <button
                type="submit"
                disabled={setupLoading}
                className="w-full rounded-full border border-purple-500/50 px-4 py-2 text-sm font-medium text-purple-300 hover:bg-purple-500/20 disabled:opacity-60"
              >
                {setupLoading ? "Creating..." : "Create first admin"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

