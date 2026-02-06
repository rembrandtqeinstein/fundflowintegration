# Toolshed MCP Data Sync

This guide explains how to sync data from Stripe internal sources (Google Drive, Compass) using Toolshed MCP.

## How It Works

Since Toolshed MCP is only available in Claude Code sessions (not in Node.js scripts), you simply ask Claude to fetch and update the data.

## Usage

### Quick Sync Command

Just say to Claude:

```
"Sync roadmap data from Toolshed"
```

Claude will:
1. ✅ Fetch the Google Sheet using `get_google_drive_file`
2. ✅ Parse the roadmap countries and launch dates
3. ✅ Update `components/integration-details.tsx`
4. ✅ Update `components/recommendation-card.tsx`
5. ✅ Commit changes to Git
6. ✅ Push to GitHub (triggers Vercel deployment)

### Data Sources

**Google Sheets:**
- File ID: `1w7XrLsYUBDIjig2NKNYLnVA1fozxwnA54z_3g4NZWT4`
- Uses: `mcp__toolshed__get_google_drive_file` tool
- Contains: Roadmap countries with launch dates

**Compass Projects:**
- Uses: `mcp__toolshed__execute_internal_search` and `mcp__toolshed__fetch_internal_search_result` tools
- Project 1: [Cross-border transfers (US <> UK <> EEA <> CA)](https://home.corp.stripe.com/compass/projects/crossborder-transfers-us-uk-eea-ca)
  - Contains: Connect Cross Border Transfers launch timeline (2025 GA)
  - Project ID: `project_S0xmk1G3XOS0TF`
- Project 2: [GA Global payouts to crypto wallets](https://home.corp.stripe.com/compass/projects/code-yellow-global-payouts-to-crypto-wallets)
  - Contains: Global Payouts USDC launch dates (May 2025 Sessions launch)
  - Project ID: `project_SrXJRd3qQZYLnx`
- Project 3: [Connect on Stablecoins](https://home.corp.stripe.com/compass/projects/connect-stablecoins-for-marketplaces)
  - Contains: Connect Stablecoins for Marketplaces timeline (2025-2026)
  - Project ID: `project_TTwR4WYRCy37Wa`

**Trailhead Docs (if needed):**
- Uses: `mcp__toolshed__get_trailhead_doc` tool
- Can fetch: Internal documentation for verification

## Example Prompts

### Update roadmap from Google Sheets
```
"Fetch the Global Payouts roadmap from Google Drive and update the files"
```

### Check Compass for launch dates
```
"Search Compass for Global Payouts USDC launch dates and update the code"
```

### Full sync
```
"Sync all roadmap data from internal sources (Google Sheets + Compass)"
```

## Benefits of Toolshed Approach

✅ **No public access needed** - Works with internal Stripe data
✅ **Always up-to-date** - Direct access to source of truth
✅ **Authenticated** - Uses your Stripe credentials automatically
✅ **Simple** - Just ask Claude to sync when needed
✅ **Fast** - No need to make sheets public or wait for cron jobs

## When to Sync

- After updating the roadmap Google Sheet
- When Compass projects update launch dates
- Before major releases
- Monthly (or as needed)

## Technical Details

### Available Toolshed MCP Tools

**Google Drive/Sheets:**
- `mcp__toolshed__get_google_drive_file` - Read Google Docs/Sheets (returns full document)
- ✨ `get_google_drive_public_sheet_in_spreadsheet` - **RECOMMENDED** - Fetch specific sheet as CSV
  - Parameters: `spreadsheet_id` and `sheet_title`
  - Returns structured CSV format (easier to parse than full document)
  - [Documentation](https://trailhead.corp.stripe.com/docs/toolshed/tools/google_drive_public/get_google_drive_public_sheet_in_spreadsheet)

**Internal Search:**
- `mcp__toolshed__execute_internal_search` - Search Home (includes Compass)
- `mcp__toolshed__fetch_internal_search_result` - Get full doc content
- `mcp__toolshed__get_trailhead_doc` - Fetch Trailhead documentation

**Stripe Public Docs:**
- ✨ **Public Search API** - **RECOMMENDED** instead of web scraping
  - Returns structured JSON for any docs.stripe.com page
  - No HTML parsing needed (cheerio/jsdom not required)
  - Not blocked, officially supported
  - [Documentation](https://trailhead.corp.stripe.com/docs/search/public-search-development/public-search)

Claude Code has access to all these tools and can fetch/parse/update automatically.

## Advanced: Programmatic MCP Integration

For **automated scheduling** without manual Claude Code sessions, you can integrate with MCP programmatically:

### Using agent-srv

Register your agent with MCP support:

```python
# In your agent-srv code
class YourAgent(Agent):
    def __init__(self, uses_mcp_tools=True):
        super().__init__(uses_mcp_tools=True)

    async def sync_data(self):
        # Get MCP tools
        tools = await self.dependencies.mcp_client.get_agent_usable_tools(...)

        # Call Toolshed tools directly from code
        sheet_data = await tools.get_google_drive_public_sheet_in_spreadsheet(
            spreadsheet_id='1w7XrLsYUBDIjig2NKNYLnVA1fozxwnA54z_3g4NZWT4',
            sheet_title='Your Sheet Name'
        )

        # Process and update files
        # ...
```

**Benefits:**
- ✅ Run on a schedule (cron, GitHub Actions, etc.)
- ✅ No manual intervention needed
- ✅ Same authenticated access to internal tools
- ✅ Can be deployed as a service

**Resources:**
- [Integrating your agent with MCP](https://trailhead.corp.stripe.com/docs/ai-foundations/getting-started/integrating-your-agent-with-mcp)
- [Agent-srv documentation](https://trailhead.corp.stripe.com/docs/ai-foundations/agent-srv)
