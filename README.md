# Asset Management System

**Build Setup:**

- Vite
- TypeScript
- ESLint
- Tailwind CSS
- React Hook Form + Zod (form handling and validation)
- Recharts (for the dashboard charts)
- Sonner (toast notifications)
- Lucide React (icons)

## Getting Started

### You'll Need

- Node.js v18 or newer
- npm (comes with Node)

### Installation

1.clone this repo

2. Install everything:

```bash
npm install
```

3. Fire it up:

```bash
npm run dev
```

## How to Use It

### Adding Parts

1. Click "Parts" in the sidebar
2. Hit the "Add Part" button
3. Fill in the details (name, type, category, quantity)
4. The form won't let you submit if something's wrong - it'll show you what to fix

You can edit or delete parts using the icons in the table. There's a confirmation dialog for deletes so you don't accidentally nuke something important.

### Creating Assets

1. Go to "Assets"
2. Click "Add Asset"
3. Pick a part from the dropdown
4. Give it a unique serial number (like "PD-001" or whatever system you use)
5. Set the initial status
6. Add notes if you want

The serial number has to be unique - the form will yell at you if you try to use one that already exists.

### Assigning Equipment to People

1. Head to "Utilization"
2. Click "Assign Asset"
3. Pick an available asset and a team member
4. Add notes like "Job site #3" or "Needs new battery"
5. Submit

The asset automatically changes to "Assigned" status. When they return it, click the "Complete" button and it goes back to "Available".

You can also edit assignments if you made a mistake, or delete them entirely.

### Checking the Dashboard

The dashboard is the first thing you see. It shows:

- How many parts, assets, and active assignments you have
- Your utilization rate (higher = more equipment in use)
- A bar chart of your top 5 most-used parts
- A pie chart showing how many assets are available vs assigned vs in maintenance
