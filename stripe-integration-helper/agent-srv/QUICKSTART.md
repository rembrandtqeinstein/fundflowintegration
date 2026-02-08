# Quick Start Guide - Fund Flow Sync Agent

Get your automated data sync running in 5 steps!

## Prerequisites Checklist

- [ ] You have access to Stripe's agent-srv infrastructure
- [ ] You have Toolshed MCP access
- [ ] You have SSH keys configured for git.corp.stripe.com
- [ ] You have access to github.com

## Step 1: Configure the Agent

Edit `config.yaml` and set your repository path:

```yaml
agent:
  repo_path: "/Users/hernanherrera/stripe/fund-flow-integrator"  # CHANGE THIS
```

## Step 2: Clone Repository for Agent Access

The agent needs a local clone it can modify:

```bash
# Clone to a location accessible by agent-srv
cd /Users/hernanherrera/stripe/
git clone git@git.corp.stripe.com:hernanherrera/fund-flow-integrator.git

cd fund-flow-integrator

# Add personal GitHub remote
git remote add origin https://github.com/rembrandtqeinstein/fundflowintegration.git

# Verify both remotes
git remote -v
```

## Step 3: Test Locally

Test the agent before deploying:

```bash
cd /path/to/fund-flow-integrator/agent-srv

# Run a test sync (requires MCP access)
python -m fund_flow_sync_agent.agent
```

Expected output:
```
📊 Fetching Google Sheets roadmap data...
   → Parsed 34 roadmap countries
🧭 Fetching Compass project timelines...
   ✓ Fetched Cross-border transfers (US <> UK <> EEA <> CA)
   ✓ Fetched GA Global payouts to crypto wallets by Sessions
   ✓ Fetched Connect on Stablecoins [Q1:Launch]
📝 Updating integration files...
   ✓ Updated components/integration-details.tsx
   ✓ Updated components/recommendation-card.tsx
🚀 Committing and pushing changes...
   ✓ Changes committed
   ✓ Pushed to Stripe GitHub
   ✓ Pushed to personal GitHub (Vercel will deploy)
✅ Sync completed successfully! Updated 2 files
```

## Step 4: Deploy to Agent-srv

Deploy the agent to Stripe infrastructure:

```bash
# Register the agent
agent-srv register fund_flow_sync_agent \
  --path /path/to/fund-flow-integrator/agent-srv \
  --uses-mcp-tools

# Set schedule (monthly on 1st)
agent-srv schedule fund-flow-sync-agent --cron "0 0 1 * *"

# Deploy
agent-srv deploy fund-flow-sync-agent
```

## Step 5: Verify Deployment

Check that everything is working:

```bash
# Check agent status
agent-srv status fund-flow-sync-agent

# View logs
agent-srv logs fund-flow-sync-agent --tail 50

# Trigger a manual test run
agent-srv trigger fund-flow-sync-agent
```

## What Happens Now?

✅ **Automatic Monthly Sync:**
- Agent runs on the 1st of each month at midnight UTC
- Fetches latest data from Google Sheets and Compass
- Updates TypeScript files with new roadmap countries
- Commits and pushes to both GitHub repos
- Vercel automatically deploys the update

✅ **Manual Sync:**
You can also trigger manually anytime:
```bash
agent-srv trigger fund-flow-sync-agent
```

## Monitoring

### View Recent Syncs

```bash
# See last 5 runs
agent-srv history fund-flow-sync-agent --limit 5
```

### Set Up Alerts

Get notified on failures:

1. Edit `config.yaml`:
```yaml
notifications:
  slack:
    enabled: true
    webhook_url: "YOUR_WEBHOOK"
    channel: "#fund-flow-updates"
```

2. Redeploy:
```bash
agent-srv deploy fund-flow-sync-agent
```

## Troubleshooting

### "MCP tools not available"

**Problem:** Agent can't access Toolshed MCP

**Fix:**
```bash
# Re-register with MCP tools enabled
agent-srv register fund-flow-sync-agent --uses-mcp-tools
```

### "Git push permission denied"

**Problem:** SSH keys not configured in agent environment

**Fix:**
1. Check agent-srv documentation for SSH key setup
2. Add your SSH keys to the agent's compute environment
3. Test: `ssh -T git@git.corp.stripe.com`

### "Pattern not found in file"

**Problem:** File structure changed and regex doesn't match

**Fix:**
1. Check the actual file structure
2. Update regex patterns in `agent.py`
3. Redeploy agent

## Next Steps

- [ ] Set up Slack notifications
- [ ] Add monitoring dashboard
- [ ] Test manual trigger
- [ ] Document for team in Trailhead

## Getting Help

- **Agent-srv issues:** #wpp
- **MCP/Toolshed issues:** #dev-productivity
- **Fund Flow Guide questions:** @hernanherrera

---

**That's it!** Your automated data sync is now running. The Fund Flow Integration Guide will stay up-to-date automatically! 🎉
