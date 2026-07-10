# Mulago National Referral Hospital - Electronic Health Records (EHR)


A fully functional, modern Electronic Health Records (EHR) system designed to digitize patient management, clinical diagnoses, prescriptions, and administrative workflows at Mulago National Referral Hospital, Uganda.

## 🚀 Key Features

- **Role-Based Access Control (RBAC):** Intelligent routing and UI restrictions tailored for Administrators, Doctors, Nurses, Pharmacists, and Records Officers.
- **Real-Time Synchronization:** Utilizes `SWR` (Stale-While-Revalidate) to aggressively cache and fetch data. Clinical updates appear instantly across all hospital terminals.
- **Cloud Database Integration:** Persistent, cloud-hosted storage using Upstash Redis.
- **Secure Authentication:** Stateless, encrypted session cookies managed via `iron-session`.
- **High-Fidelity UI:** A responsive, accessible, and sharply designed clinical interface built with Tailwind CSS v4 and IBM Plex typography.

## 🛠️ Technology Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4
- **Database:** Upstash Redis (JSON)
- **Data Fetching:** SWR
- **Authentication:** iron-session
- **Icons:** Heroicons

## 🔑 Demo & Test Accounts

The system is pre-seeded with 15 realistic hospital staff accounts and patient records. Use the credentials below to test the different access levels and business logic:

| Role | Username | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Administrator** | `sarah.nakato` | `Admin@2026` | Full system access, System Settings, User Management |
| **Doctor** | `ibrahim.sserwadda` | `Doctor@2026` | Dashboard, Patient Management, Diagnoses, Prescriptions |
| **Nurse** | `mary.atim` | `Nurse@2026` | Dashboard, Patient Management, Vitals, Ward allocation |
| **Pharmacist** | `grace.auma` | `Pharma@2026` | Dashboard, Clinical Dispensing Queue (Strictly limited) |
| **Records Officer** | `james.okello` | `Records@2026` | Dashboard, Patient Registration & Demographics |

*Note: For quick testing, the login page features auto-fill buttons for these roles.*

## 💻 Getting Started (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/annagginda/Mulago-Hospital-Electronic-Health-Records-systems.git
cd Mulago-Hospital-Electronic-Health-Records-systems
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory and add your Upstash Redis credentials:
```env
UPSTASH_REDIS_REST_URL="your-upstash-url"
UPSTASH_REDIS_REST_TOKEN="your-upstash-token"
SECRET_COOKIE_PASSWORD="a-complex-32-character-password-here"
```

### 4. Seed the Database
To populate the database with the initial 15 users and 8 patients:
```bash
npm run seed
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📄 License
This project was developed for academic/proposal purposes for Mulago National Referral Hospital. All rights reserved.