interface Recommendation {
  integration: string
  description: string
  useCases: string[]
  keyBenefits: string[]
  docsLink?: string
  integrationType?: "global-payouts" | "connect"
  implementationNote?: string
}

export function determineBestIntegration(answers: Record<string, boolean | null>): Recommendation {
  const q1 = answers.question1 // Are you paying your own funds?
  const q2 = answers.question2 // Do you need international payouts?
  const q3 = answers.question3 // Do you need to stay out of the flow of funds?
  const q4 = answers.question4 // Do you need a fast integration?
  const q5 = answers.question5 // Are you the Merchant of Record?

  // Rule 1: If Q1=Yes AND Q2=Yes AND Q3=No AND Q4=Yes AND Q5=Yes → Global Payouts and Direct integration
  if (q1 === true && q2 === true && q3 === false && q4 === true && q5 === true) {
    return {
      integration: "Global Payouts with Direct Integration",
      description: "Direct payouts from your account to international recipients with fast implementation.",
      keyBenefits: [
        "Pay out from your own business account",
        "International payout support",
        "Fast integration and time-to-market",
        "You are the Merchant of Record",
        "Full control over payout flow",
      ],
      useCases: [
        "Global B2C platforms paying out funds to users",
        "International marketplaces with fast integration requirements",
        "Businesses managing global fund distribution",
      ],
      docsLink: "https://docs.stripe.com/global-payouts",
      integrationType: "global-payouts",
    }
  }

  // Rule 2: If Q1=Yes AND Q2=No AND Q3=No AND Q4=Yes → Global Payouts
  if (q1 === true && q2 === false && q3 === false && q4 === true) {
    return {
      integration: "Global Payouts",
      description: "Direct payouts from your account to recipients with fast integration.",
      keyBenefits: [
        "Pay out from your own business account",
        "Domestic payout support",
        "Quick implementation and deployment",
        "Full control over payout flow",
        "Real-time payout tracking",
      ],
      useCases: [
        "B2C platforms paying out funds to users",
        "Domestic marketplaces with fast integration requirements",
        "Businesses with simple payout workflows",
      ],
      docsLink: "https://docs.stripe.com/global-payouts",
      integrationType: "global-payouts",
    }
  }

  // Rule 3: If Q1=No AND Q3=Yes AND Q5=Yes → Connect with Destination charges or SCT
  if (q1 === false && q3 === true && q5 === true) {
    return {
      integration: "Connect with Destination Charges or Separate Charges and Transfers",
      description: "Stay out of the flow of funds while managing merchant relationships as Merchant of Record.",
      keyBenefits: [
        "Direct fund flow from payer to connected accounts",
        "You remain Merchant of Record",
        "Reduced operational complexity",
        "Built-in Stripe account management",
        "Flexible charge and transfer patterns",
      ],
      useCases: [
        "Marketplaces connecting buyers and sellers",
        "Platforms managing merchant relationships",
        "SaaS platforms with split payments",
      ],
      docsLink: "https://docs.stripe.com/connect/cross-border-payouts",
      integrationType: "connect",
      implementationNote: "Use Destination Charges or Separate Charges and Transfers without on_behalf_of to remain as the Merchant of Record.",
    }
  }

  // Rule 4: If Q1=No AND Q3=Yes AND Q5=No → Connect with Direct charges or Destination OBO
  if (q1 === false && q3 === true && q5 === false) {
    return {
      integration: "Connect with Direct Charges or Destination On-Behalf-Of",
      description: "Enable direct payments while connected accounts act as Merchant of Record.",
      keyBenefits: [
        "Connected accounts are Merchant of Record",
        "You stay out of the fund flow",
        "Reduced compliance burden for platform",
        "Built-in account and payout management",
        "Lower operational complexity",
      ],
      useCases: [
        "Gig economy and freelance platforms",
        "P2P payment networks",
        "Platforms where sellers manage customer relationships",
      ],
      docsLink: "https://docs.stripe.com/connect/cross-border-payouts",
      integrationType: "connect",
    }
  }

  // Additional conditions for Q1=Yes (general Global Payouts)
  if (q1 === true && q3 === false) {
    return {
      integration: "Global Payouts",
      description: "Direct payouts from your account to recipients with flexible implementation.",
      keyBenefits: [
        "Pay out from your own business account",
        "Comprehensive payout management",
        q2 === true ? "International payout support" : "Domestic payout support",
        "Flexible implementation timeline",
        "Real-time payout tracking",
      ],
      useCases: [
        "B2C platforms with standard integration timelines",
        "Marketplaces handling user payouts",
        "Payroll and distribution systems",
      ],
      docsLink: "https://docs.stripe.com/global-payouts",
      integrationType: "global-payouts",
    }
  }

  // Fallback for Connect scenarios
  if (q1 === false) {
    return {
      integration: "Stripe Connect",
      description: "Enable payments between your users while managing the fund flow architecture.",
      keyBenefits: [
        "Simplified platform architecture",
        "User-to-user payment support",
        "Built-in account management",
        "Compliance handled by Stripe",
      ],
      useCases: [
        "Multi-user payment platforms",
        "Collaboration and split payment scenarios",
        "Distributed marketplace models",
      ],
      docsLink: "https://docs.stripe.com/connect/cross-border-payouts",
      integrationType: "connect",
    }
  }

  // Final fallback
  return {
    integration: "Global Payouts",
    description: "The recommended solution for your use case.",
    keyBenefits: ["Direct payout capabilities", "Comprehensive payout management", "Proven at scale"],
    useCases: ["Fund distribution", "Marketplace payouts"],
    docsLink: "https://docs.stripe.com/global-payouts",
    integrationType: "global-payouts",
  }
}
