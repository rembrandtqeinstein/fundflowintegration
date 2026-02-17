"use client"

import { useState } from "react"
import { CheckCircle2, ExternalLink, AlertTriangle, CheckCircle, XCircle, Info, ChevronDown, ChevronUp } from "lucide-react"
import IntegrationDetails from "./integration-details"

// Global Payouts recipient countries
const GLOBAL_PAYOUTS_RECIPIENT_COUNTRIES = [
  "Albania", "Algeria", "Armenia", "Australia", "Austria", "Bahamas", "Belgium", "Benin",
  "Bosnia and Herzegovina", "Botswana", "Brunei", "Bulgaria", "Canada", "Côte d'Ivoire",
  "Croatia", "Cyprus", "Czech Republic", "Denmark", "Ecuador", "El Salvador", "Estonia",
  "Ethiopia", "Finland", "France", "Germany", "Greece", "Guyana", "Hungary", "Iceland",
  "India", "Indonesia", "Ireland", "Israel", "Italy", "Jamaica", "Jordan", "Kenya", "Kuwait",
  "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malta", "Mauritius", "Mexico",
  "Mongolia", "Morocco", "Namibia", "Netherlands", "New Zealand", "Norway", "Oman", "Panama",
  "Philippines", "Poland", "Portugal", "Romania", "Senegal", "Serbia", "Singapore", "Slovakia",
  "Slovenia", "South Africa", "Spain", "Sri Lanka", "Sweden", "Switzerland", "Tanzania",
  "Tunisia", "Turkey", "United Kingdom", "United States"
]

// Roadmap countries - coming soon to Global Payouts
const ROADMAP_COUNTRIES: Record<string, string> = {
  // Coming January 26, 2026
  "Antigua and Barbuda": "Jan 26, 2026",
  "Bahrain": "Jan 26, 2026",
  "Belize": "Jan 26, 2026",
  "Cayman Islands": "Jan 26, 2026",
  "Gambia": "Jan 26, 2026",
  "Honduras": "Jan 26, 2026",
  "Maldives": "Jan 26, 2026",
  "Mozambique": "Jan 26, 2026",
  "Nicaragua": "Jan 26, 2026",
  "Papua New Guinea": "Jan 26, 2026",
  "Saint Lucia": "Jan 26, 2026",
  "Seychelles": "Jan 26, 2026",
  "Suriname": "Jan 26, 2026",
  "Zimbabwe": "Jan 26, 2026",
  // Coming February 26, 2026
  "Bhutan": "Feb 26, 2026",
  "Cambodia": "Feb 26, 2026",
  "Dominican Republic": "Feb 26, 2026",
  "Equatorial Guinea": "Feb 26, 2026",
  "Fiji": "Feb 26, 2026",
  "Grenada": "Feb 26, 2026",
  "Kyrgyzstan": "Feb 26, 2026",
  "Lebanon": "Feb 26, 2026",
  "Lesotho": "Feb 26, 2026",
  "Malawi": "Feb 26, 2026",
  "Sao Tome and Principe": "Feb 26, 2026",
  "Solomon Islands": "Feb 26, 2026",
  "Tonga": "Feb 26, 2026",
  // Coming March 2026
  "Angola": "Mar 2026",
  "Cameroon": "Mar 2026",
  "Ghana": "Mar 2026",
  "Nigeria": "Mar 2026",
  "Rwanda": "Mar 2026",
  "Uganda": "Mar 2026",
  // Coming April 2026
  "Japan": "Apr 2026"
}

// Global Payouts sender countries (where platform must be based)
const GLOBAL_PAYOUTS_SENDER_COUNTRIES = ["United States", "United Kingdom"]

// Connect cross-border payout supported regions
const CONNECT_SUPPORTED_REGIONS = [
  "United States", "United Kingdom", "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus",
  "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary",
  "Ireland", "Italy", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malta", "Netherlands",
  "Norway", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden",
  "Canada", "Switzerland"
]

// Connect USDC Payouts - Coming Soon
const CONNECT_ROADMAP_COUNTRIES = [
  "Andorra", "Angola", "Anguilla", "Antigua and Barbuda", "Argentina", "Armenia", "Azerbaijan",
  "Bahamas", "Bahrain", "Belize", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina",
  "Botswana", "Brunei", "Cabo Verde", "Chile", "Colombia", "Comoros", "Cook Islands", "Costa Rica",
  "Djibouti", "Dominica", "Dominican Republic", "East Timor (Timor-Leste)", "Ecuador",
  "Equatorial Guinea", "Eswatini", "Fiji", "Gabon", "Gambia", "Guatemala", "Guernsey", "Guinea",
  "Guyana", "Honduras", "Isle of Man", "Jersey", "Kazakhstan", "Kiribati", "Kyrgyzstan", "Lesotho",
  "Liberia", "Madagascar", "Malawi", "Maldives", "Marshall Islands", "Mauritania", "Mauritius",
  "Micronesia", "Mongolia", "Montenegro", "Montserrat", "Nauru", "Oman", "Palau", "Pakistan",
  "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Qatar", "Saint Kitts and Nevis",
  "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
  "Saudi Arabia", "Serbia", "Seychelles", "Sierra Leone", "Solomon Islands", "Sri Lanka", "Suriname",
  "Tajikistan", "Togo", "Tonga", "Turkmenistan", "Tuvalu", "Uruguay", "Vatican City (Holy See)", "Zambia"
]

// Region to country mappings
const REGION_COUNTRIES: Record<string, string[]> = {
  "EMEA": [
    // EU & EEA
    "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark",
    "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Iceland", "Ireland",
    "Italy", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malta", "Netherlands",
    "Norway", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden",
    // UK and territories
    "United Kingdom", "Gibraltar",
    // Russia
    "Russia",
    // Middle East
    "Armenia", "Israel", "Jordan", "Kuwait", "Oman", "Turkey", "United Arab Emirates",
    // Other European
    "Albania", "Bosnia and Herzegovina", "Serbia", "Switzerland"
  ],
  "APAC": [
    // Asia
    "Armenia", "Brunei", "China", "Hong Kong", "India", "Indonesia", "Japan", "Malaysia",
    "Mongolia", "Philippines", "Singapore", "South Korea", "Sri Lanka", "Taiwan", "Thailand",
    "Vietnam",
    // Pacific
    "Australia", "New Zealand"
  ],
  "North America": ["Canada", "United States"],
  "LATAM": [
    // Mexico and Central America
    "Mexico", "Belize", "Costa Rica", "El Salvador", "Guatemala", "Honduras", "Nicaragua", "Panama",
    // Caribbean
    "Bahamas", "Jamaica", "Dominican Republic", "Puerto Rico", "Trinidad and Tobago",
    // South America
    "Argentina", "Bolivia", "Brazil", "Chile", "Colombia", "Ecuador", "Guyana", "Paraguay",
    "Peru", "Suriname", "Uruguay", "Venezuela"
  ],
  "Africa": [
    "Algeria", "Benin", "Botswana", "Cameroon", "Côte d'Ivoire", "Egypt", "Ethiopia",
    "Ghana", "Kenya", "Mauritius", "Morocco", "Namibia", "Nigeria", "Rwanda", "Senegal",
    "South Africa", "Tanzania", "Tunisia", "Uganda", "Zimbabwe"
  ]
}

interface RecommendationCardProps {
  recommendation: {
    integration: string
    description: string
    useCases: string[]
    keyBenefits: string[]
    docsLink?: string
    integrationType?: "global-payouts" | "connect"
    implementationNote?: string
  }
  onRestart: () => void
  answers: Record<string, boolean | string | string[] | null>
}

function getMarketAvailability(
  integrationType: "global-payouts" | "connect" | undefined,
  country: string | null
): { status: "supported" | "partial" | "unsupported" | "unknown"; message: string; details?: string } {
  if (!country || country === "Other") {
    return {
      status: "unknown",
      message: "Market availability unknown",
      details: "Please contact your Stripe representative to verify availability in your region."
    }
  }

  if (integrationType === "global-payouts") {
    const canSend = GLOBAL_PAYOUTS_SENDER_COUNTRIES.includes(country)
    const canReceive = GLOBAL_PAYOUTS_RECIPIENT_COUNTRIES.includes(country)

    if (canSend) {
      return {
        status: "supported",
        message: `Global Payouts is available in ${country}`,
        details: `As a sender country, you can pay out to 58+ recipient countries from ${country}.`
      }
    } else if (canReceive) {
      return {
        status: "partial",
        message: `${country} is supported as a recipient country only`,
        details: "Global Payouts can send funds TO this country, but cannot be used to send FROM this country. Sender countries are currently limited to US and UK."
      }
    } else {
      return {
        status: "unsupported",
        message: `Global Payouts is not yet available in ${country}`,
        details: "This country is not currently supported as a sender or recipient. Please contact Stripe for future availability."
      }
    }
  }

  if (integrationType === "connect") {
    const isSupported = CONNECT_SUPPORTED_REGIONS.includes(country)

    if (isSupported) {
      return {
        status: "supported",
        message: `Connect cross-border payouts is available in ${country}`,
        details: "You can make cross-border payouts to connected accounts in US, UK, EEA, Canada, and Switzerland."
      }
    } else {
      return {
        status: "unsupported",
        message: `Connect cross-border payouts is not available in ${country}`,
        details: "Cross-border payouts are currently supported for platforms in US, UK, EEA, Canada, and Switzerland only."
      }
    }
  }

  return {
    status: "unknown",
    message: "Market availability unknown",
    details: "Please contact your Stripe representative for more information."
  }
}

// Expand regions to individual countries
function expandDestinations(destinations: string[]): string[] {
  const expanded: Set<string> = new Set()
  for (const dest of destinations) {
    if (REGION_COUNTRIES[dest]) {
      REGION_COUNTRIES[dest].forEach((country) => expanded.add(country))
    } else {
      expanded.add(dest)
    }
  }
  return Array.from(expanded)
}

function getFundFlowSupport(
  integrationType: "global-payouts" | "connect" | undefined,
  sourceCountry: string | null,
  destinations: string[] | null
): {
  status: "fully-supported" | "partially-supported" | "not-supported" | "unknown"
  message: string
  supportedDestinations: string[]
  comingSoonDestinations: Array<{ country: string; launchDate: string }>
  unsupportedDestinations: string[]
  details?: string
} {
  if (!sourceCountry || sourceCountry === "Other" || !destinations || destinations.length === 0) {
    return {
      status: "unknown",
      message: "Fund flow support cannot be determined",
      supportedDestinations: [],
      comingSoonDestinations: [],
      unsupportedDestinations: [],
      details: "Please select both a source location and at least one destination to check fund flow support."
    }
  }

  const expandedDestinations = expandDestinations(destinations)
  const supportedDestinations: string[] = []
  const comingSoonDestinations: Array<{ country: string; launchDate: string }> = []
  const unsupportedDestinations: string[] = []

  if (integrationType === "global-payouts") {
    const canSendFrom = GLOBAL_PAYOUTS_SENDER_COUNTRIES.includes(sourceCountry)

    if (!canSendFrom) {
      // When source country is not supported, categorize all destinations
      for (const dest of expandedDestinations) {
        if (dest === "Other") continue
        if (ROADMAP_COUNTRIES[dest]) {
          comingSoonDestinations.push({ country: dest, launchDate: ROADMAP_COUNTRIES[dest] })
        } else {
          unsupportedDestinations.push(dest)
        }
      }
      return {
        status: "not-supported",
        message: `Cannot send Global Payouts from ${sourceCountry}`,
        supportedDestinations: [],
        comingSoonDestinations,
        unsupportedDestinations,
        details: `Global Payouts can only be sent from US or UK. ${sourceCountry} is not a supported sender country.`
      }
    }

    for (const dest of expandedDestinations) {
      if (dest === "Other") continue
      if (GLOBAL_PAYOUTS_RECIPIENT_COUNTRIES.includes(dest)) {
        supportedDestinations.push(dest)
      } else if (ROADMAP_COUNTRIES[dest]) {
        comingSoonDestinations.push({ country: dest, launchDate: ROADMAP_COUNTRIES[dest] })
      } else {
        unsupportedDestinations.push(dest)
      }
    }
  } else if (integrationType === "connect") {
    const canSendFrom = CONNECT_SUPPORTED_REGIONS.includes(sourceCountry)

    if (!canSendFrom) {
      // When source country is not supported, categorize all destinations
      for (const dest of expandedDestinations) {
        if (dest === "Other") continue
        if (CONNECT_ROADMAP_COUNTRIES.includes(dest)) {
          comingSoonDestinations.push({ country: dest, launchDate: "Coming Soon" })
        } else {
          unsupportedDestinations.push(dest)
        }
      }
      return {
        status: "not-supported",
        message: `Cannot send Connect payouts from ${sourceCountry}`,
        supportedDestinations: [],
        comingSoonDestinations,
        unsupportedDestinations,
        details: `Connect cross-border payouts require the platform to be in US, UK, EEA, Canada, or Switzerland.`
      }
    }

    for (const dest of expandedDestinations) {
      if (dest === "Other") continue
      if (CONNECT_SUPPORTED_REGIONS.includes(dest)) {
        supportedDestinations.push(dest)
      } else if (CONNECT_ROADMAP_COUNTRIES.includes(dest)) {
        comingSoonDestinations.push({ country: dest, launchDate: "Coming Soon" })
      } else {
        unsupportedDestinations.push(dest)
      }
    }
  } else {
    return {
      status: "unknown",
      message: "Fund flow support unknown",
      supportedDestinations: [],
      comingSoonDestinations: [],
      unsupportedDestinations: [],
      details: "Integration type not specified."
    }
  }

  const totalDestinations = supportedDestinations.length + comingSoonDestinations.length + unsupportedDestinations.length

  if (unsupportedDestinations.length === 0 && comingSoonDestinations.length === 0) {
    return {
      status: "fully-supported",
      message: `All ${supportedDestinations.length} destination(s) are supported`,
      supportedDestinations,
      comingSoonDestinations,
      unsupportedDestinations,
      details: `Fund flows from ${sourceCountry} to all selected destinations are supported.`
    }
  } else if (supportedDestinations.length === 0 && comingSoonDestinations.length === 0) {
    return {
      status: "not-supported",
      message: "No selected destinations are supported",
      supportedDestinations,
      comingSoonDestinations,
      unsupportedDestinations,
      details: `None of the selected destinations can receive payouts from ${sourceCountry} with this integration.`
    }
  } else {
    return {
      status: "partially-supported",
      message: `${supportedDestinations.length} of ${totalDestinations} destination(s) supported`,
      supportedDestinations,
      comingSoonDestinations,
      unsupportedDestinations,
      details: comingSoonDestinations.length > 0
        ? `Some destinations are coming soon, and some are not yet supported for payouts from ${sourceCountry}.`
        : `Some destinations are not supported for payouts from ${sourceCountry}.`
    }
  }
}

export default function RecommendationCard({ recommendation, onRestart, answers }: RecommendationCardProps) {
  const [showAllSupported, setShowAllSupported] = useState(false)
  const [showAllComingSoon, setShowAllComingSoon] = useState(false)
  const [showAllUnsupported, setShowAllUnsupported] = useState(false)

  const booleanAnswers = [
    { label: "Paying own funds", answer: answers.question1 as boolean | null },
    { label: "International payouts", answer: answers.question2 as boolean | null },
    { label: "Stay out of fund flow", answer: answers.question3 as boolean | null },
    { label: "Fast integration", answer: answers.question4 as boolean | null },
    { label: "Merchant of Record", answer: answers.question5 as boolean | null },
  ]

  const merchantLocation = answers.question6 as string | null
  const destinationLocations = answers.question7 as string[] | null
  const marketAvailability = getMarketAvailability(recommendation.integrationType, merchantLocation)
  const fundFlowSupport = getFundFlowSupport(recommendation.integrationType, merchantLocation, destinationLocations)

  const answerSummary = booleanAnswers.map((item) => ({
    label: item.label,
    answer: item.answer,
  }))

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/50 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white font-sans">Your Recommendation</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Fund Flow Support Banner */}
          {merchantLocation && destinationLocations && destinationLocations.length > 0 && (
            <div
              className={`rounded-xl p-5 border ${
                fundFlowSupport.status === "fully-supported"
                  ? "bg-gradient-to-r from-green-950/40 to-emerald-950/40 border-green-500/40"
                  : fundFlowSupport.status === "partially-supported"
                    ? "bg-gradient-to-r from-amber-950/40 to-yellow-950/40 border-amber-500/40"
                    : fundFlowSupport.status === "not-supported"
                      ? "bg-gradient-to-r from-red-950/40 to-rose-950/40 border-red-500/40"
                      : "bg-slate-800/50 border-slate-700"
              }`}
            >
              <div className="flex items-start gap-4">
                {fundFlowSupport.status === "fully-supported" && (
                  <CheckCircle className="w-7 h-7 text-green-400 flex-shrink-0 mt-0.5" />
                )}
                {fundFlowSupport.status === "partially-supported" && (
                  <AlertTriangle className="w-7 h-7 text-amber-400 flex-shrink-0 mt-0.5" />
                )}
                {fundFlowSupport.status === "not-supported" && (
                  <XCircle className="w-7 h-7 text-red-400 flex-shrink-0 mt-0.5" />
                )}
                {fundFlowSupport.status === "unknown" && (
                  <Info className="w-7 h-7 text-slate-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Fund Flow Support</span>
                  </div>
                  <h3
                    className={`text-lg font-semibold ${
                      fundFlowSupport.status === "fully-supported"
                        ? "text-green-300"
                        : fundFlowSupport.status === "partially-supported"
                          ? "text-amber-300"
                          : fundFlowSupport.status === "not-supported"
                            ? "text-red-300"
                            : "text-slate-300"
                    }`}
                  >
                    {fundFlowSupport.message}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">{fundFlowSupport.details}</p>

                  {recommendation.integrationType === "global-payouts" && (
                    <div className="mt-3">
                      <a
                        href="https://admin.corp.stripe.com/horizon-outbound-flows/outbound-payments-config"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300"
                      >
                        Complete list of countries and payout methods for Global Payouts <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">From:</span>{" "}
                      <span className="text-cyan-400 font-medium">{merchantLocation}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">To:</span>{" "}
                      <span className="text-slate-300">{destinationLocations.join(", ")}</span>
                    </div>
                  </div>

                  {(fundFlowSupport.supportedDestinations.length > 0 || fundFlowSupport.comingSoonDestinations.length > 0 || fundFlowSupport.unsupportedDestinations.length > 0) && (
                    <div className="mt-4 grid sm:grid-cols-2 gap-3">
                      {fundFlowSupport.supportedDestinations.length > 0 && (
                        <div className="bg-green-950/30 border border-green-800/50 rounded-lg p-3">
                          <button
                            onClick={() => setShowAllSupported(!showAllSupported)}
                            className="w-full flex items-center justify-between mb-2"
                          >
                            <h4 className="text-xs font-semibold text-green-400 uppercase tracking-wider">
                              Supported ({fundFlowSupport.supportedDestinations.length})
                            </h4>
                            {fundFlowSupport.supportedDestinations.length > 10 && (
                              showAllSupported ? (
                                <ChevronUp className="w-4 h-4 text-green-400" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-green-400" />
                              )
                            )}
                          </button>
                          <div className="flex flex-wrap gap-1">
                            {(showAllSupported
                              ? fundFlowSupport.supportedDestinations
                              : fundFlowSupport.supportedDestinations.slice(0, 10)
                            ).map((dest) => (
                              <span key={dest} className="text-xs bg-green-900/50 text-green-300 px-2 py-0.5 rounded">
                                {dest}
                              </span>
                            ))}
                            {!showAllSupported && fundFlowSupport.supportedDestinations.length > 10 && (
                              <button
                                onClick={() => setShowAllSupported(true)}
                                className="text-xs text-green-400 hover:text-green-300 underline underline-offset-2"
                              >
                                +{fundFlowSupport.supportedDestinations.length - 10} more
                              </button>
                            )}
                          </div>
                          {showAllSupported && fundFlowSupport.supportedDestinations.length > 10 && (
                            <button
                              onClick={() => setShowAllSupported(false)}
                              className="mt-2 text-xs text-green-400 hover:text-green-300 underline underline-offset-2"
                            >
                              Show less
                            </button>
                          )}
                        </div>
                      )}
                      {fundFlowSupport.comingSoonDestinations.length > 0 && (
                        <div className="bg-amber-950/30 border border-amber-800/50 rounded-lg p-3">
                          <button
                            onClick={() => setShowAllComingSoon(!showAllComingSoon)}
                            className="w-full flex items-center justify-between mb-2"
                          >
                            <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                              Coming Soon ({fundFlowSupport.comingSoonDestinations.length})
                            </h4>
                            {fundFlowSupport.comingSoonDestinations.length > 10 && (
                              showAllComingSoon ? (
                                <ChevronUp className="w-4 h-4 text-amber-400" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-amber-400" />
                              )
                            )}
                          </button>
                          <div className="flex flex-wrap gap-1">
                            {(showAllComingSoon
                              ? fundFlowSupport.comingSoonDestinations
                              : fundFlowSupport.comingSoonDestinations.slice(0, 10)
                            ).map((item) => (
                              <span
                                key={item.country}
                                className="text-xs bg-amber-900/50 text-amber-300 px-2 py-0.5 rounded flex items-center gap-1"
                                title={`Available ${item.launchDate}`}
                              >
                                {item.country}
                                <span className="text-amber-500 text-[10px]">({item.launchDate})</span>
                              </span>
                            ))}
                            {!showAllComingSoon && fundFlowSupport.comingSoonDestinations.length > 10 && (
                              <button
                                onClick={() => setShowAllComingSoon(true)}
                                className="text-xs text-amber-400 hover:text-amber-300 underline underline-offset-2"
                              >
                                +{fundFlowSupport.comingSoonDestinations.length - 10} more
                              </button>
                            )}
                          </div>
                          {showAllComingSoon && fundFlowSupport.comingSoonDestinations.length > 10 && (
                            <button
                              onClick={() => setShowAllComingSoon(false)}
                              className="mt-2 text-xs text-amber-400 hover:text-amber-300 underline underline-offset-2"
                            >
                              Show less
                            </button>
                          )}
                        </div>
                      )}
                      {fundFlowSupport.unsupportedDestinations.length > 0 && (
                        <div className="bg-red-950/30 border border-red-800/50 rounded-lg p-3">
                          <button
                            onClick={() => setShowAllUnsupported(!showAllUnsupported)}
                            className="w-full flex items-center justify-between mb-2"
                          >
                            <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider">
                              Not Supported ({fundFlowSupport.unsupportedDestinations.length})
                            </h4>
                            {fundFlowSupport.unsupportedDestinations.length > 10 && (
                              showAllUnsupported ? (
                                <ChevronUp className="w-4 h-4 text-red-400" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-red-400" />
                              )
                            )}
                          </button>
                          <div className="flex flex-wrap gap-1">
                            {(showAllUnsupported
                              ? fundFlowSupport.unsupportedDestinations
                              : fundFlowSupport.unsupportedDestinations.slice(0, 10)
                            ).map((dest) => (
                              <span key={dest} className="text-xs bg-red-900/50 text-red-300 px-2 py-0.5 rounded">
                                {dest}
                              </span>
                            ))}
                            {!showAllUnsupported && fundFlowSupport.unsupportedDestinations.length > 10 && (
                              <button
                                onClick={() => setShowAllUnsupported(true)}
                                className="text-xs text-red-400 hover:text-red-300 underline underline-offset-2"
                              >
                                +{fundFlowSupport.unsupportedDestinations.length - 10} more
                              </button>
                            )}
                          </div>
                          {showAllUnsupported && fundFlowSupport.unsupportedDestinations.length > 10 && (
                            <button
                              onClick={() => setShowAllUnsupported(false)}
                              className="mt-2 text-xs text-red-400 hover:text-red-300 underline underline-offset-2"
                            >
                              Show less
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Market Availability Banner */}
          {merchantLocation && (
            <div
              className={`rounded-xl p-4 border ${
                marketAvailability.status === "supported"
                  ? "bg-green-950/30 border-green-500/30"
                  : marketAvailability.status === "partial"
                    ? "bg-amber-950/30 border-amber-500/30"
                    : marketAvailability.status === "unsupported"
                      ? "bg-red-950/30 border-red-500/30"
                      : "bg-slate-800/50 border-slate-700"
              }`}
            >
              <div className="flex items-start gap-3">
                {marketAvailability.status === "supported" && (
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                )}
                {marketAvailability.status === "partial" && (
                  <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
                )}
                {marketAvailability.status === "unsupported" && (
                  <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                )}
                {marketAvailability.status === "unknown" && (
                  <Info className="w-6 h-6 text-slate-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h3
                    className={`font-semibold ${
                      marketAvailability.status === "supported"
                        ? "text-green-300"
                        : marketAvailability.status === "partial"
                          ? "text-amber-300"
                          : marketAvailability.status === "unsupported"
                            ? "text-red-300"
                            : "text-slate-300"
                    }`}
                  >
                    {marketAvailability.message}
                  </h3>
                  {marketAvailability.details && (
                    <p className="text-sm text-slate-400 mt-1">{marketAvailability.details}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Main Recommendation Card */}
          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <CheckCircle2 className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 text-balance">{recommendation.integration}</h2>
                <p className="text-slate-300 text-lg">{recommendation.description}</p>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="grid gap-4 mb-6">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Key Benefits</h3>
              <ul className="space-y-2">
                {recommendation.keyBenefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-cyan-400 font-bold">✓</span>
                    <span className="text-slate-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Use Cases */}
            <div>
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Best For</h3>
              <ul className="space-y-2">
                {recommendation.useCases.map((useCase, idx) => (
                  <li key={idx} className="text-slate-300">
                    • {useCase}
                  </li>
                ))}
              </ul>
            </div>

            {/* Implementation Note */}
            {recommendation.implementationNote && (
              <div className="mt-6 p-4 bg-blue-950/40 border border-blue-500/40 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-blue-300 mb-1">Implementation Note</h4>
                    <p className="text-sm text-slate-300">{recommendation.implementationNote}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Integration Details */}
          {recommendation.integrationType && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Detailed Information</h3>
              <p className="text-slate-400 mb-4">Expand sections below for countries, pricing, and integration options</p>
              <IntegrationDetails type={recommendation.integrationType} />
            </div>
          )}

          {/* Answer Summary */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Your Answers</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {booleanAnswers.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 px-3 bg-slate-900/50 rounded-lg">
                  <span className="text-slate-300 text-sm">{item.label}</span>
                  <span className={`font-semibold ${item.answer ? "text-green-400" : "text-slate-500"}`}>
                    {item.answer ? "Yes" : "No"}
                  </span>
                </div>
              ))}
              {merchantLocation && (
                <div className="flex items-center justify-between py-2 px-3 bg-slate-900/50 rounded-lg">
                  <span className="text-slate-300 text-sm">Merchant / User Location</span>
                  <span className="font-semibold text-cyan-400">{merchantLocation}</span>
                </div>
              )}
              {destinationLocations && destinationLocations.length > 0 && (
                <div className="flex items-start justify-between py-2 px-3 bg-slate-900/50 rounded-lg">
                  <span className="text-slate-300 text-sm">Payout Destinations</span>
                  <span className="font-semibold text-purple-400 text-right text-sm max-w-[200px]">
                    {destinationLocations.length <= 3
                      ? destinationLocations.join(", ")
                      : `${destinationLocations.slice(0, 3).join(", ")} +${destinationLocations.length - 3} more`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            {recommendation.docsLink && (
              <a
                href={recommendation.docsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
              >
                Read Documentation
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <button
              onClick={onRestart}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
