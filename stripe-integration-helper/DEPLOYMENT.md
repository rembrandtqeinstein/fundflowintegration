# Deployment Setup

This project uses a dual-repository setup:

## Repositories

1. **Stripe GitHub (Internal)** - Source of truth
   - URL: https://git.corp.stripe.com/hernanherrera/fund-flow-integrator
   - Remote: `stripe`
   - Branch: `master`
   - Purpose: Internal visibility, collaboration with Stripe team

2. **Personal GitHub (Public)** - Deployment source
   - URL: https://github.com/rembrandtqeinstein/fundflowintegration
   - Remote: `origin`
   - Branch: `main`
   - Purpose: Connected to Vercel for automatic deployments

3. **Vercel Deployment**
   - URL: https://ffi-gamma.vercel.app/
   - Deploys from: Personal GitHub (`origin/main`)
   - Auto-deploys on push to `main` branch

## Workflow

### Making Changes

When you make changes, commit them locally:

```bash
git add .
git commit -m "Your commit message"
```

### Deploying (Push to Both)

Push to both repositories to keep them in sync:

```bash
# Push to Stripe GitHub (internal)
git push stripe main:master

# Push to personal GitHub (triggers Vercel deployment)
git push origin main
```

Or use a single command to push to both:

```bash
git push origin main && git push stripe main:master
```

### Quick Deploy Alias

Add this to your `~/.bashrc` or `~/.zshrc`:

```bash
alias deploy-ffi='git push origin main && git push stripe main:master && echo "✅ Deployed to both GitHub repos!"'
```

Then just run:
```bash
deploy-ffi
```

## Repository Sync

Both repositories should always have the same code. If they get out of sync:

```bash
# Pull latest from Stripe GitHub
git pull stripe master

# Push to personal GitHub
git push origin main
```

## Automated Data Sync

### Agent-srv Integration

An **automated agent** keeps the roadmap data up-to-date by syncing from internal sources monthly.

**What it does:**
1. Fetches Google Sheets roadmap data (countries + launch dates)
2. Fetches Compass project timelines
3. Updates TypeScript files automatically
4. Commits and pushes to both GitHub repos
5. Triggers Vercel deployment automatically

**Schedule:** Runs on the 1st of every month at midnight UTC

**Setup:** See `agent-srv/QUICKSTART.md` for deployment instructions

**Manual trigger:**
```bash
agent-srv trigger fund-flow-sync-agent
```

This means **data sources sync automatically** - you don't need to manually update roadmap countries!

## Notes

- ✅ Vercel **can only** connect to github.com (not git.corp.stripe.com)
- ✅ Personal GitHub is required for Vercel deployment
- ✅ Stripe GitHub provides internal visibility
- ✅ Both repos stay in sync by pushing to both on each change
- ✅ Data sources (Google Sheets, Compass) sync automatically via agent-srv
