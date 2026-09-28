# Fingo SC-Empower

### Smart Scheme Matching & Concessional Credit Routing for Marginalized Entrepreneurs

*The right scheme. The right partner. In minutes.*

**Smart India Hackathon 2026** | **PS 26092** | Ministry of Social Justice & Empowerment (MoSJE) | Theme: Smart Automation

---

## 1. Overview

**Fingo SC-Empower** is a multilingual platform that connects Scheduled Caste (SC), ST, OBC, and Women entrepreneurs to concessional credit. It answers three questions that today take weeks of offline effort:

1. **Which scheme fits me?** An eligibility and recommendation engine matches the user's profile to the right credit or education loan scheme.
2. **What will I repay?** A calculator projects EMIs using each scheme's real rate, cap, and moratorium.
3. **Where do I apply?** A map locates the nearest eligible channel partner and routes the user *away* from partners with high NPAs or exhausted funds.

> This repository is the submission for **Smart India Hackathon 2026, PS 26092**. 

---

## 2. Problem Statement

| Field | Detail |
|---|---|
| Problem Statement ID | **SIH26092** |
| Title | AI-Driven Scheme Matching for Marginalized Entrepreneurs |
| Organization | Ministry of Social Justice and Empowerment (MoSJE) |
| Technology Bucket | Smart Automation |

**Challenge.** Citizens often cannot tell which credit scheme fits their need (Micro Finance, Term Loan, or Education Loan), and cannot identify the nearest authorised channel partner equipped to process it. The result is offline confusion, misrouted applications, and delayed disbursement.

---

## 3. Solution at a Glance

```
  Beneficiary 
        |
        v
  +--------------------------------+
  | Smart Scheme Recommender       |   rules for eligibility + AI for language
  +---------------+----------------+
                  v
  +--------------------------------+
  | Financial Calculator           |   EMI, moratorium, loan cap
  +---------------+----------------+
                  v
  +--------------------------------+
  | Geo-Spatial Partner Locator    |   nearest eligible partner, NPA-aware
  +---------------+----------------+
                  v
  +--------------------------------+
  | Pre-filled Application Dossier |   handed off to the channel partner
  +--------------------------------+
```

---

## 4. Module 1: Smart Scheme Recommender
A hybrid **rule engine + AI** recommender. Eligibility and tier classification are deterministic rules; AI is used for understanding the user's words and explaining the result in plain language. It checks Annual Family Income, Education Status, and Project Cost to automatically recommend schemes like the Micro Credit Finance (MCF), Term Loan (TL), or Education Loan Scheme.

## 5. Module 2: Financial Calculator
A dynamic, scheme-aware calculator. Unlike a standard commercial EMI calculator, it applies the scheme's concessional rate, loan cap, and moratorium mathematically capitalizing the moratorium interest.

## 6. Module 3: Geo-Spatial Partner Locator & Router
Identifies where the user should apply, and where they should **not**.
*   **Health Score = (1 - NPA Ratio) x Fund Utilisation / Liquidity Factor**
*   Partners are excluded when their NPA ratio crosses a configurable cut-off or their fund allocation is depleted.
*   Uses OpenStreetMap, Nominatim, and Haversine queries to plot and route.

## 7. Tech Stack
*   **Frontend:** React, Tailwind CSS, Leaflet Maps
*   **Backend:** Python, FastAPI
*   **AI/NLP:** Custom LLM matching, multilingual inputs
*   **Deployment:** Mobile-first web application

## 8. Team & License
**Team:** Fingo
**Members:** Aditya Sachin Sonavane, Prashi Rai, Aaryan Choube, Anish Chitnis, Aditi Gandre, Somansh Dafade
**License:** MIT
