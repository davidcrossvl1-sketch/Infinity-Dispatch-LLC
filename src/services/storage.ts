import {
  Carrier,
  CarrierApplication,
  LoadItem,
  Dispatcher,
  SalesPerson,
  MessageInquiry,
  PaymentRecord,
  OwnerActivity,
  OwnerUser,
  Review,
  StickyNote,
  DemoBooking,
  ChatMessage,
  EmailNotificationRecord,
  GeneratedInvoice,
  RosterCarrier,
  InvoiceStatus,
  LoadStatus,
  CarrierPerformance,
} from '../types';

export interface StoredEditorDocument {
  id: string;
  name: string;
  type: string;
  carrierName?: string;
  loadNumber?: string;
  pageCount: number;
  lastModified: string;
  modifiedBy: string;
  dataUrl?: string;
  elementsJson?: string;
  isPasswordProtected?: boolean;
}

export const OFFICIAL_OWNERS: OwnerUser[] = [
  {
    id: 'owner-david-cross',
    name: 'David Cross',
    email: 'Davidcross.vl1@gmail.com',
    phone: '+1 (409) 509-6940',
    role: 'OWNER / SUPER ADMIN',
  },
  {
    id: 'owner-alvin',
    name: 'Alvin',
    email: 'alvin.vast@gmail.com',
    phone: '+1 (409) 509-6940',
    role: 'OWNER / SUPER ADMIN',
  },
];

const INITIAL_CARRIERS: Carrier[] = [
  {
    id: 'c-101',
    companyName: 'Apex Interstate Express LLC',
    ownerName: 'Marcus Vance',
    email: 'mvance@apexinterstate.com',
    phone: '(214) 555-8392',
    mcNumber: 'MC-1489201',
    dotNumber: 'USDOT 3920141',
    vinNumber: '1FT8W3BT4NEC89201',
    driversLicense: 'TX-DL-89201410',
    equipmentType: 'Dry Van',
    truckCount: 3,
    currentZip: '75201',
    preferredLanes: ['TX → Midwest', 'TX → Southeast', 'Midwest → TX'],
    preferredRPM: 2.75,
    maxDeadhead: 65,
    availableDate: '2026-11-06',
    insuranceStatus: 'Active ($1M / $100K)',
    assignedDispatcher: 'Sarah Jenkins',
    assignedOwner: 'David Cross',
    status: 'Active',
    createdAt: '2026-08-14',
    documents: { w9: true, coi: true, mcAuthority: true, noa: true, driversLicense: true },
  },
  {
    id: 'c-102',
    companyName: 'Blue Ridge Freight Lines',
    ownerName: 'Tyler Morrison',
    email: 'dispatch@blueridgefl.com',
    phone: '(423) 555-1940',
    mcNumber: 'MC-1290384',
    dotNumber: 'USDOT 3681920',
    vinNumber: '1FUJBBCK8LL829102',
    driversLicense: 'TN-DL-98210492',
    equipmentType: 'Reefer',
    truckCount: 2,
    currentZip: '37201',
    preferredLanes: ['Southeast → Northeast', 'Midwest → Southeast'],
    preferredRPM: 3.15,
    maxDeadhead: 50,
    availableDate: '2026-11-06',
    insuranceStatus: 'Active ($1M / $100K)',
    assignedDispatcher: 'Sarah Jenkins',
    assignedOwner: 'Alvin',
    status: 'Active',
    createdAt: '2026-09-02',
    documents: { w9: true, coi: true, mcAuthority: true, noa: true, driversLicense: true },
  },
  {
    id: 'c-103',
    companyName: 'Iron Horse Hauling LLC',
    ownerName: 'Derrick Caldwell',
    email: 'ironhorse.derrick@gmail.com',
    phone: '(312) 555-4081',
    mcNumber: 'MC-984321',
    dotNumber: 'USDOT 2847291',
    vinNumber: '3AKJGLD59LS910248',
    driversLicense: 'IL-DL-38910294',
    equipmentType: 'Flatbed',
    truckCount: 1,
    currentZip: '60601',
    preferredLanes: ['Midwest → South', 'Texas Triangle'],
    preferredRPM: 3.40,
    maxDeadhead: 75,
    availableDate: '2026-11-07',
    insuranceStatus: 'Active ($1M / $100K)',
    assignedDispatcher: 'Elena Rostova',
    assignedOwner: 'David Cross',
    status: 'Active',
    createdAt: '2026-09-18',
    documents: { w9: true, coi: true, mcAuthority: true, noa: true, driversLicense: true },
  },
  {
    id: 'c-104',
    companyName: 'Silver Star Logistics Inc',
    ownerName: 'Gabriel Ramos',
    email: 'gabe@silverstarlogistics.us',
    phone: '(602) 555-7264',
    mcNumber: 'MC-1502931',
    dotNumber: 'USDOT 4018290',
    vinNumber: '2WKDK40X3HM910248',
    driversLicense: 'AZ-DL-71029481',
    equipmentType: 'Step Deck',
    truckCount: 2,
    currentZip: '85001',
    preferredLanes: ['Southwest → West Coast', 'TX → AZ'],
    preferredRPM: 3.65,
    maxDeadhead: 60,
    availableDate: '2026-11-08',
    insuranceStatus: 'Active ($1M / $100K)',
    assignedDispatcher: 'Elena Rostova',
    assignedOwner: 'Alvin',
    status: 'Active',
    createdAt: '2026-10-05',
    documents: { w9: true, coi: true, mcAuthority: true, noa: true, driversLicense: true },
  },
  {
    id: 'c-105',
    companyName: 'Falcon Fast Hotshot LLC',
    ownerName: 'Nathan Cole',
    email: 'nathan@falconhotshot.com',
    phone: '(832) 555-9102',
    mcNumber: 'MC-1619024',
    dotNumber: 'USDOT 4192019',
    vinNumber: '1GC4KVE79MF291048',
    driversLicense: 'TX-DL-91029482',
    equipmentType: 'Hotshot',
    truckCount: 1,
    currentZip: '77001',
    preferredLanes: ['TX Regional', 'TX → LA', 'TX → OK'],
    preferredRPM: 2.35,
    maxDeadhead: 45,
    availableDate: '2026-11-06',
    insuranceStatus: 'Active ($1M / $100K)',
    assignedDispatcher: 'David Cross',
    assignedOwner: 'David Cross',
    status: 'Active',
    createdAt: '2026-10-19',
    documents: { w9: true, coi: true, mcAuthority: true, noa: true, driversLicense: true },
  },
];

const INITIAL_APPLICATIONS: CarrierApplication[] = [
  {
    id: 'app-1',
    applicationNumber: 1,
    fullName: 'Javier Mendez',
    companyName: 'Mendez Transport Group',
    email: 'jmendez@mendeztrans.com',
    phone: '(210) 555-6621',
    mcNumber: 'MC-1702914',
    dotNumber: 'USDOT 4291029',
    vinNumber: '1XKDDB9X4KJ291049',
    driversLicense: 'TX-DL-82910492',
    equipmentType: 'Dry Van',
    truckCount: 2,
    currentZip: '78201',
    preferredLanes: 'San Antonio, TX to Atlanta, GA and Memphis, TN',
    preferredRPM: 2.65,
    maxDeadhead: 60,
    availableDate: '2026-11-10',
    insuranceStatus: '$1,000,000 Auto Liability / $100,000 Cargo with Progressive',
    additionalRequirements: 'Prefer no-touch dry freight with weekly quick settlements.',
    assignedOwner: 'David Cross',
    submittedAt: '2026-11-04 09:24',
    status: 'Pending',
    uploadedFiles: ['COI_Mendez.pdf', 'W9_Signed_2026.pdf', 'MC_Authority_Certificate.pdf', 'DriversLicense_Mendez.pdf', 'VoidedCheck_NOA.pdf'],
    documents: {
      w9: true,
      coi: true,
      mcAuthority: true,
      driversLicense: true,
      noaOrVoidedCheck: true,
    },
  },
  {
    id: 'app-2',
    applicationNumber: 2,
    fullName: 'Darnell Washington',
    companyName: 'Lone Wolf Hauling LLC',
    email: 'darnell@lonewolfhauling.com',
    phone: '(317) 555-3920',
    mcNumber: 'MC-1689201',
    dotNumber: 'USDOT 4209182',
    vinNumber: '3AKJGLD58MS892014',
    driversLicense: 'IN-DL-49201840',
    equipmentType: 'Reefer',
    truckCount: 1,
    currentZip: '46201',
    preferredLanes: 'Midwest outbound to Florida or Georgia, regular weekly loops',
    preferredRPM: 3.10,
    maxDeadhead: 50,
    availableDate: '2026-11-09',
    insuranceStatus: '$1M Liability / $250K Reefer Breakdown Cargo',
    additionalRequirements: 'Ready for full dedicated dispatch support.',
    assignedOwner: 'Alvin',
    submittedAt: '2026-11-05 11:15',
    status: 'Pending',
    uploadedFiles: ['COI_Reefer.pdf', 'W9_LoneWolf.pdf', 'MC_Letter.pdf', 'DL_Washington.pdf'],
    documents: {
      w9: true,
      coi: true,
      mcAuthority: true,
      driversLicense: true,
      noaOrVoidedCheck: true,
    },
  },
];

const INITIAL_LOADS: LoadItem[] = [
  {
    id: 'load-801',
    loadNumber: 'INF-2026-0891',
    carrierId: 'c-101',
    carrierName: 'Apex Interstate Express LLC',
    carrierPhone: '(214) 555-8392',
    driverName: 'Marcus Vance',
    driverPhone: '(214) 555-8392',
    dispatcherName: 'David Cross',
    dispatcherPhone: '+1 (409) 509-6940',
    mcNumber: 'MC-1489201',
    equipmentType: 'Dry Van',
    originCity: 'Dallas',
    originState: 'TX',
    puAddress: '4800 Logistics Way, Dallas, TX 75241',
    puTime: '08:00 AM CST',
    destinationCity: 'Columbus',
    destinationState: 'OH',
    delAddress: '1200 Distribution Pkwy, Columbus, OH 43228',
    delTime: '02:00 PM EST',
    pickupDate: '2026-11-05',
    deliveryDate: '2026-11-07',
    brokerName: 'C.H. Robinson Worldwide',
    brokerageMc: 'MC-108920',
    brokerPhone: '(800) 323-7587',
    brokerageEmail: 'loads@chrobinson.com',
    rate: 2850,
    loadedMiles: 1045,
    deadheadMiles: 38,
    rpm: 2.73,
    status: 'In Transit',
    dispatchFeePercent: 7,
    dispatchFeeAmount: 199.50,
    paymentStatus: 'Processing',
    invoiceStatus: 'Invoice Sent',
    invoiceNumber: 'INV-8910',
    rcDocumentName: 'Rate_Confirmation_INF-0891.pdf',
    rcDocumentContent: 'OFFICIAL RATE CONFIRMATION #INF-2026-0891\nBroker: C.H. Robinson Worldwide (MC-108920)\nCarrier: Apex Interstate Express LLC (MC-1489201)\nDriver: Marcus Vance | Cell: (214) 555-8392\nOrigin: 4800 Logistics Way, Dallas, TX 75241\nDestination: 1200 Distribution Pkwy, Columbus, OH 43228\nAgreed Total Rate: $2,850.00 USD (All-In)\nDispatch Fee: 7% ($199.50)\nDirect Carrier Payout: $2,650.50\nSignature: Signed by David Cross (Infinity Dispatch LLC Authorized Agent)',
    bolDocumentName: 'Bill_of_Lading_BOL-8910.pdf',
    bolDocumentContent: 'STRAIGHT BILL OF LADING #BOL-8910\nShipper: Dallas Central Distribution, 4800 Logistics Way, Dallas, TX 75241\nConsignee: Buckeye Retail Logistics, 1200 Distribution Pkwy, Columbus, OH 43228\nCarrier: Apex Interstate Express LLC | Trailer #5309\nCommodity: 24 Pallets Non-Hazardous Packaged Goods\nGross Weight: 38,450 lbs\nStatus: Shipper Load & Count Verified / Sealed #778921',
    commodity: 'Packaged Consumer Goods (No-Touch)',
    notes: 'Pre-cooled consumer packaged goods. Clean check call at 08:00 AM near Little Rock, AR.',
    createdAt: '2026-11-04',
    updatedAt: '2026-11-05',
  },
  {
    id: 'load-802',
    loadNumber: 'INF-2026-0892',
    carrierId: 'c-102',
    carrierName: 'Blue Ridge Freight Lines',
    carrierPhone: '(423) 555-1940',
    driverName: 'Tyler Morrison',
    driverPhone: '(423) 555-1940',
    dispatcherName: 'Alvin',
    dispatcherPhone: '+1 (409) 509-6940',
    mcNumber: 'MC-1290384',
    equipmentType: 'Reefer',
    originCity: 'Nashville',
    originState: 'TN',
    puAddress: '900 Cold Storage Blvd, Nashville, TN 37210',
    puTime: '10:30 AM CST',
    destinationCity: 'Philadelphia',
    destinationState: 'PA',
    delAddress: '3500 Food Center Dr, Philadelphia, PA 19148',
    delTime: '06:00 AM EST',
    pickupDate: '2026-11-06',
    deliveryDate: '2026-11-08',
    brokerName: 'Total Quality Logistics (TQL)',
    brokerageMc: 'MC-320491',
    brokerPhone: '(800) 580-3101',
    brokerageEmail: 'dispatch@tql.com',
    rate: 3400,
    loadedMiles: 755,
    deadheadMiles: 25,
    rpm: 4.50,
    status: 'Booked',
    dispatchFeePercent: 5,
    dispatchFeeAmount: 170.00,
    paymentStatus: 'Pending',
    invoiceStatus: 'Pending Payment',
    invoiceNumber: 'INV-8911',
    rcDocumentName: 'Rate_Confirmation_INF-0892_TQL.pdf',
    rcDocumentContent: 'OFFICIAL RATE CONFIRMATION #INF-2026-0892\nBroker: Total Quality Logistics (TQL) (MC-320491)\nCarrier: Blue Ridge Freight Lines (MC-1290384)\nDriver: Tyler Morrison | Phone: (423) 555-1940\nOrigin: Nashville, TN -> Destination: Philadelphia, PA\nReefer Temp: Continuous -10 deg F\nGross Agreed Rate: $3,400.00 USD\nDispatch Fee: 5% ($170.00)\nDirect Broker Payout to Carrier: $3,230.00',
    bolDocumentName: 'Bill_of_Lading_BOL-8911.pdf',
    bolDocumentContent: 'STRAIGHT BILL OF LADING #BOL-8911\nShipper: Nashville Cold Storage Hub\nConsignee: Philly Food Terminal\nCommodity: Frozen Dairy & Poultry (-10 F)\nWeight: 41,200 lbs | Pallets: 22\nDriver Signature on File.',
    commodity: 'Frozen Poultry & Dairy (-10°F)',
    notes: 'Temperature continuous at -10°F. Rate con signed and broker setup verified.',
    createdAt: '2026-11-05',
    updatedAt: '2026-11-05',
  },
  {
    id: 'load-803',
    loadNumber: 'INF-2026-0893',
    carrierId: 'c-103',
    carrierName: 'Iron Horse Hauling LLC',
    carrierPhone: '(312) 555-4081',
    driverName: 'Derrick Caldwell',
    driverPhone: '(312) 555-4081',
    dispatcherName: 'David Cross',
    dispatcherPhone: '+1 (409) 509-6940',
    mcNumber: 'MC-984321',
    equipmentType: 'Flatbed',
    originCity: 'Gary',
    originState: 'IN',
    puAddress: '1 Industrial Mill Rd, Gary, IN 46402',
    puTime: '07:00 AM CST',
    destinationCity: 'Houston',
    destinationState: 'TX',
    delAddress: '9200 Ship Channel Blvd, Houston, TX 77029',
    delTime: '01:00 PM CST',
    pickupDate: '2026-11-07',
    deliveryDate: '2026-11-09',
    brokerName: 'Landstar Transportation',
    brokerageMc: 'MC-143210',
    brokerPhone: '(800) 872-9400',
    brokerageEmail: 'steel@landstar.com',
    rate: 3800,
    loadedMiles: 1080,
    deadheadMiles: 45,
    rpm: 3.52,
    status: 'Booked',
    dispatchFeePercent: 6,
    dispatchFeeAmount: 228.00,
    paymentStatus: 'Pending',
    invoiceStatus: 'Not Invoiced',
    invoiceNumber: 'INV-8912',
    rcDocumentName: 'Rate_Confirmation_INF-0893_Landstar.pdf',
    rcDocumentContent: 'OFFICIAL RATE CONFIRMATION #INF-2026-0893\nBroker: Landstar Transportation (MC-143210)\nCarrier: Iron Horse Hauling LLC (MC-984321)\nOrigin: Gary, IN -> Houston, TX\nRate: $3,800.00 USD (Includes $250 Tarp Fee)\nDispatch Fee: 6% ($228.00)',
    bolDocumentName: 'Bill_of_Lading_BOL-8913.pdf',
    bolDocumentContent: 'STRAIGHT BILL OF LADING #BOL-8913\nShipper: Gary Steel Works, IN\nConsignee: Houston Port Marine Services, TX\nCommodity: Structural Steel Coils (4 Coils Eye-to-Sky)\nWeight: 44,800 lbs | Straps & Edge Protectors Applied',
    commodity: 'Structural Steel Coils (Tarped)',
    notes: 'Structural steel coils. 4-inch straps and edge protectors required by shipper.',
    createdAt: '2026-11-05',
    updatedAt: '2026-11-05',
  },
];

const INITIAL_ROSTER_CARRIERS: RosterCarrier[] = [
  {
    id: 'roster-1',
    driverName: 'Marcus Vance',
    driverPhone: '(214) 555-8392',
    carrierName: 'Apex Interstate Express LLC',
    carrierPhone: '(214) 555-8392',
    carrierEmail: 'apexinterstate.dispatch@gmail.com',
    mcNumber: 'MC-1489201',
    dotNumber: '3920141',
    carrierAddress: '4800 Logistics Way, Dallas, TX 75241',
    truckType: 'Dry Van',
    equipmentType: 'Dry Van',
    vinNumber: '1FT8W3BT9NED48912',
    notes: 'Prefers TX → OH/GA/NC lanes. No NYC or Northeast. Target RPM $2.80+. Remit factoring via RTS Financial.',
    dispatcherName: 'David Cross',
    dispatcherPhone: '+1 (409) 509-6940',
    salesPersonName: 'Marcus Sterling',
    dispatchedAmount: 2850,
    dispatchFeePercent: 7,
    invoiceStatus: 'Invoice Sent',
    loadStatus: 'In Transit',
    originDestination: 'Dallas, TX → Columbus, OH',
    documents: [
      { id: 'doc-1', name: 'MC_Authority_Certificate_Apex.pdf', type: 'MC Authority', fileUrl: '/assets/sample_mc.pdf', uploadedAt: '2026-11-04' },
      { id: 'doc-2', name: 'W9_Tax_Form_Apex_2026.pdf', type: 'W-9', fileUrl: '/assets/sample_w9.pdf', uploadedAt: '2026-11-04' },
      { id: 'doc-3', name: 'Certificate_of_Insurance_Apex_1M.pdf', type: 'COI', fileUrl: '/assets/sample_coi.pdf', uploadedAt: '2026-11-04' },
      { id: 'doc-4', name: 'NOA_Factoring_RTS_Apex.pdf', type: 'NOA', fileUrl: '/assets/sample_noa.pdf', uploadedAt: '2026-11-04' },
      { id: 'doc-5', name: 'Driver_License_Marcus_CDL_A.pdf', type: 'Driver License', fileUrl: '/assets/sample_cdl.pdf', uploadedAt: '2026-11-04' },
    ],
    updatedAt: '2026-11-06 09:15',
  },
  {
    id: 'roster-2',
    driverName: 'Tyler Morrison',
    driverPhone: '(423) 555-1940',
    carrierName: 'Blue Ridge Freight Lines',
    carrierPhone: '(423) 555-1940',
    carrierEmail: 'blueridge.tyler@gmail.com',
    mcNumber: 'MC-1290384',
    dotNumber: '3681920',
    carrierAddress: '120 Mountain View Rd, Chattanooga, TN 37402',
    truckType: 'Reefer',
    equipmentType: 'Reefer',
    vinNumber: '3AKJHHDR8NS891024',
    notes: 'Refrigerated 53ft unit with Thermo King pre-cooler. Requires continuous temp monitoring. Target $3.20+/mi.',
    dispatcherName: 'Alvin',
    dispatcherPhone: '+1 (409) 509-6940',
    salesPersonName: 'Marcus Sterling',
    dispatchedAmount: 3400,
    dispatchFeePercent: 5,
    invoiceStatus: 'Pending Payment',
    loadStatus: 'Booked',
    originDestination: 'Nashville, TN → Philadelphia, PA',
    documents: [
      { id: 'doc-201', name: 'MC_Authority_BlueRidge.pdf', type: 'MC Authority', fileUrl: '/assets/sample_mc.pdf', uploadedAt: '2026-11-05' },
      { id: 'doc-202', name: 'COI_Reefer_Cargo_100K.pdf', type: 'COI', fileUrl: '/assets/sample_coi.pdf', uploadedAt: '2026-11-05' },
      { id: 'doc-203', name: 'W9_Signed_BlueRidge.pdf', type: 'W-9', fileUrl: '/assets/sample_w9.pdf', uploadedAt: '2026-11-05' },
    ],
    updatedAt: '2026-11-06 08:30',
  },
  {
    id: 'roster-3',
    driverName: 'Derrick Caldwell',
    driverPhone: '(312) 555-4081',
    carrierName: 'Iron Horse Hauling LLC',
    carrierPhone: '(312) 555-4081',
    carrierEmail: 'ironhorse.derrick@gmail.com',
    mcNumber: 'MC-984321',
    dotNumber: '2847291',
    carrierAddress: '7800 S Commercial Ave, Chicago, IL 60617',
    truckType: 'Flatbed',
    equipmentType: 'Flatbed',
    vinNumber: '2C3CDZFJ8NH559102',
    notes: '48ft Flatbed with steel tarps, 8ft lumber tarps, chains & binders. Heavy machinery and pipe experienced.',
    dispatcherName: 'David Cross',
    dispatcherPhone: '+1 (409) 509-6940',
    salesPersonName: 'Jessica Vance',
    dispatchedAmount: 3800,
    dispatchFeePercent: 6,
    invoiceStatus: 'Cleared / Paid',
    loadStatus: 'Booked',
    originDestination: 'Gary, IN → Houston, TX',
    documents: [
      { id: 'doc-301', name: 'MC_IronHorse_Authority.pdf', type: 'MC Authority', fileUrl: '/assets/sample_mc.pdf', uploadedAt: '2026-11-03' },
      { id: 'doc-302', name: 'COI_Progressive_1M.pdf', type: 'COI', fileUrl: '/assets/sample_coi.pdf', uploadedAt: '2026-11-03' },
    ],
    updatedAt: '2026-11-05 16:45',
  },
  {
    id: 'roster-4',
    driverName: 'Nathan Cole',
    driverPhone: '(832) 555-9102',
    carrierName: 'Falcon Fast Hotshot LLC',
    carrierPhone: '(832) 555-9102',
    carrierEmail: 'falconhotshot.tx@gmail.com',
    mcNumber: 'MC-1619024',
    dotNumber: '4192019',
    carrierAddress: '1540 Westheimer Rd, Houston, TX 77006',
    truckType: 'Hotshot',
    equipmentType: 'Hotshot',
    vinNumber: '1D7RV1GT2AS991048',
    notes: '40ft Gooseneck with mega ramps. Oilfield and expedited steel runs across Texas & Oklahoma. Clean DOT inspection.',
    dispatcherName: 'David Cross',
    dispatcherPhone: '+1 (409) 509-6940',
    salesPersonName: 'Jessica Vance',
    dispatchedAmount: 2200,
    dispatchFeePercent: 7,
    invoiceStatus: 'Cleared / Paid',
    loadStatus: 'Completed',
    originDestination: 'Houston, TX → Midland, TX',
    documents: [
      { id: 'doc-401', name: 'MC_Falcon_Fast_Hotshot.pdf', type: 'MC Authority', fileUrl: '/assets/sample_mc.pdf', uploadedAt: '2026-11-02' },
      { id: 'doc-402', name: 'W9_Falcon_2026.pdf', type: 'W-9', fileUrl: '/assets/sample_w9.pdf', uploadedAt: '2026-11-02' },
    ],
    updatedAt: '2026-11-04 18:20',
  },
];

const INITIAL_DISPATCHERS: Dispatcher[] = [
  {
    id: 'disp-1',
    name: 'David Cross',
    email: 'Davidcross.vl1@gmail.com',
    phone: '+1 (409) 509-6940',
    assignedCarriersCount: 6,
    activeLoadsCount: 3,
    status: 'Active',
  },
  {
    id: 'disp-2',
    name: 'Alvin',
    email: 'alvin.vast@gmail.com',
    phone: '+1 (409) 509-6940',
    assignedCarriersCount: 5,
    activeLoadsCount: 3,
    status: 'Active',
  },
  {
    id: 'disp-3',
    name: 'Sarah Jenkins',
    email: 'sjenkins@infinitydispatchllcusa.com',
    phone: '+1 (409) 509-6941',
    assignedCarriersCount: 4,
    activeLoadsCount: 2,
    status: 'Active',
  },
  {
    id: 'disp-4',
    name: 'Elena Rostova',
    email: 'erostova@infinitydispatchllcusa.com',
    phone: '+1 (409) 509-6942',
    shift: 'Night (24/7)',
    commissionPercent: 7,
    assignedCarriersCount: 3,
    activeLoadsCount: 2,
    status: 'Active',
  },
];

const INITIAL_SALES_PERSONS: SalesPerson[] = [
  {
    id: 'sales-1',
    name: 'Marcus Sterling',
    email: 'msterling@infinitydispatchllcusa.com',
    phone: '+1 (409) 509-6950',
    commissionRate: 5,
    status: 'Active',
    onboardedCarriersCount: 8,
    totalRevenueGenerated: 24500,
    joinedDate: '2026-09-15',
    notes: 'Senior Recruiter focusing on Midwest Flatbed and Reefer fleets.',
    assignedCarriers: ['MC-1489201', 'MC-1290384'],
  },
  {
    id: 'sales-2',
    name: 'Jessica Vance',
    email: 'jvance@infinitydispatchllcusa.com',
    phone: '+1 (409) 509-6951',
    commissionRate: 5,
    status: 'Active',
    onboardedCarriersCount: 5,
    totalRevenueGenerated: 16800,
    joinedDate: '2026-10-01',
    notes: 'Southeast lane recruiter. High success rate with owner-operators.',
    assignedCarriers: ['MC-984321', 'MC-1619024'],
  },
];

const INITIAL_INQUIRIES: MessageInquiry[] = [
  {
    id: 'inq-301',
    fullName: 'Robert Sterling',
    companyName: 'Sterling Haulage',
    email: 'robert@sterlinghaul.com',
    phone: '(512) 555-9014',
    equipment: 'Flatbed',
    subject: 'Inquiry regarding flatbed dispatch rates in Texas',
    message: 'Hello David and Alvin, I run 2 flatbeds out of Austin and San Antonio. What are your average RPMs and broker setup times?',
    assignedOwner: 'David Cross',
    status: 'Sent',
    createdAt: '2026-11-05 13:40',
  },
  {
    id: 'inq-302',
    fullName: 'Kenneth Brooks',
    companyName: 'KB Express Logistics',
    email: 'kbrooks@kbexpress.net',
    phone: '(404) 555-8123',
    equipment: 'Dry Van',
    subject: 'Interested in Southeastern lane dispatch',
    message: 'Looking for a dispatch partner that handles all broker check calls and detention tracking.',
    assignedOwner: 'Alvin',
    status: 'Replied',
    replyText: 'Kenneth, we have direct freight lanes running Atlanta to Dallas paying $2.65+/mi. Calling you today.',
    replyAuthor: 'Alvin',
    replyAt: '2026-11-05 14:10',
    createdAt: '2026-11-04 16:15',
  },
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    carrierName: 'Marcus Vance',
    companyName: 'Apex Interstate Express',
    mcNumber: 'MC-1489201',
    equipment: 'Dry Van',
    rating: 5,
    comment:
      'David Cross and Alvin have kept my 3 dry vans rolling with zero downtime. My average weekly gross jumped from $6,200 to over $8,400. Direct payments, no games.',
    date: '2026-11-02',
    isApproved: true,
    verified: true,
  },
  {
    id: 'rev-2',
    carrierName: 'Tyler Morrison',
    companyName: 'Blue Ridge Freight Lines',
    mcNumber: 'MC-1290384',
    equipment: 'Reefer',
    rating: 5,
    comment:
      'Best reefer dispatchers in the game. They aggressively negotiate detention and TONU. If a receiver makes me wait, David makes sure I get paid for my time.',
    date: '2026-10-28',
    isApproved: true,
    verified: true,
  },
  {
    id: 'rev-3',
    carrierName: 'Nathan Cole',
    companyName: 'Falcon Fast Hotshot LLC',
    mcNumber: 'MC-1619024',
    equipment: 'Hotshot',
    rating: 5,
    comment:
      'Hotshot freight can be tough, but Infinity Dispatch keeps me on high-paying Texas and Louisiana oilfield runs. 5% commission is well worth the peace of mind.',
    date: '2026-10-15',
    isApproved: true,
    verified: true,
  },
];

const INITIAL_NOTES: StickyNote[] = [
  {
    id: 'note-1',
    title: 'TQL Broker Lane Target',
    content: 'TQL expanding Nashville to Philly lanes on Tuesdays and Thursdays. Contact broker MC-320491 for $4.20+/mi loads.',
    ownerName: 'David Cross',
    tag: 'Broker Lane',
    createdAt: '2026-11-05 10:15',
    updatedAt: '2026-11-05 10:15',
  },
  {
    id: 'note-2',
    title: 'Carrier Onboarding Checklists',
    content: 'Always double-check VIN match between insurance certificate and cab registration before signing first rate con.',
    ownerName: 'Alvin',
    tag: 'Compliance',
    createdAt: '2026-11-04 15:30',
    updatedAt: '2026-11-04 15:30',
  },
];

const INITIAL_EMAIL_LOGS: EmailNotificationRecord[] = [
  {
    id: 'email-1',
    to: 'Davidcross.vl1@gmail.com',
    subject: 'New Carrier Application #1: Mendez Transport Group (MC-1702914)',
    body: 'Carrier application received with W-9, COI, MC Authority, DL, and NOA documents attached. Assigned to David Cross.',
    type: 'Carrier Registration',
    status: 'Delivered',
    timestamp: '2026-11-04 09:24',
  },
  {
    id: 'email-2',
    to: 'alvin.vast@gmail.com',
    subject: 'New Carrier Application #2: Lone Wolf Hauling LLC (MC-1689201)',
    body: 'Carrier application received for 1 Reefer unit. Assigned to Alvin.',
    type: 'Carrier Registration',
    status: 'Delivered',
    timestamp: '2026-11-05 11:15',
  },
];

const INITIAL_DEMOS: DemoBooking[] = [
  {
    id: 'demo-1',
    fullName: 'Jason Miller',
    companyName: 'Miller Trans Logistics',
    email: 'jason@millertrans.com',
    phone: '(314) 555-8902',
    preferredDate: '2026-11-08',
    preferredTime: '02:00 PM CST',
    equipmentType: 'Dry Van',
    truckCount: 4,
    assignedOwner: 'David Cross',
    status: 'Confirmed',
    createdAt: '2026-11-05 08:30',
  },
];

const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay-701',
    invoiceNumber: 'INV-8888',
    loadId: 'load-805',
    carrierName: 'Falcon Fast Hotshot LLC',
    mcNumber: 'MC-1619024',
    loadRate: 1650,
    dispatchFeePercent: 8,
    commissionAmount: 132.00,
    paymentStatus: 'Paid',
    dueDate: '2026-11-04',
    paidDate: '2026-11-04',
    paymentMethod: 'ACH Transfer',
  },
  {
    id: 'pay-702',
    invoiceNumber: 'INV-8910',
    loadId: 'load-801',
    carrierName: 'Apex Interstate Express LLC',
    mcNumber: 'MC-1489201',
    loadRate: 2850,
    dispatchFeePercent: 7,
    commissionAmount: 199.50,
    paymentStatus: 'Processing',
    dueDate: '2026-11-08',
  },
  {
    id: 'pay-703',
    invoiceNumber: 'INV-8911',
    loadId: 'load-802',
    carrierName: 'Blue Ridge Freight Lines',
    mcNumber: 'MC-1290384',
    loadRate: 3400,
    dispatchFeePercent: 7,
    commissionAmount: 238.00,
    paymentStatus: 'Pending',
    dueDate: '2026-11-10',
  },
];

const INITIAL_ACTIVITIES: OwnerActivity[] = [
  {
    id: 'act-1',
    timestamp: '2026-11-05 14:10',
    ownerName: 'David Cross',
    action: 'Booked Load #INF-2026-0892',
    details: 'Locked in $3,400 for Blue Ridge Freight Lines with TQL (Nashville to Philadelphia).',
    category: 'Load',
  },
  {
    id: 'act-2',
    timestamp: '2026-11-05 11:20',
    ownerName: 'Alvin',
    action: 'Carrier Application Received #2',
    details: 'Reviewed initial submission from Lone Wolf Hauling LLC (USDOT 4209182).',
    category: 'Carrier',
  },
  {
    id: 'act-3',
    timestamp: '2026-11-04 17:30',
    ownerName: 'David Cross',
    action: 'Commission Payment Processed',
    details: 'Received $132.00 fee from Falcon Fast Hotshot LLC for INV-8888.',
    category: 'Payment',
  },
];

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'gemini',
    senderName: 'David AI Assistant',
    text: 'Welcome to Infinity Dispatch LLC! I am your 24/7 Dispatch Intelligence Assistant. Both David Cross (+1 409-509-6940, Telegram @DavidCross4899) and Alvin are active. How can we help keep your trucks rolling at top dollar today?',
    timestamp: '09:00 AM',
    status: 'Replied',
  },
];

class StorageService {
  private get<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(`infinity_dispatch_${key}`);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private set<T>(key: string, val: T): void {
    try {
      localStorage.setItem(`infinity_dispatch_${key}`, JSON.stringify(val));
    } catch {
      // storage quota or private mode fallback
    }
  }

  // Security Check
  verifyOwnerPassword(passcode: string): boolean {
    return passcode.trim() === 'Malik@786';
  }

  // Carriers
  getCarriers(): Carrier[] {
    return this.get<Carrier[]>('carriers', INITIAL_CARRIERS);
  }

  saveCarrier(carrier: Carrier): void {
    const list = this.getCarriers();
    const idx = list.findIndex((c) => c.id === carrier.id);
    if (idx >= 0) {
      list[idx] = carrier;
    } else {
      list.unshift(carrier);
    }
    this.set('carriers', list);
  }

  deleteCarrier(id: string): void {
    const list = this.getCarriers().filter((c) => c.id !== id);
    this.set('carriers', list);
  }

  // Applications
  getApplications(): CarrierApplication[] {
    return this.get<CarrierApplication[]>('applications', INITIAL_APPLICATIONS);
  }

  submitApplication(
    app: Omit<CarrierApplication, 'id' | 'applicationNumber' | 'submittedAt' | 'status'>
  ): CarrierApplication {
    const list = this.getApplications();
    const nextNumber = list.length > 0 ? Math.max(...list.map((a) => a.applicationNumber || 0)) + 1 : 1;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newApp: CarrierApplication = {
      ...app,
      id: `app-${Date.now()}`,
      applicationNumber: nextNumber,
      submittedAt: formattedDate,
      status: 'Pending',
    };

    list.unshift(newApp);
    this.set('applications', list);

    // Activity Log
    this.logActivity(
      app.assignedOwner,
      `New Carrier Application #${nextNumber}`,
      `Carrier applicant #${nextNumber} submitted: ${app.companyName} (${app.mcNumber}) with ${app.equipmentType} - Assigned to ${app.assignedOwner}.`,
      'Carrier'
    );

    // Auto-generate outgoing email notification to selected owner
    const targetEmail =
      app.assignedOwner === 'David Cross' ? 'Davidcross.vl1@gmail.com' : 'alvin.vast@gmail.com';

    this.logEmail({
      to: targetEmail,
      subject: `New Carrier Application #${nextNumber}: ${app.companyName} (${app.mcNumber})`,
      body: `Carrier ${app.companyName} (${app.fullName}, Phone: ${app.phone}) submitted application #${nextNumber}. Equipment: ${app.equipmentType}, VIN: ${app.vinNumber || 'N/A'}, Target RPM: $${app.preferredRPM}/mi. Documents attached: W-9, COI, MC Authority, Driver's License, NOA/Voided Check.`,
      type: 'Carrier Registration',
    });

    const connectedGoogle = this.getConnectedGoogleEmail();
    if (connectedGoogle && connectedGoogle !== targetEmail) {
      this.logEmail({
        to: connectedGoogle,
        subject: `[Google Sync] New Carrier Application #${nextNumber}: ${app.companyName} (${app.mcNumber})`,
        body: `Carrier ${app.companyName} (${app.fullName}, Phone: ${app.phone}) submitted application #${nextNumber}. Equipment: ${app.equipmentType}, Target RPM: $${app.preferredRPM}/mi. Documents attached: W-9, COI, MC Authority, Driver's License, NOA/Voided Check. Assigned to: ${app.assignedOwner}.`,
        type: 'Carrier Registration',
      });
    }

    return newApp;
  }

  updateApplicationStatus(id: string, status: 'Approved' | 'Declined', owner: 'David Cross' | 'Alvin'): void {
    const list = this.getApplications();
    const app = list.find((a) => a.id === id);
    if (app) {
      app.status = status;
      this.set('applications', list);

      if (status === 'Approved') {
        const newCarrier: Carrier = {
          id: `c-${Date.now()}`,
          companyName: app.companyName,
          ownerName: app.fullName,
          email: app.email,
          phone: app.phone,
          mcNumber: app.mcNumber,
          dotNumber: app.dotNumber,
          vinNumber: app.vinNumber,
          driversLicense: app.driversLicense,
          equipmentType: app.equipmentType,
          truckCount: app.truckCount,
          currentZip: app.currentZip,
          preferredLanes: app.preferredLanes.split(',').map((s) => s.trim()),
          preferredRPM: app.preferredRPM,
          maxDeadhead: app.maxDeadhead,
          availableDate: app.availableDate,
          insuranceStatus: 'Active ($1M / $100K)',
          assignedDispatcher: owner,
          assignedOwner: app.assignedOwner,
          status: 'Active',
          createdAt: new Date().toISOString().split('T')[0],
          documents: {
            w9: true,
            coi: true,
            mcAuthority: true,
            noa: app.documents?.noaOrVoidedCheck ?? true,
            driversLicense: app.documents?.driversLicense ?? true,
          },
        };
        this.saveCarrier(newCarrier);
      }

      this.logActivity(
        owner,
        `Application #${app.applicationNumber} ${status}`,
        `${owner} ${status.toLowerCase()} carrier application for ${app.companyName}.`,
        'Carrier'
      );
    }
  }

  // Loads
  getLoads(): LoadItem[] {
    return this.get<LoadItem[]>('loads', INITIAL_LOADS);
  }

  saveLoad(load: LoadItem, ownerName: 'David Cross' | 'Alvin' = 'David Cross'): void {
    const list = this.getLoads();
    const idx = list.findIndex((l) => l.id === load.id);
    if (idx >= 0) {
      list[idx] = { ...load, updatedAt: new Date().toISOString().split('T')[0] };
      this.logActivity(
        ownerName,
        `Updated Load #${load.loadNumber}`,
        `Status set to ${load.status} for ${load.carrierName}.`,
        'Load'
      );
    } else {
      list.unshift(load);
      this.logActivity(
        ownerName,
        `Created Load #${load.loadNumber}`,
        `${load.originCity}, ${load.originState} → ${load.destinationCity}, ${load.destinationState} ($${load.rate}).`,
        'Load'
      );
    }
    this.set('loads', list);
  }

  deleteLoad(id: string): void {
    const list = this.getLoads().filter((l) => l.id !== id);
    this.set('loads', list);
  }

  updateLoadStatus(id: string, status: LoadStatus, ownerName: 'David Cross' | 'Alvin' = 'David Cross'): void {
    const list = this.getLoads();
    const load = list.find((l) => l.id === id);
    if (load) {
      load.status = status;
      load.updatedAt = new Date().toISOString().split('T')[0];
      this.set('loads', list);
      this.logActivity(
        ownerName,
        `Load #${load.loadNumber} Status: ${status}`,
        `Updated load status to ${status} for ${load.carrierName}.`,
        'Load'
      );
    }
  }

  updateLoadInvoiceStatus(
    id: string,
    invoiceStatus: InvoiceStatus,
    ownerName: 'David Cross' | 'Alvin' = 'David Cross'
  ): void {
    const list = this.getLoads();
    const load = list.find((l) => l.id === id);
    if (load) {
      load.invoiceStatus = invoiceStatus;
      if (invoiceStatus === 'Cleared / Paid') {
        load.paymentStatus = 'Paid';
        load.invoiceClearedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
      } else if (invoiceStatus === 'Pending Payment') {
        load.paymentStatus = 'Pending';
      }
      load.updatedAt = new Date().toISOString().split('T')[0];
      this.set('loads', list);
      this.logActivity(
        ownerName,
        `Invoice #${load.invoiceNumber || load.loadNumber} ${invoiceStatus}`,
        `Invoice marked as "${invoiceStatus}" for ${load.carrierName}. Commission: $${load.dispatchFeeAmount.toFixed(2)}.`,
        'Payment'
      );
    }
  }

  // Active Dispatch Roster Carriers
  getRosterCarriers(): RosterCarrier[] {
    return this.get<RosterCarrier[]>('roster_carriers', INITIAL_ROSTER_CARRIERS);
  }

  saveRosterCarrier(carrier: RosterCarrier, ownerName: 'David Cross' | 'Alvin' = 'David Cross'): void {
    const list = this.getRosterCarriers();
    const idx = list.findIndex((c) => c.id === carrier.id);
    if (idx >= 0) {
      list[idx] = { ...carrier, updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16) };
      this.logActivity(
        ownerName,
        `Updated Roster Carrier: ${carrier.carrierName}`,
        `Driver: ${carrier.driverName} (${carrier.driverPhone}), Status: ${carrier.loadStatus}, Invoice: ${carrier.invoiceStatus}`,
        'Carrier'
      );
    } else {
      list.unshift(carrier);
      this.logActivity(
        ownerName,
        `Added Carrier to Roster: ${carrier.carrierName}`,
        `Driver: ${carrier.driverName}, MC: ${carrier.mcNumber}, Dispatched Gross: $${carrier.dispatchedAmount}`,
        'Carrier'
      );
    }
    this.set('roster_carriers', list);
  }

  deleteRosterCarrier(id: string): void {
    const list = this.getRosterCarriers().filter((c) => c.id !== id);
    this.set('roster_carriers', list);
  }

  // PDF Editor Document Management
  getEditorDocuments(): StoredEditorDocument[] {
    return this.get<StoredEditorDocument[]>('editor_documents', [
      {
        id: 'doc-template-1',
        name: 'Carrier_Rate_Confirmation_INF-8921.pdf',
        type: 'Rate Confirmation',
        carrierName: 'Apex Interstate Express LLC',
        loadNumber: 'INF-8921',
        pageCount: 1,
        lastModified: '2026-11-10 14:30',
        modifiedBy: 'David Cross',
      },
      {
        id: 'doc-template-2',
        name: 'Uniform_Straight_BOL_8910.pdf',
        type: 'Bill of Lading',
        carrierName: 'Apex Interstate Express LLC',
        loadNumber: 'INF-8921',
        pageCount: 1,
        lastModified: '2026-11-10 15:45',
        modifiedBy: 'Alvin',
      },
      {
        id: 'doc-template-3',
        name: 'Infinity_Dispatch_Carrier_Agreement_2026.pdf',
        type: 'Dispatch Agreement',
        carrierName: 'Blue Ridge Freight Lines',
        loadNumber: 'INF-8922',
        pageCount: 2,
        lastModified: '2026-11-09 11:20',
        modifiedBy: 'David Cross',
      },
      {
        id: 'doc-template-4',
        name: 'Form_W9_Infinity_Dispatch_LLC.pdf',
        type: 'W-9',
        carrierName: 'Iron Horse Hauling LLC',
        loadNumber: 'INF-8923',
        pageCount: 1,
        lastModified: '2026-11-08 09:15',
        modifiedBy: 'Alvin',
      },
      {
        id: 'doc-template-5',
        name: 'Certificate_of_Insurance_COI_1M.pdf',
        type: 'COI',
        carrierName: 'Silver Star Logistics Inc',
        loadNumber: 'INF-8924',
        pageCount: 1,
        lastModified: '2026-11-07 16:00',
        modifiedBy: 'David Cross',
      },
      {
        id: 'doc-template-6',
        name: 'FMCSA_MC_Operating_Authority.pdf',
        type: 'MC Authority',
        carrierName: 'Falcon Fast Hotshot LLC',
        loadNumber: 'INF-8925',
        pageCount: 1,
        lastModified: '2026-11-06 13:10',
        modifiedBy: 'Alvin',
      },
    ]);
  }

  saveEditorDocument(
    doc: StoredEditorDocument,
    ownerName: 'David Cross' | 'Alvin' = 'David Cross'
  ): void {
    const list = this.getEditorDocuments();
    const idx = list.findIndex((d) => d.id === doc.id || d.name === doc.name);
    if (idx >= 0) {
      list[idx] = { ...doc, lastModified: new Date().toISOString().replace('T', ' ').slice(0, 16), modifiedBy: ownerName };
    } else {
      list.unshift({ ...doc, lastModified: new Date().toISOString().replace('T', ' ').slice(0, 16), modifiedBy: ownerName });
    }
    this.set('editor_documents', list);
    this.logActivity(
      ownerName,
      `Saved PDF Document: ${doc.name}`,
      `Type: ${doc.type} | Carrier: ${doc.carrierName || 'Fleet'} | Pages: ${doc.pageCount}`,
      'Load'
    );
  }

  deleteEditorDocument(id: string): void {
    const list = this.getEditorDocuments().filter((d) => d.id !== id);
    this.set('editor_documents', list);
  }

  // Generated Invoices
  getGeneratedInvoices(): GeneratedInvoice[] {
    return this.get<GeneratedInvoice[]>('generated_invoices', [
      {
        id: 'inv-gen-1',
        invoiceNumber: 'INV-8910',
        invoiceDate: '2026-11-04',
        dueDate: '2026-11-07',
        paymentTerms: 'Due upon receipt (72 hours)',
        poNumber: 'INF-2026-0891',
        fromName: 'Infinity Dispatch LLC',
        fromEmail: 'Davidcross.vl1@gmail.com',
        fromPhone: '+1 (409) 509-6940',
        fromAddress: 'Houston, Texas HQ · Web: infinitydispatchllcusa.com',
        billToCompany: 'Apex Interstate Express LLC',
        billToContact: 'Marcus Vance',
        billToEmail: 'dispatch@apexinterstate.com',
        billToPhone: '(214) 555-8392',
        billToAddress: '4800 Logistics Way, Dallas, TX 75241',
        billToMc: 'MC-1489201',
        items: [
          {
            id: 'item-1',
            description: 'Dedicated Dispatch Support & Rate Con Negotiation (Dallas, TX to Columbus, OH)',
            rate: 2850,
            quantity: 1,
            amount: 199.50, // 7% fee
          },
        ],
        subtotal: 199.50,
        tax: 0,
        total: 199.50,
        notes: 'Thank you for choosing Infinity Dispatch LLC. Direct carrier remittance via QuickPay, ACH, Zelle, or Factoring deduction.',
        terms: 'Remit within 72 hours of freight delivery confirmation.',
        status: 'Sent',
        loadReferenceId: 'load-801',
        createdAt: '2026-11-04 10:00',
      },
    ]);
  }

  saveGeneratedInvoice(invoice: GeneratedInvoice, ownerName: 'David Cross' | 'Alvin' = 'David Cross'): void {
    const list = this.getGeneratedInvoices();
    const idx = list.findIndex((i) => i.id === invoice.id);
    if (idx >= 0) {
      list[idx] = invoice;
    } else {
      list.unshift(invoice);
    }
    this.set('generated_invoices', list);
    this.logActivity(
      ownerName,
      `Generated Invoice #${invoice.invoiceNumber}`,
      `Billed $${invoice.total.toFixed(2)} to ${invoice.billToCompany} (${invoice.billToMc}).`,
      'Payment'
    );
  }

  deleteGeneratedInvoice(id: string): void {
    const list = this.getGeneratedInvoices().filter((i) => i.id !== id);
    this.set('generated_invoices', list);
  }

  // Connected Google / Email Account
  getConnectedGoogleEmail(): string | null {
    return this.get<string | null>('connected_google_email', 'Davidcross.vl1@gmail.com');
  }

  setConnectedGoogleEmail(email: string | null): void {
    this.set('connected_google_email', email);
  }

  // Inquiries
  getInquiries(): MessageInquiry[] {
    return this.get<MessageInquiry[]>('inquiries', INITIAL_INQUIRIES);
  }

  submitInquiry(
    inquiry: Omit<MessageInquiry, 'id' | 'createdAt' | 'status'>
  ): MessageInquiry {
    const list = this.getInquiries();
    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newInquiry: MessageInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      status: 'Sent',
      createdAt: formatted,
    };
    list.unshift(newInquiry);
    this.set('inquiries', list);

    // Notify owners
    const ownerEmail = inquiry.assignedOwner === 'Alvin' ? 'alvin.vast@gmail.com' : 'Davidcross.vl1@gmail.com';
    this.logEmail({
      to: ownerEmail,
      subject: `New Carrier Message from ${inquiry.fullName} (${inquiry.phone})`,
      body: `Subject: ${inquiry.subject}\nMessage: ${inquiry.message}`,
      type: 'Live Inquiry',
    });

    const connectedGoogle = this.getConnectedGoogleEmail();
    if (connectedGoogle && connectedGoogle !== ownerEmail) {
      this.logEmail({
        to: connectedGoogle,
        subject: `[Google Sync] New Carrier Inquiry from ${inquiry.fullName} (${inquiry.phone})`,
        body: `Subject: ${inquiry.subject}\nMessage: ${inquiry.message}\nAssigned: ${inquiry.assignedOwner || 'David Cross'}`,
        type: 'Live Inquiry',
      });
    }

    return newInquiry;
  }

  updateInquiryStatus(
    id: string,
    status: 'Sent' | 'Seen' | 'Replied',
    reply?: { text: string; author: 'David Cross' | 'Alvin' }
  ): void {
    const list = this.getInquiries();
    const item = list.find((i) => i.id === id);
    if (item) {
      item.status = status;
      if (reply) {
        item.replyText = reply.text;
        item.replyAuthor = reply.author;
        item.replyAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
      }
      this.set('inquiries', list);
    }
  }

  // Reviews & Testimonials
  getReviews(): Review[] {
    return this.get<Review[]>('carrier_reviews', INITIAL_REVIEWS);
  }

  submitReview(review: Omit<Review, 'id' | 'date' | 'isApproved'>): Review {
    const list = this.getReviews();
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      isApproved: true, // Auto-approve or moderate
    };
    list.unshift(newRev);
    this.set('carrier_reviews', list);
    return newRev;
  }

  toggleReviewApproval(id: string): void {
    const list = this.getReviews();
    const r = list.find((item) => item.id === id);
    if (r) {
      r.isApproved = !r.isApproved;
      this.set('carrier_reviews', list);
    }
  }

  // Sticky Notes
  getNotes(): StickyNote[] {
    return this.get<StickyNote[]>('sticky_notes', INITIAL_NOTES);
  }

  saveNote(note: StickyNote): void {
    const list = this.getNotes();
    const idx = list.findIndex((n) => n.id === note.id);
    if (idx >= 0) {
      list[idx] = note;
    } else {
      list.unshift(note);
    }
    this.set('sticky_notes', list);
  }

  deleteNote(id: string): void {
    const list = this.getNotes().filter((n) => n.id !== id);
    this.set('sticky_notes', list);
  }

  // Demo Bookings
  getDemoBookings(): DemoBooking[] {
    return this.get<DemoBooking[]>('demo_bookings', INITIAL_DEMOS);
  }

  submitDemoBooking(demo: Omit<DemoBooking, 'id' | 'createdAt' | 'status'>): DemoBooking {
    const list = this.getDemoBookings();
    const newDemo: DemoBooking = {
      ...demo,
      id: `demo-${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    list.unshift(newDemo);
    this.set('demo_bookings', list);

    this.logActivity(
      demo.assignedOwner,
      'Demo Consultation Booked',
      `${demo.fullName} booked dispatch demo for ${demo.preferredDate} (${demo.companyName}).`,
      'System'
    );

    this.logEmail({
      to: demo.assignedOwner === 'Alvin' ? 'alvin.vast@gmail.com' : 'Davidcross.vl1@gmail.com',
      subject: `New Demo Consultation Request: ${demo.fullName} (${demo.companyName})`,
      body: `Carrier booked demo for ${demo.preferredDate} at ${demo.preferredTime}. Equipment: ${demo.equipmentType}, Phone: ${demo.phone}`,
      type: 'Demo Booking',
    });

    return newDemo;
  }

  // Live Chat Messages
  getChatMessages(): ChatMessage[] {
    return this.get<ChatMessage[]>('live_chat_messages', INITIAL_CHAT_MESSAGES);
  }

  saveChatMessage(msg: ChatMessage): void {
    const list = this.getChatMessages();
    list.push(msg);
    this.set('live_chat_messages', list);
  }

  markChatMessagesSeen(): void {
    const list = this.getChatMessages();
    list.forEach((m) => {
      if (m.status === 'Sent') {
        m.status = 'Seen';
      }
    });
    this.set('live_chat_messages', list);
  }

  // Email Notifications Log
  getEmailLogs(): EmailNotificationRecord[] {
    return this.get<EmailNotificationRecord[]>('email_logs', INITIAL_EMAIL_LOGS);
  }

  logEmail(email: Omit<EmailNotificationRecord, 'id' | 'timestamp' | 'status'>): void {
    const list = this.getEmailLogs();
    const record: EmailNotificationRecord = {
      ...email,
      id: `email-${Date.now()}`,
      status: 'Delivered',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    list.unshift(record);
    this.set('email_logs', list.slice(0, 100));
  }

  // Dispatchers
  getDispatchers(): Dispatcher[] {
    return this.get<Dispatcher[]>('dispatchers', INITIAL_DISPATCHERS);
  }

  saveDispatcher(dispatcher: Dispatcher, ownerName: 'David Cross' | 'Alvin' = 'David Cross'): void {
    const list = this.getDispatchers();
    const idx = list.findIndex((d) => d.id === dispatcher.id);
    if (idx >= 0) {
      list[idx] = dispatcher;
      this.logActivity(ownerName, `Updated Dispatcher: ${dispatcher.name}`, `Shift: ${dispatcher.shift || 'Day'}, Phone: ${dispatcher.phone}`, 'Dispatcher');
    } else {
      list.unshift(dispatcher);
      this.logActivity(ownerName, `Added Dispatcher: ${dispatcher.name}`, `Shift: ${dispatcher.shift || 'Day'}, Commission: ${dispatcher.commissionPercent || 7}%`, 'Dispatcher');
    }
    this.set('dispatchers', list);
  }

  deleteDispatcher(id: string): void {
    const list = this.getDispatchers().filter((d) => d.id !== id);
    this.set('dispatchers', list);
  }

  // Sales Persons
  getSalesPersons(): SalesPerson[] {
    return this.get<SalesPerson[]>('sales_persons', INITIAL_SALES_PERSONS);
  }

  saveSalesPerson(sp: SalesPerson, ownerName: 'David Cross' | 'Alvin' = 'David Cross'): void {
    const list = this.getSalesPersons();
    const idx = list.findIndex((s) => s.id === sp.id);
    if (idx >= 0) {
      list[idx] = sp;
      this.logActivity(ownerName, `Updated Sales Recruiter: ${sp.name}`, `Commission: ${sp.commissionRate}%, Phone: ${sp.phone}`, 'Carrier');
    } else {
      list.unshift(sp);
      this.logActivity(ownerName, `Added Sales Recruiter: ${sp.name}`, `Commission: ${sp.commissionRate}%, Onboarded Carriers: ${sp.onboardedCarriersCount}`, 'Carrier');
    }
    this.set('sales_persons', list);
  }

  deleteSalesPerson(id: string): void {
    const list = this.getSalesPersons().filter((s) => s.id !== id);
    this.set('sales_persons', list);
  }

  // Payments
  getPayments(): PaymentRecord[] {
    return this.get<PaymentRecord[]>('payments', INITIAL_PAYMENTS);
  }

  recordPayment(payment: PaymentRecord, owner: 'David Cross' | 'Alvin'): void {
    const list = this.getPayments();
    const idx = list.findIndex((p) => p.id === payment.id);
    if (idx >= 0) {
      list[idx] = payment;
    } else {
      list.unshift(payment);
    }
    this.set('payments', list);
    this.logActivity(
      owner,
      `Payment Recorded`,
      `Invoice ${payment.invoiceNumber} recorded for ${payment.carrierName} ($${payment.commissionAmount.toFixed(2)}).`,
      'Payment'
    );
  }

  // Owner Activity Log
  getActivities(): OwnerActivity[] {
    return this.get<OwnerActivity[]>('activities', INITIAL_ACTIVITIES);
  }

  logActivity(
    ownerName: 'David Cross' | 'Alvin',
    action: string,
    details: string,
    category: 'Carrier' | 'Load' | 'Payment' | 'Dispatcher' | 'System' | 'Email'
  ): void {
    const list = this.getActivities();
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newAct: OwnerActivity = {
      id: `act-${Date.now()}`,
      timestamp,
      ownerName,
      action,
      details,
      category,
    };
    list.unshift(newAct);
    this.set('activities', list.slice(0, 100));
  }

  // Active Session
  getCurrentOwner(): OwnerUser | null {
    return this.get<OwnerUser | null>('current_owner_session', null);
  }

  setCurrentOwner(owner: OwnerUser | null): void {
    this.set('current_owner_session', owner);
  }

  // Carrier Performance Tracking
  getCarrierPerformances(): CarrierPerformance[] {
    return this.get<CarrierPerformance[]>('carrier_performances', INITIAL_CARRIER_PERFORMANCE);
  }

  saveCarrierPerformance(
    perf: CarrierPerformance,
    ownerName: 'David Cross' | 'Alvin' = 'David Cross'
  ): void {
    const list = this.getCarrierPerformances();
    const idx = list.findIndex((p) => p.carrierId === perf.carrierId || p.mcNumber === perf.mcNumber);
    if (idx >= 0) {
      list[idx] = { ...perf, lastEvaluated: new Date().toISOString().split('T')[0] };
    } else {
      list.unshift(perf);
    }
    this.set('carrier_performances', list);
    this.logActivity(
      ownerName,
      `Performance Updated: ${perf.carrierName}`,
      `Score: ${perf.overallScore}/100 | On-Time: ${perf.onTimeRate}% | Doc Turnaround: ${perf.averageDocSubmissionMinutes}m`,
      'Carrier'
    );
  }

  recordDeliveryPerformance(
    mcNumber: string,
    isOnTime: boolean,
    docSubmissionMinutes: number = 20,
    ownerName: 'David Cross' | 'Alvin' = 'David Cross'
  ): void {
    const list = this.getCarrierPerformances();
    const cleanMc = mcNumber.replace(/[^\d]/g, '');
    const carrier = list.find((p) => p.mcNumber.replace(/[^\d]/g, '') === cleanMc);
    if (carrier) {
      carrier.totalLoadsCompleted += 1;
      if (isOnTime) {
        carrier.onTimeDeliveries += 1;
      } else {
        carrier.lateDeliveries += 1;
      }
      carrier.onTimeRate = Number(
        ((carrier.onTimeDeliveries / carrier.totalLoadsCompleted) * 100).toFixed(1)
      );
      // Moving average for doc turnaround
      carrier.averageDocSubmissionMinutes = Math.round(
        (carrier.averageDocSubmissionMinutes * 0.7) + (docSubmissionMinutes * 0.3)
      );
      // Recalculate score
      const onTimeWeight = carrier.onTimeRate * 0.6; // 60%
      const speedScore = Math.max(70, 100 - (carrier.averageDocSubmissionMinutes * 0.8)); // 30%
      const complianceScore = 10; // 10%
      carrier.overallScore = Math.min(100, Math.round(onTimeWeight + (speedScore * 0.3) + complianceScore));
      carrier.performanceTier =
        carrier.overallScore >= 95
          ? 'Elite Tier A+'
          : carrier.overallScore >= 85
          ? 'High Performing A'
          : carrier.overallScore >= 75
          ? 'Standard B'
          : 'Needs Review';
      carrier.lastEvaluated = new Date().toISOString().split('T')[0];
      this.set('carrier_performances', list);
      this.logActivity(
        ownerName,
        `Carrier Delivery Recorded: ${carrier.carrierName}`,
        `${isOnTime ? 'ON-TIME' : 'DELAYED'} delivery. Signed BOL submitted in ${docSubmissionMinutes} mins. New Score: ${carrier.overallScore}/100.`,
        'Carrier'
      );
    }
  }
}

const INITIAL_CARRIER_PERFORMANCE: CarrierPerformance[] = [
  {
    carrierId: 'c-101',
    carrierName: 'Apex Interstate Express LLC',
    mcNumber: 'MC-1489201',
    equipmentType: 'Dry Van',
    totalLoadsCompleted: 42,
    onTimeDeliveries: 41,
    lateDeliveries: 1,
    onTimeRate: 97.6,
    averageDocSubmissionMinutes: 14,
    bolFastUploadRate: 96,
    rateConReturnMinutes: 9,
    claimsCount: 0,
    overallScore: 98,
    performanceTier: 'Elite Tier A+',
    status: 'Preferred',
    lastEvaluated: '2026-11-08',
    evaluatorNotes: 'Consistently uploads signed clean BOL within 15 minutes of dock departure. Exemplary ELD tracking compliance.',
  },
  {
    carrierId: 'c-102',
    carrierName: 'Blue Ridge Freight Lines',
    mcNumber: 'MC-1290384',
    equipmentType: 'Reefer',
    totalLoadsCompleted: 35,
    onTimeDeliveries: 35,
    lateDeliveries: 0,
    onTimeRate: 100.0,
    averageDocSubmissionMinutes: 18,
    bolFastUploadRate: 94,
    rateConReturnMinutes: 12,
    claimsCount: 0,
    overallScore: 99,
    performanceTier: 'Elite Tier A+',
    status: 'Preferred',
    lastEvaluated: '2026-11-09',
    evaluatorNotes: 'Zero late loads. Maintains continuous temperature telemetry on refrigerated lanes with instant BOL submission.',
  },
  {
    carrierId: 'c-103',
    carrierName: 'Iron Horse Hauling LLC',
    mcNumber: 'MC-984321',
    equipmentType: 'Flatbed',
    totalLoadsCompleted: 28,
    onTimeDeliveries: 27,
    lateDeliveries: 1,
    onTimeRate: 96.4,
    averageDocSubmissionMinutes: 24,
    bolFastUploadRate: 88,
    rateConReturnMinutes: 15,
    claimsCount: 0,
    overallScore: 94,
    performanceTier: 'High Performing A',
    status: 'Active',
    lastEvaluated: '2026-11-06',
    evaluatorNotes: 'Great heavy haul performance. Tarp & strap photos submitted promptly with bill of lading.',
  },
  {
    carrierId: 'c-104',
    carrierName: 'Silver Star Logistics Inc',
    mcNumber: 'MC-1502931',
    equipmentType: 'Step Deck',
    totalLoadsCompleted: 22,
    onTimeDeliveries: 21,
    lateDeliveries: 1,
    onTimeRate: 95.5,
    averageDocSubmissionMinutes: 29,
    bolFastUploadRate: 85,
    rateConReturnMinutes: 17,
    claimsCount: 0,
    overallScore: 92,
    performanceTier: 'High Performing A',
    status: 'Active',
    lastEvaluated: '2026-11-05',
    evaluatorNotes: 'Solid step deck fleet. Fast response on West Coast corridor runs.',
  },
  {
    carrierId: 'c-105',
    carrierName: 'Falcon Fast Hotshot LLC',
    mcNumber: 'MC-1619024',
    equipmentType: 'Hotshot',
    totalLoadsCompleted: 39,
    onTimeDeliveries: 38,
    lateDeliveries: 1,
    onTimeRate: 97.4,
    averageDocSubmissionMinutes: 16,
    bolFastUploadRate: 95,
    rateConReturnMinutes: 8,
    claimsCount: 0,
    overallScore: 96,
    performanceTier: 'Elite Tier A+',
    status: 'Preferred',
    lastEvaluated: '2026-11-07',
    evaluatorNotes: 'Fast expedited hotshot delivery with immediate mobile scanned paperwork.',
  },
];

export const storage = new StorageService();
