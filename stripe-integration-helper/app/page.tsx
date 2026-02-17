"use client"

import { useState } from "react"
import QuestionCard from "@/components/question-card"
import RecommendationCard from "@/components/recommendation-card"
import { determineBestIntegration } from "@/lib/decision-logic"
import { AlertCircle } from "lucide-react"

// Countries list from stripe.com/global
const MERCHANT_LOCATION_OPTIONS = [
  "United States",
  "United Kingdom",
  "Australia",
  "Austria",
  "Belgium",
  "Brazil",
  "Bulgaria",
  "Canada",
  "Croatia",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "Ghana",
  "Gibraltar",
  "Greece",
  "Hong Kong",
  "Hungary",
  "India",
  "Indonesia",
  "Ireland",
  "Italy",
  "Japan",
  "Kenya",
  "Latvia",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Malaysia",
  "Malta",
  "Mexico",
  "Netherlands",
  "New Zealand",
  "Nigeria",
  "Norway",
  "Poland",
  "Portugal",
  "Romania",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "South Africa",
  "Spain",
  "Sweden",
  "Switzerland",
  "Thailand",
  "United Arab Emirates",
  "Other",
]

// Destination options with regions first, then all countries in the world
const DESTINATION_OPTIONS = [
  // Regions first
  "EMEA",
  "APAC",
  "North America",
  "LATAM",
  "Africa",
  // All countries (alphabetically sorted)
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cayman Islands",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo (Brazzaville)",
  "Congo (Kinshasa)",
  "Cook Islands",
  "Costa Rica",
  "Côte d'Ivoire",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "East Timor (Timor-Leste)",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Gibraltar",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guernsey",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Isle of Man",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jersey",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macau",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Montserrat",
  "Morocco",
  "Mozambique",
  "Myanmar (Burma)",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Turks and Caicos Islands",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City (Holy See)",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
  "Other",
]

const USER_LOCATION_OPTIONS = [
  "United States",
  "United Kingdom",
  "Australia",
  "Austria",
  "Belgium",
  "Brazil",
  "Bulgaria",
  "Canada",
  "Croatia",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "Ghana",
  "Gibraltar",
  "Greece",
  "Hong Kong",
  "Hungary",
  "India",
  "Indonesia",
  "Ireland",
  "Italy",
  "Japan",
  "Kenya",
  "Latvia",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Malaysia",
  "Malta",
  "Mexico",
  "Netherlands",
  "New Zealand",
  "Nigeria",
  "Norway",
  "Poland",
  "Portugal",
  "Romania",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "South Africa",
  "Spain",
  "Sweden",
  "Switzerland",
  "Thailand",
  "United Arab Emirates",
  "Other",
]

const QUESTIONS = [
  {
    id: "question1",
    question: "Are you paying your own funds?",
    description:
      "This determines whether you are using your own funds to do the payout (alternatively you might have licensing (MTL) or exemptions to required licensing).",
    descriptionLink: { text: "exemptions", href: "/exemptions" },
    type: "yes-no",
  },
  {
    id: "question2",
    question: "Do you need international payouts?",
    description: "Support for paying out to recipients in multiple countries.",
    type: "yes-no",
  },
  {
    id: "question3",
    question: "Do you need to stay out of the flow of funds?",
    description: "You want funds to flow directly between your platform and your users.",
    type: "yes-no",
  },
  {
    id: "question4",
    question: "Do you need a fast integration?",
    description: "Quick time-to-market is critical for your use case.",
    type: "yes-no",
  },
  {
    id: "question5",
    question: "Are you the Merchant of Record?",
    description:
      "Your company name will appear on the card statement / payment. You are responsible for collecting payment and managing the customer relationship.",
    type: "yes-no",
  },
  {
    id: "question6",
    question: "Where is your merchant / user located?",
    description: "Select the primary location of your merchant or user (the source of the payout).",
    type: "dropdown",
    options: MERCHANT_LOCATION_OPTIONS,
  },
  {
    id: "question7",
    question: "Select the primary location(s) of the users your merchant/user will be paying out to",
    description: "Choose all regions or countries where recipients are located. You can select multiple options.",
    type: "multiselect",
    options: DESTINATION_OPTIONS,
  },
]

export default function Home() {
  const [answers, setAnswers] = useState<Record<string, boolean | string | string[] | null>>({
    question1: null,
    question2: null,
    question3: null,
    question4: null,
    question5: null,
    question6: null,
    question7: null,
  })

  const [showRecommendation, setShowRecommendation] = useState(false)
  const [showConflictWarning, setShowConflictWarning] = useState(false)
  const [userType, setUserType] = useState<"marketplace" | "fintech" | null>(null)

  const handleAnswer = (questionId: string, value: boolean | string | string[]) => {
    setAnswers((prev) => {
      const newAnswers = {
        ...prev,
        [questionId]: value,
      }

      // For dropdown or multiselect questions, just update the value
      if (typeof value === "string" || Array.isArray(value)) {
        return newAnswers
      }

      if (questionId === "question1" && value === true && prev.question3 === true) {
        setShowConflictWarning(true)
        return prev
      }

      if (questionId === "question3" && value === true && prev.question1 === true) {
        setShowConflictWarning(true)
        return prev
      }

      setShowConflictWarning(false)

      if (questionId === "question1" && value === true) {
        newAnswers.question3 = false
      }

      if (questionId === "question3" && value === true) {
        newAnswers.question1 = false
      }

      // Auto-set question3 to Yes when question1 is No
      if (questionId === "question1" && value === false) {
        newAnswers.question3 = true
      }

      return newAnswers
    })
  }

  const allAnswered = Object.entries(answers).every(([key, a]) => {
    if (key === "question7") {
      return Array.isArray(a) && a.length > 0
    }
    return a !== null
  })

  const recommendation = allAnswered ? determineBestIntegration(answers) : null

  const handleRestart = () => {
    setAnswers({
      question1: null,
      question2: null,
      question3: null,
      question4: null,
      question5: null,
      question6: null,
      question7: null,
    })
    setShowRecommendation(false)
    setShowConflictWarning(false)
    setUserType(null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleConnectRecommendation = () => {
    // Set answers that lead to Connect recommendation
    setAnswers({
      question1: false, // Not paying own funds
      question2: true, // International payouts
      question3: true, // Stay out of flow of funds
      question4: false, // Fast integration (not required)
      question5: true, // Merchant of record - YES
      question6: "United States",
      question7: ["EMEA", "APAC", "North America", "LATAM", "Africa"], // All regions
    })
    setShowRecommendation(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleGlobalPayoutsRecommendation = () => {
    // Set answers that lead to Global Payouts recommendation
    setAnswers({
      question1: true, // Paying own funds
      question2: true, // International payouts
      question3: false, // Not staying out of flow of funds
      question4: true, // Fast integration
      question5: true, // Merchant of record
      question6: "United States",
      question7: ["EMEA", "APAC", "North America", "LATAM", "Africa"], // All regions
    })
    setShowRecommendation(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (showRecommendation && recommendation) {
    return <RecommendationCard recommendation={recommendation} onRestart={handleRestart} answers={answers} />
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/50 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-white font-sans">Fund Flows Integration Guide</h1>
            <p className="text-slate-400 text-lg">
              Answer a few questions to find the best Stripe integration for your use case
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Quick User Type Selection */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white text-center">Quick Recommendation</h2>
            <p className="text-slate-400 text-center text-sm">Select your business type for a quick recommendation</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Marketplace */}
              <button
                onClick={() => setUserType(userType === "marketplace" ? null : "marketplace")}
                className={`relative p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                  userType === "marketplace"
                    ? "border-blue-500 bg-blue-950/30"
                    : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                }`}
              >
                <h3 className="text-lg font-semibold text-white mb-2">Marketplace/SaaS</h3>
                <p className="text-slate-400 text-sm">
                  Multi-party platforms connecting buyers and sellers, service providers, or creators, where marketplace does not own the funds
                </p>
              </button>

              {/* FinTech/SaaS */}
              <button
                onClick={() => setUserType(userType === "fintech" ? null : "fintech")}
                className={`relative p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                  userType === "fintech"
                    ? "border-cyan-500 bg-cyan-950/30"
                    : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                }`}
              >
                <h3 className="text-lg font-semibold text-white mb-2">FinTech/SaaS</h3>
                <p className="text-slate-400 text-sm">
                  Users paying out rewards, commissions, vendors, remittances or doing revenue-share, using their own funds (or licensed)
                </p>
              </button>
            </div>

            {/* Recommendation Boxes */}
            {userType === "marketplace" && (
              <div className="mt-4 bg-gradient-to-br from-blue-950/40 to-cyan-950/40 border border-blue-500/30 rounded-xl p-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <h4 className="text-lg font-semibold text-white mb-2">Recommended: Connect</h4>
                <p className="text-slate-300 text-sm mb-4">
                  Connect is the recommended integration for marketplace platforms. It allows you to stay out of the flow of funds while your users transact directly.
                </p>
                <button
                  onClick={handleConnectRecommendation}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  View Connect Details
                </button>
              </div>
            )}

            {userType === "fintech" && (
              <div className="mt-4 bg-gradient-to-br from-cyan-950/40 to-teal-950/40 border border-cyan-500/30 rounded-xl p-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <h4 className="text-lg font-semibold text-white mb-2">Recommended: Global Payouts</h4>
                <p className="text-slate-300 text-sm mb-4">
                  Global Payouts is the recommended integration for FinTech/SaaS platforms. Send funds directly to users in 90+ countries with local currency support.
                </p>
                <button
                  onClick={handleGlobalPayoutsRecommendation}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  View Global Payouts Details
                </button>
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-950 text-slate-400">or answer questions for a personalized recommendation</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Progress</span>
              <span className="text-slate-300 font-medium">
                {Object.values(answers).filter((a) => a !== null).length} of {QUESTIONS.length}
              </span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300 ease-out"
                style={{
                  width: `${(Object.values(answers).filter((a) => a !== null).length / QUESTIONS.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {QUESTIONS.map((question, index) => (
              <div key={question.id}>
                <QuestionCard
                  question={question}
                  answer={answers[question.id]}
                  onAnswer={(value) => handleAnswer(question.id, value)}
                />
                {index === 2 && showConflictWarning && (
                  <div className="mt-4 bg-red-950/70 border border-red-800 rounded-lg p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <h3 className="text-red-300 font-semibold">Conflicting Requirements</h3>
                      <p className="text-red-200 text-sm leading-relaxed">
                        You cannot pay your own funds AND stay out of the flow of funds at the same time. These options
                        are mutually exclusive. Please adjust your answers to reflect your actual requirements.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex gap-3 justify-center pt-8">
            <button
              onClick={() => {
                setShowRecommendation(true)
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
              disabled={!allAnswered}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Recommendation
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
