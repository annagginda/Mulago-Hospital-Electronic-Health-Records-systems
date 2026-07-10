import { redis } from '../lib/redis';

// 15 realistic users — 3 per role — covering real hospital staff names
// All passwords are plaintext per project requirement
// Test each role by logging in with the credentials below

const users = [
  // ── ADMINISTRATORS (3) ──────────────────────────────────────────────
  { id:'usr_001', username:'sarah.nakato',     password:'Admin@2026',   name:'Dr. Sarah Nakato',       initials:'SN', role:'Administrator',   active:true,  createdAt:'2026-01-01T00:00:00.000Z' },
  { id:'usr_002', username:'peter.mugisha',    password:'Admin@2026',   name:'Dr. Peter Mugisha',      initials:'PM', role:'Administrator',   active:true,  createdAt:'2026-01-15T00:00:00.000Z' },
  { id:'usr_003', username:'alice.namubiru',   password:'Admin@2026',   name:'Alice Namubiru',         initials:'AN', role:'Administrator',   active:false, createdAt:'2026-02-01T00:00:00.000Z' },

  // ── DOCTORS (3) ─────────────────────────────────────────────────────
  { id:'usr_004', username:'ibrahim.sserwadda',password:'Doctor@2026',  name:'Dr. Ibrahim Sserwadda',  initials:'IS', role:'Doctor',          active:true,  createdAt:'2026-01-01T00:00:00.000Z' },
  { id:'usr_005', username:'fatuma.nakalema',  password:'Doctor@2026',  name:'Dr. Fatuma Nakalema',    initials:'FN', role:'Doctor',          active:true,  createdAt:'2026-01-20T00:00:00.000Z' },
  { id:'usr_006', username:'robert.tendo',     password:'Doctor@2026',  name:'Dr. Robert Tendo',       initials:'RT', role:'Doctor',          active:true,  createdAt:'2026-02-10T00:00:00.000Z' },

  // ── NURSES (3) ──────────────────────────────────────────────────────
  { id:'usr_007', username:'mary.atim',        password:'Nurse@2026',   name:'Mary Atim',              initials:'MA', role:'Nurse',           active:true,  createdAt:'2026-01-01T00:00:00.000Z' },
  { id:'usr_008', username:'joan.nakibuule',   password:'Nurse@2026',   name:'Joan Nakibuule',         initials:'JN', role:'Nurse',           active:true,  createdAt:'2026-01-25T00:00:00.000Z' },
  { id:'usr_009', username:'prossy.apio',      password:'Nurse@2026',   name:'Prossy Apio',            initials:'PA', role:'Nurse',           active:true,  createdAt:'2026-02-05T00:00:00.000Z' },

  // ── RECORDS OFFICERS (3) ────────────────────────────────────────────
  { id:'usr_010', username:'james.okello',     password:'Records@2026', name:'James Okello',           initials:'JO', role:'Records Officer', active:true,  createdAt:'2026-01-01T00:00:00.000Z' },
  { id:'usr_011', username:'rita.nantongo',    password:'Records@2026', name:'Rita Nantongo',          initials:'RN', role:'Records Officer', active:true,  createdAt:'2026-01-18T00:00:00.000Z' },
  { id:'usr_012', username:'samuel.waiswa',    password:'Records@2026', name:'Samuel Waiswa',          initials:'SW', role:'Records Officer', active:false, createdAt:'2026-02-12T00:00:00.000Z' },

  // ── PHARMACISTS (3) ─────────────────────────────────────────────────
  { id:'usr_013', username:'grace.auma',       password:'Pharma@2026',  name:'Grace Auma',             initials:'GA', role:'Pharmacist',      active:true,  createdAt:'2026-01-01T00:00:00.000Z' },
  { id:'usr_014', username:'patrick.kiwanuka', password:'Pharma@2026',  name:'Patrick Kiwanuka',       initials:'PK', role:'Pharmacist',      active:true,  createdAt:'2026-01-22T00:00:00.000Z' },
  { id:'usr_015', username:'eunice.nassali',   password:'Pharma@2026',  name:'Eunice Nassali',         initials:'EN', role:'Pharmacist',      active:true,  createdAt:'2026-02-08T00:00:00.000Z' },
];

/*
 LOGIN CREDENTIALS QUICK REFERENCE
 ──────────────────────────────────────────────────────────────────────
 Role              Username                Password
 ──────────────────────────────────────────────────────────────────────
 Administrator     sarah.nakato            Admin@2026
 Administrator     peter.mugisha           Admin@2026
 Doctor            ibrahim.sserwadda       Doctor@2026
 Doctor            fatuma.nakalema         Doctor@2026
 Doctor            robert.tendo            Doctor@2026
 Nurse             mary.atim               Nurse@2026
 Nurse             joan.nakibuule          Nurse@2026
 Nurse             prossy.apio             Nurse@2026
 Records Officer   james.okello            Records@2026
 Records Officer   rita.nantongo           Records@2026
 Pharmacist        grace.auma              Pharma@2026
 Pharmacist        patrick.kiwanuka        Pharma@2026
 Pharmacist        eunice.nassali          Pharma@2026
 ──────────────────────────────────────────────────────────────────────
 Note: alice.namubiru (Admin) and samuel.waiswa (Records) are inactive
 to test the Settings → System Users active/inactive display.
*/

// All 8 patients from the mockup — full clinical data
const v = (bp:string,temp:string,pulse:string,weight:string,by:string) =>
  ({bp,temp,pulse,weight,recordedBy:by,recordedAt:'22 Jun 2026'});

const patients = [
  { id:'MUL-00136', firstName:'Anna', lastName:'Nabirye', gender:'Female', dob:'12 Mar 1990', age:36, contact:'+256 772 145 220', bloodGroup:'O+', nin:'', address:'Kawempe, Kampala', status:'Outpatient', room:'OPD', registeredOn:'02 Jun 2026',
    vitals:v('124/82','37.1','78','64','Mary Atim'),
    history:[{date:'02 Jun 2026',note:'Presented with recurrent headaches and fatigue. No known allergies.',by:'Dr. Ibrahim Sserwadda'}],
    diagnoses:[{date:'02 Jun 2026',code:'B50',detail:'Plasmodium falciparum malaria',doctor:'Dr. Ibrahim Sserwadda'}],
    prescriptions:[{drug:'Artemether/Lumefantrine',dosage:'80/480mg',frequency:'Twice daily',duration:'3 days',status:'dispensed',by:'Dr. Ibrahim Sserwadda',date:'02 Jun 2026',dispensedBy:'Grace Auma',dispensedOn:'02 Jun 2026'}] },

  { id:'MUL-00137', firstName:'David', lastName:'Mugisha', gender:'Male', dob:'29 Jul 1985', age:40, contact:'+256 701 884 010', bloodGroup:'A+', nin:'', address:'Ntinda, Kampala', status:'Admitted', room:'Ward 3A · Bed 12', registeredOn:'10 Jun 2026',
    vitals:v('148/95','38.4','96','81','Mary Atim'),
    history:[{date:'10 Jun 2026',note:'Admitted with elevated blood pressure and chest discomfort.',by:'Dr. Sarah Nakato'}],
    diagnoses:[{date:'11 Jun 2026',code:'I10',detail:'Essential hypertension',doctor:'Dr. Sarah Nakato'}],
    prescriptions:[
      {drug:'Amlodipine',dosage:'5mg',frequency:'Once daily',duration:'30 days',status:'pending',by:'Dr. Sarah Nakato',date:'11 Jun 2026'},
      {drug:'Hydrochlorothiazide',dosage:'25mg',frequency:'Once daily',duration:'30 days',status:'pending',by:'Dr. Sarah Nakato',date:'11 Jun 2026'}
    ] },

  { id:'MUL-00138', firstName:'Grace', lastName:'Apio', gender:'Female', dob:'05 Nov 2001', age:24, contact:'+256 758 332 119', bloodGroup:'B+', nin:'', address:'Makindye, Kampala', status:'Outpatient', room:'OPD', registeredOn:'14 Jun 2026',
    vitals:v('118/76','36.8','72','58','Mary Atim'),
    history:[{date:'14 Jun 2026',note:'Routine check-up. Reports occasional cough.',by:'Dr. Ibrahim Sserwadda'}],
    diagnoses:[{date:'14 Jun 2026',code:'J06',detail:'Acute upper respiratory infection',doctor:'Dr. Ibrahim Sserwadda'}],
    prescriptions:[{drug:'Amoxicillin',dosage:'500mg',frequency:'Three times daily',duration:'5 days',status:'pending',by:'Dr. Ibrahim Sserwadda',date:'14 Jun 2026'}] },

  { id:'MUL-00139', firstName:'Samuel', lastName:'Kato', gender:'Male', dob:'18 Feb 1973', age:53, contact:'+256 772 905 446', bloodGroup:'O-', nin:'', address:'Nakawa, Kampala', status:'Admitted', room:'Ward 5C · Bed 04', registeredOn:'15 Jun 2026',
    vitals:v('132/88','37.6','84','77','Mary Atim'),
    history:[{date:'15 Jun 2026',note:'Diabetic patient admitted for glucose stabilisation.',by:'Dr. Sarah Nakato'}],
    diagnoses:[{date:'15 Jun 2026',code:'E11',detail:'Type 2 diabetes mellitus',doctor:'Dr. Sarah Nakato'}],
    prescriptions:[{drug:'Metformin',dosage:'850mg',frequency:'Twice daily',duration:'30 days',status:'pending',by:'Dr. Sarah Nakato',date:'15 Jun 2026'}] },

  { id:'MUL-00140', firstName:'Esther', lastName:'Nakaye', gender:'Female', dob:'23 Sep 1996', age:29, contact:'+256 706 221 778', bloodGroup:'AB+', nin:'', address:'Kira, Wakiso', status:'Discharged', room:'—', registeredOn:'05 Jun 2026',
    vitals:v('120/80','36.6','70','62','Mary Atim'),
    history:[{date:'05 Jun 2026',note:'Treated for acute gastroenteritis. Recovered well.',by:'Dr. Ibrahim Sserwadda'}],
    diagnoses:[{date:'05 Jun 2026',code:'A09',detail:'Acute gastroenteritis',doctor:'Dr. Ibrahim Sserwadda'}],
    prescriptions:[{drug:'Oral Rehydration Salts',dosage:'1 sachet',frequency:'After each loose stool',duration:'3 days',status:'dispensed',by:'Dr. Ibrahim Sserwadda',date:'05 Jun 2026',dispensedBy:'Grace Auma',dispensedOn:'05 Jun 2026'}] },

  { id:'MUL-00141', firstName:'Joseph', lastName:'Wasswa', gender:'Male', dob:'14 May 2010', age:16, contact:'+256 781 540 663', bloodGroup:'A-', nin:'', address:'Bweyogerere, Wakiso', status:'Outpatient', room:'OPD', registeredOn:'18 Jun 2026',
    vitals:{},
    history:[{date:'18 Jun 2026',note:'Brought in by guardian with high fever and chills.',by:'Dr. Ibrahim Sserwadda'}],
    diagnoses:[], prescriptions:[] },

  { id:'MUL-00142', firstName:'Patricia', lastName:'Auma', gender:'Female', dob:'01 Dec 1968', age:57, contact:'+256 772 118 904', bloodGroup:'B-', nin:'', address:'Mengo, Kampala', status:'Admitted', room:'Ward 3A · Bed 18', registeredOn:'19 Jun 2026',
    vitals:v('150/98','37.9','90','79','Mary Atim'),
    history:[{date:'19 Jun 2026',note:'Admitted with severe joint pain and swelling.',by:'Dr. Sarah Nakato'}],
    diagnoses:[{date:'20 Jun 2026',code:'M06',detail:'Rheumatoid arthritis',doctor:'Dr. Sarah Nakato'}],
    prescriptions:[{drug:'Methotrexate',dosage:'10mg',frequency:'Weekly',duration:'8 weeks',status:'pending',by:'Dr. Sarah Nakato',date:'20 Jun 2026'}] },

  { id:'MUL-00143', firstName:'Brian', lastName:'Ssempa', gender:'Male', dob:'08 Aug 1992', age:33, contact:'+256 704 667 201', bloodGroup:'O+', nin:'', address:'Najjera, Wakiso', status:'Outpatient', room:'OPD', registeredOn:'21 Jun 2026',
    vitals:v('122/79','36.9','74','70','Mary Atim'),
    history:[{date:'21 Jun 2026',note:'Complains of persistent lower back pain. No significant history.',by:'Dr. Ibrahim Sserwadda'}],
    diagnoses:[], prescriptions:[] },
];

async function seed() {
  console.log('🌱 Starting seed...');

  // Write users
  for (const u of users) {
    await redis.set(`user:${u.username}`, JSON.stringify(u));
    console.log(`  ✅ User: ${u.username} (${u.role})`);
  }
  await redis.set('users:index', JSON.stringify(users.map(u => u.username)));
  console.log(`  ✅ users:index (${users.length} users)`);

  // Write patients
  for (const p of patients) {
    await redis.set(`patient:${p.id}`, JSON.stringify(p));
    console.log(`  ✅ Patient: ${p.id} — ${p.firstName} ${p.lastName}`);
  }
  await redis.set('patients:index', JSON.stringify(patients.map(p => p.id)));
  console.log(`  ✅ patients:index (${patients.length} patients)`);

  // Set ID counter so next patient is MUL-00144
  await redis.set('patients:id_seq', 143);
  console.log('  ✅ patients:id_seq = 143');

  console.log('\n✅ Seed complete! 15 users and 8 patients loaded.');
  console.log('   Next patient ID will be: MUL-00144');
}

seed().catch(console.error);
