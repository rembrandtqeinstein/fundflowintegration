# Fund Flow Sync Agent

Automated agent that syncs Fund Flow Integration Guide data from internal Stripe sources using Toolshed MCP.

## Overview

This agent-srv agent runs on a schedule (monthly by default) to automatically:

1. **Fetch data** from internal sources:
   - Google Sheets (roadmap countries with launch dates)
   - Compass projects (launch timelines)

2. **Update files** in the repository:
   - `components/integration-details.tsx`
   - `components/recommendation-card.tsx`

3. **Commit and push** changes to both:
   - Stripe GitHub (internal visibility)
   - Personal GitHub (triggers Vercel deployment)

## Architecture

```
┌─────────────────────┐
│  Scheduled Trigger  │
│   (Monthly: 1st)    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Fund Flow Sync     │
│      Agent          │
│  (agent-srv)        │
└──────────┬──────────┘
           │
           ├─► Toolshed MCP ──► Google Sheets
           ├─► Toolshed MCP ──► Compass Projects
           │
           ▼
┌─────────────────────┐
│   Update TSX Files  │
│   Parse & Replace   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Git Commit        │
│   & Push            │
└──────────┬──────────┘
           │
           ├─► Stripe GitHub ─────┐
           │                      │
           └─► Personal GitHub ───┤
                                  │
                                  ▼
                           ┌──────────────┐
                           │    Vercel    │
                           │  (deploys)   │
                           └──────────────┘
```

## Prerequisites

1. **Agent-srv framework** installed
   - See: https://trailhead.corp.stripe.com/docs/ai-foundations/agent-srv

2. **Toolshed MCP access**
   - Agent must be registered with `uses_mcp_tools=True`

3. **Git access**
   - SSH keys configured for both GitHub remotes
   - Write access to the fund-flow-integrator repository

4. **Compute environment**
   - Stripe-hosted environment with access to:
     - git.corp.stripe.com
     - github.com
     - Toolshed MCP servers

## Configuration

### 1. Update `config.yaml`

Edit `config.yaml` and set:

```yaml
agent:
  repo_path: "/actual/path/to/fund-flow-integrator"  # REQUIRED

sources:
  google_sheets:
    sheet_title: "Sheet1"  # Adjust if your sheet has different name

schedule:
  cron: "0 0 1 * *"  # Monthly on 1st at midnight UTC
```

### 2. Configure Repository Path

The agent needs access to a local clone of the repository:

```bash
# Clone the repository where the agent can access it
git clone git@git.corp.stripe.com:hernanherrera/fund-flow-integrator.git /path/to/repo

# Ensure both remotes are configured
cd /path/to/repo
git remote add origin https://github.com/rembrandtqeinstein/fundflowintegration.git
git remote add stripe git@git.corp.stripe.com:hernanherrera/fund-flow-integrator.git
```

### 3. Set Git Credentials

Ensure the agent's compute environment has:
- SSH keys for git.corp.stripe.com
- SSH keys or tokens for github.com

## Deployment

### Option A: Deploy to Stripe Agent-srv Infrastructure

1. **Register the agent:**

```bash
# From the agent-srv directory
agent-srv register fund_flow_sync_agent
```

2. **Configure MCP tools:**

```python
from agent_srv import Agent

agent = Agent(
    name='fund-flow-sync-agent',
    uses_mcp_tools=True
)
```

3. **Set up the schedule:**

```bash
# Configure cron schedule
agent-srv schedule fund-flow-sync-agent --cron "0 0 1 * *"
```

4. **Deploy:**

```bash
agent-srv deploy fund-flow-sync-agent
```

### Option B: Manual Testing

Run the agent manually for testing:

```bash
cd agent-srv
python -m fund_flow_sync_agent.agent
```

### Option C: Custom Scheduler

If not using agent-srv infrastructure, you can schedule via:

**Cron (Linux/Mac):**
```bash
# Add to crontab
0 0 1 * * cd /path/to/agent && python -m fund_flow_sync_agent.agent
```

**GitHub Actions** (if running on self-hosted runner with MCP access):
```yaml
name: Sync Fund Flow Data
on:
  schedule:
    - cron: '0 0 1 * *'
jobs:
  sync:
    runs-on: stripe-runner  # Self-hosted with MCP access
    steps:
      - name: Run sync agent
        run: python -m fund_flow_sync_agent.agent
```

## How It Works

### 1. Data Fetching

**Google Sheets:**
```python
# Uses Toolshed MCP tool
csv_data = await mcp_tools.get_google_drive_public_sheet_in_spreadsheet(
    spreadsheet_id='1w7XrLsYUBDIjig2NKNYLnVA1fozxwnA54z_3g4NZWT4',
    sheet_title='Sheet1'
)
```

**Compass Projects:**
```python
# Fetches each project via internal search
result = await mcp_tools.fetch_internal_search_result(
    document_reference='compass_project:project_S0xmk1G3XOS0TF'
)
```

### 2. File Updates

The agent uses regex patterns to find and replace sections in TypeScript files:

- **integration-details.tsx**: Updates `GLOBAL_PAYOUTS_COUNTRIES` array
- **recommendation-card.tsx**: Updates `ROADMAP_COUNTRIES` object

### 3. Git Operations

```bash
# Add changed files
git add components/integration-details.tsx components/recommendation-card.tsx

# Commit with automated message
git commit -m "chore: auto-sync roadmap data from internal sources"

# Push to both remotes
git push stripe main:master    # Stripe GitHub
git push origin main           # Personal GitHub → triggers Vercel
```

## Monitoring

### Check Agent Status

```bash
# View recent runs
agent-srv logs fund-flow-sync-agent --tail 100

# Check schedule status
agent-srv status fund-flow-sync-agent
```

### Manual Trigger

```bash
# Trigger sync manually (useful for testing)
agent-srv trigger fund-flow-sync-agent
```

### Sync Results

The agent returns a results dictionary:

```json
{
  "timestamp": "2026-02-08T12:00:00Z",
  "sources": {
    "google_sheets": {
      "status": "success",
      "countries_found": 34
    },
    "compass": {
      "status": "success",
      "projects_fetched": 3
    }
  },
  "files_updated": [
    "components/integration-details.tsx",
    "components/recommendation-card.tsx"
  ],
  "git_push": {
    "committed": true,
    "pushed": {
      "stripe": true,
      "origin": true
    }
  },
  "errors": []
}
```

## Troubleshooting

### MCP Tools Not Available

**Error:** `RuntimeError: MCP tools not initialized`

**Solution:** Ensure agent is registered with `uses_mcp_tools=True`:
```python
agent = FundFlowSyncAgent(uses_mcp_tools=True)
await agent.initialize(dependencies)
```

### Git Push Fails

**Error:** `git push failed: permission denied`

**Solution:** Check SSH keys are configured:
```bash
ssh -T git@git.corp.stripe.com
ssh -T git@github.com
```

### File Update Pattern Not Found

**Error:** `Pattern not found in [file]`

**Solution:** The regex pattern might be out of sync with current file structure. Check:
1. File still has expected structure
2. Update regex pattern in `agent.py` if file format changed

### Google Sheets Access Denied

**Error:** `403 Forbidden` or `401 Unauthorized`

**Solution:**
1. Verify sheet is accessible via Toolshed
2. Check spreadsheet ID is correct
3. Ensure MCP tools have proper permissions

## Notifications (Optional)

### Slack Notifications

To get Slack notifications on sync completion:

1. Create a Slack webhook
2. Update `config.yaml`:
```yaml
notifications:
  slack:
    enabled: true
    webhook_url: "https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
    channel: "#fund-flow-updates"
```

### Email Notifications

Update `config.yaml`:
```yaml
notifications:
  email:
    enabled: true
    recipients:
      - "hernanherrera@stripe.com"
```

## Development

### Running Tests

```bash
# Run unit tests
python -m pytest tests/

# Test Google Sheets fetch
python -m fund_flow_sync_agent.agent --test-sheets

# Test Compass fetch
python -m fund_flow_sync_agent.agent --test-compass

# Dry run (no git push)
python -m fund_flow_sync_agent.agent --dry-run
```

### Adding New Data Sources

1. Add source configuration to `config.yaml`
2. Add fetch method to `agent.py`:
```python
async def _fetch_new_source(self):
    # Implement fetching logic
    pass
```
3. Call in `sync_data()` method
4. Update file update logic as needed

## Resources

- [Agent-srv Documentation](https://trailhead.corp.stripe.com/docs/ai-foundations/agent-srv)
- [Integrating with MCP](https://trailhead.corp.stripe.com/docs/ai-foundations/getting-started/integrating-your-agent-with-mcp)
- [Toolshed MCP Tools](https://trailhead.corp.stripe.com/docs/toolshed)
- [Public Search API](https://trailhead.corp.stripe.com/docs/search/public-search-development/public-search)

## Support

Questions or issues? Reach out to:
- **#wpp** - For agent-srv deployment help
- **#dev-productivity** - For Toolshed/MCP questions
- **@hernanherrera** - For Fund Flow Integration Guide questions
