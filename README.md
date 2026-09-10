# WORD website

Static website for Women's Organisation for Resilience and Development (WORD).

## Pages
```
index.html          Home
about.html          About
leadership.html     Leadership & governance
programs.html       Our Work (8 pillars)
approach.html       Approach & Values
impact.html         Impact
partners.html       Partners
donate.html         Donate / Support
careers.html        Careers & Volunteering
news.html           News index
news-launch.html    Launch / RRC registration update
documents.html      Documents library
documents/factsheet.html   Printable factsheet
contact.html        Contact + form + map
privacy.html        Privacy policy
sitemap.html        HTML sitemap
thanks.html         Form success
404.html            Not found
```

## Assets
- `assets/style.css`, `assets/main.js`
- `assets/fonts/` — self-hosted Poppins (Spacewalk-style typography)
- Photos: `photo-team.jpg`, `photo-distribution.jpg`, `photo-supplies.jpg`
- `favicons/`

## Contact form
Submits via [FormSubmit](https://formsubmit.co) to `word94091@gmail.com`.

1. First real submission sends an activation email — confirm it once.
2. Honeypot field filters basic bots (`_captcha` stays `false` so AJAX submit keeps working).
3. After success, users go to `thanks.html`.

## Analytics (optional)
In any page before `main.js`, or in the console for testing:

```html
<script>
  window.WORD_ANALYTICS_SRC = 'https://plausible.io/js/script.js';
  window.WORD_ANALYTICS_DOMAIN = 'your-domain.org';
</script>
```

The consent banner stores Accept/Decline in `localStorage`. Analytics load only after Accept.

## Hosting
Works on any static host. Included helpers:
- `netlify.toml` + `_redirects` — custom 404 + security headers
- `vercel.json` — clean URL defaults

Upload the whole folder; no build step.

## Before going live
1. Domain is set to `https://www.word-ss.org` (canonicals, OG tags, sitemap, robots, form `_next`).
2. Point DNS at Netlify and enable HTTPS.
3. Confirm FormSubmit activation email.
4. Submit `sitemap.xml` in Google Search Console.
5. Add Board names, partner logos, registration PDF, and social URLs when approved.
6. Set `WORD_ANALYTICS_SRC` if you want analytics.

## Notes
- Leadership page does not invent personal names — add approved biographies when ready.
- Partner logos only after written permission.
- Exact HQ map pin can replace the area search once you have coordinates.
- Social footer note remains until official Facebook/LinkedIn/X links exist.
