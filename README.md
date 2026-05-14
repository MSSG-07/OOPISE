# Oopsie — Smart Period Triage

Oopsie is a cycle and wellness tracking app built with Next.js. It helps users log symptoms, track daily flow and mood, view cycle phase insights, explore community support, and manage profile data locally in the browser.

The app is designed to be private-first: most user data is stored in IndexedDB on the device, and the profile section includes editable wellness settings, language selection, and export options.

## Key Features

- **Home dashboard** with current cycle phase and daily wellness summary
- **Daily log** for pain level, flow, mood, symptoms, notes, and tags
- **Interactive body map** with multi-select pain areas and pain types
- **Anonymous community feed** with post support and replies
- **Personalized wellness guidance** with phase-aware food and yoga recommendations
- **Editable profile** for wellness setup and personal cycle details
- **Password-protected activity view** for private activity records
- **Data export** to CSV and printable table/PDF-style view
- **Theme support** with dark mode
- **Language selector** with translation support for multiple languages

## Tech Stack

- **Framework:** Next.js 16
- **Language:** TypeScript
- **UI:** React 19, Tailwind CSS 4
- **Icons:** lucide-react
- **Storage:** IndexedDB for local persistence
- **Translation:** Google Translate widget integration and language selector

## What the App Stores Locally

The app saves data in the browser using IndexedDB, including:

- user profile and wellness setup
- daily log entries
- body map entries
- community posts
- community interactions such as likes and replies
- predictions and derived wellness data

This means user data stays on the device unless exported.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

### 3. Open the app

Visit:

```text
http://localhost:3000
```

## Available Scripts

- `npm run dev` — start the development server
- `npm run build` — create a production build
- `npm run start` — run the production server
- `npm run lint` — run ESLint

## Main Screens

### Home
Shows the current phase, recent flow and mood, and a summary of the user’s wellness state.

### Log
Used to record daily symptoms, pain intensity, flow, mood, and notes.

### Body Map
Lets the user mark affected areas and select pain types for better tracking.

### Community
Provides anonymous posting, likes, and replies for support sharing.

### Insights
Displays trends and phase-based wellness guidance.

### Profile
Contains editable wellness details, dark mode, export tools, language selection, and logout.

## Language Support

The profile section includes a language selector with support for:

- English
- हिन्दी
- Español
- Français
- 日本語
- മലയാളം

Language switching is powered by the Google Translate widget integration.

## Export and Privacy

The profile section includes:

- **CSV export** for structured record sharing
- **Activity view** protected by a password prompt
- **Printable table view** for reviewing stored records

The app does not rely on a remote database for core tracking data, which keeps the experience lightweight and private.

## Project Structure

```text
app/
  layout.tsx
  page.tsx
  dashboard/
    page.tsx
  onboarding/
    page.tsx
  setup/
    page.tsx
components/
  BottomNav.tsx
  PhoneFrame.tsx
  ui.tsx
public/
  locales/
```

## Notes

- Some translation features depend on Google Translate being available in the browser.
- Data is stored locally in the browser, so clearing site data will remove saved records.
- Exported files should be handled carefully because they may contain personal health information.

## Contributing

If you want to extend the app, good next steps are:

- add more supported languages
- improve the export formats
- expand the wellness guidance content
- add reminders or notification support

## License

No license has been specified yet.
