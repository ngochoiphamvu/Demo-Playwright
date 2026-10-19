# Test Plan: Core Purchase Journey - Practice Software Testing

## 1. Scope, Assumptions, and Risks

**Scope:**
Functional UI testing of the end-to-end purchase journey on `https://practicesoftwaretesting.com`. The flow covers: User Login &rarr; Search/Browse Products &rarr; Add to Cart &rarr; Checkout Pipeline (Address, Shipping, Payment) &rarr; Order Confirmation.

**Assumptions:**
- Test environment is stable and test data (products, stock) is seeded/available.
- 3rd party payment gateways are mocked or use a sandbox environment.
- Automation focuses on Desktop Web view (Chrome/Chromium).

**Main Risks (Testing Against):**
1. **Revenue Impact:** Failures in the checkout or payment submission process preventing users from completing orders.
2. **Data Integrity:** Incorrect cart calculations (price, quantity) leading to business loss or customer dissatisfaction.
3. **Session Management:** Authentication loss mid-journey, forcing users to re-login and potentially abandoning carts.
4. **Concurrency/Stock:** Adding out-of-stock items or stock depletion during the checkout process.

---

## 2. Test Conditions & Test Design Reasoning

To ensure systematic coverage, test conditions encompass **positive, negative, boundary, and edge cases**. The test design applies peer-level testing techniques (Equivalence Partitioning, Boundary Value Analysis, Decision Table, State Transition, Error Guessing) strictly mapped to the system's **Acceptance Criteria (AC)**.

### 2.1. Feature 1: Login Form
**Acceptance Criteria Mapped:** Users must authenticate using a registered email and password. Passwords have length constraints. Invalid inputs must display specific UI errors.

- **Positive Cases (EP):** 
  - Valid Email + Valid Password &rarr; Access Granted.
- **Negative Cases (EP):** 
  - Invalid email formats, unregistered emails, or incorrect passwords &rarr; Access Denied with appropriate validation errors.
- **Boundary Cases (BVA):** 
  - Password length limits. Testing exactly the minimum/maximum allowed characters (e.g., if AC specifies min 6 &rarr; test 5 and 6 characters) to ensure the form validates lengths properly.
- **Edge Cases (Error Guessing):** 
  - SQL Injection / XSS attempts in the email field (`' OR 1=1 --`).

### 2.2. Feature 2: Search/Browse Products
- **Positive/Negative (EP):** Existing keywords (exact/partial match) &rarr; Display results. Non-existent keywords &rarr; Display "No products found".
- **Edge Cases (Error Guessing):** Inputting special HTML/JS characters (e.g., `<script>`) to verify XSS prevention.

### 2.3. Feature 3: Add to Cart
- **Boundary Cases (BVA on Quantity):**
  - `Qty = 0` (Lower bound) &rarr; Invalid/Remove item.
  - `Qty = 1` (Valid minimum) &rarr; Success.
  - `Qty = Max Stock` (Upper bound) &rarr; Success.
  - `Qty = Max Stock + 1` (Invalid upper bound) &rarr; Blocked/Error.
- **Edge Cases (State Transition):**
  - `Active Cart` &rarr; `Session Expiry/Logout` &rarr; `Login Again` &rarr; Expected: Cart state is persisted.

### 2.4. Feature 4: Checkout Pipeline (Address & Payment Forms)
**Acceptance Criteria Mapped:** Address fields (Address, City, State, Country, Postcode) are mandatory. Payment requires valid method selection. Cannot checkout with 0 stock.

- **Positive Cases (EP):**
  - All mandatory address fields filled correctly & valid payment selected &rarr; Allowed to proceed and place order.
- **Negative Cases (EP):**
  - Mandatory fields missing in Address form &rarr; Block transition to the next step, highlight missing fields.
  - Invalid Credit Card format &rarr; Payment rejected.
- **Edge/Boundary Cases (Decision Table & Error Guessing):**
  - **Decision Table Testing on Payment Rules:**
    Used to verify complex business logic during the final checkout step.

    | Conditions | Rule 1 | Rule 2 | Rule 3 | Rule 4 | Rule 5 |
    | :--- | :---: | :---: | :---: | :---: | :---: |
    | User is Logged In? | Y | N | Y | Y | Y |
    | Items in Stock? | Y | Y | N | Y | Y |
    | Payment Info Valid? | Y | - | - | N | Y |
    | API Gateway Responds?| Y | - | - | Y | N |
    | **Actions** | | | | | |
    | Place Order Successfully | **X** | | | | |
    | Redirect to Login | | **X** | | | |
    | Show "Out of Stock" Error| | | **X** | | |
    | Show "Payment Failed" | | | | **X** | |
    | Show "Gateway Timeout" | | | | | **X** |
  - *Stock Depletion mid-checkout:* DB stock changes to 0 externally while the user is at the Payment step. (Decision Table: Payment Valid + Stock Invalid &rarr; Show "Out of Stock" Error, halt transaction).
  - *Session Timeout:* Token expires right before clicking "Confirm Order".

### 2.5. Feature 5: Order Confirmation
- **Edge Cases (State Transition):**
  - `Order Confirmed` &rarr; User clicks browser's `Back` button &rarr; Try to resubmit. Expected: System prevents duplicate submission.
- **Edge Cases (Error Guessing):**
  - *Race Condition:* Rapidly clicking the "Confirm Order" button to ensure it debounces and processes exactly one transaction.

---

## 3. Prioritized Test Cases

**Priority Levels:** P0 (Critical/Blocker), P1 (High), P2 (Medium)
**Test Suites:** Smoke (Core functionality), Regression (Comprehensive coverage)

| ID | Priority | Suite | Feature / Workflow | Title | Technique | Preconditions | Steps | Expected Result |
|---|---|---|---|---|---|---|---|---|
| TC01 | **P0** | **Smoke** | **E2E** | Full Happy Path Purchase (Positive) | Happy Path | User exists. Product in stock. | 1. Login.<br>2. Search product.<br>3. Add to cart.<br>4. Fill checkout.<br>5. Confirm. | Order is placed successfully. Confirmation message shown. |
| TC02 | **P0** | **Smoke** | **1. Login** | Successful Login (Positive) | EP | Valid credentials. | 1. Enter valid email & pass.<br>2. Click Login. | Redirected to User Profile. |
| TC03 | **P1** | **Regression** | **1. Login** | Invalid Login Validation (Negative) | EP | None. | 1. Enter invalid email/password combos.<br>2. Click Login. | Error messages displayed. Access denied. |
| TC04 | **P1** | **Regression** | **2. Search** | Search with existing keyword (Positive) | EP | Product exists. | 1. Input keyword.<br>2. Search. | Product grid shows matching items. |
| TC05 | **P1** | **Regression** | **3. Cart** | Add item exceeding max stock (Boundary) | BVA | Stock = N. | 1. Try to add quantity of N + 1. | System prevents action, shows stock limit error. |
| TC06 | **P2** | **Regression** | **3. Cart** | Cart persistence after logout (Edge) | State Transition | Cart has 1 item. | 1. Logout.<br>2. Login again.<br>3. Check cart. | Cart still retains the previously added item. |
| TC07 | **P0** | **Smoke** | **4. Checkout** | Address mandatory fields (Negative) | EP | At Address step. | 1. Leave required fields empty.<br>2. Click Next. | Validation errors shown. Cannot proceed to Payment. |
| TC08 | **P1** | **Regression** | **4. Checkout** | Stock depleted during checkout (Edge) | Decision Table | At Payment step. | 1. DB stock changes to 0 externally.<br>2. Submit payment. | Transaction halted. "Item out of stock" error displayed. |
| TC09 | **P1** | **Regression** | **4. Checkout** | Invalid Payment Information (Negative) | Decision Table | At Payment step. | 1. Enter invalid card details.<br>2. Submit. | Payment rejected. Error message displayed. |
| TC10 | **P1** | **Regression** | **5. Confirm** | Prevent Duplicate Order (Edge) | Error Guessing | At Confirm step. | 1. Click "Confirm" rapidly 3 times. | Button debounces. Only 1 order created. |
| TC11 | **P2** | **Regression** | **5. Confirm** | Browser Back Button Post-Purchase (Edge) | State Transition | Order confirmed. | 1. Click Browser "Back".<br>2. Resubmit. | Handled gracefully. No duplicate order created. |

---

## 4. Test Data Management Strategy

Effective test data management is critical to prevent data collision between testers and ensure flaky-free automation.

### 4.1. Manual Testing Data Management
- **Centralized Data Repository:** All manual test data (test accounts, mock credit cards, specific product IDs) will be documented in a centralized repository (e.g., Confluence, TestRail, or a secure shared spreadsheet). 
- **Logical Structure:** This repository will be logically organized by Feature/Workflow (e.g., `Feature 1: Login Data`, `Feature 4: Checkout Data`). This establishes a "Single Source of Truth", allowing the QA team to easily find, reserve, and update test data without overlapping or causing conflicts.
- **Inventory Control:** QA will utilize the admin dashboard (if available) or coordinate with the backend team to manually manipulate product states (e.g., forcing a product's stock to 0) to verify edge cases safely without impacting other testers.
- **Environment Clean-up:** After executing scenarios that alter the database state (like placing an order), QA must document the Order ID or cancel the order to maintain a clean testing environment.

### 4.2. Automation Testing Data Management
- **Static Data (Credentials):** Dummy credentials will be securely managed via `.env` files to prevent hardcoding sensitive information in the repository.
- **Dynamic Data (Products/Inventory):** 
   - *Current Implementation Strategy:* The Playwright suite will dynamically query the DOM for available products (e.g., filtering for items with an `in-stock` badge) rather than hardcoding a volatile product name.
   - *Future API Seeding Strategy:* Leverage the backend API within Playwright's `globalSetup` hook to create a dedicated test product, inject precise stock levels, and register a fresh user. In `globalTeardown`, clean up the generated entities to guarantee absolute determinism.
- **Static Data (Credentials):** Dummy credentials will be securely managed via `.env` files to prevent hardcoding sensitive information in the repository.
- **Dynamic Data (Products/Inventory):** 
   - *Current Implementation Strategy:* The Playwright suite will dynamically query the DOM for available products (e.g., filtering for items with an `in-stock` badge) rather than hardcoding a volatile product name.
   - *Future API Seeding Strategy:* Leverage the backend API within Playwright's `globalSetup` hook to create a dedicated test product, inject precise stock levels, and register a fresh user. In `globalTeardown`, clean up the generated entities to guarantee absolute determinism.
