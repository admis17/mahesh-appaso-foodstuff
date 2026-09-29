# Admin (content + enquiries)

The site has a private admin at **`/admin`** for:

- **Enquiries** — every quote request from the contact form, with status (new → contacted → quoted → won / lost / spam), private notes, one-click email or WhatsApp reply, and CSV export.
- **Products** — add, edit, hide/show, reorder and delete products.
- **Testimonials** — the quotes on the home page.
- **Regions** — the markets on the home page map, region cards and the Global Reach board.
- **Company details** — email, WhatsApp number, phone, hours, address, map, social links, licence number and TRN.

Data lives in [Supabase](https://supabase.com) (free tier is plenty). Until Supabase is connected, the site keeps working on its built-in content, and enquiries go straight to WhatsApp or email without being saved.

## One-time setup (about 15 minutes)

### 1. Create the Supabase project

1. Sign up at supabase.com → **New project**. Pick a region close to your buyers (e.g. Mumbai or Frankfurt) and save the database password somewhere safe.
2. When it's ready, open **SQL Editor** → **New query**, paste the whole of [`supabase/schema.sql`](supabase/schema.sql) and click **Run**.
3. New query again, paste [`supabase/seed.sql`](supabase/seed.sql) and **Run**. This copies the site's current products, testimonials, regions and company details into the database.

### 2. Lock down sign-ups and set the admin links

In **Authentication**:

1. **Sign In / Providers → Email**: keep Email enabled, and **turn off "Allow new users to sign up"**. Only people you invite can have accounts.
2. **URL Configuration**:
   - **Site URL**: `https://mahesh-appaso-foodstuff.vercel.app/admin/set-password`
   - **Redirect URLs**: add `https://mahesh-appaso-foodstuff.vercel.app/admin/set-password` and, for local testing, `http://localhost:5173/admin/set-password`.

   (Invite and password-reset emails send people to the Site URL, where they choose their password.)

### 3. Add yourself as an admin

1. **Authentication → Users → Add user → Send invitation**, enter your email.
2. Open the invite email and follow the link. You'll land on "Choose a password".
3. Back in Supabase, **SQL Editor**, run (with your email):

   ```sql
   insert into public.admins (user_id, email)
   select id, email from auth.users where email = 'you@example.com';
   ```

Repeat step 3 for anyone else who should have access. To remove someone: `delete from public.admins where email = '…';`

### 4. Connect the website

1. In Supabase, **Project Settings → API**, copy the **Project URL** and the **anon public** key.
2. In Vercel, **Project → Settings → Environment Variables**, add:
   - `VITE_SUPABASE_URL` = the Project URL
   - `VITE_SUPABASE_ANON_KEY` = the anon public key
3. **Redeploy** (Deployments → ⋯ → Redeploy). These values are read at build time, so a redeploy is required.

For local development, copy `.env.example` to `.env.local` and fill in the same two values.

Then sign in at **`/admin`**.

## How it behaves

- **Content changes** appear for visitors on their next page load — no redeploy needed.
- **If Supabase is slow or down**, the site waits up to 3 seconds, then shows its built-in content, so it never goes blank.
- **Enquiries are saved** the moment a visitor presses "Message on WhatsApp" or "Send via Email" with a valid form, even if they never finish sending in WhatsApp. A hidden spam trap skips obvious bots.
- **Security**: the anon key in the website is public by design. The database rules in `schema.sql` only let visitors *read published content* and *submit* enquiries. Reading enquiries, editing anything, or granting admin rights needs a signed-in account listed in `public.admins`.

## Changing the built-in fallback content

The fallback content is in `src/data/*.js`. After changing it, regenerate the seed file with:

```bash
node scripts/generate-seed.mjs
```

The seed only adds rows that don't exist yet, so it's safe to run against a database that already has admin edits.
