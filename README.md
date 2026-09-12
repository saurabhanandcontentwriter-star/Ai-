# Career Task & HR Tracker

A Google Apps Script + Google Sheets backend designed for AppSheet.

## Features

- Daily and monthly task tracking
- HR job applications
- LinkedIn job tracking
- HR email tracking and follow-ups
- Interviews and results
- Events with accept/reject/attendance status
- Contacts and recruiter tracking
- Dashboard metrics
- Dropdown validation
- Automatic IDs and timestamps
- Daily reminder email
- AppSheet-ready tables

## Setup

1. Create a Google Sheet.
2. Open **Extensions → Apps Script**.
3. Copy `Code.gs` into the Apps Script project.
4. Run `setupCareerTracker()` once and authorize the script.
5. Open AppSheet and select the Google Sheet as the data source.
6. Add the generated tables as AppSheet tables/views.

> LinkedIn is tracked through job/recruiter URLs and application status. This project does not scrape LinkedIn or automatically submit applications.
