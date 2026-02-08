"""
Fund Flow Sync Agent - Main Implementation

This agent uses Toolshed MCP tools to automatically fetch and sync data.
"""

import asyncio
import re
from typing import Dict, List, Any
from datetime import datetime


class FundFlowSyncAgent:
    """
    Agent that syncs data from internal Stripe sources to the Fund Flow Integration Guide.

    Uses Toolshed MCP tools to access:
    - Google Sheets (roadmap data)
    - Compass projects (launch timelines)
    - Public Search API (Stripe docs)
    """

    def __init__(self, uses_mcp_tools=True):
        """Initialize the agent with MCP tools support."""
        self.uses_mcp_tools = uses_mcp_tools
        self.mcp_tools = None

        # Data sources
        self.GOOGLE_SHEET_ID = '1w7XrLsYUBDIjig2NKNYLnVA1fozxwnA54z_3g4NZWT4'
        self.COMPASS_PROJECTS = [
            'project_S0xmk1G3XOS0TF',  # Cross-border transfers
            'project_SrXJRd3qQZYLnx',  # Global Payouts USDC
            'project_TTwR4WYRCy37Wa',  # Connect Stablecoins
        ]

        # Git configuration
        self.REPO_PATH = '/path/to/fund-flow-integrator'  # To be configured
        self.FILES_TO_UPDATE = {
            'integration_details': 'components/integration-details.tsx',
            'recommendation_card': 'components/recommendation-card.tsx',
        }

    async def initialize(self, dependencies):
        """Initialize MCP tools."""
        if self.uses_mcp_tools and dependencies.mcp_client:
            self.mcp_tools = await dependencies.mcp_client.get_agent_usable_tools()
            print("✅ MCP tools initialized")
        else:
            raise RuntimeError("MCP tools required but not available")

    async def sync_data(self) -> Dict[str, Any]:
        """
        Main sync function - fetches all data sources and updates files.

        Returns:
            Dictionary with sync results and statistics
        """
        results = {
            'timestamp': datetime.utcnow().isoformat(),
            'sources': {},
            'files_updated': [],
            'errors': []
        }

        try:
            # Step 1: Fetch Google Sheets data
            print("📊 Fetching Google Sheets roadmap data...")
            sheet_data = await self._fetch_google_sheet()
            results['sources']['google_sheets'] = {
                'status': 'success',
                'countries_found': len(sheet_data.get('roadmap_countries', []))
            }

            # Step 2: Fetch Compass project data
            print("🧭 Fetching Compass project timelines...")
            compass_data = await self._fetch_compass_projects()
            results['sources']['compass'] = {
                'status': 'success',
                'projects_fetched': len(compass_data)
            }

            # Step 3: Update files
            print("📝 Updating integration files...")
            updated_files = await self._update_files(sheet_data, compass_data)
            results['files_updated'] = updated_files

            # Step 4: Commit and push changes
            print("🚀 Committing and pushing changes...")
            commit_result = await self._commit_and_push(updated_files)
            results['git_push'] = commit_result

            print(f"✅ Sync completed successfully! Updated {len(updated_files)} files")

        except Exception as e:
            error_msg = f"Sync failed: {str(e)}"
            print(f"❌ {error_msg}")
            results['errors'].append(error_msg)

        return results

    async def _fetch_google_sheet(self) -> Dict[str, Any]:
        """
        Fetch roadmap data from Google Sheets using Toolshed MCP.

        Uses: get_google_drive_public_sheet_in_spreadsheet
        """
        if not self.mcp_tools:
            raise RuntimeError("MCP tools not initialized")

        # Call Toolshed MCP tool to get sheet as CSV
        csv_data = await self.mcp_tools.get_google_drive_public_sheet_in_spreadsheet(
            spreadsheet_id=self.GOOGLE_SHEET_ID,
            sheet_title='Sheet1'  # Adjust if needed
        )

        # Parse CSV data
        roadmap_countries = self._parse_csv_roadmap(csv_data)

        return {
            'roadmap_countries': roadmap_countries,
            'raw_csv': csv_data
        }

    def _parse_csv_roadmap(self, csv_data: str) -> List[Dict[str, str]]:
        """
        Parse CSV data to extract country names and launch dates.

        Expected format:
        Column B: Launch date
        Column D: Country name
        """
        roadmap_countries = []
        lines = csv_data.strip().split('\n')

        for i, line in enumerate(lines[1:], start=1):  # Skip header
            columns = line.split(',')
            if len(columns) >= 4:
                launch_date = columns[1].strip()
                country = columns[3].strip()
                if country and launch_date:
                    roadmap_countries.append({
                        'country': country,
                        'launchDate': launch_date
                    })

        print(f"   → Parsed {len(roadmap_countries)} roadmap countries")
        return roadmap_countries

    async def _fetch_compass_projects(self) -> List[Dict[str, Any]]:
        """
        Fetch Compass project data using Toolshed MCP.

        Uses: execute_internal_search + fetch_internal_search_result
        """
        if not self.mcp_tools:
            raise RuntimeError("MCP tools not initialized")

        compass_data = []

        for project_id in self.COMPASS_PROJECTS:
            try:
                # Fetch project content
                result = await self.mcp_tools.fetch_internal_search_result(
                    document_reference=f'compass_project:{project_id}'
                )

                compass_data.append({
                    'project_id': project_id,
                    'title': result.get('title', ''),
                    'content': result.get('content', ''),
                    'url': result.get('url', '')
                })
                print(f"   ✓ Fetched {result.get('title', project_id)}")

            except Exception as e:
                print(f"   ⚠️  Failed to fetch {project_id}: {str(e)}")

        return compass_data

    async def _update_files(
        self,
        sheet_data: Dict[str, Any],
        compass_data: List[Dict[str, Any]]
    ) -> List[str]:
        """
        Update TypeScript files with new data.

        Returns:
            List of updated file paths
        """
        updated_files = []

        # Update integration-details.tsx
        if await self._update_integration_details(sheet_data):
            updated_files.append(self.FILES_TO_UPDATE['integration_details'])

        # Update recommendation-card.tsx
        if await self._update_recommendation_card(sheet_data):
            updated_files.append(self.FILES_TO_UPDATE['recommendation_card'])

        return updated_files

    async def _update_integration_details(self, data: Dict[str, Any]) -> bool:
        """
        Update components/integration-details.tsx with roadmap countries.
        """
        file_path = f"{self.REPO_PATH}/{self.FILES_TO_UPDATE['integration_details']}"

        try:
            with open(file_path, 'r') as f:
                content = f.read()

            # Generate roadmap section
            roadmap_section = self._generate_roadmap_section(
                data.get('roadmap_countries', [])
            )

            # Find and replace roadmap section using regex
            pattern = r'(const GLOBAL_PAYOUTS_COUNTRIES = \[[^\]]*?)(\n\s*// Coming[^\]]*?)(\])'

            if re.search(pattern, content, re.DOTALL):
                match = re.search(pattern, content, re.DOTALL)
                before_roadmap = match.group(1)
                after_array = match.group(3)

                new_content = re.sub(
                    pattern,
                    f"{before_roadmap}{roadmap_section}{after_array}",
                    content,
                    flags=re.DOTALL
                )

                with open(file_path, 'w') as f:
                    f.write(new_content)

                print(f"   ✓ Updated {self.FILES_TO_UPDATE['integration_details']}")
                return True
            else:
                print(f"   ⚠️  Pattern not found in {self.FILES_TO_UPDATE['integration_details']}")
                return False

        except Exception as e:
            print(f"   ❌ Error updating integration-details: {str(e)}")
            return False

    def _generate_roadmap_section(self, roadmap_countries: List[Dict[str, str]]) -> str:
        """Generate TypeScript code for roadmap countries section."""
        # Group by launch date
        by_date = {}
        for item in roadmap_countries:
            date = item['launchDate']
            if date not in by_date:
                by_date[date] = []
            by_date[date].append(item['country'])

        # Generate code
        roadmap_section = '\n'
        for date in sorted(by_date.keys()):
            roadmap_section += f'  // Coming {date}\n'
            for country in by_date[date]:
                roadmap_section += (
                    f'  {{ country: "{country}", currency: "TBD", '
                    f'crossBorderFee: "TBD", launchDate: "{date}" }},\n'
                )
            roadmap_section += '\n'

        return roadmap_section

    async def _update_recommendation_card(self, data: Dict[str, Any]) -> bool:
        """
        Update components/recommendation-card.tsx with roadmap countries.
        """
        file_path = f"{self.REPO_PATH}/{self.FILES_TO_UPDATE['recommendation_card']}"

        try:
            with open(file_path, 'r') as f:
                content = f.read()

            # Generate ROADMAP_COUNTRIES object
            roadmap_object = self._generate_roadmap_object(
                data.get('roadmap_countries', [])
            )

            # Replace ROADMAP_COUNTRIES
            pattern = r'const ROADMAP_COUNTRIES: Record<string, string> = \{[^}]*\}'

            if re.search(pattern, content, re.DOTALL):
                new_content = re.sub(
                    pattern,
                    roadmap_object,
                    content,
                    flags=re.DOTALL
                )

                with open(file_path, 'w') as f:
                    f.write(new_content)

                print(f"   ✓ Updated {self.FILES_TO_UPDATE['recommendation_card']}")
                return True
            else:
                print(f"   ⚠️  Pattern not found in {self.FILES_TO_UPDATE['recommendation_card']}")
                return False

        except Exception as e:
            print(f"   ❌ Error updating recommendation-card: {str(e)}")
            return False

    def _generate_roadmap_object(self, roadmap_countries: List[Dict[str, str]]) -> str:
        """Generate TypeScript code for ROADMAP_COUNTRIES object."""
        # Group by date
        by_date = {}
        for item in roadmap_countries:
            date = item['launchDate']
            if date not in by_date:
                by_date[date] = []
            by_date[date].append(item['country'])

        # Generate code
        roadmap_object = 'const ROADMAP_COUNTRIES: Record<string, string> = {\n'

        for date in sorted(by_date.keys()):
            roadmap_object += f'  // Coming {date}\n'
            for country in sorted(by_date[date]):
                roadmap_object += f'  "{country}": "{date}",\n'

        roadmap_object += '}'

        return roadmap_object

    async def _commit_and_push(self, updated_files: List[str]) -> Dict[str, Any]:
        """
        Commit changes and push to both remotes.
        """
        import subprocess

        result = {'committed': False, 'pushed': {}}

        if not updated_files:
            print("   ⓘ  No files to commit")
            return result

        try:
            # Change to repo directory
            subprocess.run(['git', '-C', self.REPO_PATH, 'add'] + updated_files, check=True)

            # Commit
            commit_msg = (
                f"chore: auto-sync roadmap data from internal sources\n\n"
                f"Updated {len(updated_files)} file(s):\n" +
                "\n".join(f"- {f}" for f in updated_files) +
                f"\n\nSynced at: {datetime.utcnow().isoformat()}\n\n"
                "Co-Authored-By: Fund Flow Sync Agent <noreply@stripe.com>"
            )

            subprocess.run(
                ['git', '-C', self.REPO_PATH, 'commit', '-m', commit_msg],
                check=True
            )
            result['committed'] = True
            print("   ✓ Changes committed")

            # Push to Stripe GitHub
            subprocess.run(
                ['git', '-C', self.REPO_PATH, 'push', 'stripe', 'main:master'],
                check=True
            )
            result['pushed']['stripe'] = True
            print("   ✓ Pushed to Stripe GitHub")

            # Push to personal GitHub (triggers Vercel)
            subprocess.run(
                ['git', '-C', self.REPO_PATH, 'push', 'origin', 'main'],
                check=True
            )
            result['pushed']['origin'] = True
            print("   ✓ Pushed to personal GitHub (Vercel will deploy)")

        except subprocess.CalledProcessError as e:
            print(f"   ❌ Git operation failed: {str(e)}")
            result['error'] = str(e)

        return result


async def main():
    """Main entry point for scheduled execution."""
    agent = FundFlowSyncAgent(uses_mcp_tools=True)

    # Initialize (would get dependencies from agent-srv framework)
    # await agent.initialize(dependencies)

    # Run sync
    results = await agent.sync_data()

    # Log results
    print("\n" + "="*50)
    print("SYNC RESULTS")
    print("="*50)
    print(f"Timestamp: {results['timestamp']}")
    print(f"Files Updated: {results['files_updated']}")
    print(f"Errors: {results['errors']}")
    print("="*50)

    return results


if __name__ == '__main__':
    asyncio.run(main())
