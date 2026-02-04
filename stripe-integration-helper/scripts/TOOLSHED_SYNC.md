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

**Compass Projects (if needed):**
- Uses: `mcp__toolshed__execute_internal_search` tool
- Can search for: Product launch dates, feature timelines

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

The Toolshed MCP provides these tools:
- `mcp__toolshed__get_google_drive_file` - Read Google Docs/Sheets
- `mcp__toolshed__execute_internal_search` - Search Home (includes Compass)
- `mcp__toolshed__fetch_internal_search_result` - Get full doc content
- `mcp__toolshed__get_trailhead_doc` - Fetch Trailhead documentation

Claude Code has access to all these tools and can fetch/parse/update automatically.
