"use client"

import { useState } from "react"
import { ChevronDown, X } from "lucide-react"
import Link from "next/link"

interface QuestionCardProps {
  question: {
    id: string
    question: string
    description: string
    descriptionLink?: { text: string; href: string }
    type: "yes-no" | "dropdown" | "multiselect"
    options?: string[]
  }
  answer: boolean | string | string[] | null
  onAnswer: (value: boolean | string | string[]) => void
}

function renderDescriptionWithLink(description: string, link?: { text: string; href: string }) {
  if (!link) return description

  const parts = description.split(link.text)
  if (parts.length < 2) return description

  return (
    <>
      {parts[0]}
      <Link href={link.href} className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2">
        {link.text}
      </Link>
      {parts[1]}
    </>
  )
}

export default function QuestionCard({ question, answer, onAnswer }: QuestionCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedItems = Array.isArray(answer) ? answer : []

  const handleMultiSelect = (option: string) => {
    const newSelection = selectedItems.includes(option)
      ? selectedItems.filter((item) => item !== option)
      : [...selectedItems, option]
    onAnswer(newSelection.length > 0 ? newSelection : [])
  }

  const removeItem = (option: string) => {
    const newSelection = selectedItems.filter((item) => item !== option)
    onAnswer(newSelection.length > 0 ? newSelection : [])
  }

  const isRegion = (option: string) => {
    return ["EMEA", "APAC", "North America", "LATAM", "Africa"].includes(option)
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors">
      <h3 className="text-lg font-semibold text-white mb-2">{question.question}</h3>
      <p className="text-slate-400 text-sm mb-6">
        {renderDescriptionWithLink(question.description, question.descriptionLink)}
      </p>

      {question.type === "yes-no" ? (
        <div className="flex gap-3">
          <button
            onClick={() => onAnswer(true)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
              answer === true
                ? "bg-blue-600 text-white shadow-lg ring-2 ring-blue-400/50"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            Yes
          </button>
          <button
            onClick={() => onAnswer(false)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
              answer === false
                ? "bg-blue-600 text-white shadow-lg ring-2 ring-blue-400/50"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            No
          </button>
        </div>
      ) : question.type === "dropdown" ? (
        <div className="relative">
          <select
            value={typeof answer === "string" ? answer : ""}
            onChange={(e) => onAnswer(e.target.value)}
            className="w-full appearance-none py-3 px-4 pr-10 rounded-lg font-medium bg-slate-700 text-white border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-400/50 focus:outline-none transition-all cursor-pointer"
          >
            <option value="" disabled>
              Select a country...
            </option>
            {question.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
        </div>
      ) : (
        <div className="space-y-3">
          {/* Selected items display */}
          {selectedItems.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedItems.map((item) => (
                <span
                  key={item}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    isRegion(item)
                      ? "bg-purple-600/30 text-purple-300 border border-purple-500/50"
                      : "bg-blue-600/30 text-blue-300 border border-blue-500/50"
                  }`}
                >
                  {item}
                  <button
                    onClick={() => removeItem(item)}
                    className="ml-1 hover:text-white transition-colors"
                    aria-label={`Remove ${item}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Dropdown trigger */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-between py-3 px-4 rounded-lg font-medium bg-slate-700 text-white border border-slate-600 hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-400/50 focus:outline-none transition-all cursor-pointer"
            >
              <span className={selectedItems.length === 0 ? "text-slate-400" : "text-white"}>
                {selectedItems.length === 0
                  ? "Select regions or countries..."
                  : `${selectedItems.length} selected`}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown menu */}
            {isOpen && (
              <div className="absolute z-50 mt-2 w-full max-h-64 overflow-y-auto bg-slate-800 border border-slate-600 rounded-lg shadow-xl">
                {question.options?.map((option, idx) => {
                  const isSelected = selectedItems.includes(option)
                  const optionIsRegion = isRegion(option)
                  const isFirstCountry = idx === 5 // After the 5 regions

                  return (
                    <div key={option}>
                      {isFirstCountry && (
                        <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-900/50 border-t border-slate-700">
                          Countries
                        </div>
                      )}
                      {idx === 0 && (
                        <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-900/50">
                          Regions
                        </div>
                      )}
                      <button
                        onClick={() => handleMultiSelect(option)}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-slate-700 transition-colors ${
                          isSelected ? "bg-slate-700/50" : ""
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isSelected
                              ? optionIsRegion
                                ? "bg-purple-600 border-purple-500"
                                : "bg-blue-600 border-blue-500"
                              : "border-slate-500"
                          }`}
                        >
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        <span
                          className={`${
                            optionIsRegion ? "font-semibold text-purple-300" : "text-slate-300"
                          }`}
                        >
                          {option}
                        </span>
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Click outside to close */}
          {isOpen && (
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} aria-hidden="true" />
          )}
        </div>
      )}
    </div>
  )
}
