'use client';

import Link from 'next/link';
import { useState } from 'react';
import { artistContact } from '@/lib/site/contact';

export default function ContactPage() {
  const [status, setStatus] = useState('');

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setStatus('Sending...');

    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    const payload = {
      name: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      inquiryType: String(form.get('inquiryType') ?? ''),
      subject: String(form.get('subject') ?? ''),
      message: String(form.get('message') ?? ''),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setStatus(result.error ?? 'The message could not be sent.');
        return;
      }

      setStatus('Your message was sent successfully!');
      formElement.reset();
    } catch {
      setStatus(
        'Something went wrong while sending your message.'
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#FDF8F4] px-5 py-10 text-[#473C38] sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.38em] text-[#B88A43]">
              Contact
            </p>

            <h1 className="mt-3 max-w-3xl font-display text-5xl leading-tight text-[#473C38] sm:text-6xl">
              Let&apos;s create something meaningful together.
            </h1>
          </div>

          <Link
            href="/"
            className="hidden text-sm text-[#6b5a55] transition hover:text-[#473C38] sm:block"
          >
            Back home
          </Link>
        </div>

        <div className="grid overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_65px_rgba(71,60,56,0.1)] lg:grid-cols-[0.9fr_1.1fr]">
          <section className="relative overflow-hidden bg-[#473C38] p-7 text-white sm:p-9 lg:p-12">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#B88A43]/25 blur-3xl" />
            <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-[#EFCFD6]/20 blur-3xl" />

            <div className="relative">
              <p className="text-xs uppercase tracking-[0.35em] text-[#E7C98E]">
                Get in touch
              </p>

              <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">
                Commissions, exhibitions, and artwork inquiries.
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-7 text-white/75 sm:text-base">
                Reach out about a custom piece, an available artwork,
                a collaboration, or displaying work in a gallery or
                event.
              </p>

              <div className="mt-10 space-y-4">
                <div className="rounded-[1.25rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#E7C98E]">
                    Email
                  </p>

                  <a
                    href={
                      artistContact.email
                        ? `mailto:${artistContact.email}`
                        : undefined
                    }
                    className="mt-2 block break-all text-base font-medium text-white"
                  >
                    {artistContact.email}
                  </a>
                </div>

                <div className="rounded-[1.25rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#E7C98E]">
                    Instagram
                  </p>

                  <a
                    href={artistContact.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 block text-base font-medium text-white"
                  >
                    {artistContact.instagramUsername}
                  </a>
                </div>
              </div>

              <div className="mt-10 border-t border-white/15 pt-7">
                <p className="text-xs uppercase tracking-[0.28em] text-[#E7C98E]">
                  For commissions
                </p>

                <p className="mt-3 text-sm leading-7 text-white/70">
                  Include the preferred size, colors, timeline,
                  budget, and the feeling you want the artwork to
                  represent.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-[#FFFDFC] p-7 sm:p-9 lg:p-12">
            <div className="mb-7">
              <p className="text-xs uppercase tracking-[0.32em] text-[#B88A43]">
                Send a message
              </p>

              <h2 className="mt-3 font-display text-4xl text-[#473C38]">
                Tell the artist what you have in mind.
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-sm font-medium">
                  Name
                  <input
                    name="name"
                    required
                    className="mt-2 w-full rounded-xl border border-[#DBC9BD] px-4 py-3"
                  />
                </label>

                <label className="text-sm font-medium">
                  Email
                  <input
                    name="email"
                    type="email"
                    required
                    className="mt-2 w-full rounded-xl border border-[#DBC9BD] px-4 py-3"
                  />
                </label>
              </div>

              <label className="block text-sm font-medium">
                What are you reaching out about?
                <select
                  name="inquiryType"
                  defaultValue="Commission"
                  className="mt-2 w-full rounded-xl border border-[#DBC9BD] px-4 py-3"
                >
                  <option>Commission</option>
                  <option>Available artwork</option>
                  <option>Exhibition</option>
                  <option>Collaboration</option>
                  <option>General inquiry</option>
                </select>
              </label>

              <label className="block text-sm font-medium">
                Subject
                <input
                  name="subject"
                  required
                  className="mt-2 w-full rounded-xl border border-[#DBC9BD] px-4 py-3"
                />
              </label>

              <label className="block text-sm font-medium">
                Message
                <textarea
                  name="message"
                  required
                  className="mt-2 min-h-40 w-full rounded-xl border border-[#DBC9BD] px-4 py-3"
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  className="rounded-full bg-[#B88A43] px-6 py-3 font-semibold text-white transition hover:bg-[#9B7131]"
                >
                  Send Message
                </button>

                <Link
                  href="/shop"
                  className="rounded-full border border-[#DBC9BD] px-6 py-3 text-center font-semibold transition hover:bg-[#F5ECE6]"
                >
                  Browse Artwork
                </Link>
              </div>

              {status && (
                <div className="rounded-xl bg-[#F5ECE6] px-4 py-3 text-sm">
                  {status}
                </div>
              )}
            </form>
          </section>
        </div>

        <Link
          href="/"
          className="mt-6 block text-center text-sm text-[#6b5a55] sm:hidden"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}