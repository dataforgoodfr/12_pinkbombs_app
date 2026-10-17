# Pinkbombs

## Getting Started

### 2. Install and update dependencies

Use npm to install the dependencies recorded in `package-lock.json`:

```bash
npm install
```

To update dependencies within the version ranges declared in `package.json`, run:

```bash
npm update
```

Use `npm outdated` to check for newer versions. To add a dependency, use
`npm install <package>`; add `--save-dev` for a development dependency.

### 3. Run the development server

You can start the server using this command:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. You can start editing the page by modifying `src/pages/index.tsx`.

### 4. Build and test

Run the followed command:

- Build the project: `npm run build`
- Launch linter: `npm run lint:strict`
- Launch Typecheck: `npm run typecheck`
- Launch Prettier: `npm run format:check`
- Launch Jest: `npm test`

The calculator (Pinkometer) has focused reducer tests and a rendered modal-flow regression
test covering product selection, frequency selection, summary, and loading.
Run them with:

```bash
npm test -- src/components/calculator/__tests__
```

The calculator sends its initial answers and selected reduced-impact
commitment to the Pinkbombs FastAPI ([https://github.com/dataforgoodfr/12_pinkbombs](https://github.com/dataforgoodfr/12_pinkbombs)) service when the badge form is submitted.
The calculation itself remains local to the Next.js application.

Configure this server-only environment variable in Vercel for Development,
Preview, and Production:

- `PINKBOMBS_API_BASE_URL`

For local development, set `PINKBOMBS_API_BASE_URL=http://localhost:8000` in
`.env.local`. The Vercel Route Handlers proxy `/api/v1/options` and
`/api/v1/submissions`; the browser does not call FastAPI directly. Configure the
FastAPI CORS allowlist with the deployed frontend's exact origin (never `*`);
CORS is not an authentication mechanism. Do not expose API credentials through
`NEXT_PUBLIC_` variables.

### Newsletter subscription

The footer and calculator badge form can subscribe an email address to the
Brevo newsletter through the Pages Router Vercel Function at
`/api/newsletter/subscribe`. Configure these server-only environment variables
in Vercel for Development, Preview, and Production:

- `BREVO_API_KEY`
- `BREVO_NEWSLETTER_LIST_ID`

For local development, pull the Development values into `.env.local`:

```bash
vercel env pull .env.local --environment=development
```

The API treats an existing contact as a successful subscription and does not
expose Brevo credentials or provider error details to the browser.

### Deploy to Vercel

Before deploying, log in to the Vercel account linked to this project:

```bash
vercel login
```

Vercel requires the latest commit's author email to match the email linked to
the Vercel account. Set the Git email and create an empty commit so Vercel can
accept the deployment:

```bash
git config --global user.email "pinkbombs.dev@gmail.com"
git commit -m "fix config user email for vercel" --allow-empty
```

Run the deployment command from the project directory. Use the Preview target
for staging:

```bash
vercel --target preview
```

Use the Production target for the live site:

```bash
vercel --target production
```

Make sure the required environment variables are configured for the matching
Preview or Production environment in Vercel before deploying.

### 5. Commit Message Convention

This starter is using [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/), it is mandatory to use it to commit changes.
