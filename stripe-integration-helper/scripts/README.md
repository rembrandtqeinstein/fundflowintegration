# Data Sync Scripts

This directory contains scripts for automatically syncing data from public sources.

## Monthly Auto-Sync

The `sync-data.js` script runs automatically on the 1st of every month via GitHub Actions to fetch the latest data from public sources and update the application.

### How It Works

1. **GitHub Actions workflow** (`.github/workflows/sync-data.yml`) runs monthly
2. **Sync script** (`sync-data.js`) fetches data from public sources
3. **Data files** are updated with the latest information
4. **Changes are committed** automatically to the repository
5. **Vercel redeploys** automatically when changes are pushed

### Data Sources

The script can fetch from:
- Stripe's public documentation pages
- Google Sheets (if publicly accessible as CSV export)
- Any public API endpoints

### Customization Required

⚠️ **The script is currently a template and needs customization:**

1. **Add Google Sheets URL** (if using):
   ```javascript
   GOOGLE_SHEETS_CSV: 'https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv&gid=YOUR_GID'
   ```

2. **Implement Stripe docs scraping** or find a public API:
   - Option A: Parse HTML from docs.stripe.com pages
   - Option B: Find if Stripe has a public API for country availability
   - Option C: Use another structured data source

3. **Implement data parsing logic**:
   - Parse fetched data into the required format
   - Update the country arrays in the TypeScript files

### Manual Testing

Test the sync script locally:

```bash
node scripts/sync-data.js
```

### Manual Trigger

Trigger the GitHub Action manually:
1. Go to your GitHub repository
2. Click "Actions" tab
3. Select "Sync Data from Public Sources"
4. Click "Run workflow"

### Files Updated

- `components/integration-details.tsx` - Country lists and pricing
- `components/recommendation-card.tsx` - Roadmap countries with launch dates

### Next Steps

1. Identify reliable public data sources for:
   - Global Payouts country list
   - Connect supported regions
   - USDC Connect Payouts roadmap
   - Launch dates
   - Pricing information

2. Implement the fetching logic for each source

3. Test the script locally before relying on automation

4. Consider adding:
   - Email notifications on sync failures
   - Slack webhook for sync status
   - Data validation before updating files
