"use client";

import { FormEvent, useState } from "react";

export function ContactForm({ recipientEmail }: { recipientEmail: string | null }) {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!recipientEmail) {
      setStatusMessage("Contact email is not configured yet.");
      return;
    }

    const bodyLines = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      "",
      message,
    ].filter((line): line is string => line !== null);

    const mailtoUrl = new URL(`mailto:${recipientEmail}`);
    mailtoUrl.searchParams.set("subject", `Contact request from ${name}`);
    mailtoUrl.searchParams.set("body", bodyLines.join("\n"));

    window.location.href = mailtoUrl.toString();
    setStatusMessage("Opening your email app...");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-5 rounded-site border border-foreground/10 bg-background p-6 shadow-sm"
    >
      <label className="grid gap-2 text-sm font-medium text-foreground">
        Name
        <input
          name="name"
          type="text"
          autoComplete="name"
          required
          className="min-h-12 rounded-site border border-foreground/15 bg-background px-4 text-base font-normal outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
      </label>

      <label className="grid gap-2 text-sm font-medium text-foreground">
        Email
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="min-h-12 rounded-site border border-foreground/15 bg-background px-4 text-base font-normal outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
      </label>

      <label className="grid gap-2 text-sm font-medium text-foreground">
        Phone
        <input
          name="phone"
          type="tel"
          autoComplete="tel"
          className="min-h-12 rounded-site border border-foreground/15 bg-background px-4 text-base font-normal outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
      </label>

      <label className="grid gap-2 text-sm font-medium text-foreground">
        Message
        <textarea
          name="message"
          required
          rows={5}
          className="min-h-32 resize-y rounded-site border border-foreground/15 bg-background px-4 py-3 text-base font-normal outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center rounded-site bg-primary px-5 text-sm font-semibold text-background transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-primary/20"
        >
          Send message
        </button>
        {statusMessage ? (
          <p className="text-sm text-foreground/70" role="status">
            {statusMessage}
          </p>
        ) : null}
      </div>
    </form>
  );
}
