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

✅ **Configured and actively fetching from:**

1. **Google Sheets** - Global Payouts roadmap data
   - URL: `https://docs.google.com/spreadsheets/d/1w7XrLsYUBDIjig2NKNYLnVA1fozxwnA54z_3g4NZWT4/export?format=csv&gid=0`
   - Fetches country names and launch dates from CSV

2. **Stripe Documentation Pages:**
   - Global Payouts countries: `https://docs.stripe.com/global-payouts/send-money`
   - Global Payouts pricing: `https://docs.stripe.com/global-payouts/pricing`
   - Stablecoin Financial Accounts: `https://docs.stripe.com/financial-accounts/stablecoins`
   - Legacy Stablecoin Payouts: `https://docs.stripe.com/connect/stablecoin-payouts`
   - Issuing Stablecoins: `https://docs.stripe.com/issuing/stablecoins-connect`

### Current Status

✅ **Implemented:**
- Fetching from all configured data sources
- CSV parsing for Google Sheets roadmap data
- Error handling and logging
- Data availability checks

⚠️ **Needs Implementation:**

1. **HTML Parsing for Stripe Docs:**
   - Raw HTML is fetched but needs parsing to extract structured data
   - Consider adding a library like `cheerio` or `jsdom`
   - Extract country lists, pricing tables, and feature information

2. **File Update Logic:**
   - Currently logs what would be updated
   - Needs implementation to actually modify TypeScript files
   - Must preserve formatting and type safety

3. **CSV Column Mapping:**
   - Update `fetchGoogleSheetsData()` if CSV structure changes
   - Current mapping: Column B = date, Column D = country

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
