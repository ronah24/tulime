Tulime

Tulime is a climate-smart farming assistant for Zambian smallholder farmers. It helps farmers register their crop profile, view planting advisories, track seasonal windows, and report field conditions to extension officers.

## Why I Built This

I built Tulime because farming decisions in Zambia are increasingly affected by changing rainfall patterns, delayed planting seasons, and limited access to timely agricultural guidance. The goal was to explore how a simple mobile-first web app could help farmers make better planting decisions using location, crop, seed, and weather advisory information.

This project connects my interest in practical software, agriculture, and data-driven decision support. It is designed around a real user problem: helping farmers decide when to plant, what risks to watch, and how to share local field reports.

## What It Does

- Registers a farmer profile with name, phone number, district, crop, and seed variety
- Shows farming advisories with clear risk levels and suggested actions
- Displays a simple crop calendar for planting, growing, and harvest windows
- Lets farmers submit field reports such as pest issues, drought signs, and crop conditions
- Connects to a backend API for farmer registration and report submission
- Uses a mobile-first interface because many target users would access the tool on a phone

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- Backend API hosted on Render

Backend repository: https://github.com/ronah24/-tulime-backend

## What I Learned

- How to design a user flow around a specific audience instead of building a generic app
- How to structure a React app with multiple screens and form state
- How frontend forms connect to backend API endpoints using `fetch`
- How small UI decisions, such as risk labels and action text, can make technical information easier to understand
- How agriculture and climate data can be turned into practical decision-support features

## Screenshots

Coming soon

## Run Locally

```bash
git clone https://github.com/ronah24/tulime.git
cd tulime
npm install
npm run dev
```

Then open the local URL shown in your terminal.

## Future Improvements

- Add real weather and rainfall data by district
- Add authentication for farmers and extension officers
- Store advisory history per farmer
- Add SMS or WhatsApp notifications for planting alerts
- Build an extension officer dashboard for reviewing reports

## Author

Built by Ronah Mbewe.

GitHub: https://github.com/ronah24

