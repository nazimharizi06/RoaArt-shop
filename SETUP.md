# Roa-Art setup checklist

## 1. Environment variables
Copy `.env.example` to `.env.local` and fill every value. Set `ADMIN_EMAILS` to the artist's exact Supabase login email. Multiple approved emails can be comma-separated.

## 2. Supabase database
The `artworks` table should include:
- `id` uuid primary key
- `title` text not null
- `description` text
- `price` numeric not null default 0
- `category` text
- `medium` text
- `width` numeric
- `height` numeric
- `quantity` integer not null default 1
- `is_available` boolean not null default true
- `featured` boolean not null default false
- `image_url` text
- `created_at` timestamptz default now()
- `updated_at` timestamptz

Create a public Supabase Storage bucket named `artwork-images` (or change `SUPABASE_ARTWORK_BUCKET`). Server-side admin routes use the service-role key; never expose that key in browser code or commit `.env.local`.

## 3. Admin account
Create the artist account inside Supabase Authentication. Public sign-up was removed from the site. The signed-in email must appear in `ADMIN_EMAILS`.

## 4. Stripe
Add the Stripe secret and webhook secret. Configure the webhook endpoint as `/api/stripe-webhook` and subscribe to `checkout.session.completed`.

## 5. Contact details
Fill `NEXT_PUBLIC_ARTIST_EMAIL`, `NEXT_PUBLIC_INSTAGRAM_USERNAME`, and `NEXT_PUBLIC_INSTAGRAM_URL`. The contact form opens the visitor's email app with a prepared message.

## 6. Run
```bash
npm ci
npm run dev
```

## Security
Rotate any Supabase service-role key that was previously shared in a zip. Never zip `.env.local`, `.next`, or `node_modules`.
