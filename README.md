# Pinkbombs

## Getting Started

### 2. Install dependencies

It is encouraged to use **yarn** so the husky hooks can work properly.

```bash
yarn install
```

### 3. Run the development server

You can start the server using this command:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. You can start editing the page by modifying `src/pages/index.tsx`.

### 4. Build and test

Run the followed command:

- Build the project: `yarn build`
- Launch linter: `yarn lint:strict`
- Launch Typecheck: `yarn typecheck`
- Launch Prettier: `yarn format:check`
- Launch Jest: `yarn test`

The calculator has focused reducer tests and a rendered modal-flow regression
test covering product selection, frequency selection, summary, and loading.
Run them with:

```bash
pnpm test -- src/components/calculator/__tests__
```

Calculator submission currently uses a mocked async service. Its typed
submission boundary is ready to be replaced by the future React mutation and
backend persistence flow.

### 5. Commit Message Convention

This starter is using [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/), it is mandatory to use it to commit changes.
