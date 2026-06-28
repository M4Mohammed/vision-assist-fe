"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Fingerprint } from "lucide-react";
import { AuthShell } from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { PasswordField } from "@/components/ui/PasswordField";
import {
  DialogClose,
  DialogContent,
  DialogRoot,
} from "@/components/ui/Dialog";
import { useAuth } from "@/lib/auth/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { isApiClientError } from "@/lib/api/ApiClientError";

const signInSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [forgotOpen, setForgotOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: SignInFormValues) => {
    try {
      await signIn(values);
      toast({
        title: "Signed in",
        description: "Welcome back to CapIt.",
        tone: "success",
      });
      router.replace("/caption");
    } catch (error) {
      const description =
        isApiClientError(error) && error.status === 401
          ? "Invalid email or password."
          : "Check your details and try again.";
      toast({
        title: "Could not sign in",
        description,
        tone: "error",
      });
    }
  };

  const onBiometrics = () => {
    toast({
      title: "Biometrics unavailable",
      description: "We could not detect a passkey on this device yet.",
      tone: "info",
    });
  };

  return (
    <AuthShell variant="centered">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-5xl font-semibold tracking-tight">Sign In</h1>
        <p className="text-[var(--fg-secondary)]">
          Welcome back to the future of visual AI.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-10 flex flex-col gap-5"
        noValidate
      >
        <TextField
          label="Email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="name@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-4">
            <span
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-muted)]"
              id="signin-password-label"
            >
              Password
            </span>
            <button
              type="button"
              onClick={() => setForgotOpen(true)}
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-secondary)] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/85 focus-visible:rounded-md"
            >
              Forgot Password?
            </button>
          </div>
          <PasswordField
            label="Password"
            hideLabel
            autoComplete="current-password"
            aria-labelledby="signin-password-label"
            error={errors.password?.message}
            {...register("password")}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="mt-2 w-full"
          loading={isSubmitting}
        >
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--fg-secondary)]">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-semibold text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/85 focus-visible:rounded-md"
        >
          Create Account
        </Link>
      </p>

      <div className="mt-10">
        <Button
          variant="secondary"
          size="lg"
          className="w-full uppercase tracking-[0.18em]"
          onClick={onBiometrics}
          leadingIcon={<Fingerprint aria-hidden="true" className="size-5" />}
        >
          Continue with Biometrics
        </Button>
      </div>

      <DialogRoot open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent
          title="Forgot your password?"
          description="Account recovery is rolling out soon. In the meantime, contact support and we'll get you back in."
        >
          <div className="mt-2 flex flex-col gap-3 text-sm text-[var(--fg-secondary)]">
            <p>
              Email{" "}
              <a
                href="mailto:support@capit.app"
                className="font-medium text-white underline"
              >
                support@capit.app
              </a>{" "}
              with the address on your account.
            </p>
          </div>
          <div className="mt-6 flex justify-end">
            <DialogClose asChild>
              <Button variant="secondary">Got it</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </DialogRoot>
    </AuthShell>
  );
}
