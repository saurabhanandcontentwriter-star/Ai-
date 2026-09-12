# 🚀 Saurabh TaskManager

All-in-one personal command center for SEO, AI Marketing, Career/HR applications, LinkedIn jobs, events, contacts and productivity.

## Modules

1. 🔎 SEO Toolkit — keyword, content, audit and optimization workspaces
2. 💼 Job + HR Tracker — applications, recruiters, interviews, follow-ups and results
3. 🤖 AI Tools Hub — provider-neutral prompt workspaces for content, HR and analytics
4. 📊 Analytics Dashboard — live productivity and career metrics
5. 🌐 Personal TaskManager — responsive web dashboard branded for Saurabh

## Files

- `Code.gs` — Apps Script backend, Sheets database, CRUD API, dashboard metrics, reminders, Calendar and email helpers
- `Index.html` — responsive web application
- `appsscript.json` — Apps Script manifest

## Setup

1. Create a Google Sheet.
2. Open **Extensions → Apps Script**.
3. Add `Code.gs`, `Index.html` and `appsscript.json` from this repository.
4. Run `setupCareerTracker()` once and authorize permissions.
5. Reload the Sheet and use **🚀 Saurabh TaskManager → Setup / Reset** when needed.
6. Deploy as **Web app** from Apps Script.
7. For AppSheet, use the generated Google Sheet as the data source.

## Tables

Tasks, HR Applications, LinkedIn Jobs, HR Emails, Events, Contacts, Settings and Dashboard.

## Automation

Automatic IDs, timestamps, validation dropdowns, daily reminder email, dashboard metrics, table CRUD, search/filter, Calendar event helper and email helper.

## Security

No API keys are hard-coded. AI provider credentials should be stored in Apps Script Properties or a secure backend. The project does not scrape LinkedIn or automatically submit applications.
