"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ExemptionsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Questions
          </Link>
          <h1 className="text-3xl font-bold text-white">Licensing Exemptions & Stored Value Guidelines</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Summary */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Summary</h2>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold mt-1">•</span>
                <span>
                  <strong>Definition:</strong> Stored value covers prepaid cards, gift cards, virtual/in-game credits,
                  and similar products where value is stored on the item itself and redeemed with a merchant; Stripe
                  must be used to process the purchase.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold mt-1">•</span>
                <span>
                  <strong>Risk:</strong> Higher money-laundering risk and potential money transmission. Supportability
                  depends on model and region; some cases require Extra Supportability Checks (ESC) or Enhanced Due
                  Diligence (EDD).
                </span>
              </li>
            </ul>
          </section>

          {/* Table */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-white">Subcategory Reference Table</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-slate-300 font-semibold">Subcategory</th>
                    <th className="px-4 py-3 text-left text-slate-300 font-semibold">Short Definition</th>
                    <th className="px-4 py-3 text-left text-slate-300 font-semibold">Typical Examples</th>
                    <th className="px-4 py-3 text-left text-slate-300 font-semibold">Supportability & Handling</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  <tr className="hover:bg-slate-700/30">
                    <td className="px-4 py-4 text-slate-200 font-medium">1. Open-Loop Stored Value</td>
                    <td className="px-4 py-4 text-slate-300">Value redeemable with merchants other than the seller</td>
                    <td className="px-4 py-4 text-slate-400">
                      General prepaid payment cards; gift cards usable broadly; virtual credits redeemable outside
                      seller
                    </td>
                    <td className="px-4 py-4 text-slate-300">
                      <span className="text-amber-400">US: Restricted (ESC)</span>.{" "}
                      <span className="text-red-400">UK/EU/CA: Prohibited (TO30)</span>.{" "}
                      <span className="text-red-400">ROW: Prohibited (TO10)</span>. For ESC, auto-escalates; do not
                      manually send CR. Connected accounts under approved SV platforms (or onboarded pre-2018-10-31) are
                      supportable.
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-700/30">
                    <td className="px-4 py-4 text-slate-200 font-medium">2. Stored Value Cash-out Services</td>
                    <td className="px-4 py-4 text-slate-300">Services that "cash out" stored value to money</td>
                    <td className="px-4 py-4 text-slate-400">
                      Cashing out gift cards, loyalty points, miles, in-game currency to USD/EUR/etc.
                    </td>
                    <td className="px-4 py-4 text-slate-300">
                      <span className="text-amber-400">US: Restricted (ESC)</span>.{" "}
                      <span className="text-red-400">UK/EU/CA: Prohibited (TO30)</span>.{" "}
                      <span className="text-red-400">ROW: Prohibited (TO10)</span>. Same platform exception and ESC
                      auto-escalation note as above.
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-700/30">
                    <td className="px-4 py-4 text-slate-200 font-medium">
                      3. Closed-Loop SV exceeding $2,000
                    </td>
                    <td className="px-4 py-4 text-slate-300">
                      Closed-loop value redeemable only with issuer/limited set, where face value {">"} $2,000 (or charge{" "}
                      {">"} $2,000)
                    </td>
                    <td className="px-4 py-4 text-slate-400">
                      High-value merchant gift cards (e.g., luxury brands), marketplace/store credits, in-game currency
                      limited to specific game, transit cards, air-miles
                    </td>
                    <td className="px-4 py-4 text-slate-300">
                      <span className="text-amber-400">JP: Restricted (ESC for JP sold)</span>.{" "}
                      <span className="text-amber-400">ROW: Restricted (EDD)</span>. Tag and monitor: if a charge{" "}
                      {">"} $2,000 occurs, initiate intervention and send CR to limit to {"<="} $2,000 or stop selling. If
                      user refuses, require Financial Services EDD (ROW) or ESC (JP) and escalate.
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-700/30">
                    <td className="px-4 py-4 text-slate-200 font-medium">
                      4. Closed-Loop SV not exceeding $2,000
                    </td>
                    <td className="px-4 py-4 text-slate-300">
                      Closed-loop value {"<="} $2,000; includes cases listing {">"} $2,000 but not yet processing {">"}{" "}
                      $2,000
                    </td>
                    <td className="px-4 py-4 text-slate-400">
                      Starbucks gift cards; seller-issued virtual credits; in-game currency usable only within
                      merchant's world; air-miles; transit cards
                    </td>
                    <td className="px-4 py-4 text-slate-300">
                      <span className="text-green-400">ROW: Supportable</span>.{" "}
                      <span className="text-red-400">TH: Prohibited (TO10)</span>. Same "redirect to relevant category"
                      rule for redeemability to P/R goods. Blockchain-based credit excluded (see Crypto).
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-700/30">
                    <td className="px-4 py-4 text-slate-200 font-medium">
                      5. High-Value Goods, Precious Metals & Gemstones
                    </td>
                    <td className="px-4 py-4 text-slate-300">
                      Loose/rough diamonds or gold of any value; other precious metals/gemstones or jewelry {">"} $10,000
                    </td>
                    <td className="px-4 py-4 text-slate-400">
                      Luxury art, designer bags/watches/jewelry {">="} $10,000; precious metals (Au, Ag, Pt, Pd, Rh, etc.)
                      and gemstones (e.g., ruby, sapphire, emerald, etc.)
                    </td>
                    <td className="px-4 py-4 text-slate-300">
                      <span className="text-amber-400">ROW: Restricted (EDD)</span>.{" "}
                      <span className="text-red-400">IN/EU: Prohibited (TO10)</span>. Users may process charges/payouts
                      while EDD pending if no other issues; clear non-SHG interventions.
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-700/30">
                    <td className="px-4 py-4 text-slate-200 font-medium">
                      6. Cross-border Jewelry & Low-value PM/Gemstones
                    </td>
                    <td className="px-4 py-4 text-slate-300">
                      Export of jewelry across borders; sale/auction/lease of gemstones/precious metals (excl.
                      gold/diamonds) and jewelry made from them {"<="} $10,000; gold-plated {"<="} $10,000 included
                    </td>
                    <td className="px-4 py-4 text-slate-400">
                      Silver, platinum, palladium, rhodium, iridium, etc.; broad gemstone list
                    </td>
                    <td className="px-4 py-4 text-slate-300">
                      <span className="text-amber-400">ROW: Restricted (EDD)</span>.{" "}
                      <span className="text-red-400">IN/EU: Prohibited (TO10)</span>. Refer to Subcat 5 for
                      diamonds/gold or items {">"} $10,000.
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-700/30">
                    <td className="px-4 py-4 text-slate-200 font-medium">
                      7. Vehicle sales {"<"} $250,000
                    </td>
                    <td className="px-4 py-4 text-slate-300">
                      Passenger vehicles {"<"} $250,000; includes motorcycles, cars, trucks, electric/motorized
                      vehicles/buses; excludes parts
                    </td>
                    <td className="px-4 py-4 text-slate-400">
                      Mopeds; small/lightweight scooters (e.g., Vespas)
                    </td>
                    <td className="px-4 py-4 text-slate-300">
                      <span className="text-green-400">ROW: Supportable</span>.{" "}
                      <span className="text-red-400">IN: Prohibited (TO10)</span>. Excludes non-motorized bikes and
                      stand-up scooters.
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-700/30">
                    <td className="px-4 py-4 text-slate-200 font-medium">
                      8. Vehicle sales {">="} $250,000 (and luxury aircraft/watercraft)
                    </td>
                    <td className="px-4 py-4 text-slate-300">
                      Vehicles {">="} $250,000; luxury aircraft/watercraft {">="} $7,500,000; excludes parts
                    </td>
                    <td className="px-4 py-4 text-slate-400">-</td>
                    <td className="px-4 py-4 text-slate-300">
                      <span className="text-amber-400">ROW: Restricted (EDD)</span>.{" "}
                      <span className="text-red-400">IN/TH: Prohibited (TO10)</span>. May process while EDD pending if
                      no other issues; clear non-SHG interventions.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Operational Notes */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Operational Notes and Details</h2>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold mt-1">•</span>
                <span>
                  <strong>ToS removals:</strong> UPO T2-T4 may use product-removal CR for non-immediate rejections. For
                  Closed-Loop SV {">"} $2,000, send CR to require limiting to $2,000 or ceasing sales.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold mt-1">•</span>
                <span>
                  <strong>ESC submissions:</strong> For Subcats 1-2, submitting the category auto-escalates to ESC;
                  don't manually send an ESC CR.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold mt-1">•</span>
                <span>
                  <strong>Platforms:</strong> Connected accounts under approved stored value platforms (or platforms
                  onboarded before 2018-10-31) are supportable.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold mt-1">•</span>
                <span>
                  <strong>Redirect rule:</strong> If a stored-value product is redeemable for Prohibited/Restricted
                  goods/services, review under that specific category.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold mt-1">!</span>
                <span>
                  <strong>Do not share externally:</strong> Use external Restricted/Prohibited Business lists for
                  customer-facing references.
                </span>
              </li>
            </ul>
          </section>

          {/* Legends */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Legends</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                <span className="px-2 py-1 bg-amber-600/20 text-amber-400 text-xs font-semibold rounded">ESC</span>
                <span className="text-slate-300 text-sm">Extra Supportability Checks</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                <span className="px-2 py-1 bg-amber-600/20 text-amber-400 text-xs font-semibold rounded">EDD</span>
                <span className="text-slate-300 text-sm">Enhanced Due Diligence</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                <span className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs font-semibold rounded">ROW</span>
                <span className="text-slate-300 text-sm">Rest of World</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                <span className="px-2 py-1 bg-red-600/20 text-red-400 text-xs font-semibold rounded">TO10/TO30</span>
                <span className="text-slate-300 text-sm">ToS transition timelines (immediate vs. within X days)</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm mt-4">
              "Prohibited" indicates ToS removal; "Restricted" indicates additional review required prior to or during
              continued processing.
            </p>
          </section>

          {/* Back Button */}
          <div className="flex justify-center pt-4">
            <Link
              href="/"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Back to Questions
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
