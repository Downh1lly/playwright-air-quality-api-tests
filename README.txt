# API Tests (Playwright + TypeScript)

## About

Simple API test framework for the OpenAQ API.

Built to practice:

    API testing with Playwright
    TypeScript structure
    Schema validation with Zod

---

## Stack

    Playwright
    TypeScript
    Zod

---

## Structure

/api        → client + validators
/tests      → test cases
/fixtures   → setup

```

---

## Setup

Set your API key as an environment variable:

X_API_KEY=your_api_key_here

---

## Run tests

```
npm install
npx playwright test

```

---

## Notes

* Uses API client instead of raw requests
* Validates responses with Zod
* Covers positive, negative, and pagination cases

---
