"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Globe, DollarSign, Users, ExternalLink, Sparkles, Coins, FileText, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface IntegrationDetailsProps {
  type: "global-payouts" | "connect"
}

// OFAC Sanctioned countries - USDC payouts prohibited
const PROHIBITED_COUNTRIES = [
  "Cuba",
  "Iran",
  "North Korea",
  "Syria",
  "Crimea Region of Ukraine",
  "Donetsk People's Republic",
  "Luhansk People's Republic",
  "Russia",
  "Belarus",
]

// New York is also excluded for US-based transactions
const US_EXCLUDED_REGIONS = ["New York"]

const GLOBAL_PAYOUTS_COUNTRIES = [
  { country: "Albania", currency: "ALL", crossBorderFee: "1.00%" },
  { country: "Algeria", currency: "DZD", crossBorderFee: "1.00%" },
  { country: "Armenia", currency: "AMD", crossBorderFee: "1.00%" },
  { country: "Australia", currency: "AUD", crossBorderFee: "1.00%" },
  { country: "Austria", currency: "EUR", crossBorderFee: "0% (Eurozone) / 0.25%" },
  { country: "Bahamas", currency: "BSD", crossBorderFee: "1.00%" },
  { country: "Belgium", currency: "EUR", crossBorderFee: "0% (Eurozone) / 0.25%" },
  { country: "Benin", currency: "XOF", crossBorderFee: "1.00%" },
  { country: "Bosnia and Herzegovina", currency: "BAM", crossBorderFee: "1.00%" },
  { country: "Botswana", currency: "BWP", crossBorderFee: "1.00%" },
  { country: "Brunei", currency: "BND", crossBorderFee: "1.00%" },
  { country: "Bulgaria", currency: "EUR", crossBorderFee: "1.00%" },
  { country: "Canada", currency: "CAD", crossBorderFee: "0.25%" },
  { country: "Côte d'Ivoire", currency: "XOF", crossBorderFee: "1.00%" },
  { country: "Croatia", currency: "EUR", crossBorderFee: "0% (Eurozone) / 0.25%" },
  { country: "Cyprus", currency: "EUR", crossBorderFee: "0% (Eurozone) / 0.25%" },
  { country: "Czech Republic", currency: "EUR", crossBorderFee: "0.25%" },
  { country: "Denmark", currency: "DKK", crossBorderFee: "0.50%" },
  { country: "Ecuador", currency: "USD", crossBorderFee: "1.00%" },
  { country: "El Salvador", currency: "USD", crossBorderFee: "1.00%" },
  { country: "Estonia", currency: "EUR", crossBorderFee: "0% (Eurozone) / 0.25%" },
  { country: "Ethiopia", currency: "ETB", crossBorderFee: "1.00%" },
  { country: "Finland", currency: "EUR", crossBorderFee: "0% (Eurozone) / 0.25%" },
  { country: "France", currency: "EUR", crossBorderFee: "0% (Eurozone) / 0.25%" },
  { country: "Germany", currency: "EUR", crossBorderFee: "0% (Eurozone) / 0.25%" },
  { country: "Greece", currency: "EUR", crossBorderFee: "0% (Eurozone) / 0.25%" },
  { country: "Guyana", currency: "GYD", crossBorderFee: "1.00%" },
  { country: "Hungary", currency: "HUF", crossBorderFee: "0.25%" },
  { country: "Iceland", currency: "EUR", crossBorderFee: "0.25%" },
  { country: "India", currency: "INR", crossBorderFee: "0.75%" },
  { country: "Indonesia", currency: "IDR", crossBorderFee: "0.50%" },
  { country: "Ireland", currency: "EUR", crossBorderFee: "0% (Eurozone) / 0.25%" },
  { country: "Israel", currency: "ILS", crossBorderFee: "0.50%" },
  { country: "Italy", currency: "EUR", crossBorderFee: "0% (Eurozone) / 0.25%" },
  { country: "Jamaica", currency: "JMD", crossBorderFee: "0.50%" },
  { country: "Jordan", currency: "JOD", crossBorderFee: "1.00%" },
  { country: "Kenya", currency: "KES", crossBorderFee: "0.75%" },
  { country: "Kuwait", currency: "KWD", crossBorderFee: "1.00%" },
  { country: "Latvia", currency: "EUR", crossBorderFee: "0% (Eurozone) / 0.25%" },
  { country: "Liechtenstein", currency: "EUR", crossBorderFee: "0.25%" },
  { country: "Lithuania", currency: "EUR", crossBorderFee: "0% (Eurozone) / 0.25%" },
  { country: "Luxembourg", currency: "EUR", crossBorderFee: "0% (Eurozone) / 0.25%" },
  { country: "Malta", currency: "EUR", crossBorderFee: "0% (Eurozone) / 0.25%" },
  { country: "Mauritius", currency: "MUR", crossBorderFee: "1.00%" },
  { country: "Mexico", currency: "MXN", crossBorderFee: "0.25%" },
  { country: "Mongolia", currency: "MNT", crossBorderFee: "1.00%" },
  { country: "Morocco", currency: "MAD", crossBorderFee: "0.50%" },
  { country: "Namibia", currency: "NAD", crossBorderFee: "1.00%" },
  { country: "Netherlands", currency: "EUR", crossBorderFee: "0% (Eurozone) / 0.25%" },
  { country: "New Zealand", currency: "NZD", crossBorderFee: "0.50%" },
  { country: "Norway", currency: "NOK", crossBorderFee: "0.25%" },
  { country: "Oman", currency: "OMR", crossBorderFee: "1.00%" },
  { country: "Panama", currency: "USD", crossBorderFee: "1.00%" },
  { country: "Philippines", currency: "PHP", crossBorderFee: "1.00%" },
  { country: "Poland", currency: "PLN", crossBorderFee: "0.50%" },
  { country: "Portugal", currency: "EUR", crossBorderFee: "0% (Eurozone) / 0.25%" },
  { country: "Romania", currency: "RON", crossBorderFee: "0.75%" },
  { country: "Senegal", currency: "XOF", crossBorderFee: "1.00%" },
  { country: "Serbia", currency: "RSD", crossBorderFee: "1.00%" },
  { country: "Singapore", currency: "SGD", crossBorderFee: "0.50%" },
  { country: "Slovakia", currency: "EUR", crossBorderFee: "0% (Eurozone) / 0.25%" },
  { country: "Slovenia", currency: "EUR", crossBorderFee: "0% (Eurozone) / 0.25%" },
  { country: "South Africa", currency: "ZAR", crossBorderFee: "0.50%" },
  { country: "Spain", currency: "EUR", crossBorderFee: "0% (Eurozone) / 0.25%" },
  { country: "Sri Lanka", currency: "LKR", crossBorderFee: "1.00%" },
  { country: "Sweden", currency: "SEK", crossBorderFee: "0.25%" },
  { country: "Switzerland", currency: "EUR", crossBorderFee: "0.25%" },
  { country: "Tanzania", currency: "TZS", crossBorderFee: "1.00%" },
  { country: "Tunisia", currency: "TND", crossBorderFee: "0.50%" },
  { country: "Turkey", currency: "TRY", crossBorderFee: "0.75%" },
  { country: "United Kingdom", currency: "GBP", crossBorderFee: "0.25%" },
  { country: "United States", currency: "USD", crossBorderFee: "0.25%" },

  // Coming January 26, 2026
  { country: "Antigua and Barbuda", currency: "XCD", crossBorderFee: "TBD", launchDate: "Jan 26, 2026" },
  { country: "Bahrain", currency: "BHD", crossBorderFee: "TBD", launchDate: "Jan 26, 2026" },
  { country: "Gambia", currency: "GMD", crossBorderFee: "TBD", launchDate: "Jan 26, 2026" },
  { country: "Hong Kong", currency: "HKD", crossBorderFee: "TBD", launchDate: "Jan 26, 2026" },
  { country: "Madagascar", currency: "MGA", crossBorderFee: "TBD", launchDate: "Jan 26, 2026" },
  { country: "Malaysia", currency: "MYR", crossBorderFee: "TBD", launchDate: "Jan 26, 2026" },
  { country: "Monaco", currency: "EUR", crossBorderFee: "TBD", launchDate: "Jan 26, 2026" },
  { country: "Qatar", currency: "QAR", crossBorderFee: "TBD", launchDate: "Jan 26, 2026" },
  { country: "Rwanda", currency: "RWF", crossBorderFee: "TBD", launchDate: "Jan 26, 2026" },
  { country: "Saint Lucia", currency: "XCD", crossBorderFee: "TBD", launchDate: "Jan 26, 2026" },
  { country: "Thailand", currency: "THB", crossBorderFee: "TBD", launchDate: "Jan 26, 2026" },
  { country: "Trinidad and Tobago", currency: "TTD", crossBorderFee: "TBD", launchDate: "Jan 26, 2026" },
  { country: "United Arab Emirates", currency: "AED", crossBorderFee: "TBD", launchDate: "Jan 26, 2026" },
  { country: "Vietnam", currency: "VND", crossBorderFee: "TBD", launchDate: "Jan 26, 2026" },

  // Coming February 26, 2026
  { country: "Bhutan", currency: "BTN", crossBorderFee: "TBD", launchDate: "Feb 26, 2026" },
  { country: "Cambodia", currency: "KHR", crossBorderFee: "TBD", launchDate: "Feb 26, 2026" },
  { country: "Costa Rica", currency: "CRC", crossBorderFee: "TBD", launchDate: "Feb 26, 2026" },
  { country: "Dominican Republic", currency: "DOP", crossBorderFee: "TBD", launchDate: "Feb 26, 2026" },
  { country: "Guatemala", currency: "GTQ", crossBorderFee: "TBD", launchDate: "Feb 26, 2026" },
  { country: "Macau", currency: "MOP", crossBorderFee: "TBD", launchDate: "Feb 26, 2026" },
  { country: "Moldova", currency: "MDL", crossBorderFee: "TBD", launchDate: "Feb 26, 2026" },
  { country: "Mozambique", currency: "MZN", crossBorderFee: "TBD", launchDate: "Feb 26, 2026" },
  { country: "North Macedonia", currency: "MKD", crossBorderFee: "TBD", launchDate: "Feb 26, 2026" },
  { country: "Pakistan", currency: "PKR", crossBorderFee: "TBD", launchDate: "Feb 26, 2026" },
  { country: "Peru", currency: "PEN", crossBorderFee: "TBD", launchDate: "Feb 26, 2026" },
  { country: "Taiwan", currency: "TWD", crossBorderFee: "TBD", launchDate: "Feb 26, 2026" },
  { country: "Uzbekistan", currency: "UZS", crossBorderFee: "TBD", launchDate: "Feb 26, 2026" },

  // Coming March 2026
  { country: "Angola", currency: "AOA", crossBorderFee: "TBD", launchDate: "Mar 2026" },
  { country: "Azerbaijan", currency: "AZN", crossBorderFee: "TBD", launchDate: "Mar 2026" },
  { country: "Gabon", currency: "XAF", crossBorderFee: "TBD", launchDate: "Mar 2026" },
  { country: "Kazakhstan", currency: "KZT", crossBorderFee: "TBD", launchDate: "Mar 2026" },
  { country: "Niger", currency: "XOF", crossBorderFee: "TBD", launchDate: "Mar 2026" },
  { country: "San Marino", currency: "EUR", crossBorderFee: "TBD", launchDate: "Mar 2026" },

  // Coming April 2026
  { country: "Japan", currency: "JPY", crossBorderFee: "TBD", launchDate: "Apr 2026" },
]

const CONNECT_REGIONS = [
  { region: "United States", canPayTo: "US, UK, EEA, Canada, Switzerland" },
  { region: "United Kingdom", canPayTo: "US, UK, EEA, Canada, Switzerland" },
  { region: "European Economic Area (EEA)", canPayTo: "US, UK, EEA, Canada, Switzerland" },
  { region: "Canada", canPayTo: "US, UK, EEA, Canada, Switzerland" },
  { region: "Switzerland", canPayTo: "US, UK, EEA, Canada, Switzerland" },
]

// USDC Connect Payouts - KR32 countries list
const USDC_CONNECT_RECIPIENT_COUNTRIES = [
  "Andorra",
  "Angola",
  "Anguilla",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Belize",
  "Bermuda",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brunei",
  "Cabo Verde",
  "Chile",
  "Colombia",
  "Comoros",
  "Cook Islands",
  "Costa Rica",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "East Timor (Timor-Leste)",
  "Ecuador",
  "Equatorial Guinea",
  "Eswatini",
  "Fiji",
  "Gabon",
  "Gambia",
  "Guatemala",
  "Guernsey",
  "Guinea",
  "Guyana",
  "Honduras",
  "Isle of Man",
  "Jersey",
  "Kazakhstan",
  "Kiribati",
  "Kyrgyzstan",
  "Lesotho",
  "Liberia",
  "Madagascar",
  "Malawi",
  "Maldives",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Micronesia",
  "Mongolia",
  "Montenegro",
  "Montserrat",
  "Nauru",
  "Oman",
  "Palau",
  "Pakistan",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Qatar",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Solomon Islands",
  "Sri Lanka",
  "Suriname",
  "Tajikistan",
  "Togo",
  "Tonga",
  "Turkmenistan",
  "Tuvalu",
  "Uruguay",
  "Vatican City (Holy See)",
  "Zambia",
]

export default function IntegrationDetails({ type }: IntegrationDetailsProps) {
  const [showCountries, setShowCountries] = useState(false)
  const [showPricing, setShowPricing] = useState(false)
  const [showRecipientOptions, setShowRecipientOptions] = useState(false)
  const [showUSDC, setShowUSDC] = useState(false)
  const [showDirectStablecoins, setShowDirectStablecoins] = useState(false)
  const [showExemptions, setShowExemptions] = useState(false)
  const [showLegacyStablecoin, setShowLegacyStablecoin] = useState(false)
  const [showUSDCConnect, setShowUSDCConnect] = useState(false)
  const [showRemoteAcquiring, setShowRemoteAcquiring] = useState(false)
  const [showFinancialAccountDistribution, setShowFinancialAccountDistribution] = useState(false)

  if (type === "global-payouts") {
    return (
      <div className="space-y-4 mt-6">
        {/* Supported Countries */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
          <button
            onClick={() => setShowCountries(!showCountries)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-700/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-cyan-400" />
              <div>
                <h4 className="font-semibold text-white">Supported Countries</h4>
                <p className="text-sm text-slate-400">92 countries with local currency payouts (58 live, 34 coming soon)</p>
              </div>
            </div>
            {showCountries ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>
          {showCountries && (
            <div className="border-t border-slate-700 p-4">
              <div className="mb-4 p-3 bg-blue-950/30 border border-blue-800/50 rounded-lg">
                <p className="text-sm text-blue-200">
                  <strong>Sender Countries:</strong> United States and United Kingdom (Public Preview)
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-2 px-3 text-slate-300 font-semibold">Country</th>
                      <th className="text-left py-2 px-3 text-slate-300 font-semibold">Currency</th>
                      <th className="text-left py-2 px-3 text-slate-300 font-semibold">Cross-Border Fee</th>
                      <th className="text-left py-2 px-3 text-slate-300 font-semibold">Launch Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {GLOBAL_PAYOUTS_COUNTRIES.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-700/20">
                        <td className="py-2 px-3 text-slate-300">{item.country}</td>
                        <td className="py-2 px-3 text-slate-400 font-mono text-xs">{item.currency}</td>
                        <td className="py-2 px-3 text-slate-400">{item.crossBorderFee}</td>
                        <td className="py-2 px-3 text-slate-400">
                          {item.launchDate ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-900/30 border border-purple-700/50 text-purple-300 text-xs rounded">
                              {item.launchDate}
                            </span>
                          ) : (
                            <span className="text-green-400">✓ Available</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 space-y-2">
                <a
                  href="https://docs.stripe.com/global-payouts/send-money"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300"
                >
                  View full country details <ExternalLink className="w-3 h-3" />
                </a>
                <br />
                <a
                  href="https://admin.corp.stripe.com/horizon-outbound-flows/outbound-payments-config"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300"
                >
                  Complete list of countries and payout methods for Global Payouts <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
          <button
            onClick={() => setShowPricing(!showPricing)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-700/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-green-400" />
              <div>
                <h4 className="font-semibold text-white">Pricing</h4>
                <p className="text-sm text-slate-400">Fees for funding and sending money</p>
              </div>
            </div>
            {showPricing ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>
          {showPricing && (
            <div className="border-t border-slate-700 p-4 space-y-4">
              <div>
                <h5 className="text-sm font-semibold text-slate-300 mb-2">Funding Your Account</h5>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 px-3 bg-slate-900/50 rounded">
                    <span className="text-slate-300">ACH (US only)</span>
                    <span className="text-green-400 font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between py-2 px-3 bg-slate-900/50 rounded">
                    <span className="text-slate-300">FPS (UK only)</span>
                    <span className="text-green-400 font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between py-2 px-3 bg-slate-900/50 rounded">
                    <span className="text-slate-300">Wire (US only)</span>
                    <span className="text-slate-400">$2.00 per wire</span>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-semibold text-slate-300 mb-2">Sending Money</h5>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 px-3 bg-slate-900/50 rounded">
                    <span className="text-slate-300">Local bank transfers (US)</span>
                    <span className="text-slate-400">$1.50 per payout</span>
                  </div>
                  <div className="flex justify-between py-2 px-3 bg-slate-900/50 rounded">
                    <span className="text-slate-300">Local bank transfers (UK)</span>
                    <span className="text-slate-400">£0.50 per payout</span>
                  </div>
                  <div className="flex justify-between py-2 px-3 bg-slate-900/50 rounded">
                    <span className="text-slate-300">Local bank transfers (Eurozone)</span>
                    <span className="text-slate-400">€0.30 per payout</span>
                  </div>
                  <div className="flex justify-between py-2 px-3 bg-slate-900/50 rounded">
                    <span className="text-slate-300">Wires (US only)</span>
                    <span className="text-slate-400">$25 per wire</span>
                  </div>
                  <div className="flex justify-between py-2 px-3 bg-slate-900/50 rounded">
                    <span className="text-slate-300">Debit card / Instant (US only)</span>
                    <span className="text-slate-400">$1.50 + 0.75% (min $2)</span>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-semibold text-slate-300 mb-2">Cross-Border Fees</h5>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 px-3 bg-slate-900/50 rounded">
                    <span className="text-slate-300">Cross-border fee</span>
                    <span className="text-slate-400">0.25% - 1.25%</span>
                  </div>
                  <div className="flex justify-between py-2 px-3 bg-slate-900/50 rounded">
                    <span className="text-slate-300">Intra-Eurozone transfers</span>
                    <span className="text-green-400 font-semibold">0%</span>
                  </div>
                  <div className="flex justify-between py-2 px-3 bg-slate-900/50 rounded">
                    <span className="text-slate-300">FX fee (USD/EUR/GBP)</span>
                    <span className="text-slate-400">0.50%</span>
                  </div>
                  <div className="flex justify-between py-2 px-3 bg-slate-900/50 rounded">
                    <span className="text-slate-300">FX fee (other currencies - US)</span>
                    <span className="text-slate-400">1%</span>
                  </div>
                  <div className="flex justify-between py-2 px-3 bg-slate-900/50 rounded">
                    <span className="text-slate-300">FX fee (other currencies - UK)</span>
                    <span className="text-slate-400">2%</span>
                  </div>
                </div>
              </div>

              <a
                href="https://docs.stripe.com/global-payouts/pricing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300"
              >
                View full pricing details <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Recipient Creation Options */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
          <button
            onClick={() => setShowRecipientOptions(!showRecipientOptions)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-700/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-purple-400" />
              <div>
                <h4 className="font-semibold text-white">Recipient Creation Options</h4>
                <p className="text-sm text-slate-400">Ways to onboard recipients</p>
              </div>
            </div>
            {showRecipientOptions ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>
          {showRecipientOptions && (
            <div className="border-t border-slate-700 p-4 space-y-4">
              <div className="grid gap-4">
                <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-green-900/50 text-green-400 text-xs font-medium rounded">
                      No Code
                    </span>
                  </div>
                  <h5 className="font-semibold text-white mb-1">Manual / Dashboard</h5>
                  <p className="text-sm text-slate-400">
                    Enter recipient data in the Dashboard or send a link to Stripe-hosted forms.
                  </p>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-yellow-900/50 text-yellow-400 text-xs font-medium rounded">
                      Some Code
                    </span>
                  </div>
                  <h5 className="font-semibold text-white mb-1">Stripe-Hosted Forms (API)</h5>
                  <p className="text-sm text-slate-400">
                    Programmatically generate links to localized Stripe-hosted forms with your branding.
                  </p>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-blue-900/50 text-blue-400 text-xs font-medium rounded">
                      Code Required
                    </span>
                  </div>
                  <h5 className="font-semibold text-white mb-1">Full API Integration</h5>
                  <p className="text-sm text-slate-400">
                    Build your own forms with full control over the UI. You handle localization and validation.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-amber-950/30 border border-amber-800/50 rounded-lg">
                <p className="text-sm text-amber-200">
                  <strong>Note:</strong> Stripe-hosted forms support 34 languages and automatically update for new
                  compliance requirements.
                </p>
              </div>

              <a
                href="https://docs.stripe.com/global-payouts/recipient-creation-options"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300"
              >
                View recipient creation docs <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* USDC Global Payouts - Coming Soon */}
        <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-lg overflow-hidden">
          <button
            onClick={() => setShowUSDC(!showUSDC)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-purple-700/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-white">USDC Global Payouts</h4>
                  <span className="px-2 py-0.5 bg-purple-600/50 text-purple-200 text-xs font-medium rounded">
                    May 2025
                  </span>
                </div>
                <p className="text-sm text-slate-400">Pay out in USDC from US / EU to global recipients</p>
              </div>
            </div>
            {showUSDC ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>
          {showUSDC && (
            <div className="border-t border-purple-500/30 p-4 space-y-4">
              <div className="p-3 bg-purple-950/30 border border-purple-800/50 rounded-lg">
                <p className="text-sm text-purple-200">
                  <strong>Source Countries:</strong> United States and European Union
                </p>
                <p className="text-sm text-purple-200 mt-1">
                  <strong>Destination:</strong> All countries not on the OFAC sanctions list
                </p>
              </div>

              <div>
                <h5 className="text-sm font-semibold text-slate-300 mb-2">Prohibited Destinations (OFAC Sanctioned)</h5>
                <div className="flex flex-wrap gap-2">
                  {PROHIBITED_COUNTRIES.map((country) => (
                    <span
                      key={country}
                      className="px-2 py-1 bg-red-950/50 border border-red-800/50 text-red-300 text-xs rounded"
                    >
                      {country}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="text-sm font-semibold text-slate-300 mb-2">US Regional Exclusions</h5>
                <div className="flex flex-wrap gap-2">
                  {US_EXCLUDED_REGIONS.map((region) => (
                    <span
                      key={region}
                      className="px-2 py-1 bg-amber-950/50 border border-amber-800/50 text-amber-300 text-xs rounded"
                    >
                      {region}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Businesses with principal residential or operating addresses in New York are excluded.
                </p>
              </div>

              <div>
                <h5 className="text-sm font-semibold text-slate-300 mb-2">Pricing</h5>
                <div className="p-3 bg-slate-900/50 rounded-lg">
                  <span className="text-slate-400 italic">TBD - Pricing to be announced</span>
                </div>
              </div>

              <div className="p-3 bg-blue-950/30 border border-blue-800/50 rounded-lg">
                <p className="text-sm text-blue-200">
                  <strong>Supported Rails:</strong> ACH (USD), Wire (USD), SEPA (EUR), SPEI (MXN), Pix (BRL - Beta), and
                  more coming soon.
                </p>
              </div>

              <a
                href="https://apidocs.bridge.xyz/get-started/introduction/what-we-support/payment-routes"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300"
              >
                View Bridge payment routes <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* For Direct Users - Stablecoins in Financial Accounts */}
        <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border border-emerald-500/30 rounded-lg overflow-hidden">
          <button
            onClick={() => setShowDirectStablecoins(!showDirectStablecoins)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-emerald-700/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Coins className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-white">Stablecoins in Financial Accounts</h4>
                  <span className="px-2 py-0.5 bg-emerald-600/50 text-emerald-200 text-xs font-medium rounded">
                    For Direct Users
                  </span>
                </div>
                <p className="text-sm text-slate-400">Receive, store, and send stablecoins using Financial Accounts</p>
              </div>
            </div>
            {showDirectStablecoins ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>
          {showDirectStablecoins && (
            <div className="border-t border-emerald-500/30 p-4 space-y-4">
              <div className="p-3 bg-emerald-950/30 border border-emerald-800/50 rounded-lg">
                <p className="text-sm text-emerald-200">
                  <strong>Available in:</strong> 100+ countries globally
                </p>
              </div>

              <div>
                <h5 className="text-sm font-semibold text-slate-300 mb-2">Key Features</h5>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400">•</span>
                    <span>Add funds from bank account or crypto wallet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400">•</span>
                    <span>Set up automatic recurring transfers from payments balance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400">•</span>
                    <span>Transfer to external bank accounts or crypto wallets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400">•</span>
                    <span>Pay out to other people or businesses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400">•</span>
                    <span>Create cards backed by stablecoins (Private Preview - US + 100 intl markets)</span>
                  </li>
                </ul>
              </div>

              <div>
                <h5 className="text-sm font-semibold text-slate-300 mb-2">Supported Currencies</h5>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-2 px-3 text-slate-300 font-semibold">Currency</th>
                        <th className="text-left py-2 px-3 text-slate-300 font-semibold">Networks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      <tr>
                        <td className="py-2 px-3 text-slate-300 font-medium">USDC</td>
                        <td className="py-2 px-3 text-slate-400">Arbitrum, Avalanche, Base, Ethereum, Optimism, Polygon, Solana, Stellar</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-slate-300 font-medium">USD (US only)</td>
                        <td className="py-2 px-3 text-slate-400">ACH, Wire transfer</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-slate-300 font-medium">EUR (US only)</td>
                        <td className="py-2 px-3 text-slate-400">SEPA</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-3 bg-blue-950/30 border border-blue-800/50 rounded-lg">
                <p className="text-sm text-blue-200">
                  <strong>Custody:</strong> Bridge (a Stripe company) acts as custodian. Balances held in USDC (Circle) or USDB (Bridge), both pegged 1:1 to USD.
                </p>
              </div>

              <a
                href="https://docs.stripe.com/financial-accounts/stablecoins"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300"
              >
                View Financial Accounts stablecoins docs <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Exemptions Link */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
          <button
            onClick={() => setShowExemptions(!showExemptions)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-700/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-amber-400" />
              <div>
                <h4 className="font-semibold text-white">Licensing & Exemptions</h4>
                <p className="text-sm text-slate-400">Stored value guidelines and supportability reference</p>
              </div>
            </div>
            {showExemptions ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>
          {showExemptions && (
            <div className="border-t border-slate-700 p-4 space-y-4">
              <p className="text-sm text-slate-300">
                Understanding licensing requirements and exemptions is critical for stored value products and certain payout scenarios.
              </p>
              <Link
                href="/exemptions"
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 rounded-lg transition-colors"
              >
                View Exemptions & Stored Value Guidelines
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Connect details
  return (
    <div className="space-y-4 mt-6">
      {/* Supported Regions */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
        <button
          onClick={() => setShowCountries(!showCountries)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-700/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-cyan-400" />
            <div>
              <h4 className="font-semibold text-white">Cross-Border Payout Regions</h4>
              <p className="text-sm text-slate-400">Supported platform and recipient locations</p>
            </div>
          </div>
          {showCountries ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>
        {showCountries && (
          <div className="border-t border-slate-700 p-4">
            <div className="mb-4 p-3 bg-blue-950/30 border border-blue-800/50 rounded-lg">
              <p className="text-sm text-blue-200">
                Platforms in US, UK, EEA, Canada, and Switzerland can transfer funds to connected accounts in any of
                these same regions.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-2 px-3 text-slate-300 font-semibold">Platform Region</th>
                    <th className="text-left py-2 px-3 text-slate-300 font-semibold">Can Pay Out To</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {CONNECT_REGIONS.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-700/20">
                      <td className="py-2 px-3 text-slate-300">{item.region}</td>
                      <td className="py-2 px-3 text-slate-400">{item.canPayTo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-3 bg-amber-950/30 border border-amber-800/50 rounded-lg">
              <p className="text-sm text-amber-200">
                <strong>Note:</strong> For countries outside these regions, contact Stripe Sales for alternatives.
              </p>
            </div>
            <a
              href="https://docs.stripe.com/connect/cross-border-payouts"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300"
            >
              View full cross-border details <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>

      {/* Pricing */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
        <button
          onClick={() => setShowPricing(!showPricing)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-700/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-green-400" />
            <div>
              <h4 className="font-semibold text-white">Pricing</h4>
              <p className="text-sm text-slate-400">Cross-border payout fees</p>
            </div>
          </div>
          {showPricing ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>
        {showPricing && (
          <div className="border-t border-slate-700 p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between py-2 px-3 bg-slate-900/50 rounded">
                <span className="text-slate-300">Cross-border payout fee</span>
                <span className="text-slate-400">0.25%</span>
              </div>
              <div className="flex justify-between py-2 px-3 bg-slate-900/50 rounded">
                <span className="text-slate-300">UK to EEA / EEA to UK</span>
                <span className="text-green-400 font-semibold">0% (waived)</span>
              </div>
              <div className="flex justify-between py-2 px-3 bg-slate-900/50 rounded">
                <span className="text-slate-300">Within EEA</span>
                <span className="text-green-400 font-semibold">0% (waived)</span>
              </div>
            </div>

            <a
              href="https://docs.stripe.com/connect/cross-border-payouts"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300"
            >
              View pricing details <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>

      {/* Supported Funds Flows */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
        <button
          onClick={() => setShowRecipientOptions(!showRecipientOptions)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-700/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-purple-400" />
            <div>
              <h4 className="font-semibold text-white">Supported Funds Flows</h4>
              <p className="text-sm text-slate-400">Charge types and transfer patterns</p>
            </div>
          </div>
          {showRecipientOptions ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>
        {showRecipientOptions && (
          <div className="border-t border-slate-700 p-4 space-y-4">
            <div className="grid gap-4">
              <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                <h5 className="font-semibold text-white mb-1">Separate Charges and Transfers</h5>
                <p className="text-sm text-slate-400">
                  Create charges on your platform, then transfer funds to connected accounts separately.
                </p>
                <span className="mt-2 inline-block text-xs text-amber-400">Without on_behalf_of</span>
              </div>

              <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                <h5 className="font-semibold text-white mb-1">Destination Charges</h5>
                <p className="text-sm text-slate-400">
                  Create charges on behalf of connected accounts with automatic fund routing.
                </p>
                <span className="mt-2 inline-block text-xs text-amber-400">Without on_behalf_of</span>
              </div>

              <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                <h5 className="font-semibold text-white mb-1">Top-ups and Transfers</h5>
                <p className="text-sm text-slate-400">
                  Add funds to your Stripe balance and transfer to connected accounts.
                </p>
              </div>
            </div>

            <div className="p-3 bg-amber-950/30 border border-amber-800/50 rounded-lg">
              <p className="text-sm text-amber-200">
                <strong>Requirement:</strong> You must use the Full service agreement for your connected accounts. For
                Recipient Service Agreement, use Global Payouts instead.
              </p>
            </div>

            <div className="space-y-2">
              <a
                href="https://docs.stripe.com/connect/charges"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300"
              >
                View charge types documentation <ExternalLink className="w-3 h-3" />
              </a>
              <br />
              <a
                href="https://admin.corp.stripe.com/horizon-outbound-flows/outbound-payments-config"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300"
              >
                Complete list of countries and payout methods for Connect <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* USDC Connect Payouts - Coming Soon */}
      <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-lg overflow-hidden">
        <button
          onClick={() => setShowUSDCConnect(!showUSDCConnect)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-purple-700/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-white">USDC Connect Payouts</h4>
                <span className="px-2 py-0.5 bg-purple-600/50 text-purple-200 text-xs font-medium rounded">
                  Q1-Q2 2026
                </span>
              </div>
              <p className="text-sm text-slate-400">Pay out in USDC from US / EU platforms to global connected accounts</p>
            </div>
          </div>
          {showUSDCConnect ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>
        {showUSDCConnect && (
          <div className="border-t border-purple-500/30 p-4 space-y-4">
            <div className="p-3 bg-purple-950/30 border border-purple-800/50 rounded-lg">
              <p className="text-sm text-purple-200">
                <strong>Platform Countries:</strong> United States and European Union
              </p>
              <p className="text-sm text-purple-200 mt-1">
                <strong>Recipient Countries:</strong> 84 countries globally (see list below)
              </p>
            </div>

            <div>
              <h5 className="text-sm font-semibold text-slate-300 mb-2">Supported Recipient Countries ({USDC_CONNECT_RECIPIENT_COUNTRIES.length})</h5>
              <div className="max-h-64 overflow-y-auto bg-slate-900/50 rounded-lg p-3">
                <div className="flex flex-wrap gap-2">
                  {USDC_CONNECT_RECIPIENT_COUNTRIES.map((country) => (
                    <span
                      key={country}
                      className="px-2 py-1 bg-purple-950/50 border border-purple-800/50 text-purple-300 text-xs rounded"
                    >
                      {country}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h5 className="text-sm font-semibold text-slate-300 mb-2">Prohibited Destinations (OFAC Sanctioned)</h5>
              <div className="flex flex-wrap gap-2">
                {PROHIBITED_COUNTRIES.map((country) => (
                  <span
                    key={country}
                    className="px-2 py-1 bg-red-950/50 border border-red-800/50 text-red-300 text-xs rounded"
                  >
                    {country}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-sm font-semibold text-slate-300 mb-2">US Regional Exclusions</h5>
              <div className="flex flex-wrap gap-2">
                {US_EXCLUDED_REGIONS.map((region) => (
                  <span
                    key={region}
                    className="px-2 py-1 bg-amber-950/50 border border-amber-800/50 text-amber-300 text-xs rounded"
                  >
                    {region}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Businesses with principal residential or operating addresses in New York are excluded.
              </p>
            </div>

            <div>
              <h5 className="text-sm font-semibold text-slate-300 mb-2">Pricing</h5>
              <div className="p-3 bg-slate-900/50 rounded-lg">
                <span className="text-slate-400 italic">TBD - Pricing to be announced</span>
              </div>
            </div>

            <div className="p-3 bg-blue-950/30 border border-blue-800/50 rounded-lg">
              <p className="text-sm text-blue-200">
                <strong>How it works:</strong> US/EU platforms can onboard connected accounts in the supported countries and transfer funds in USDC using Connect's cross-border payout capabilities.
              </p>
            </div>

            <a
              href="https://docs.stripe.com/connect/cross-border-payouts"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300"
            >
              View Connect cross-border docs <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>

      {/* Legacy Connect Stablecoin Payouts */}
      <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 border border-amber-500/30 rounded-lg overflow-hidden">
        <button
          onClick={() => setShowLegacyStablecoin(!showLegacyStablecoin)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-amber-700/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-white">Legacy Connect Stablecoin Payouts</h4>
                <span className="px-2 py-0.5 bg-amber-600/50 text-amber-200 text-xs font-medium rounded">
                  Private Preview
                </span>
              </div>
              <p className="text-sm text-slate-400">Enable stablecoin payouts on your platform (being replaced)</p>
            </div>
          </div>
          {showLegacyStablecoin ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>
        {showLegacyStablecoin && (
          <div className="border-t border-amber-500/30 p-4 space-y-4">
            <div className="p-3 bg-amber-950/50 border border-amber-700/50 rounded-lg">
              <p className="text-sm text-amber-200">
                <strong>Notice:</strong> This solution will soon be replaced by a compliant solution. See internal documentation for migration details.
              </p>
            </div>

            <div>
              <h5 className="text-sm font-semibold text-slate-300 mb-2">How It Works</h5>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">1.</span>
                  <span>Platform balance stays in fiat currency</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">2.</span>
                  <span>Users link crypto wallet via Express Dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">3.</span>
                  <span>Stripe handles conversion and payout in USDC</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">4.</span>
                  <span>Transfers in USD automatically convert to recipients' preferred currency</span>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-sm font-semibold text-slate-300 mb-2">Limitations</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>Only US Connect platforms can make stablecoin payouts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>Only individuals/sole proprietors in supported countries (no companies/non-profits)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>Requires Express Dashboard access for recipients</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>Must use Transfers API</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://docs.stripe.com/connect/stablecoin-payouts"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300"
              >
                View stablecoin payouts docs <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://home.corp.stripe.com/compass/projects/stablecoins-on-connect-marketplaces/resources"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300"
              >
                View compliant solution (Internal) <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Remote Acquiring - Coming Soon */}
      <div className="bg-gradient-to-br from-indigo-900/30 to-violet-900/30 border border-indigo-500/30 rounded-lg overflow-hidden">
        <button
          onClick={() => setShowRemoteAcquiring(!showRemoteAcquiring)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-indigo-700/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-white">Remote Acquiring</h4>
                <span className="px-2 py-0.5 bg-indigo-600/50 text-indigo-200 text-xs font-medium rounded">
                  Coming Soon
                </span>
              </div>
              <p className="text-sm text-slate-400">Direct charges to locations where Stripe can't acquire today</p>
            </div>
          </div>
          {showRemoteAcquiring ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>
        {showRemoteAcquiring && (
          <div className="border-t border-indigo-500/30 p-4 space-y-4">
            <div className="p-3 bg-indigo-950/30 border border-indigo-800/50 rounded-lg">
              <p className="text-sm text-indigo-200">
                <strong>Overview:</strong> Remote Acquiring enables platforms to process Direct Charges in countries where Stripe doesn't currently have acquiring capabilities, such as Argentina.
              </p>
            </div>

            <div>
              <h5 className="text-sm font-semibold text-slate-300 mb-2">Key Benefits</h5>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400">•</span>
                  <span>Expand to new markets without local acquiring infrastructure</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400">•</span>
                  <span>Process Direct Charges in regions like Argentina</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400">•</span>
                  <span>Seamless integration with existing Connect implementation</span>
                </li>
              </ul>
            </div>

            <div className="p-3 bg-blue-950/30 border border-blue-800/50 rounded-lg">
              <p className="text-sm text-blue-200">
                <strong>Questions?</strong> Reach out to <span className="font-mono text-cyan-300">@hernanherrera</span> on Slack for more information about Remote Acquiring.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Financial Account Distribution - Coming Soon */}
      <div className="bg-gradient-to-br from-teal-900/30 to-emerald-900/30 border border-teal-500/30 rounded-lg overflow-hidden">
        <button
          onClick={() => setShowFinancialAccountDistribution(!showFinancialAccountDistribution)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-teal-700/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Coins className="w-5 h-5 text-teal-400" />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-white">Financial Account Distribution</h4>
                <span className="px-2 py-0.5 bg-teal-600/50 text-teal-200 text-xs font-medium rounded">
                  Coming Soon
                </span>
              </div>
              <p className="text-sm text-slate-400">Distribute Financial Accounts to Connected Accounts for money management</p>
            </div>
          </div>
          {showFinancialAccountDistribution ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>
        {showFinancialAccountDistribution && (
          <div className="border-t border-teal-500/30 p-4 space-y-4">
            <div className="p-3 bg-teal-950/30 border border-teal-800/50 rounded-lg">
              <p className="text-sm text-teal-200">
                <strong>Available for:</strong> EU, UK, and US Platforms
              </p>
              <p className="text-sm text-teal-200 mt-1">
                <strong>Use Case:</strong> Platforms that want to offer their Connected Accounts money management capabilities
              </p>
            </div>

            <div>
              <h5 className="text-sm font-semibold text-slate-300 mb-2">Key Features</h5>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-teal-400">•</span>
                  <span>Enable Connected Accounts to hold and manage funds in Financial Accounts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-400">•</span>
                  <span>Offer money management capabilities directly to your connected users</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-400">•</span>
                  <span>Support for EU/UK interoperability and treasury features</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-400">•</span>
                  <span>Build differentiated financial services on your platform</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://home.corp.stripe.com/compass/projects/eu-uk-interoperability-for-treasury"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300"
              >
                View Compass project <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://docs.corp.stripe.com/money-management"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300"
              >
                View Money Management docs <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
