"use client";

import { useState } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const contactSchema = z.object({
  name: z.string().min(2, "Enter your name."),
  email: z.string().email("Enter a valid email address."),
  message: z.string().min(20, "Say a little more — at least 20 characters."),
});

type ContactValues = z.infer<typeof contactSchema>;

type SubmitState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<SubmitState>("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(values: ContactValues) {
    setState("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Request failed");
      setState("success");
      reset();
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[var(--radius-md)] border border-(--color-success)/30 bg-(--color-success)/10 p-6"
        role="status"
      >
        <p className="font-mono text-sm text-(--color-success)">Message sent.</p>
        <p className="mt-2 text-sm text-(--color-text-muted)">
          Thanks for reaching out — I read every message and reply within a
          couple of days.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <Field
        id="name"
        label="Name"
        error={errors.name?.message}
        inputProps={register("name")}
      />
      <Field
        id="email"
        label="Email"
        type="email"
        error={errors.email?.message}
        inputProps={register("email")}
      />
      <div>
        <label
          htmlFor="message"
          className="font-mono text-xs uppercase tracking-[0.1em] text-(--color-text-muted)"
        >
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="mt-2 w-full resize-none rounded-[var(--radius-sm)] border border-(--color-hairline-strong) bg-(--color-surface) px-4 py-3 text-sm text-(--color-text-high) outline-none transition-colors placeholder:text-(--color-text-faint) focus:border-(--color-signal)"
          placeholder="What are you building?"
          {...register("message")}
        />
        {errors.message && (
          <p id="message-error" className="mt-2 text-xs text-(--color-danger)">
            {errors.message.message}
          </p>
        )}
      </div>

      {state === "error" && (
        <p className="text-xs text-(--color-danger)" role="alert">
          Something went wrong sending that. Try again, or email directly.
        </p>
      )}

      <Button type="submit" disabled={state === "submitting"} className="w-full sm:w-auto">
        {state === "submitting" ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending
          </>
        ) : (
          <>
            Send message
            <Send size={16} />
          </>
        )}
      </Button>
    </form>
  );
}

function Field({
  id,
  label,
  type = "text",
  error,
  inputProps,
}: {
  id: string;
  label: string;
  type?: string;
  error?: string;
  inputProps: UseFormRegisterReturn;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="font-mono text-xs uppercase tracking-[0.1em] text-(--color-text-muted)"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className="mt-2 w-full rounded-[var(--radius-sm)] border border-(--color-hairline-strong) bg-(--color-surface) px-4 py-3 text-sm text-(--color-text-high) outline-none transition-colors placeholder:text-(--color-text-faint) focus:border-(--color-signal)"
        {...inputProps}
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 text-xs text-(--color-danger)">
          {error}
        </p>
      )}
    </div>
  );
}
