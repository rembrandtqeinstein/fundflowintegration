#!/usr/bin/env node

/**
 * Data Sync Script
 * Fetches data from public sources and updates the application files
 * Runs monthly via GitHub Actions
 */

const fs = require('fs');
const path = require('path');

// Configuration
const DATA_SOURCES = {
  // Google Sheets - Replace GID with actual sheet GID
  GOOGLE_SHEETS_GLOBAL_PAYOUTS: 'https://docs.google.com/spreadsheets/d/1w7XrLsYUBDIjig2NKNYLnVA1fozxwnA54z_3g4NZWT4/export?format=csv&gid=0',

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
    const content = fs.readFileSync(filePath, 'utf8');

    // Log what data we have available
    if (data.roadmapCountries && data.roadmapCountries.length > 0) {
      console.log(`   → ${data.roadmapCountries.length} roadmap countries available`);
      console.log('   ℹ️  To enable updates, implement array replacement logic');
    }

    if (data.globalPayoutsCountries) {
      console.log('   → Global Payouts HTML fetched (needs parsing)');
    }

    if (data.pricing) {
      console.log('   → Pricing HTML fetched (needs parsing)');
    }

    // TODO: Implement logic to update the country arrays
    // Example approach:
    // 1. Find the GLOBAL_PAYOUTS_COUNTRIES array with regex
    // 2. Parse existing structure to understand format
    // 3. Generate new array with same format
    // 4. Replace old array with new one
    // 5. Preserve TypeScript types and formatting

    console.log('   ⚠️  File read successfully but updates not implemented yet');
    console.log('   → To enable: implement array replacement in updateIntegrationDetails()');

    // When ready to update, uncomment:
    // fs.writeFileSync(filePath, updatedContent, 'utf8');
    // console.log('   ✓ File updated successfully');

    return false; // Return true when actually updating
  } catch (error) {
    console.error('❌ Error updating integration-details.tsx:', error.message);
    return false;
  }
}

/**
 * Update recommendation-card.tsx with new roadmap data
 */
function updateRecommendationCard(data) {
  console.log('📝 Updating recommendation-card.tsx...');

  try {
    const filePath = FILES_TO_UPDATE.RECOMMENDATION_CARD;
    const content = fs.readFileSync(filePath, 'utf8');

    // Log what data we have available
    if (data.roadmapCountries && data.roadmapCountries.length > 0) {
      console.log(`   → ${data.roadmapCountries.length} roadmap countries available`);

      // Example of what we could do:
      // Group by launch date
      const byDate = {};
      data.roadmapCountries.forEach(item => {
        if (!byDate[item.launchDate]) byDate[item.launchDate] = [];
        byDate[item.launchDate].push(item.country);
      });

      console.log('   → Grouped by launch date:');
      Object.entries(byDate).forEach(([date, countries]) => {
        console.log(`      ${date}: ${countries.length} countries`);
      });
    }

    // TODO: Implement logic to update the roadmap objects
    // Example approach:
    // 1. Find ROADMAP_COUNTRIES const with regex
    // 2. Parse the TypeScript Record<string, string> structure
    // 3. Generate new object with same format
    // 4. Replace old object with new one
    // 5. Do the same for CONNECT_ROADMAP_COUNTRIES if needed

    console.log('   ⚠️  File read successfully but updates not implemented yet');
    console.log('   → To enable: implement object replacement in updateRecommendationCard()');

    // When ready to update, uncomment:
    // fs.writeFileSync(filePath, updatedContent, 'utf8');
    // console.log('   ✓ File updated successfully');

    return false; // Return true when actually updating
  } catch (error) {
    console.error('❌ Error updating recommendation-card.tsx:', error.message);
    return false;
  }
}

/**
 * Main sync function
 */
async function syncData() {
  console.log('🚀 Starting data sync...\n');

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

  // Combine data
  const combinedData = {
    ...stripeData,
    ...sheetsData,
  };

  // Update files
  const results = [
    updateIntegrationDetails(combinedData),
    updateRecommendationCard(combinedData),
  ];

  // Check if any updates succeeded
  const success = results.some(result => result === true);

  if (success) {
    console.log('\n✅ Data sync completed successfully!');
    console.log('   Files have been updated with latest data.');
  } else {
    console.log('\n⚠️  Data sync completed but no files were updated.');
  }
}

// Run the sync
syncData().catch(error => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});
