# Sargodha Marketplace: Hostinger PHP + MySQL Production Compatibility Plan

Architectural audit and deployment plan to run the complete Sargodha Marketplace application on Hostinger shared hosting using a compiled static frontend communicating with PHP 8 PDO API endpoints and native MySQL/MariaDB, completely eliminating runtime Node.js dependencies while preserving every visual element, feature, and workflow.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions were confirmed through Phase 1 clarification:
> - **Runtime Environment**: Hostinger Shared Hosting with Apache, PHP 8, and MySQL/MariaDB. No Node.js server will run at production runtime.
> - **Frontend Strategy**: Static compiled HTML, CSS, and JavaScript bundle (`dist/` generated via Vite) serving as the single-page application client, integrated directly with server-rendered fallback PHP endpoints and unified Apache routing.
> - **Database Security**: Secure PHP PDO configuration reading credentials from protected environment variables (`.env`) or a separate credentials configuration file guarded against public HTTP access by Apache `.htaccess`.
> - **Authentication Flow**: Native PHP sessions with `HttpOnly`, `SameSite=Lax`, and `Secure` cookie flags, paired with `password_hash` (`PASSWORD_DEFAULT` / Bcrypt).

- **Confirmed Decision 1**: Zero UI Redesign — All current pages, modals, 3D intro, bottom navigation, admin panels, college admission workflows, freight booking, digital skills, food deals, and local branding are preserved without modification or simplification.
- **Confirmed Decision 2**: Dual-Mode Entry Point — Apache `.htaccess` routes frontend requests cleanly to the compiled static frontend (`index.html`) while preserving direct access to `/api/*` endpoints, `/admin/*`, and PHP endpoints.

---

## 1. Overview & Core Concept

- **What It Does**: Sargodha Marketplace is a hyper-local buy, sell, and employment portal dedicated to Sargodha, Shaheenabad, and Sillanwali. It connects buyers, sellers, job seekers, freight logistics transporters, and colleges with zero middleman commissions, featuring a one-time seller activation fee (Rs. 1,000) and direct Call/WhatsApp contact channels.
- **Target Audience / Persona**: Local residents, livestock farmers, citrus orchard owners, electronics and mobile vendors, commercial freight transporters, college applicants, and marketplace administrators.
- **Key Value**: Delivers the high-performance, polished, mobile-first experience designed in AI Studio within the cost-effective, standard shared hosting infrastructure of Hostinger (Apache + PHP 8 + MariaDB/MySQL).

---

## 2. User Experience & Visual Design

The visual design is already approved and will be preserved 100% without alteration:

- **Key User Flows**:
  1. *Public Browsing*: Hero section with search, category filters, and live listings for agricultural produce, livestock, electronics, vehicles, jobs, and campus ads.
  2. *Authentication*: Register to post, login with mobile number/email and password, with strict authentication for administrator credentials (`akm47122@gmail.com`).
  3. *Seller Activation*: One-time Rs. 1,000 seller verification workflow via JazzCash/EasyPaisa with TRX ID submission.
  4. *Post Ad / Post Job / Post Freight*: Multi-step submission forms with photo upload, pricing, contact details, and location selection.
  5. *Colleges & Campus Ads*: Institutional admission ads with course details, deadlines, and safe external Google Forms/portal link redirects.
  6. *Admin Portal*: Moderation dashboard for ad approvals, seller activation payments, college ads, freight, and site settings.
- **Visual Identity & Theme**:
  - *Palette*: Slate 900 background with cyan (`#0891b2`), blue (`#2563eb`), fuchsia (`#c026d3`), and emerald (`#10b981`) accents.
  - *Typography*: Inter / system font stack with tabular numbers for currency formatting.
  - *Navigation*: 8-item mobile bottom navigation (`Market`, `Food`, `Jobs`, `Skills`, `Freight`, `Add`, `Dashboard`, `Admin`) and responsive top district navigation bar.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Static Client Bundle vs. Pure Server-Rendered PHP**
  - *Chosen Approach*: Deploy the compiled static client (`dist/`) directly to Hostinger's `public_html` root, backed by a unified PHP API layer (`/api/*`) for data persistence, authentication, and payments.
  - *Why*: Delivers instant client-side transitions, offline PWA capabilities, and interactive modals without requiring a Node.js process, while keeping all data authoritative inside MySQL.
  - *Alternatives Considered*: Re-writing all React components into PHP templates was rejected because it would duplicate effort, introduce visual regressions, and break rich interactive state.

- **Decision 2: PHP Sessions with Cookie Bridge vs. Pure JWT**
  - *Chosen Approach*: Native PHP session management with session cookies transmitted automatically via `credentials: 'include'` on `fetch()` calls.
  - *Why*: Eliminates token theft vulnerabilities in localStorage, integrates natively with Hostinger's PHP session garbage collection, and respects existing PHP code in `includes/auth_check.php`.

- **Decision 3: Database Credentials Storage**
  - *Chosen Approach*: Maintain a dedicated `config/config.php` that pulls from environment variables (`getenv()`) with a separate fallback file `config/db_credentials.php` placed inside a directory protected by Apache `Deny from all` in `.htaccess`.
  - *Why*: Guarantees zero credential exposure to HTTP visitors or client bundles while allowing easy configuration via Hostinger's hPanel File Manager.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT / BROWSER (MOBILE & DESKTOP)             │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │   Compiled React 19 Client Bundle (HTML5, Tailwind, JS, Assets)  │  │
│  │   • PWA Service Worker & Manifest                                │  │
│  │   • Local Storage Preferences & Session Bridge                   │  │
│  └─────────────────────────────────┬────────────────────────────────┘  │
└────────────────────────────────────┼───────────────────────────────────┘
                                     │ HTTPS Requests
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│               HOSTINGER APACHE WEB SERVER (public_html)                │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │   .htaccess Routing Engine                                       │  │
│  │   • If request is file or directory: Serve directly (assets, images)│
│  │   • If request begins with /api/: Route to PHP API dispatcher   │  │
│  │   • If request begins with /admin/ or .php: Execute PHP script   │  │
│  │   • Otherwise: Fallback to index.html (Client-side routing)     │  │
│  └─────────────────────────────────┬────────────────────────────────┘  │
│                                    │
│        ┌───────────────────────────┴──────────────────────────┐
│        ▼                                                      ▼
│  ┌─────────────────────────────┐            ┌──────────────────────────┐
│  │     PHP API LAYER (/api/*)  │            │     PHP ADMIN / SCRIPTS  │
│  │  • auth.php (Login/Register)│            │  • admin/index.php       │
│  │  • listings.php (CRUD)      │            │  • activate-seller.php   │
│  │  • colleges.php             │            │  • user/dashboard.php    │
│  │  • chat.php & telegram.php  │            └─────────────┬────────────┘
│  └──────────────┬──────────────┘                          │
│                 │                                         │
│                 ▼                                         ▼
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │   CORE PHP SERVICES & SECURITY                                   │  │
│  │   • config/config.php & db.php (PDO Connection Pool)             │  │
│  │   • config/csrf.php (CSRF Token Verification)                    │  │
│  │   • includes/functions.php (Business Rules & Helpers)           │  │
│  │   • PHP Native Sessions (Session Cookie: Lax, HttpOnly)          │  │
│  └─────────────────────────────────┬────────────────────────────────┘  │
└────────────────────────────────────┼───────────────────────────────────┘
                                     │ PDO Prepared Queries
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   HOSTINGER MYSQL / MARIADB DATABASE                   │
│  • users (Profiles, Auth, Roles: user, admin, super_admin)             │
│  • listings & listing_images (Published, Featured, Draft)              │
│  • categories & subcategories (Hierarchical Taxonomy)                  │
│  • activation_payments & featured_listings (Audit Logs)                │
│  • college_ads (Campus admissions, Google Forms links)                 │
│  • jobs & restaurants & food_deals (Local modules)                     │
│  • site_settings (Dynamic fees, contact numbers, branding)             │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Flow & Execution Strategy

1. **Compilation Phase (Build)**:
   - Run `npm run build` in AI Studio to output the static distribution into `dist/`.
   - The compiled client files (`index.html`, `assets/*.js`, `assets/*.css`) will reside alongside the PHP backend files.
2. **API Communication**:
   - The frontend's service layer will issue REST calls to `/api/*.php` endpoints using standard `fetch()` with `credentials: 'include'`.
   - Each PHP endpoint validates session auth, checks CSRF headers on state-mutating requests (`POST`/`PUT`/`DELETE`), queries MySQL via PDO prepared statements, and returns standardized JSON responses: `{ "success": true, "data": ... }`.
3. **Database Migration & Credentials Template**:
   - Generate a sanitized `config/db_credentials.sample.php` for the user to copy to `config/db_credentials.php` on Hostinger.
   - Supply an idempotent `database_migration.sql` ensuring all recent tables (`college_ads`, `restaurants`, `food_deals`, `food_menu_items`) exist in MySQL without dropping or altering existing user records.
4. **Apache Routing (`.htaccess`)**:
   - Protect sensitive files (`.env`, `database.sql`, `config/`) from public HTTP access.
   - Enable Gzip/Deflate compression and CORS security headers.
   - Direct API and PHP calls to PHP while routing client URL paths to `index.html`.
