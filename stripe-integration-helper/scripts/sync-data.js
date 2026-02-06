#!/usr/bin/env node

/**
 * Data Sync Script
 * Fetches data from Stripe internal sources via Toolshed MCP
 * and updates the application files
 * Runs monthly via GitHub Actions
 *
 * NOTE: This script is designed to run in a Stripe environment with
 * access to Toolshed MCP for internal Google Drive and Compass data.
 * For external users, it will fall back to public Stripe docs.
 *
 * RECOMMENDED IMPROVEMENTS:
 * 1. Google Sheets: Use `get_google_drive_public_sheet_in_spreadsheet` tool
 *    - Provide spreadsheet_id and sheet_title
 *    - Returns CSV directly (no manual download needed)
 *    - See: https://trailhead.corp.stripe.com/docs/toolshed/tools/google_drive_public/get_google_drive_public_sheet_in_spreadsheet
 *
 * 2. Stripe Docs: Use Public Search API instead of scraping
 *    - Returns structured JSON (no cheerio/HTML parsing needed)
 *    - Not blocked, officially supported
 *    - See: https://trailhead.corp.stripe.com/docs/search/public-search-development/public-search
 *
 * 3. Automation: Integrate with MCP programmatically via agent-srv
 *    - Register agent with uses_mcp_tools=True
 *    - Call self.dependencies.mcp_client.get_agent_usable_tools(...)
 *    - Run Toolshed tools from code on a schedule
 *    - See: https://trailhead.corp.stripe.com/docs/ai-foundations/getting-started/integrating-your-agent-with-mcp
 */

const fs = require('fs');
const path = require('path');

// Configuration
const DATA_SOURCES = {
  // Google Sheets - Global Payouts roadmap data
  GOOGLE_SHEETS_GLOBAL_PAYOUTS: 'https://docs.google.com/spreadsheets/d/1w7XrLsYUBDIjig2NKNYLnVA1fozxwnA54z_3g4NZWT4/export?format=csv&gid=99819799',

  // Stripe Documentation URLs
  GLOBAL_PAYOUTS_COUNTRIES: 'https://docs.stripe.com/global-payouts/send-money',
  GLOBAL_PAYOUTS_PRICING: 'https://docs.stripe.com/global-payouts/pricing',
  STABLECOIN_FINANCIAL_ACCOUNTS: 'https://docs.stripe.com/financial-accounts/stablecoins',
  LEGACY_STABLECOIN_PAYOUTS: 'https://docs.stripe.com/connect/stablecoin-payouts',
  ISSUING_STABLECOINS: 'https://docs.stripe.com/issuing/stablecoins-connect',
};

const FILES_TO_UPDATE = {
  INTEGRATION_DETAILS: path.join(__dirname, '../components/integration-details.tsx'),
  RECOMMENDATION_CARD: path.join(__dirname, '../components/recommendation-card.tsx'),
};

/**
 * Fetch data from Stripe's public documentation
 */
async function fetchStripePublicData() {
  console.log('📡 Fetching data from Stripe public docs...');

  try {
    const results = {
      globalPayoutsCountries: null,
      pricing: null,
      stablecoinInfo: null,
    };

    // Fetch Global Payouts countries page
    console.log('   → Fetching Global Payouts countries...');
    const countriesResponse = await fetch(DATA_SOURCES.GLOBAL_PAYOUTS_COUNTRIES);
    if (countriesResponse.ok) {
      results.globalPayoutsCountries = await countriesResponse.text();
      console.log('   ✓ Global Payouts countries fetched');
    }

    // Fetch pricing page
    console.log('   → Fetching pricing information...');
    const pricingResponse = await fetch(DATA_SOURCES.GLOBAL_PAYOUTS_PRICING);
    if (pricingResponse.ok) {
      results.pricing = await pricingResponse.text();
      console.log('   ✓ Pricing information fetched');
    }

    // Fetch stablecoin docs
    console.log('   → Fetching stablecoin documentation...');
    const stablecoinResponses = await Promise.all([
      fetch(DATA_SOURCES.STABLECOIN_FINANCIAL_ACCOUNTS),
      fetch(DATA_SOURCES.LEGACY_STABLECOIN_PAYOUTS),
      fetch(DATA_SOURCES.ISSUING_STABLECOINS),
    ]);

    if (stablecoinResponses.every(r => r.ok)) {
      const stablecoinData = await Promise.all(stablecoinResponses.map(r => r.text()));
      results.stablecoinInfo = stablecoinData;
      console.log('   ✓ Stablecoin documentation fetched');
    }

    console.log('⚠️  Note: HTML parsing not implemented yet');
    console.log('   Raw HTML has been fetched but needs parsing to extract structured data');
    console.log('   Consider using a library like cheerio or jsdom to parse the HTML');

    return results;
  } catch (error) {
    console.error('❌ Error fetching Stripe data:', error.message);
    return null;
  }
}

/**
 * Fetch data from Google Sheets (if publicly accessible)
 */
async function fetchGoogleSheetsData() {
  console.log('📊 Fetching data from Google Sheets...');

  try {
    const response = await fetch(DATA_SOURCES.GOOGLE_SHEETS_GLOBAL_PAYOUTS);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const csvData = await response.text();
    console.log('   ✓ Google Sheets data fetched');
    console.log(`   → CSV data length: ${csvData.length} characters`);

    // Parse CSV into lines
    const lines = csvData.split('\n').filter(line => line.trim());
    console.log(`   → Found ${lines.length} rows in CSV`);

    // TODO: Parse CSV data into structured format
    // Expected columns based on previous discussions:
    // Column A: ? (to disregard)
    // Column B: Launch date
    // Column D: Country name

    // Simple parsing example (you may want to use a CSV library for robust parsing):
    const roadmapCountries = [];
    for (let i = 1; i < lines.length; i++) { // Skip header row
      const columns = lines[i].split(',');
      if (columns.length >= 4) {
        const launchDate = columns[1]?.trim();
        const country = columns[3]?.trim();
        if (country && launchDate) {
          roadmapCountries.push({ country, launchDate });
        }
      }
    }

    console.log(`   ✓ Parsed ${roadmapCountries.length} roadmap countries`);

    return {
      roadmapCountries,
      rawCsv: csvData,
    };
  } catch (error) {
    console.error('❌ Error fetching Google Sheets data:', error.message);
    return null;
  }
}

/**
 * Update integration-details.tsx with new data
 */
function updateIntegrationDetails(data) {
  console.log('📝 Updating integration-details.tsx...');

  try {
    const filePath = FILES_TO_UPDATE.INTEGRATION_DETAILS;
    let content = fs.readFileSync(filePath, 'utf8');

    if (!data.roadmapCountries || data.roadmapCountries.length === 0) {
      console.log('   ⚠️  No roadmap countries data available to update');
      return false;
    }

    console.log(`   → Processing ${data.roadmapCountries.length} roadmap countries`);

    // Group countries by launch date
    const byDate = {};
    data.roadmapCountries.forEach(item => {
      if (!byDate[item.launchDate]) {
        byDate[item.launchDate] = [];
      }
      byDate[item.launchDate].push(item.country);
    });

    // Generate the roadmap countries section for GLOBAL_PAYOUTS_COUNTRIES array
    let roadmapSection = '\n';
    Object.entries(byDate).sort().forEach(([date, countries]) => {
      roadmapSection += `  // Coming ${date}\n`;
      countries.forEach(country => {
        // Format: { country: "Name", currency: "CODE", crossBorderFee: "TBD", launchDate: "Date" },
        roadmapSection += `  { country: "${country}", currency: "TBD", crossBorderFee: "TBD", launchDate: "${date}" },\n`;
      });
      roadmapSection += '\n';
    });

    // Find and replace the roadmap section in GLOBAL_PAYOUTS_COUNTRIES
    // Look for the pattern starting with "// Coming" until the closing bracket
    const regex = /(const GLOBAL_PAYOUTS_COUNTRIES = \[[^\]]*?)(\n\s*\/\/ Coming[^\]]*?)(\])/s;

    if (regex.test(content)) {
      // Extract the live countries (before "// Coming")
      const match = content.match(/(const GLOBAL_PAYOUTS_COUNTRIES = \[[^\]]*?)(\n\s*\/\/ Coming[^\]]*?)(\])/s);
      if (match) {
        const beforeRoadmap = match[1];
        const afterArray = match[3];

        // Replace with new roadmap data
        content = content.replace(regex, `${beforeRoadmap}${roadmapSection}${afterArray}`);

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`   ✓ Updated roadmap countries in GLOBAL_PAYOUTS_COUNTRIES array`);
        console.log(`   → Added ${data.roadmapCountries.length} countries across ${Object.keys(byDate).length} launch dates`);
        return true;
      }
    }

    console.log('   ⚠️  Could not find roadmap section to update in file');
    return false;
  } catch (error) {
    console.error('❌ Error updating integration-details.tsx:', error.message);
    return false;
  }
}

/**
 * Update recommendation-card.tsx with new roadmap data (coming soon countries only)
 */
function updateRecommendationCard(data) {
  console.log('📝 Updating recommendation-card.tsx...');

  try {
    const filePath = FILES_TO_UPDATE.RECOMMENDATION_CARD;
    let content = fs.readFileSync(filePath, 'utf8');

    if (!data.roadmapCountries || data.roadmapCountries.length === 0) {
      console.log('   ⚠️  No roadmap countries data available to update');
      return false;
    }

    console.log(`   → Processing ${data.roadmapCountries.length} roadmap countries from Google Sheets`);

    // Create the ROADMAP_COUNTRIES Record object (coming soon only)
    let roadmapObject = 'const ROADMAP_COUNTRIES: Record<string, string> = {\n';

    // Group by launch date for better organization
    const byDate = {};
    data.roadmapCountries.forEach(item => {
      if (!byDate[item.launchDate]) {
        byDate[item.launchDate] = [];
      }
      byDate[item.launchDate].push(item.country);
    });

    // Generate the object entries grouped by date
    Object.entries(byDate).sort().forEach(([date, countries]) => {
      roadmapObject += `  // Coming ${date}\n`;
      countries.sort().forEach(country => {
        roadmapObject += `  "${country}": "${date}",\n`;
      });
    });

    roadmapObject += '}';

    // Find and replace ROADMAP_COUNTRIES (Global Payouts coming soon)
    const regex = /const ROADMAP_COUNTRIES: Record<string, string> = \{[^}]*\}/s;

    if (regex.test(content)) {
      content = content.replace(regex, roadmapObject);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`   ✓ Updated ROADMAP_COUNTRIES with ${data.roadmapCountries.length} coming soon countries`);
      console.log(`   → Organized across ${Object.keys(byDate).length} launch dates`);
      return true;
    }

    console.log('   ⚠️  Could not find ROADMAP_COUNTRIES to update in file');
    return false;
  } catch (error) {
    console.error('❌ Error updating recommendation-card.tsx:', error.message);
    return false;
  }
}

/**
 * Main sync function
 *
 * Data Source Priority:
 * - Stripe Docs (public URLs) = Source of truth for LIVE/current countries
 * - Google Sheets = Source for upcoming/coming soon roadmap countries only
 */
async function syncData() {
  console.log('🚀 Starting data sync...\n');
  console.log('📋 Data Source Strategy:');
  console.log('   • Stripe Docs → Live/current country data (manual verification recommended)');
  console.log('   • Google Sheets → Roadmap/coming soon countries (auto-updated)\n');

  // Fetch data from all sources
  const [stripeData, sheetsData] = await Promise.all([
    fetchStripePublicData(),
    fetchGoogleSheetsData(),
  ]);

  // Check if we got any data
  if (!stripeData && !sheetsData) {
    console.log('\n⚠️  No data fetched from any source. Exiting without changes.');
    process.exit(0);
  }

  // Log Stripe docs availability (for manual review)
  if (stripeData) {
    console.log('📄 Stripe Documentation Fetched:');
    if (stripeData.globalPayoutsCountries) {
      console.log('   ✓ Global Payouts countries page (review manually for live data)');
      console.log(`     URL: ${DATA_SOURCES.GLOBAL_PAYOUTS_COUNTRIES}`);
    }
    if (stripeData.pricing) {
      console.log('   ✓ Pricing information page (review manually for current fees)');
      console.log(`     URL: ${DATA_SOURCES.GLOBAL_PAYOUTS_PRICING}`);
    }
    if (stripeData.stablecoinInfo) {
      console.log('   ✓ Stablecoin documentation pages');
    }
    console.log('');
  }

  // Use Google Sheets data for roadmap updates
  const combinedData = {
    ...sheetsData,
  };

  // Update files (only roadmap data from Google Sheets)
  const results = [
    updateIntegrationDetails(combinedData),
    updateRecommendationCard(combinedData),
  ];

  // Check if any updates succeeded
  const success = results.some(result => result === true);

  if (success) {
    console.log('\n✅ Data sync completed successfully!');
    console.log('   Roadmap countries updated from Google Sheets.');
    console.log('   ⓘ  Remember to verify live countries against Stripe Docs manually.');
  } else {
    console.log('\n⚠️  Data sync completed but no files were updated.');
    console.log('   ⓘ  This may be normal if roadmap data hasn\'t changed.');
  }
}

// Run the sync
syncData().catch(error => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});
