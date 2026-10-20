# Playwright E2E Automation Framework - Practice Software Testing

This repository contains the End-to-End (E2E) UI Automation framework for the [Practice Software Testing](https://practicesoftwaretesting.com/) application. It is designed to be fully runnable locally and in CI/CD pipelines.

---

## 📦 Deliverables Overview

This project fulfills the following delivery requirements:
1. **The Test Plan Document**: Outlined in the [Test Plan Summary](#1-test-plan-summary) section below.
2. **Runnable Playwright Project**: Complete code with POM architecture, fixtures, and execution scripts.
3. **Reports & Traces**: Instructions on how to generate and locate HTML reports and traces from local runs.

---

## 📝 1. Test Plan Summary

* **Objective**: Verify the core business flows of the application, focusing on stability, handling Angular asynchronous states (skeleton loaders), and strict negative form validations.
* **In-Scope Features**:
  * **Authentication**: Login success and error handling.
  * **Product Interaction**: Search functionality, out-of-stock filtering, and adding items to the cart.
  * **Checkout Pipeline**: Address form validation (Negative testing), Payment format validation, and successful End-to-End purchase.
* **Automation Strategy**:
  * **Tooling**: Playwright, TypeScript, Node.js.
  * **Design Pattern**: Page Object Model (POM) with Custom Fixtures for dependency injection.

---

## 🚀 2. Prerequisites

Before installing, ensure your machine has the following:
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [Git](https://git-scm.com/)
- Visual Studio Code (Recommended with the *Playwright Test for VSCode* extension)

---

## ⚙️ 3. Installation

Follow these steps to get the source code and install the dependencies:

```bash
# Clone the repository
git clone <your-repository-url>

# Navigate to the project directory
cd <your-project-folder>

# Install project dependencies
npm install

# Install Playwright browsers and dependencies
npx playwright install --with-deps

## 🔐 4. Environment Setup & Security Note

**⚠️ Note for Reviewers:**
For the purpose of this technical assessment and to ensure the framework runs out-of-the-box without requiring you to manually set up environment variables, the test credentials have been kept public/accessible within the project.

**Production Best Practices:**
I am fully aware of security best practices regarding sensitive data. In a real-world, production-grade repository, credentials would **never** be hardcoded or pushed to version control. Instead, they would be handled securely via:
1. Local execution: Using a `.env` file (which would be strictly added to `.gitignore`).
2. CI/CD Execution: Utilizing Pipeline Secrets (e.g., GitHub Actions Secrets) injected at runtime.

*Example of how it would be structured in production (`.env`):*
```env
USER_EMAIL=customer@practicesoftwaretesting.com
USER_PASSWORD=welcome01

## 🏃 5. How to Run the Tests

You can execute the test suite using the following commands:

* **Run all tests (Headless - Default):**
  ```bash
  npx playwright test
  ```
* **Run tests with Browser UI (Headed):**
  ```bash
  npx playwright test --headed
  ```
* **Run tests in Playwright UI Mode (Best for debugging):**
  ```bash
  npx playwright test --ui
  ```
* **Run a specific test file:**
  ```bash
  npx playwright test tests/03-cart.spec.ts
  ```

---

## 📊 6. Where to Find Reports and Traces

After a test run, Playwright automatically generates artifacts for review.

**HTML Report**
The framework generates a comprehensive HTML report located in the `playwright-report/` directory. To open it in your browser, run:
```bash
npx playwright show-report
```

**Trace Viewer (For Failed Tests)**
If a test fails, Playwright captures a full execution trace (DOM snapshots, network logs, and console output) saved in the `test-results/` directory. To view a trace, use:
```bash
npx playwright show-trace test-results/<failed-test-folder>/trace.zip
```

---

## 📁 7. Project Structure

```text
├── fixtures/
│   └── page-fixtures.ts       # Centralized fixtures for POM injection
├── page-objects/              # Encapsulated page behaviors and locators
│   ├── checkout.page.ts
│   ├── home.page.ts
│   ├── login.page.ts
│   └── product.page.ts
├── tests/                     # Test execution scripts
│   ├── 01-login.spec.ts
│   ├── 02-search.spec.ts
│   ├── 03-cart.spec.ts
│   ├── 04-checkout-negative.spec.ts
│   └── 05-e2e-purchase.spec.ts
├── playwright.config.ts       # Global Playwright configuration
└── README.md                  # This documentation file
```