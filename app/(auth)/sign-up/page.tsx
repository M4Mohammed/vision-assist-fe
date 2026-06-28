"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight } from "lucide-react";
import { AuthShell } from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { PasswordField } from "@/components/ui/PasswordField";
import { useAuth } from "@/lib/auth/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { isApiClientError } from "@/lib/api/ApiClientError";

const signUpSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    phone: z
      .string()
      .trim()
      .min(7, "Phone number looks too short")
      .regex(/^[+0-9\s()-]+$/, "Use digits, spaces, and + ( ) - only"),
    email: z.string().trim().toLowerCase().email("Enter a valid email"),
    password: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SignUpFormValues) => {
    try {
      await signUp({
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        email: values.email,
        password: values.password,
      });
      toast({
        title: "Account initialized",
        description: "Welcome to CapIt.",
        tone: "success",
      });
      router.replace("/caption");
    } catch (error) {
      if (isApiClientError(error)) {
        // Duplicate email.
        if (error.status === 409) {
          setError("email", { message: "An account with this email already exists" });
          return;
        }
        // Server-side validation errors, mapped back onto the matching fields.
        if (error.status === 400 && error.fieldErrors) {
          const fields: (keyof SignUpFormValues)[] = [
            "firstName",
            "lastName",
            "phone",
            "email",
            "password",
          ];
          let mapped = false;
          for (const field of fields) {
            const message = error.fieldErrors[field];
            if (message) {
              setError(field, { message });
              mapped = true;
            }
          }
          if (mapped) return;
        }
      }
      toast({
        title: "Could not create account",
        description: "Try again in a moment.",
        tone: "error",
      });
    }
  };

  return (
    <AuthShell
      variant="split"
      eyebrow="SYSTEM_START"
      heading="CapIt"
      description="Join the vanguard of stealth-tech captioning. Precision engineered for the modern digital creator."
      bullets={["Neural context analysis", "Sub-second generation"]}
    >
      <div className="rounded-[var(--radius-card)] border border-[var(--stroke)] bg-[var(--bg-elevated)] p-6 sm:p-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold text-white">Create Account</h2>
          <p className="text-sm text-[var(--fg-secondary)]">
            Enter your details to initialize your workspace.
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex flex-col gap-4"
          noValidate
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField
              label="First Name"
              autoComplete="given-name"
              error={errors.firstName?.message}
              {...register("firstName")}
            />
            <TextField
              label="Last Name"
              autoComplete="family-name"
              error={errors.lastName?.message}
              {...register("lastName")}
            />
          </div>
          <TextField
            label="Phone Number"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+1 (555) 000-0000"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <TextField
            label="Email Address"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="name@example.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <PasswordField
            label="Password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <PasswordField
            label="Confirm Password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          <Button
            type="submit"
            className="mt-2 w-full uppercase tracking-[0.18em]"
            size="lg"
            loading={isSubmitting}
            trailingIcon={<ArrowRight aria-hidden="true" className="size-4" />}
          >
            Initialize Account
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-[var(--fg-secondary)]">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/85 focus-visible:rounded-md"
          >
            Log in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
