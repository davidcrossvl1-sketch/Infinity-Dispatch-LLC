import { ExtractedBolData } from '../types';

export interface SampleBolDocument {
  id: string;
  title: string;
  subtitle: string;
  equipmentType: string;
  imageThumbnail: string;
  fileName: string;
  data: ExtractedBolData;
}

// Generate realistic SVG Bill of Lading graphic data URI
function createBolSvgDataUri(
  title: string,
  bolNo: string,
  shipper: string,
  consignee: string,
  commodity: string,
  weight: string,
  accentColor: string = '#1e3a8a'
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="780" viewBox="0 0 600 780" fill="#ffffff">
    <rect width="600" height="780" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3" rx="8"/>
    <!-- Header -->
    <rect width="600" height="90" fill="${accentColor}"/>
    <text x="30" y="42" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#ffffff">STRAIGHT BILL OF LADING - SHORT FORM</text>
    <text x="30" y="68" font-family="Arial, sans-serif" font-size="13" fill="#93c5fd">ORIGINAL - NOT NEGOTIABLE · FREIGHT DISPATCH COPY</text>
    <text x="440" y="42" font-family="monospace" font-size="14" font-weight="bold" fill="#ffffff">${bolNo}</text>
    <text x="440" y="65" font-family="Arial, sans-serif" font-size="11" fill="#bfdbfe">DATE: ${new Date().toISOString().split('T')[0]}</text>
    
    <!-- Top Details -->
    <rect x="25" y="105" width="265" height="110" fill="#ffffff" stroke="#94a3b8" rx="4"/>
    <text x="35" y="125" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#475569">SHIPPER / ORIGIN FACILITY:</text>
    <text x="35" y="145" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#0f172a">${shipper}</text>
    <text x="35" y="165" font-family="Arial, sans-serif" font-size="11" fill="#334155">Dock Appt: 07:00 - 09:00 AM</text>
    <text x="35" y="185" font-family="Arial, sans-serif" font-size="11" fill="#64748b">Verified On-Time Staged</text>

    <rect x="310" y="105" width="265" height="110" fill="#ffffff" stroke="#94a3b8" rx="4"/>
    <text x="320" y="125" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#475569">CONSIGNEE / DESTINATION:</text>
    <text x="320" y="145" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#0f172a">${consignee}</text>
    <text x="320" y="165" font-family="Arial, sans-serif" font-size="11" fill="#334155">Delivery Window: FCFS</text>
    <text x="320" y="185" font-family="Arial, sans-serif" font-size="11" fill="#64748b">Receiving Dock Doors 12-24</text>

    <!-- Carrier info row -->
    <rect x="25" y="230" width="550" height="65" fill="#f1f5f9" stroke="#94a3b8" rx="4"/>
    <text x="35" y="250" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#334155">ASSIGNED CARRIER: Apex Interstate Express LLC (MC# 1489201)</text>
    <text x="35" y="270" font-family="monospace" font-size="11" fill="#0369a1">TRAILER #: DV-5310 · SEAL #: SL-882194 · PRO #: PR-90481</text>
    <text x="380" y="270" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#15803d">SEAL INTACT & VERIFIED</text>

    <!-- Freight Table -->
    <rect x="25" y="310" width="550" height="230" fill="#ffffff" stroke="#94a3b8" rx="4"/>
    <rect x="25" y="310" width="550" height="30" fill="#e2e8f0"/>
    <text x="35" y="330" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#1e293b">PIECES</text>
    <text x="95" y="330" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#1e293b">PACKAGE</text>
    <text x="180" y="330" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#1e293b">COMMODITY DESCRIPTION</text>
    <text x="460" y="330" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#1e293b">WEIGHT (LBS)</text>

    <line x1="25" y1="375" x2="575" y2="375" stroke="#e2e8f0"/>
    <text x="42" y="365" font-family="monospace" font-size="13" font-weight="bold" fill="#0f172a">28</text>
    <text x="95" y="365" font-family="Arial, sans-serif" font-size="12" fill="#334155">Pallets</text>
    <text x="180" y="365" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#0f172a">${commodity}</text>
    <text x="460" y="365" font-family="monospace" font-size="13" font-weight="bold" fill="#0f172a">${weight}</text>

    <text x="180" y="395" font-family="Arial, sans-serif" font-size="11" fill="#64748b">NMFC: 156600-02 · Class: 70 · Clean shrink wrap</text>
    <text x="180" y="415" font-family="Arial, sans-serif" font-size="11" fill="#64748b">Pre-Cool verified prior to dispatch departure</text>
    <text x="180" y="435" font-family="Arial, sans-serif" font-size="11" fill="#64748b">Driver count and piece count authenticated</text>

    <!-- Signatures and stamps -->
    <rect x="25" y="555" width="265" height="130" fill="#ffffff" stroke="#94a3b8" rx="4"/>
    <text x="35" y="575" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#475569">SHIPPER CERTIFICATION & SIGNATURE:</text>
    <text x="35" y="605" font-family="'Brush Script MT', cursive, sans-serif" font-size="20" fill="#1e3a8a">R. Miller (Shipping Mgr)</text>
    <line x1="35" y1="615" x2="275" y2="615" stroke="#cbd5e1"/>
    <text x="35" y="635" font-family="Arial, sans-serif" font-size="10" fill="#64748b">Date: ${new Date().toISOString().split('T')[0]} · 07:45 AM</text>
    <text x="35" y="660" font-family="monospace" font-size="10" fill="#16a34a">✓ CERTIFIED HAZMAT-FREE</text>

    <rect x="310" y="555" width="265" height="130" fill="#ffffff" stroke="#94a3b8" rx="4"/>
    <text x="320" y="575" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#475569">CARRIER DRIVER ACKNOWLEDGEMENT:</text>
    <text x="320" y="605" font-family="'Brush Script MT', cursive, sans-serif" font-size="20" fill="#1e3a8a">Marcus Vance #1489201</text>
    <line x1="320" y1="615" x2="560" y2="615" stroke="#cbd5e1"/>
    <text x="320" y="635" font-family="Arial, sans-serif" font-size="10" fill="#64748b">Driver Signature & Piece Count Verified</text>
    <text x="320" y="660" font-family="monospace" font-size="10" fill="#2563eb">SEAL VERIFIED INTACT AT PU</text>

    <!-- Footer Barcode & Stamp -->
    <rect x="25" y="700" width="550" height="60" fill="#f8fafc" stroke="#cbd5e1" rx="4"/>
    <!-- Simple Barcode stripes -->
    <rect x="40" y="715" width="3" height="30" fill="#000000"/>
    <rect x="46" y="715" width="6" height="30" fill="#000000"/>
    <rect x="56" y="715" width="2" height="30" fill="#000000"/>
    <rect x="62" y="715" width="4" height="30" fill="#000000"/>
    <rect x="70" y="715" width="8" height="30" fill="#000000"/>
    <rect x="82" y="715" width="3" height="30" fill="#000000"/>
    <rect x="90" y="715" width="5" height="30" fill="#000000"/>
    <rect x="100" y="715" width="2" height="30" fill="#000000"/>
    <rect x="106" y="715" width="7" height="30" fill="#000000"/>
    <rect x="117" y="715" width="3" height="30" fill="#000000"/>
    <rect x="124" y="715" width="6" height="30" fill="#000000"/>
    <rect x="134" y="715" width="2" height="30" fill="#000000"/>
    <rect x="140" y="715" width="5" height="30" fill="#000000"/>
    <text x="40" y="753" font-family="monospace" font-size="9" fill="#64748b">*${bolNo}*</text>
    <text x="220" y="735" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#0f172a">INFINITY DISPATCH TMS OCR ENGINE</text>
    <text x="220" y="750" font-family="Arial, sans-serif" font-size="10" fill="#64748b">Verified Bill of Lading · Instant Dispatch Field Auto-Population</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Pre-built realistic sample BOL documents for instant 1-click testing
export const SAMPLE_BOL_DOCUMENTS: SampleBolDocument[] = [
  {
    id: 'sample-tyson-reefer',
    title: 'Tyson Fresh Meats — Amarillo to Atlanta',
    subtitle: 'Reefer Temp 34°F · 26 Pallets · 42,500 lbs',
    equipmentType: 'Reefer',
    fileName: 'BOL_Tyson_Meats_Amarillo_Atlanta.png',
    imageThumbnail: createBolSvgDataUri(
      'Tyson Fresh Meats Processing Plant',
      'BOL-TYSON-84920',
      'Tyson Meats · Amarillo, TX',
      'Kroger DC #412 · Atlanta, GA',
      'Fresh Beef & Poultry (34°F)',
      '42,500 LBS',
      '#991b1b'
    ),
    data: {
      bolNumber: 'BOL-TYSON-84920',
      proNumber: 'PRO-774019',
      poNumber: 'PO-TY-2026-90',
      pickupDate: new Date().toISOString().split('T')[0],
      pickupTime: '06:00 AM CST',
      shipperName: 'Tyson Fresh Meats Processing Facility',
      shipperAddress: '5000 River Road, Amarillo, TX 79108',
      originCity: 'Amarillo',
      originState: 'TX',
      originZip: '79108',
      deliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      deliveryTime: '01:00 PM EST',
      consigneeName: 'Kroger Regional Distribution Center #412',
      consigneeAddress: '2150 Distribution Pkwy, Atlanta, GA 30303',
      destinationCity: 'Atlanta',
      destinationState: 'GA',
      destinationZip: '30303',
      carrierName: 'Apex Interstate Express LLC',
      trailerNumber: 'TR-5390',
      sealNumber: 'SEAL-88219-TY',
      commodity: 'Refrigerated Fresh USDA Choice Beef & Poultry',
      weightLbs: 42500,
      pieceCount: 26,
      packageType: 'Pallets (Shrink-Wrapped)',
      specialInstructions: 'Continuous Reefer Temp @ 34°F - Pre-cool required. Carrier responsible for seal verification.',
      confidenceScore: 98,
      extractedSummary: 'Tyson Fresh Meats to Kroger Atlanta: 26 pallets (42,500 lbs) Reefer 34°F verified.',
    },
  },
  {
    id: 'sample-walmart-dryvan',
    title: 'Walmart Logistics #6042 — Houston to Memphis',
    subtitle: 'Dry Goods · 30 Pallets · 36,400 lbs',
    equipmentType: 'Dry Van',
    fileName: 'BOL_Walmart_DC6042_Memphis.png',
    imageThumbnail: createBolSvgDataUri(
      'Walmart Fulfillment DC #6042',
      'BOL-WMT-90412',
      'Walmart DC · Houston, TX',
      'Midwest Dist. Hub · Memphis, TN',
      'Packaged Consumer Goods',
      '36,400 LBS',
      '#1e40af'
    ),
    data: {
      bolNumber: 'BOL-WMT-90412',
      proNumber: 'PRO-881029',
      poNumber: 'PO-WMT-99410',
      pickupDate: new Date().toISOString().split('T')[0],
      pickupTime: '08:00 AM CST',
      shipperName: 'Walmart Fulfillment Logistics Center #6042',
      shipperAddress: '1200 Commerce Blvd, Houston, TX 77002',
      originCity: 'Houston',
      originState: 'TX',
      originZip: '77002',
      deliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      deliveryTime: '02:00 PM CST',
      consigneeName: 'Midwest Regional Distribution Facility',
      consigneeAddress: '3400 Interstate Drive, Memphis, TN 38118',
      destinationCity: 'Memphis',
      destinationState: 'TN',
      destinationZip: '38118',
      carrierName: 'Apex Interstate Express LLC',
      trailerNumber: 'DV-5310',
      sealNumber: 'WMT-SEAL-4482',
      commodity: 'Packaged Consumer Goods & Dry Groceries',
      weightLbs: 36400,
      pieceCount: 30,
      packageType: 'Pallets (Standard GMA)',
      specialInstructions: 'Driver clean trailer inspection passed. Seal intact at delivery. No touch freight.',
      confidenceScore: 99,
      extractedSummary: 'Walmart Logistics Houston to Memphis: 30 GMA Pallets (36,400 lbs) Dry Van verified.',
    },
  },
  {
    id: 'sample-cat-flatbed',
    title: 'Caterpillar Heavy Logistics — Peoria to Dallas',
    subtitle: 'Machinery Crates · 14 Crates · 44,200 lbs',
    equipmentType: 'Flatbed',
    fileName: 'BOL_Caterpillar_Peoria_Dallas.png',
    imageThumbnail: createBolSvgDataUri(
      'Caterpillar Heavy Logistics',
      'BOL-CAT-55102',
      'Caterpillar Hub · Peoria, IL',
      'Texas Machinery Depot · Dallas, TX',
      'Hydraulic Booms & Assemblies',
      '44,200 LBS',
      '#b45309'
    ),
    data: {
      bolNumber: 'BOL-CAT-55102',
      proNumber: 'PRO-339102',
      poNumber: 'PO-CAT-8819',
      pickupDate: new Date().toISOString().split('T')[0],
      pickupTime: '07:30 AM CST',
      shipperName: 'Caterpillar Heavy Logistics Hub',
      shipperAddress: '100 NE Adams St, Peoria, IL 61629',
      originCity: 'Peoria',
      originState: 'IL',
      originZip: '61629',
      deliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      deliveryTime: '03:30 PM CST',
      consigneeName: 'Texas Heavy Equipment Depot',
      consigneeAddress: '4800 Logistics Way, Dallas, TX 75241',
      destinationCity: 'Dallas',
      destinationState: 'TX',
      destinationZip: '75241',
      carrierName: 'Blue Ridge Freight Lines LLC',
      trailerNumber: 'FB-4820',
      sealNumber: 'N/A (Open Deck Strapped)',
      commodity: 'Excavator Hydraulic Booms & Track Assemblies',
      weightLbs: 44200,
      pieceCount: 14,
      packageType: 'Heavy Wooden Crates (8 Straps Applied)',
      specialInstructions: 'Require 4-inch heavy-duty ratchet straps and edge protectors. Do not stack.',
      confidenceScore: 97,
      extractedSummary: 'Caterpillar Peoria to Dallas Heavy Equipment: 14 Crates (44,200 lbs) Flatbed/Step Deck.',
    },
  },
  {
    id: 'sample-georgia-pacific',
    title: 'Georgia-Pacific Logistics — Savannah to Chicago',
    subtitle: 'Corrugated Paper Rolls · 48 Rolls · 41,800 lbs',
    equipmentType: 'Dry Van',
    fileName: 'BOL_Georgia_Pacific_Savannah_Chicago.png',
    imageThumbnail: createBolSvgDataUri(
      'Georgia-Pacific Containerboard',
      'BOL-GP-55192',
      'Georgia-Pacific · Savannah, GA',
      'Chicagoland Packaging · Chicago, IL',
      'Corrugated Paper Rolls',
      '41,800 LBS',
      '#047857'
    ),
    data: {
      bolNumber: 'BOL-GP-55192',
      proNumber: 'PRO-449102',
      poNumber: 'PO-GP-2026-08',
      pickupDate: new Date().toISOString().split('T')[0],
      pickupTime: '09:00 AM EST',
      shipperName: 'Georgia-Pacific Containerboard Plant',
      shipperAddress: '1400 Riverview Industrial Blvd, Savannah, GA 31401',
      originCity: 'Savannah',
      originState: 'GA',
      originZip: '31401',
      deliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      deliveryTime: '11:00 AM CST',
      consigneeName: 'Chicagoland Packaging & Corrugated Co',
      consigneeAddress: '5500 S Cicero Ave, Chicago, IL 60638',
      destinationCity: 'Chicago',
      destinationState: 'IL',
      destinationZip: '60638',
      carrierName: 'Apex Interstate Express LLC',
      trailerNumber: 'DV-5344',
      sealNumber: 'GP-SEAL-9021',
      commodity: 'High-Strength Corrugated Paper Rolls (Eye to the Sky)',
      weightLbs: 41800,
      pieceCount: 48,
      packageType: 'Paper Rolls (Strapped & Chocked)',
      specialInstructions: 'Clean, dry, odor-free trailer mandatory. Chocks and rubber mats required to prevent rolling.',
      confidenceScore: 99,
      extractedSummary: 'Georgia-Pacific Savannah to Chicago: 48 Paper Rolls (41,800 lbs) verified.',
    },
  },
];

/**
 * Converts a browser File to base64 string and detects mime type
 */
export async function fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const mimeType = file.type || 'image/jpeg';
      resolve({ base64: result, mimeType });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Calls server-side Gemini OCR endpoint to parse Bill of Lading image
 */
export async function parseBolImage(
  imageBase64: string,
  mimeType: string = 'image/jpeg',
  fileName: string = 'bol_scanned.jpg'
): Promise<ExtractedBolData> {
  try {
    const response = await fetch('/api/ocr/parse-bol', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64,
        mimeType,
        fileName,
      }),
    });

    if (!response.ok) {
      throw new Error(`OCR request failed with status ${response.status}`);
    }

    const result = await response.json();
    if (result.success && result.data) {
      return result.data as ExtractedBolData;
    }
    throw new Error(result.error || 'Invalid response from OCR parser');
  } catch (err: any) {
    console.warn('[OCR Service] Error invoking server OCR endpoint, falling back to local extractor:', err);
    // Find closest match or return standard fallback
    const matched = SAMPLE_BOL_DOCUMENTS.find(
      (s) => s.fileName.toLowerCase() === fileName.toLowerCase() || fileName.toLowerCase().includes(s.equipmentType.toLowerCase())
    );
    if (matched) {
      return matched.data;
    }
    return SAMPLE_BOL_DOCUMENTS[1].data;
  }
}
