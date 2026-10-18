# African Development Grants Foundation: site setup

Files:
- `index.html`: the website
- `functions/api/contact.js`: Cloudflare Pages Function that emails each submission to you
- `README.md`: this file

## 1. Fill in the placeholders
In `index.html`, replace `[YOUR REGISTERED ADDRESS]`, `[YOUR PHONE NUMBER]` and `[YOUR REGISTRATION NUMBER]` in the Contact section. Also replace the placeholder grant amounts, regions and the fictional example stories with real information.

## 2. Get an email-sending key (Resend)
1. Sign up at resend.com with the Gmail address that should receive applications.
2. Create an API key.
3. Until you verify your own domain in Resend, sending works only to the address you signed up with, using the default sender `onboarding@resend.dev`. That is enough to start. To use your own sender later, verify your domain and set `FROM_EMAIL`.

## 3. Deploy
1. Push these files to a GitHub repo (keep the `functions` folder at the repo root).
2. In Cloudflare: Workers & Pages > Create > Pages > Connect to Git, select the repo. Build command: none. Output directory: `/`.
3. After the first deploy: Settings > Variables and Secrets > add, for Production:
   - `RESEND_API_KEY` = your key (encrypt it)
   - `TO_EMAIL` = the address that receives applications
   - `FROM_EMAIL` = optional, only after domain verification
4. Redeploy once so the variables take effect.

Your email address is stored only in Cloudflare's settings, never in the page or repo.

## 4. Test
Submit the form on your live site and check your inbox (and spam folder).

## Good practice
- Keep "applying is free" on the site and never charge applicants.
- Add Cloudflare Turnstile later if you receive spam.
- Do not collect ID numbers, bank details or PINs through this form.
