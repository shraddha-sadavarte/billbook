import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Receipt } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ company_name: "", admin_name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await signup(form);
      toast.success("Workspace created!");
      navigate("/dashboard");
    } catch (err: any) {
      const message = err?.response?.data?.error || "Couldn't create your workspace. Try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-white">
            <Receipt size={22} />
          </div>
          <h1 className="text-xl font-semibold text-ink-900">Set up your workspace</h1>
          <p className="text-sm text-slate-500">Start billing in under a minute</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500">Business name</label>
            <input
              required
              value={form.company_name}
              onChange={(e) => setForm({ ...form, company_name: e.target.value })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500">Your name</label>
            <input
              required
              value={form.admin_name}
              onChange={(e) => setForm({ ...form, admin_name: e.target.value })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            />
            <p className="mt-1 text-xs text-slate-400">At least 8 characters</p>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
          >
            {isSubmitting ? "Setting up…" : "Create workspace"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          Already have a workspace?{" "}
          <Link to="/login" className="font-medium text-brand hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
