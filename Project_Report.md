# Fingo SC-Empower

### AI-Driven Scheme Matching and Concessional Credit Routing for Marginalized Entrepreneurs

**Project Report  |  Problem Statement SIH26092**

| Item   | Detail   |
| --- | --- |
| Problem Statement ID   | SIH26092   |
| Organization   | Ministry of Social Justice and Empowerment (MoSJE)   |
| Technology Bucket   | Smart Automation   |
| Category   | Software   |

---

## 1. Executive Summary

Fingo SC-Empower is a comprehensive, AI-driven platform designed to automate the discovery and routing of government concessional credit for marginalized entrepreneurs. Currently, citizens face immense friction trying to figure out which loan scheme applies to them and which local channelizing agency actually has the funds and bandwidth to process their application.

Fingo solves this by ingesting basic demographic and project data to instantly recommend the optimal scheme, generate a complete financial repayment plan (accounting for scheme-specific moratoriums), and dynamically route the applicant to the nearest *financially healthy* channel partner.

---

## 2. Problem Statement and Context

### 2.1 The Challenge
Direct loan applications to apex corporations (like NSFDC) are not accepted. Funds flow through a massive network of State Channelizing Agencies (SCAs), Public Sector Banks, and NBFC-MFIs. 

Applicants face severe bottlenecks because they blindly apply to the nearest branch without knowing if that branch has exhausted its funds or is paralyzed by high Non-Performing Assets (NPAs). Furthermore, they often apply for the wrong scheme tier, resulting in instant rejection and months of wasted time.

### 2.2 Gap Analysis
*   **Information Asymmetry:** Citizens cannot parse the complex rules (caps, rates, moratoriums) of the 13+ active schemes.
*   **Blind Routing:** Applications pile up at bad banks while healthy banks remain underutilized.
*   **No Standardized Intake:** SCAs receive incomplete, poorly planned applications.

---

## 3. The Solution: Core Modules

### 3.1 Module 1: Smart Scheme Recommender
A hybrid architecture combining a deterministic rule engine with an AI explainer. 
*   **Rule Engine:** Enforces hard eligibility gates (e.g., Annual Family Income <= ₹5.00 lakh).
*   **AI Explainer:** Takes conversational input from the user (e.g., "I want to start a small dairy with 50,000 rupees") and maps it to the precise scheme tier (Micro Credit Finance vs. Term Loan).

### 3.2 Module 2: Smart Financial Calculator
This module reverse-engineers the 10% applicant margin / 90% loan split.
*   It automatically applies the correct interest rate (e.g., 6.5% for MCF, 8% for Term Loan).
*   It calculates a quarterly EMI schedule that mathematically capitalizes the specific moratorium period (3-6 months) into the principal, providing full financial transparency before the loan is signed.

### 3.3 Module 3: NPA-Aware Geo-Spatial Partner Locator (The Key Innovation)
This is the systemic safeguard of the platform.
*   **Dynamic Health Scoring:** Fingo monitors channel partners and calculates a Health Score based on their NPA Ratio and Fund Utilization.
*   **Smart Geo-Routing:** Using OpenStreetMap and Haversine radius queries, Fingo plots eligible partners within the applicant's radius but dynamically *bypasses* unhealthy, backlogged branches.
*   **Dossier Handoff:** It generates a standardized, pre-screened application package ready for direct integration with SCA portals.

---

## 4. System Architecture

*   **Frontend Interface:** React.js for web and mobile-responsive access.
*   **Backend Orchestration:** Python (FastAPI) handling the API gateway and rule engines.
*   **Geo-Spatial Layer:** Leaflet maps, OSRM routing, and Nominatim for geocoding user locations.
*   **Compliance:** DPDP Act 2023 aligned, ensuring purpose-limited data collection and strict data minimization.

---

## 5. Expected Impact

1.  **For the Beneficiary:** Eliminates the confusion of scheme matching. Provides a clear, transparent EMI schedule and connects them to a bank that is actually ready to lend.
2.  **For the Channel Partners (SCAs):** Drastically reduces the time spent screening applicants, as every dossier arrives pre-verified for scheme eligibility.
3.  **For the Government:** Balances the load across the channel finance network. By routing away from high-NPA partners, it protects government capital and ensures faster fund utilization targets are met.

---

## 6. References
*   MoSJE Evaluation Study on Functioning of NSFDC
*   NSFDC Revised Lending Policy & Prudential Norms
*   DPDP Act, 2023
*   IEEE Xplore: Advanced Framework for Loan Approval Predictions Using AI-Powered Financial Inclusion Models
