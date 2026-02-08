"""
Fund Flow Integration Guide - Data Sync Agent

This agent automatically syncs data from internal Stripe sources:
- Google Sheets (roadmap countries)
- Compass projects (launch timelines)
- Public Stripe docs (via Public Search API)

Runs on a schedule to keep the integration guide up-to-date.
"""

from .agent import FundFlowSyncAgent

__all__ = ['FundFlowSyncAgent']
