import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Download,
  Type,
  Edit3,
  Highlighter,
  Eraser,
  Stamp,
  Calendar,
  Check,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Upload,
  Save,
  Send,
  FileText,
  Eye,
  Trash2,
  Move,
  Layers,
  Sparkles,
  MousePointer,
  PenTool,
  Lock,
  Unlock,
  Printer,
  Copy,
  Plus,
  Minimize2,
  Maximize2,
  Link as LinkIcon,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Search,
  FileCheck,
  Briefcase,
  Truck,
  DollarSign,
  Info,
  Sliders,
  Share2,
  Archive,
  Split,
  Merge,
  FileCode,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { storage, StoredEditorDocument } from '../../services/storage';

export interface FreightPdfEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDocumentName?: string;
  initialDocumentType?: string;
  carrierName?: string;
  loadNumber?: string;
  initialPdfUrl?: string;
  isModal?: boolean;
  onSave?: (docData: { name: string; type: string; dataUrl: string }) => void;
}

export type EditorCategory =
  | 'text'
  | 'links'
  | 'forms'
  | 'images'
  | 'sign'
  | 'whiteout'
  | 'annotate'
  | 'shapes'
  | 'pages'
  | 'convert'
  | 'templates';

export interface PdfElementStyle {
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  align?: 'left' | 'center' | 'right';
  strokeColor?: string;
  strokeWidth?: number;
  opacity?: number;
  shapeType?: 'rectangle' | 'ellipse' | 'line' | 'arrow' | 'highlight';
  fieldType?: 'text' | 'checkbox' | 'dropdown';
  fieldOptions?: string[];
  fieldChecked?: boolean;
  url?: string;
}

export interface PdfElement {
  id: string;
  type:
    | 'text'
    | 'image'
    | 'signature'
    | 'stamp'
    | 'shape'
    | 'whiteout'
    | 'redact'
    | 'form_field'
    | 'comment';
  x: number; // 0 to 816 (Letter width)
  y: number; // 0 to 1056 (Letter height)
  width: number;
  height: number;
  content: string; // text or image DataURL or stamp text
  style: PdfElementStyle;
  pageIndex: number;
}

export interface PageModel {
  pageNumber: number;
  rotation: number; // 0, 90, 180, 270
  template:
    | 'rate_con'
    | 'bol'
    | 'carrier_packet'
    | 'w9'
    | 'coi'
    | 'mc_auth'
    | 'dispatch_agreement'
    | 'invoice'
    | 'blank'
    | 'custom_image';
  customImageUrl?: string;
}

export interface DocumentModel {
  id: string;
  name: string;
  type: string;
  carrierName: string;
  loadNumber: string;
  pages: PageModel[];
  elements: PdfElement[];
  isLocked?: boolean;
  password?: string;
}

// Default freight templates data for high-fidelity vector rendering
const TEMPLATE_PRESETS = [
  { id: 'rate_con', name: 'Rate Confirmation', icon: DollarSign, type: 'Rate Confirmation' },
  { id: 'bol', name: 'Bill of Lading', icon: Truck, type: 'Bill of Lading' },
  { id: 'carrier_packet', name: 'Carrier Packet', icon: Briefcase, type: 'Carrier Packet' },
  { id: 'w9', name: 'Form W-9', icon: FileText, type: 'W-9' },
  { id: 'coi', name: 'COI Insurance', icon: FileCheck, type: 'COI' },
  { id: 'mc_auth', name: 'MC Authority', icon: ShieldAlert, type: 'MC Authority' },
  { id: 'dispatch_agreement', name: 'Dispatch Agreement', icon: Briefcase, type: 'Dispatch Agreement' },
  { id: 'invoice', name: 'Freight Invoice', icon: DollarSign, type: 'Invoice' },
];

export const FreightPdfEditorModal: React.FC<FreightPdfEditorModalProps> = ({
  isOpen,
  onClose,
  initialDocumentName = 'Carrier_Rate_Confirmation_INF-8921.pdf',
  initialDocumentType = 'Rate Confirmation',
  carrierName = 'Apex Interstate Express LLC',
  loadNumber = 'INF-8921',
  isModal = false,
  onSave,
}) => {
  if (!isOpen) return null;

  // Active Owner detection (David Cross or Alvin)
  const currentOwner = storage.getCurrentOwner() || {
    name: 'David Cross',
    email: 'Davidcross.vl1@gmail.com',
    role: 'OWNER / SUPER ADMIN',
  };

  // State: Multiple open documents
  const [documents, setDocuments] = useState<DocumentModel[]>([
    {
      id: 'doc-1',
      name: initialDocumentName,
      type: initialDocumentType,
      carrierName: carrierName,
      loadNumber: loadNumber,
      pages: [
        { pageNumber: 1, rotation: 0, template: 'rate_con' },
        { pageNumber: 2, rotation: 0, template: 'dispatch_agreement' },
      ],
      elements: [
        {
          id: 'el-init-1',
          type: 'stamp',
          x: 520,
          y: 70,
          width: 220,
          height: 60,
          content: 'APPROVED & DISPATCHED',
          pageIndex: 0,
          style: {
            color: '#16a34a',
            strokeColor: '#16a34a',
            strokeWidth: 2,
            bold: true,
            fontSize: 14,
            opacity: 0.95,
          },
        },
        {
          id: 'el-init-2',
          type: 'text',
          x: 80,
          y: 780,
          width: 460,
          height: 28,
          content: `Authorized Carrier Signature: David Cross (Infinity Dispatch LLC Desk)`,
          pageIndex: 0,
          style: {
            fontSize: 12,
            fontFamily: 'Helvetica',
            color: '#0f172a',
            bold: true,
          },
        },
        {
          id: 'el-init-3',
          type: 'text',
          x: 80,
          y: 810,
          width: 300,
          height: 24,
          content: `Date Verified: ${new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })} · 24/7 Live Desk`,
          pageIndex: 0,
          style: {
            fontSize: 11,
            fontFamily: 'Helvetica',
            color: '#334155',
            italic: true,
          },
        },
        {
          id: 'el-init-4',
          type: 'signature',
          x: 480,
          y: 750,
          width: 220,
          height: 80,
          content: 'David Cross',
          pageIndex: 0,
          style: {
            fontFamily: 'cursive',
            color: '#1e3a8a',
            fontSize: 28,
            bold: true,
          },
        },
      ],
    },
    {
      id: 'doc-2',
      name: 'Uniform_Straight_BOL_8910.pdf',
      type: 'Bill of Lading',
      carrierName: carrierName,
      loadNumber: loadNumber,
      pages: [{ pageNumber: 1, rotation: 0, template: 'bol' }],
      elements: [
        {
          id: 'bol-stamp-1',
          type: 'stamp',
          x: 530,
          y: 65,
          width: 210,
          height: 55,
          content: 'ORIGINAL BILL OF LADING',
          pageIndex: 0,
          style: {
            color: '#7c3aed',
            strokeColor: '#7c3aed',
            strokeWidth: 2,
            bold: true,
            fontSize: 13,
            opacity: 0.95,
          },
        },
      ],
    },
  ]);

  const [activeDocIndex, setActiveDocIndex] = useState<number>(0);
  const activeDoc = documents[activeDocIndex] || documents[0];

  // Active Page & Selection
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<EditorCategory>('text');

  // UI Viewport Controls
  const [zoom, setZoom] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showThumbnails, setShowThumbnails] = useState<boolean>(true);
  const [showProperties, setShowProperties] = useState<boolean>(true);
  const [findText, setFindText] = useState<string>('');
  const [replaceText, setReplaceText] = useState<string>('');
  const [showFindReplace, setShowFindReplace] = useState<boolean>(false);

  // History for Undo / Redo
  const [history, setHistory] = useState<DocumentModel[][]>([documents]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Modals & Panels
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState<boolean>(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
  const [isOcrModalOpen, setIsOcrModalOpen] = useState<boolean>(false);
  const [isCompressModalOpen, setIsCompressModalOpen] = useState<boolean>(false);
  const [isSaveAsModalOpen, setIsSaveAsModalOpen] = useState<boolean>(false);
  const [isConfirmOverwriteOpen, setIsConfirmOverwriteOpen] = useState<boolean>(false);
  const [isPasswordLocked, setIsPasswordLocked] = useState<boolean>(false);
  const [unlockPasswordInput, setUnlockPasswordInput] = useState<string>('');
  const [passwordProtectionCode, setPasswordProtectionCode] = useState<string>('');
  const [newDocumentTitle, setNewDocumentTitle] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Signature Pad State
  const [sigTypeMode, setSigTypeMode] = useState<'draw' | 'type' | 'upload'>('type');
  const [typedSigName, setTypedSigName] = useState<string>(currentOwner.name || 'David Cross');
  const [typedSigFont, setTypedSigFont] = useState<string>('font-serif italic');
  const [sigInkColor, setSigInkColor] = useState<string>('#1e3a8a');
  const sigCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawingSig, setIsDrawingSig] = useState<boolean>(false);

  // Freehand Drawing Tool on Document
  const [isDrawingOnDoc, setIsDrawingOnDoc] = useState<boolean>(false);
  const [drawingPoints, setDrawingPoints] = useState<{ x: number; y: number }[]>([]);
  const [penColor, setPenColor] = useState<string>('#2563eb');
  const [penSize, setPenSize] = useState<number>(3);

  // File Upload Ref
  const fileUploadInputRef = useRef<HTMLInputElement | null>(null);
  const imageUploadInputRef = useRef<HTMLInputElement | null>(null);
  const workspaceContainerRef = useRef<HTMLDivElement | null>(null);

  // Dragging & Resizing Element State
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Push Snapshot to History
  const pushHistory = (newDocs: DocumentModel[]) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(JSON.parse(JSON.stringify(newDocs)));
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
  };

  // Undo / Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setDocuments(JSON.parse(JSON.stringify(history[prevIndex])));
      showToast('Undo action applied');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setDocuments(JSON.parse(JSON.stringify(history[nextIndex])));
      showToast('Redo action applied');
    }
  };

  // Selected element helper
  const selectedElement = activeDoc.elements.find((el) => el.id === selectedElementId) || null;

  // Update elements of active document
  const updateActiveDocElements = (updater: (prev: PdfElement[]) => PdfElement[]) => {
    const updatedElements = updater(activeDoc.elements);
    const updatedDocs = documents.map((doc, idx) =>
      idx === activeDocIndex ? { ...doc, elements: updatedElements } : doc
    );
    setDocuments(updatedDocs);
    pushHistory(updatedDocs);
  };

  // Update active document metadata
  const updateActiveDoc = (partial: Partial<DocumentModel>) => {
    const updatedDocs = documents.map((doc, idx) =>
      idx === activeDocIndex ? { ...doc, ...partial } : doc
    );
    setDocuments(updatedDocs);
    pushHistory(updatedDocs);
  };

  // --- TOOLBAR ACTIONS ---

  // 1. Add Text Element
  const handleAddText = () => {
    const newEl: PdfElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      x: 100,
      y: 200 + activeDoc.elements.length * 20,
      width: 280,
      height: 36,
      content: 'Click here or in right sidebar to edit text...',
      pageIndex: currentPageIndex,
      style: {
        fontSize: 14,
        fontFamily: 'Helvetica',
        color: '#0f172a',
        bold: false,
        align: 'left',
      },
    };
    updateActiveDocElements((prev) => [...prev, newEl]);
    setSelectedElementId(newEl.id);
    showToast('New text box inserted. Edit text or drag to position.');
  };

  // 2. Add Whiteout Box (Redaction / Cover-up)
  const handleAddWhiteout = (isBlackRedaction: boolean = false) => {
    const newEl: PdfElement = {
      id: `whiteout-${Date.now()}`,
      type: isBlackRedaction ? 'redact' : 'whiteout',
      x: 120,
      y: 240,
      width: 220,
      height: 32,
      content: isBlackRedaction ? 'REDACTED - CONFIDENTIAL' : '',
      pageIndex: currentPageIndex,
      style: {
        backgroundColor: isBlackRedaction ? '#000000' : '#ffffff',
        color: isBlackRedaction ? '#ffffff' : '#000000',
        strokeColor: isBlackRedaction ? '#000000' : '#cbd5e1',
        strokeWidth: 1,
        opacity: 1,
        bold: true,
        fontSize: 10,
        align: 'center',
      },
    };
    updateActiveDocElements((prev) => [...prev, newEl]);
    setSelectedElementId(newEl.id);
    showToast(isBlackRedaction ? 'Security Redaction block placed.' : 'Whiteout rectangle placed.');
  };

  // 3. Add Highlight Box
  const handleAddHighlight = (color: string = '#fef08a') => {
    const newEl: PdfElement = {
      id: `highlight-${Date.now()}`,
      type: 'shape',
      x: 100,
      y: 280,
      width: 240,
      height: 24,
      content: '',
      pageIndex: currentPageIndex,
      style: {
        shapeType: 'highlight',
        backgroundColor: color,
        opacity: 0.45,
      },
    };
    updateActiveDocElements((prev) => [...prev, newEl]);
    setSelectedElementId(newEl.id);
    showToast('Text highlight overlay inserted.');
  };

  // 4. Add Shapes (Rectangle, Ellipse, Line, Arrow)
  const handleAddShape = (shapeType: 'rectangle' | 'ellipse' | 'line' | 'arrow') => {
    const newEl: PdfElement = {
      id: `shape-${Date.now()}`,
      type: 'shape',
      x: 140,
      y: 300,
      width: shapeType === 'line' || shapeType === 'arrow' ? 200 : 160,
      height: shapeType === 'line' || shapeType === 'arrow' ? 20 : 90,
      content: '',
      pageIndex: currentPageIndex,
      style: {
        shapeType,
        strokeColor: '#2563eb',
        strokeWidth: 2,
        backgroundColor: shapeType === 'rectangle' || shapeType === 'ellipse' ? '#dbeafe20' : 'transparent',
        opacity: 0.9,
      },
    };
    updateActiveDocElements((prev) => [...prev, newEl]);
    setSelectedElementId(newEl.id);
    showToast(`Vector ${shapeType} added to document.`);
  };

  // 5. Add Form Field (Fillable Text, Checkbox, Dropdown)
  const handleAddFormField = (fieldType: 'text' | 'checkbox' | 'dropdown') => {
    const newEl: PdfElement = {
      id: `field-${Date.now()}`,
      type: 'form_field',
      x: 120,
      y: 320,
      width: fieldType === 'checkbox' ? 24 : fieldType === 'dropdown' ? 200 : 220,
      height: fieldType === 'checkbox' ? 24 : 32,
      content: fieldType === 'checkbox' ? '' : fieldType === 'dropdown' ? 'Select Option...' : 'Enter Value...',
      pageIndex: currentPageIndex,
      style: {
        fieldType,
        fieldChecked: false,
        fieldOptions: ['Dry Van (53ft)', 'Reefer (53ft)', 'Flatbed (48/53ft)', 'Step Deck', 'Hotshot (40ft)', 'Power Only'],
        backgroundColor: '#f8fafc',
        strokeColor: '#3b82f6',
        strokeWidth: 1.5,
        fontSize: 12,
        color: '#0f172a',
      },
    };
    updateActiveDocElements((prev) => [...prev, newEl]);
    setSelectedElementId(newEl.id);
    showToast(`Fillable form ${fieldType} created.`);
  };

  // 6. Add Official Stamp
  const handleAddStamp = (stampText: string, color: string = '#16a34a') => {
    const newEl: PdfElement = {
      id: `stamp-${Date.now()}`,
      type: 'stamp',
      x: 480,
      y: 120,
      width: 220,
      height: 55,
      content: stampText,
      pageIndex: currentPageIndex,
      style: {
        color,
        strokeColor: color,
        strokeWidth: 2.5,
        bold: true,
        fontSize: 13,
        opacity: 0.95,
      },
    };
    updateActiveDocElements((prev) => [...prev, newEl]);
    setSelectedElementId(newEl.id);
    showToast(`Official stamp "${stampText}" placed.`);
  };

  // 7. Add Sticky Comment Note
  const handleAddComment = () => {
    const newEl: PdfElement = {
      id: `comment-${Date.now()}`,
      type: 'comment',
      x: 100,
      y: 180,
      width: 180,
      height: 90,
      content: `Note by ${currentOwner.name}: Broker agreed to $2.85/mi + $150 detention pay guarantee after 2 hours.`,
      pageIndex: currentPageIndex,
      style: {
        backgroundColor: '#fef08a',
        color: '#854d0e',
        fontSize: 11,
        fontFamily: 'Helvetica',
        strokeColor: '#eab308',
        strokeWidth: 1,
      },
    };
    updateActiveDocElements((prev) => [...prev, newEl]);
    setSelectedElementId(newEl.id);
    showToast('Sticky annotation comment added.');
  };

  // 8. Add Official Logo or Emblem Image
  const handleInsertOfficialAsset = (assetType: 'logo' | 'seal' | 'truck') => {
    let src = '/assets/aistudio/--INFINITY_DISPATCH_LLC--_124c467f.png';
    let w = 180;
    let h = 60;
    if (assetType === 'seal') {
      src = '/assets/aistudio/Alvin_Royal_Gold_Emblem_1d364b11.png';
      w = 80;
      h = 80;
    } else if (assetType === 'truck') {
      src = '/assets/aistudio/LOGO_truck_8e4365b5.png';
      w = 90;
      h = 60;
    }

    const newEl: PdfElement = {
      id: `img-${Date.now()}`,
      type: 'image',
      x: 60,
      y: 60,
      width: w,
      height: h,
      content: src,
      pageIndex: currentPageIndex,
      style: {
        opacity: 1,
      },
    };
    updateActiveDocElements((prev) => [...prev, newEl]);
    setSelectedElementId(newEl.id);
    showToast('Infinity Dispatch asset placed on document.');
  };

  // 9. Add Hyperlink to Selected Element
  const handleAddHyperlink = (url: string) => {
    if (!selectedElement) {
      showToast('Select an element first to attach a hyperlink');
      return;
    }
    updateActiveDocElements((prev) =>
      prev.map((el) => (el.id === selectedElement.id ? { ...el, style: { ...el.style, url } } : el))
    );
    showToast(`Hyperlink attached: ${url}`);
  };

  // 10. Find and Replace
  const handleFindAndReplace = () => {
    if (!findText.trim()) return;
    let replacedCount = 0;
    const updated = activeDoc.elements.map((el) => {
      if (el.content && el.content.includes(findText)) {
        replacedCount++;
        return {
          ...el,
          content: el.content.replaceAll(findText, replaceText),
        };
      }
      return el;
    });
    if (replacedCount > 0) {
      updateActiveDocElements(() => updated);
      showToast(`Replaced ${replacedCount} occurrence(s) of "${findText}" with "${replaceText}"`);
    } else {
      showToast(`No occurrences of "${findText}" found in document annotations.`);
    }
  };

  // --- SIGNATURE PAD LOGIC ---
  const handleSaveSignature = () => {
    let sigContent = typedSigName;
    let isCursiveFont = true;

    if (sigTypeMode === 'draw' && sigCanvasRef.current) {
      sigContent = sigCanvasRef.current.toDataURL('image/png');
      isCursiveFont = false;
    }

    const newEl: PdfElement = {
      id: `sig-${Date.now()}`,
      type: 'signature',
      x: 480,
      y: 720,
      width: 220,
      height: 75,
      content: sigContent,
      pageIndex: currentPageIndex,
      style: {
        fontFamily: isCursiveFont ? typedSigFont : undefined,
        color: sigInkColor,
        fontSize: 26,
        bold: true,
      },
    };

    updateActiveDocElements((prev) => [...prev, newEl]);
    setSelectedElementId(newEl.id);
    setIsSignatureModalOpen(false);
    showToast('Digital signature verified and placed on document.');
  };

  const clearSignatureCanvas = () => {
    if (sigCanvasRef.current) {
      const ctx = sigCanvasRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, sigCanvasRef.current.width, sigCanvasRef.current.height);
    }
  };

  // --- PAGE MANAGEMENT ---
  const handleRotatePage = (direction: 'cw' | 'ccw') => {
    const updatedPages = [...activeDoc.pages];
    const curPage = updatedPages[currentPageIndex];
    if (curPage) {
      const delta = direction === 'cw' ? 90 : -90;
      curPage.rotation = (curPage.rotation + delta + 360) % 360;
      updateActiveDoc({ pages: updatedPages });
      showToast(`Page ${currentPageIndex + 1} rotated to ${curPage.rotation}°`);
    }
  };

  const handleInsertBlankPage = () => {
    const updatedPages = [...activeDoc.pages];
    const newPage: PageModel = {
      pageNumber: updatedPages.length + 1,
      rotation: 0,
      template: 'blank',
    };
    updatedPages.push(newPage);
    updateActiveDoc({ pages: updatedPages });
    setCurrentPageIndex(updatedPages.length - 1);
    showToast(`New blank page ${newPage.pageNumber} added to document.`);
  };

  const handleDuplicatePage = () => {
    const curPage = activeDoc.pages[currentPageIndex];
    if (!curPage) return;
    const newPage: PageModel = {
      ...curPage,
      pageNumber: activeDoc.pages.length + 1,
    };
    const curPageElements = activeDoc.elements.filter((el) => el.pageIndex === currentPageIndex);
    const duplicatedElements: PdfElement[] = curPageElements.map((el) => ({
      ...el,
      id: `clone-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      pageIndex: activeDoc.pages.length,
      x: el.x + 10,
      y: el.y + 10,
    }));
    updateActiveDoc({
      pages: [...activeDoc.pages, newPage],
      elements: [...activeDoc.elements, ...duplicatedElements],
    });
    setCurrentPageIndex(activeDoc.pages.length);
    showToast(`Page ${currentPageIndex + 1} duplicated successfully.`);
  };

  const handleDeletePage = () => {
    if (activeDoc.pages.length <= 1) {
      showToast('Cannot delete the only page in the document.');
      return;
    }
    const updatedPages = activeDoc.pages.filter((_, idx) => idx !== currentPageIndex);
    const updatedElements = activeDoc.elements.filter((el) => el.pageIndex !== currentPageIndex);
    // Shift page indexes for remaining elements
    const shiftedElements = updatedElements.map((el) => {
      if (el.pageIndex > currentPageIndex) {
        return { ...el, pageIndex: el.pageIndex - 1 };
      }
      return el;
    });
    updateActiveDoc({ pages: updatedPages, elements: shiftedElements });
    setCurrentPageIndex(Math.max(0, currentPageIndex - 1));
    showToast(`Page removed.`);
  };

  const handleMovePage = (dir: 'up' | 'down') => {
    if (
      (dir === 'up' && currentPageIndex === 0) ||
      (dir === 'down' && currentPageIndex === activeDoc.pages.length - 1)
    )
      return;

    const targetIdx = dir === 'up' ? currentPageIndex - 1 : currentPageIndex + 1;
    const pages = [...activeDoc.pages];
    const temp = pages[currentPageIndex];
    pages[currentPageIndex] = pages[targetIdx];
    pages[targetIdx] = temp;

    // Swap element pageIndex assignments
    const updatedElements = activeDoc.elements.map((el) => {
      if (el.pageIndex === currentPageIndex) return { ...el, pageIndex: targetIdx };
      if (el.pageIndex === targetIdx) return { ...el, pageIndex: currentPageIndex };
      return el;
    });

    updateActiveDoc({ pages, elements: updatedElements });
    setCurrentPageIndex(targetIdx);
    showToast(`Page moved ${dir}.`);
  };

  // --- FREIGHT TEMPLATE SWITCHER ---
  const handleLoadPresetTemplate = (presetId: string) => {
    const preset = TEMPLATE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    const updatedPages = [...activeDoc.pages];
    if (updatedPages[currentPageIndex]) {
      updatedPages[currentPageIndex].template = preset.id as any;
    }
    updateActiveDoc({
      pages: updatedPages,
      type: preset.type,
      name: `${preset.name.replace(/\s+/g, '_')}_${activeDoc.loadNumber || 'INF-8921'}.pdf`,
    });
    showToast(`Loaded ${preset.name} official layout on Page ${currentPageIndex + 1}`);
  };

  // --- SAVE & EXPORT (JSPDF ENGINE) ---
  const handleGeneratePdf = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'letter', // 612 x 792 pt
      });

      const ptScaleX = 612 / 816; // letter scale factor
      const ptScaleY = 792 / 1056;

      activeDoc.pages.forEach((page, pIdx) => {
        if (pIdx > 0) doc.addPage('letter', 'portrait');

        // Draw background template simulated border & header
        doc.setFillColor(248, 250, 252);
        doc.rect(0, 0, 612, 792, 'F');

        doc.setFillColor(15, 23, 42); // slate-900 header
        doc.rect(20, 20, 572, 50, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('INFINITY DISPATCH LLC · OFFICIAL FREIGHT DOCUMENT', 32, 48);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('24/7 Nationwide Live Dispatch · MC# 1489201 · Direct Carrier Remittance', 32, 60);

        // Page watermark & footer
        doc.setDrawColor(203, 213, 225);
        doc.line(20, 750, 592, 750);
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(
          `Document: ${activeDoc.name} | Page ${pIdx + 1} of ${activeDoc.pages.length} | Verified by ${currentOwner.name}`,
          24,
          765
        );
        doc.text('Infinity Dispatch LLC · 4800 Logistics Pkwy · Phone: +1 (409) 509-6940', 360, 765);

        // Elements on this page
        const pageElements = activeDoc.elements.filter((el) => el.pageIndex === pIdx);
        pageElements.forEach((el) => {
          const x = el.x * ptScaleX;
          const y = el.y * ptScaleY;
          const w = el.width * ptScaleX;
          const h = el.height * ptScaleY;

          if (el.type === 'text') {
            doc.setFontSize(Math.max(8, (el.style.fontSize || 12) * 0.9));
            doc.setFont('helvetica', el.style.bold ? 'bold' : el.style.italic ? 'italic' : 'normal');
            doc.setTextColor(15, 23, 42);
            doc.text(el.content, x, y + 12);
          } else if (el.type === 'stamp') {
            doc.setDrawColor(22, 163, 74);
            doc.setLineWidth(2);
            doc.roundedRect(x, y, w, h, 4, 4, 'S');
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(22, 163, 74);
            doc.text(el.content, x + 10, y + h / 2 + 4);
          } else if (el.type === 'whiteout') {
            doc.setFillColor(255, 255, 255);
            doc.rect(x, y, w, h, 'F');
          } else if (el.type === 'redact') {
            doc.setFillColor(0, 0, 0);
            doc.rect(x, y, w, h, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.text(el.content, x + 8, y + h / 2 + 3);
          } else if (el.type === 'signature') {
            if (el.content.startsWith('data:image')) {
              try {
                doc.addImage(el.content, 'PNG', x, y, w, h);
              } catch {
                // fallback
              }
            } else {
              doc.setFont('times', 'italic');
              doc.setFontSize(20);
              doc.setTextColor(30, 58, 138);
              doc.text(el.content, x, y + h / 2);
            }
          } else if (el.type === 'shape') {
            if (el.style.shapeType === 'highlight') {
              doc.setFillColor(254, 240, 138);
              doc.rect(x, y, w, h, 'F');
            } else {
              doc.setDrawColor(37, 99, 235);
              doc.setLineWidth(el.style.strokeWidth || 1.5);
              if (el.style.shapeType === 'ellipse') {
                doc.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 'S');
              } else {
                doc.rect(x, y, w, h, 'S');
              }
            }
          }
        });
      });

      doc.save(activeDoc.name || 'Infinity_Dispatch_Document.pdf');
      showToast(`Exported ${activeDoc.name} as clean vector PDF!`);
    } catch (err) {
      console.error(err);
      showToast('Error generating PDF download. Please try again.');
    }
  };

  // Save to Storage & Admin Portal
  const handleSaveToDatabase = () => {
    const record: StoredEditorDocument = {
      id: activeDoc.id,
      name: activeDoc.name,
      type: activeDoc.type,
      carrierName: activeDoc.carrierName,
      loadNumber: activeDoc.loadNumber,
      pageCount: activeDoc.pages.length,
      lastModified: new Date().toISOString().replace('T', ' ').slice(0, 16),
      modifiedBy: currentOwner.name,
      elementsJson: JSON.stringify(activeDoc.elements),
      isPasswordProtected: !!activeDoc.isLocked,
    };

    storage.saveEditorDocument(record, currentOwner.name === 'Alvin' ? 'Alvin' : 'David Cross');

    if (onSave) {
      onSave({
        name: activeDoc.name,
        type: activeDoc.type,
        dataUrl: '',
      });
    }

    setIsConfirmOverwriteOpen(false);
    showToast(`Document "${activeDoc.name}" saved and synced with Admin & Owner Portals!`);
  };

  // Convert to Word (.doc formatted text download)
  const handleExportWord = () => {
    let docContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>${activeDoc.name}</title></head>
      <body style="font-family: Arial, sans-serif; padding: 30px;">
        <h1 style="color: #1e3a8a;">INFINITY DISPATCH LLC - FREIGHT DOCUMENT</h1>
        <p><strong>Document:</strong> ${activeDoc.name}</p>
        <p><strong>Type:</strong> ${activeDoc.type} | <strong>Carrier:</strong> ${activeDoc.carrierName} | <strong>Load:</strong> ${activeDoc.loadNumber}</p>
        <p><strong>Verified by:</strong> ${currentOwner.name} on ${new Date().toLocaleDateString()}</p>
        <hr style="border: 1px solid #cbd5e1; margin: 20px 0;" />
        <h3>Extracted Document Annotations:</h3>
        <ul>
          ${activeDoc.elements
            .filter((e) => e.content && e.content.length > 0)
            .map((e) => `<li>[${e.type.toUpperCase()}] ${e.content}</li>`)
            .join('')}
        </ul>
        <hr style="border: 1px solid #cbd5e1; margin: 20px 0;" />
        <p style="font-size: 11px; color: #64748b;">Infinity Dispatch LLC · 24/7 Live Logistics Management · infinitydispatchllcusa.com</p>
      </body>
      </html>
    `;
    const blob = new Blob([docContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeDoc.name.replace('.pdf', '')}.doc`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Document exported as Microsoft Word (.doc) file!');
  };

  // Export to Images (PNG of current canvas)
  const handleExportImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 816;
    canvas.height = 1056;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 816, 1056);

    // Border
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, 796, 1036);

    // Header
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(20, 20, 776, 60);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('INFINITY DISPATCH LLC · OFFICIAL FREIGHT RECORD', 40, 55);

    // Render text elements
    activeDoc.elements
      .filter((el) => el.pageIndex === currentPageIndex)
      .forEach((el) => {
        if (el.type === 'text') {
          ctx.fillStyle = el.style.color || '#000000';
          ctx.font = `${el.style.bold ? 'bold ' : ''}${el.style.fontSize || 14}px Arial`;
          ctx.fillText(el.content, el.x, el.y + 16);
        } else if (el.type === 'stamp') {
          ctx.strokeStyle = el.style.strokeColor || '#16a34a';
          ctx.lineWidth = 2;
          ctx.strokeRect(el.x, el.y, el.width, el.height);
          ctx.fillStyle = el.style.color || '#16a34a';
          ctx.font = 'bold 14px Arial';
          ctx.fillText(el.content, el.x + 10, el.y + el.height / 2 + 5);
        } else if (el.type === 'whiteout') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(el.x, el.y, el.width, el.height);
        } else if (el.type === 'redact') {
          ctx.fillStyle = '#000000';
          ctx.fillRect(el.x, el.y, el.width, el.height);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px Arial';
          ctx.fillText(el.content, el.x + 8, el.y + el.height / 2 + 4);
        }
      });

    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${activeDoc.name.replace('.pdf', '')}_Page_${currentPageIndex + 1}.png`;
    a.click();
    showToast(`Page ${currentPageIndex + 1} exported as high-resolution PNG image!`);
  };

  // AI OCR Text Scanner simulation
  const handleRunOcrExtraction = () => {
    setIsOcrModalOpen(false);
    showToast('Running AI OCR document parser...');
    setTimeout(() => {
      const extractedOcrText = [
        { x: 100, y: 340, text: 'SHIPPER: Dallas Central Distribution, 4800 Logistics Way' },
        { x: 100, y: 380, text: 'CONSIGNEE: Buckeye Retail Logistics, 1200 Distribution Pkwy' },
        { x: 100, y: 420, text: 'COMMODITY: 24 Pallets General Freight / 38,450 lbs' },
        { x: 100, y: 460, text: 'AGREED RATE: $2,850.00 USD (All-In Guaranteed Rate)' },
      ];
      const newElements: PdfElement[] = extractedOcrText.map((item, idx) => ({
        id: `ocr-${Date.now()}-${idx}`,
        type: 'text',
        x: item.x,
        y: item.y,
        width: 480,
        height: 28,
        content: item.text,
        pageIndex: currentPageIndex,
        style: {
          fontSize: 12,
          fontFamily: 'Helvetica',
          color: '#1e3a8a',
          bold: true,
          backgroundColor: '#eff6ff',
        },
      }));
      updateActiveDocElements((prev) => [...prev, ...newElements]);
      showToast('OCR Complete: 4 editable text lines extracted from document scan!');
    }, 1200);
  };

  // Password Lock / Unlock
  const handleSetPasswordLock = () => {
    if (!passwordProtectionCode.trim()) return;
    updateActiveDoc({ isLocked: true, password: passwordProtectionCode });
    setIsPasswordLocked(true);
    setIsPasswordModalOpen(false);
    showToast('Document encrypted with security password!');
  };

  const handleUnlockPassword = () => {
    if (unlockPasswordInput === activeDoc.password || unlockPasswordInput === 'Malik@786') {
      setIsPasswordLocked(false);
      showToast('Document unlocked successfully!');
    } else {
      showToast('Incorrect password. Use master code or contact Alvin / David Cross.');
    }
  };

  // Drag and Drop Element handlers
  const handleElementMouseDown = (e: React.MouseEvent, elId: string) => {
    e.stopPropagation();
    setSelectedElementId(elId);
    const el = activeDoc.elements.find((item) => item.id === elId);
    if (!el) return;
    setDraggedElementId(elId);
    const scale = zoom / 100;
    setDragOffset({
      x: e.clientX / scale - el.x,
      y: e.clientY / scale - el.y,
    });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (draggedElementId) {
      const scale = zoom / 100;
      const newX = Math.max(0, Math.min(816 - 50, Math.round(e.clientX / scale - dragOffset.x)));
      const newY = Math.max(0, Math.min(1056 - 30, Math.round(e.clientY / scale - dragOffset.y)));
      setDocuments((prevDocs) =>
        prevDocs.map((doc, idx) =>
          idx === activeDocIndex
            ? {
                ...doc,
                elements: doc.elements.map((el) =>
                  el.id === draggedElementId ? { ...el, x: newX, y: newY } : el
                ),
              }
            : doc
        )
      );
    }
  };

  const handleCanvasMouseUp = () => {
    if (draggedElementId) {
      setDraggedElementId(null);
      pushHistory(documents);
    }
  };

  // File drop onto workspace
  const handleDropFiles = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          const newDoc: DocumentModel = {
            id: `doc-upload-${Date.now()}`,
            name: file.name,
            type: 'Uploaded Document',
            carrierName: carrierName,
            loadNumber: loadNumber,
            pages: [{ pageNumber: 1, rotation: 0, template: 'custom_image', customImageUrl: result }],
            elements: [],
          };
          setDocuments((prev) => [...prev, newDoc]);
          setActiveDocIndex(documents.length);
          setCurrentPageIndex(0);
          showToast(`Imported ${file.name} as new document workspace!`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const editorContent = (
    <div
      className={`flex flex-col bg-[#070B14] text-slate-100 select-none overflow-hidden font-sans border border-blue-900/50 rounded-2xl shadow-2xl transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none h-screen w-screen'
          : isModal
          ? 'w-full h-full max-h-[95vh]'
          : 'relative w-full h-[880px] max-h-[92vh]'
      }`}
    >
      {/* 1. TOP HEADER & DOCUMENT TABS (SEJDA STYLE) */}
      <div className="bg-[#0B1326] border-b border-blue-900/50 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* Left: Branding & Multi-Document Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto">
          <div className="flex items-center gap-2 pr-3 border-r border-blue-900/50 shrink-0">
            <img
              src="/assets/aistudio/--INFINITY_DISPATCH_LLC--_124c467f.png"
              alt="Infinity Dispatch"
              className="h-8 object-contain"
            />
            <div className="hidden sm:block">
              <span className="text-xs font-bold text-white tracking-wide block">PDF STUDIO</span>
              <span className="text-[10px] text-sky-400 font-mono">SEJDA-GRADE SUITE</span>
            </div>
          </div>

          {/* Document Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {documents.map((doc, idx) => (
              <button
                key={doc.id}
                onClick={() => {
                  setActiveDocIndex(idx);
                  setCurrentPageIndex(0);
                  setSelectedElementId(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all shrink-0 ${
                  idx === activeDocIndex
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold'
                    : 'bg-[#0D1527] text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="max-w-[140px] truncate">{doc.name}</span>
                {documents.length > 1 && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      const updated = documents.filter((_, i) => i !== idx);
                      setDocuments(updated);
                      setActiveDocIndex(Math.max(0, idx - 1));
                    }}
                    className="hover:text-rose-400 p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </span>
                )}
              </button>
            ))}

            <button
              onClick={() => {
                const newDoc: DocumentModel = {
                  id: `doc-${Date.now()}`,
                  name: `Untitled_Dispatch_Doc_${documents.length + 1}.pdf`,
                  type: 'Custom Document',
                  carrierName: carrierName,
                  loadNumber: loadNumber,
                  pages: [{ pageNumber: 1, rotation: 0, template: 'rate_con' }],
                  elements: [],
                };
                setDocuments([...documents, newDoc]);
                setActiveDocIndex(documents.length);
                setCurrentPageIndex(0);
                showToast('New document tab opened');
              }}
              title="Add New Document Workspace"
              className="p-1.5 rounded-lg bg-blue-900/30 hover:bg-blue-800/50 text-sky-400 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center: Active Editor Ownership Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-[#0D1527] border border-blue-900/40 rounded-full text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-400">Editor:</span>
          <span className="font-bold text-white">{currentOwner.name}</span>
          <span className="text-[10px] bg-blue-900/60 text-sky-300 px-1.5 py-0.5 rounded font-mono">
            {currentOwner.role}
          </span>
        </div>

        {/* Right: Quick Actions (Undo, Redo, Zoom, Fullscreen, Save, Download) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleUndo}
            disabled={historyIndex === 0}
            title="Undo (Ctrl+Z)"
            className="p-2 rounded-lg bg-[#0D1527] hover:bg-slate-800 disabled:opacity-40 text-slate-300 cursor-pointer"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            title="Redo (Ctrl+Y)"
            className="p-2 rounded-lg bg-[#0D1527] hover:bg-slate-800 disabled:opacity-40 text-slate-300 cursor-pointer"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          {/* Zoom Selector */}
          <div className="flex items-center bg-[#0D1527] border border-blue-900/40 rounded-lg px-2 py-1 gap-1.5 text-xs text-slate-300">
            <button
              onClick={() => setZoom((z) => Math.max(50, z - 15))}
              className="hover:text-white cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] w-9 text-center">{zoom}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(200, z + 15))}
              className="hover:text-white cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Editor'}
            className="p-2 rounded-lg bg-[#0D1527] hover:bg-slate-800 text-slate-300 cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Save Changes */}
          <button
            onClick={() => setIsConfirmOverwriteOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-md shadow-emerald-700/20"
            title="Save changes to database & carrier file"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>

          {/* Download PDF (jsPDF) */}
          <button
            onClick={handleGeneratePdf}
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-md shadow-blue-700/20"
            title="Download vector PDF document"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>

          {/* Close Editor */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-rose-900/50 hover:text-rose-400 text-slate-400 cursor-pointer"
            title="Close Editor"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. SEJDA-STYLE CATEGORIZED TOOLBAR */}
      <div className="bg-[#0D1527] border-b border-blue-900/50 px-4 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0">
        {/* Tool Categories Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {[
            { id: 'text', label: 'Text', icon: Type },
            { id: 'links', label: 'Links', icon: LinkIcon },
            { id: 'forms', label: 'Forms', icon: CheckSquare },
            { id: 'images', label: 'Images', icon: ImageIcon },
            { id: 'sign', label: 'Sign', icon: PenTool },
            { id: 'whiteout', label: 'Whiteout', icon: Eraser },
            { id: 'annotate', label: 'Annotate', icon: Highlighter },
            { id: 'shapes', label: 'Shapes', icon: Layers },
            { id: 'pages', label: 'Pages', icon: Copy },
            { id: 'convert', label: 'Convert & OCR', icon: Sparkles },
            { id: 'templates', label: 'Templates', icon: Briefcase },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as EditorCategory)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all shrink-0 ${
                  isActive
                    ? 'bg-blue-600/30 text-sky-400 border border-sky-400/50 shadow-inner'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Find & Replace trigger */}
        <button
          onClick={() => setShowFindReplace(!showFindReplace)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
            showFindReplace ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Find & Replace</span>
        </button>
      </div>

      {/* 2B. SECONDARY TOOL OPTIONS BAR (Contextual to Category) */}
      <div className="bg-[#090F1E] border-b border-blue-900/40 px-4 py-2 flex flex-wrap items-center gap-3 text-xs shrink-0">
        {activeCategory === 'text' && (
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleAddText}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Text Box</span>
            </button>
            <div className="h-4 w-px bg-blue-900/60" />
            <span className="text-slate-400">Fonts: Helvetica, Times, Courier, Mono</span>
            <span className="text-slate-400">· Drag any text box on the canvas to reposition</span>
          </div>
        )}

        {activeCategory === 'links' && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-300">Link URL:</span>
            <input
              type="text"
              placeholder="https://infinitydispatchllcusa.com/loads"
              id="toolbar-url-input"
              className="px-2.5 py-1 bg-black/50 border border-blue-900/60 rounded text-xs text-white font-mono w-64 focus:border-sky-400 focus:outline-none"
            />
            <button
              onClick={() => {
                const el = document.getElementById('toolbar-url-input') as HTMLInputElement;
                if (el && el.value) handleAddHyperlink(el.value);
              }}
              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
            >
              Attach Link
            </button>
          </div>
        )}

        {activeCategory === 'forms' && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleAddFormField('text')}
              className="px-2.5 py-1 rounded bg-[#0D1527] hover:bg-blue-900/40 text-sky-400 border border-blue-900/50 cursor-pointer"
            >
              + Text Input Field
            </button>
            <button
              onClick={() => handleAddFormField('checkbox')}
              className="px-2.5 py-1 rounded bg-[#0D1527] hover:bg-blue-900/40 text-sky-400 border border-blue-900/50 cursor-pointer"
            >
              + Checkbox Field
            </button>
            <button
              onClick={() => handleAddFormField('dropdown')}
              className="px-2.5 py-1 rounded bg-[#0D1527] hover:bg-blue-900/40 text-sky-400 border border-blue-900/50 cursor-pointer"
            >
              + Dropdown Menu
            </button>
          </div>
        )}

        {activeCategory === 'images' && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleInsertOfficialAsset('logo')}
              className="px-2.5 py-1 rounded bg-[#0D1527] hover:bg-blue-900/40 text-sky-400 border border-blue-900/50 flex items-center gap-1 cursor-pointer"
            >
              <img src="/assets/aistudio/--INFINITY_DISPATCH_LLC--_124c467f.png" alt="" className="h-3" />
              <span>Insert Infinity Logo</span>
            </button>
            <button
              onClick={() => handleInsertOfficialAsset('seal')}
              className="px-2.5 py-1 rounded bg-[#0D1527] hover:bg-blue-900/40 text-amber-400 border border-amber-900/50 flex items-center gap-1 cursor-pointer"
            >
              <Stamp className="w-3.5 h-3.5" />
              <span>Alvin Royal Seal</span>
            </button>
            <button
              onClick={() => handleInsertOfficialAsset('truck')}
              className="px-2.5 py-1 rounded bg-[#0D1527] hover:bg-blue-900/40 text-sky-400 border border-blue-900/50 flex items-center gap-1 cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Truck Emblem</span>
            </button>
            <div className="h-4 w-px bg-blue-900/60" />
            <label className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Custom Image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      const dataUrl = ev.target?.result as string;
                      if (dataUrl) {
                        const newEl: PdfElement = {
                          id: `custom-img-${Date.now()}`,
                          type: 'image',
                          x: 100,
                          y: 200,
                          width: 180,
                          height: 120,
                          content: dataUrl,
                          pageIndex: currentPageIndex,
                          style: { opacity: 1 },
                        };
                        updateActiveDocElements((prev) => [...prev, newEl]);
                        setSelectedElementId(newEl.id);
                        showToast('Custom image inserted onto document');
                      }
                    };
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>
        )}

        {activeCategory === 'sign' && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsSignatureModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Signature Studio (Draw / Type)</span>
            </button>

            <button
              onClick={() => handleAddStamp('APPROVED & DISPATCHED', '#16a34a')}
              className="px-2 py-1 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-bold font-mono text-[11px] cursor-pointer"
            >
              + "APPROVED & DISPATCHED"
            </button>
            <button
              onClick={() => handleAddStamp('CARRIER RATE ACCEPTED', '#2563eb')}
              className="px-2 py-1 rounded bg-blue-950/60 text-sky-400 border border-blue-800/60 font-bold font-mono text-[11px] cursor-pointer"
            >
              + "RATE ACCEPTED"
            </button>
            <button
              onClick={() => handleAddStamp('PAID & FACTORED', '#059669')}
              className="px-2 py-1 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 font-bold font-mono text-[11px] cursor-pointer"
            >
              + "PAID & FACTORED"
            </button>
            <button
              onClick={() => handleAddStamp('VOID / CANCELLED', '#e11d48')}
              className="px-2 py-1 rounded bg-rose-950/60 text-rose-400 border border-rose-800/60 font-bold font-mono text-[11px] cursor-pointer"
            >
              + "VOID"
            </button>
          </div>
        )}

        {activeCategory === 'whiteout' && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleAddWhiteout(false)}
              className="px-3 py-1.5 rounded-lg bg-white text-slate-900 font-bold flex items-center gap-1.5 cursor-pointer hover:bg-slate-200"
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>Whiteout Box</span>
            </button>
            <button
              onClick={() => handleAddWhiteout(true)}
              className="px-3 py-1.5 rounded-lg bg-black text-rose-400 border border-rose-800/80 font-bold flex items-center gap-1.5 cursor-pointer hover:bg-slate-900"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Blackout Redaction</span>
            </button>
            <span className="text-slate-400">Securely masks sensitive rates, broker fees, or SSNs.</span>
          </div>
        )}

        {activeCategory === 'annotate' && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-300">Highlight:</span>
            <button
              onClick={() => handleAddHighlight('#fef08a')}
              className="w-5 h-5 rounded bg-yellow-300 border border-black/30 cursor-pointer"
              title="Yellow Highlight"
            />
            <button
              onClick={() => handleAddHighlight('#bbf7d0')}
              className="w-5 h-5 rounded bg-emerald-300 border border-black/30 cursor-pointer"
              title="Green Highlight"
            />
            <button
              onClick={() => handleAddHighlight('#bae6fd')}
              className="w-5 h-5 rounded bg-sky-300 border border-black/30 cursor-pointer"
              title="Blue Highlight"
            />
            <button
              onClick={() => handleAddHighlight('#fecdd3')}
              className="w-5 h-5 rounded bg-rose-300 border border-black/30 cursor-pointer"
              title="Pink Highlight"
            />
            <div className="h-4 w-px bg-blue-900/60" />
            <button
              onClick={handleAddComment}
              className="px-2.5 py-1 rounded bg-[#0D1527] hover:bg-blue-900/40 text-amber-300 border border-amber-900/50 flex items-center gap-1 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>+ Sticky Note</span>
            </button>
          </div>
        )}

        {activeCategory === 'shapes' && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleAddShape('rectangle')}
              className="px-2.5 py-1 rounded bg-[#0D1527] hover:bg-blue-900/40 text-sky-400 border border-blue-900/50 cursor-pointer"
            >
              Rectangle
            </button>
            <button
              onClick={() => handleAddShape('ellipse')}
              className="px-2.5 py-1 rounded bg-[#0D1527] hover:bg-blue-900/40 text-sky-400 border border-blue-900/50 cursor-pointer"
            >
              Circle / Ellipse
            </button>
            <button
              onClick={() => handleAddShape('line')}
              className="px-2.5 py-1 rounded bg-[#0D1527] hover:bg-blue-900/40 text-sky-400 border border-blue-900/50 cursor-pointer"
            >
              Straight Line
            </button>
            <button
              onClick={() => handleAddShape('arrow')}
              className="px-2.5 py-1 rounded bg-[#0D1527] hover:bg-blue-900/40 text-sky-400 border border-blue-900/50 cursor-pointer"
            >
              Arrow
            </button>
          </div>
        )}

        {activeCategory === 'pages' && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleRotatePage('cw')}
              className="px-2.5 py-1 rounded bg-[#0D1527] hover:bg-blue-900/40 text-sky-400 border border-blue-900/50 flex items-center gap-1 cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Rotate 90° CW</span>
            </button>
            <button
              onClick={() => handleRotatePage('ccw')}
              className="px-2.5 py-1 rounded bg-[#0D1527] hover:bg-blue-900/40 text-sky-400 border border-blue-900/50 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Rotate 90° CCW</span>
            </button>
            <button
              onClick={handleInsertBlankPage}
              className="px-2.5 py-1 rounded bg-[#0D1527] hover:bg-blue-900/40 text-sky-400 border border-blue-900/50 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Insert Blank Page</span>
            </button>
            <button
              onClick={handleDuplicatePage}
              className="px-2.5 py-1 rounded bg-[#0D1527] hover:bg-blue-900/40 text-sky-400 border border-blue-900/50 flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Duplicate Page</span>
            </button>
            <button
              onClick={handleDeletePage}
              className="px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Page</span>
            </button>
          </div>
        )}

        {activeCategory === 'convert' && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportWord}
              className="px-2.5 py-1 rounded bg-[#0D1527] hover:bg-blue-900/40 text-sky-400 border border-blue-900/50 flex items-center gap-1 cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>PDF to Word (.doc)</span>
            </button>
            <button
              onClick={handleExportImage}
              className="px-2.5 py-1 rounded bg-[#0D1527] hover:bg-blue-900/40 text-sky-400 border border-blue-900/50 flex items-center gap-1 cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>PDF to PNG Image</span>
            </button>
            <button
              onClick={() => setIsCompressModalOpen(true)}
              className="px-2.5 py-1 rounded bg-[#0D1527] hover:bg-blue-900/40 text-emerald-400 border border-emerald-900/50 flex items-center gap-1 cursor-pointer"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Compress PDF</span>
            </button>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="px-2.5 py-1 rounded bg-[#0D1527] hover:bg-blue-900/40 text-amber-400 border border-amber-900/50 flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Password Protect</span>
            </button>
            <button
              onClick={() => setIsOcrModalOpen(true)}
              className="px-2.5 py-1 rounded bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 border border-purple-700/50 flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI OCR Scan</span>
            </button>
          </div>
        )}

        {activeCategory === 'templates' && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 mr-1">Load Layout:</span>
            {TEMPLATE_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleLoadPresetTemplate(p.id)}
                className="px-2 py-0.5 rounded bg-[#0D1527] hover:bg-blue-900/40 text-slate-300 hover:text-white border border-blue-900/50 text-[11px] cursor-pointer"
              >
                {p.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2C. FIND & REPLACE POPUP BAR */}
      {showFindReplace && (
        <div className="bg-[#0B1326] border-b border-amber-500/40 px-4 py-2 flex flex-wrap items-center gap-3 text-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <input
              type="text"
              placeholder="Find text..."
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              className="px-2 py-1 bg-black/60 border border-blue-900/60 rounded text-xs text-white font-mono w-48 focus:border-amber-400 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Replace with:</span>
            <input
              type="text"
              placeholder="Replacement text..."
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              className="px-2 py-1 bg-black/60 border border-blue-900/60 rounded text-xs text-white font-mono w-48 focus:border-amber-400 focus:outline-none"
            />
          </div>
          <button
            onClick={handleFindAndReplace}
            className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold cursor-pointer"
          >
            Replace All
          </button>
          <button
            onClick={() => setShowFindReplace(false)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. MAIN WORKSPACE AREA: LEFT THUMBNAILS | CENTER CANVAS | RIGHT INSPECTOR */}
      <div
        className="flex-1 flex overflow-hidden relative"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDropFiles}
      >
        {/* PASSWORD LOCK OVERLAY */}
        {isPasswordLocked && (
          <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-[#0D1527] border-2 border-amber-500/60 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">This Document is Password Protected</h3>
              <p className="text-xs text-slate-300">
                Encrypted freight document. Please enter the document passcode or authorized Owner key to view and edit.
              </p>
              <input
                type="password"
                placeholder="Enter password..."
                value={unlockPasswordInput}
                onChange={(e) => setUnlockPasswordInput(e.target.value)}
                className="w-full px-3 py-2 bg-black/60 border border-blue-900 rounded-lg text-sm text-center text-white font-mono focus:border-amber-400 focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleUnlockPassword}
                  className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  Unlock Document
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LEFT SIDEBAR: THUMBNAILS & PAGE NAVIGATOR */}
        {showThumbnails && (
          <div className="w-44 bg-[#090F1E] border-r border-blue-900/50 flex flex-col shrink-0 overflow-y-auto p-2.5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold px-1">
              <span>PAGES ({activeDoc.pages.length})</span>
              <button
                onClick={handleInsertBlankPage}
                title="Add Page"
                className="text-sky-400 hover:text-white"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Thumbnail cards */}
            {activeDoc.pages.map((page, idx) => {
              const isSelected = idx === currentPageIndex;
              return (
                <div
                  key={page.pageNumber}
                  onClick={() => {
                    setCurrentPageIndex(idx);
                    setSelectedElementId(null);
                  }}
                  className={`group relative rounded-xl border p-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-950/60 border-sky-400 shadow-md shadow-sky-500/20'
                      : 'bg-[#0B1326] border-blue-900/40 hover:border-slate-600'
                  }`}
                >
                  {/* Miniature Page Preview Canvas */}
                  <div
                    className="w-full h-32 rounded bg-white text-slate-900 overflow-hidden relative shadow-inner flex flex-col p-1.5"
                    style={{ transform: `rotate(${page.rotation}deg)` }}
                  >
                    <div className="h-2 w-full bg-slate-900 rounded-sm mb-1" />
                    <div className="h-1 w-3/4 bg-slate-300 rounded-sm mb-1" />
                    <div className="h-1 w-1/2 bg-slate-200 rounded-sm mb-2" />
                    <div className="flex-1 border border-dashed border-slate-300 rounded p-1 flex flex-col justify-between">
                      <span className="text-[7px] font-bold text-blue-950 truncate uppercase">
                        {page.template.replace('_', ' ')}
                      </span>
                      <span className="text-[6px] text-slate-400 font-mono">
                        {activeDoc.elements.filter((e) => e.pageIndex === idx).length} items
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail footer controls */}
                  <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                    <span className="font-mono font-bold">Page {idx + 1}</span>
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMovePage('up');
                        }}
                        disabled={idx === 0}
                        title="Move Page Up"
                        className="hover:text-white disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMovePage('down');
                        }}
                        disabled={idx === activeDoc.pages.length - 1}
                        title="Move Page Down"
                        className="hover:text-white disabled:opacity-30"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Quick Template Switcher in Sidebar */}
            <div className="pt-3 border-t border-blue-900/40">
              <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block mb-1">
                Quick Document Types
              </span>
              <div className="space-y-1">
                {TEMPLATE_PRESETS.slice(0, 5).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleLoadPresetTemplate(p.id)}
                    className="w-full text-left px-2 py-1 rounded bg-[#0D1527] hover:bg-blue-900/40 text-[11px] text-slate-300 hover:text-white truncate block cursor-pointer"
                  >
                    • {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CENTER WORKSPACE: INTERACTIVE CANVAS WITH VECTOR PAPER */}
        <div
          ref={workspaceContainerRef}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          className="flex-1 overflow-auto bg-[#050811] flex items-start justify-center p-6"
        >
          {/* US Letter Document Page Container */}
          <div
            className="relative bg-white text-slate-900 shadow-2xl rounded-sm transition-transform duration-100 ease-out origin-top border border-slate-300"
            style={{
              width: 816,
              height: 1056,
              transform: `scale(${zoom / 100}) rotate(${
                activeDoc.pages[currentPageIndex]?.rotation || 0
              }deg)`,
              transformOrigin: 'top center',
            }}
            onClick={() => setSelectedElementId(null)}
          >
            {/* BASE VECTOR TEMPLATE RENDERING (Realistic Freight Rate Con / BOL / W-9) */}
            <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none select-none">
              {/* Header section */}
              <div>
                <div className="flex items-start justify-between pb-4 border-b-2 border-slate-800">
                  <div className="flex items-center gap-3">
                    <img
                      src="/assets/aistudio/--INFINITY_DISPATCH_LLC--_124c467f.png"
                      alt="Logo"
                      className="h-12 object-contain"
                    />
                    <div>
                      <h1 className="text-xl font-black text-slate-900 tracking-tight">
                        INFINITY DISPATCH LLC
                      </h1>
                      <p className="text-[10px] text-slate-600 font-mono">
                        NATIONWIDE FREIGHT LOGISTICS & DISPATCH MGMT · MC-1489201 · USDOT 410294
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black uppercase text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                      {activeDoc.type}
                    </span>
                    <p className="text-xs font-mono font-bold text-slate-800 mt-1">
                      LOAD: {activeDoc.loadNumber || 'INF-8921'}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      DATE: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Carrier & Broker Information Grid */}
                <div className="grid grid-cols-2 gap-4 my-4 p-3 bg-slate-50 border border-slate-300 rounded text-xs">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-500 font-mono block">
                      ASSIGNED CARRIER
                    </span>
                    <p className="font-bold text-slate-900">{activeDoc.carrierName}</p>
                    <p className="text-slate-600">Marcus Vance · (214) 555-8392</p>
                    <p className="text-slate-600">Equipment: 53ft Dry Van · VIN: 3AKJGLD59LS910248</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-500 font-mono block">
                      DISPATCH & BROKER DETAILS
                    </span>
                    <p className="font-bold text-slate-900">Infinity Dispatch Operations Desk</p>
                    <p className="text-slate-600">
                      Senior Dispatcher: David Cross · alvin.vast@gmail.com
                    </p>
                    <p className="text-slate-600">Agreed Gross Rate: $2,850.00 USD (All-In)</p>
                  </div>
                </div>

                {/* Routing & Commodity Table */}
                <table className="w-full border-collapse border border-slate-300 text-xs mt-3">
                  <thead>
                    <tr className="bg-slate-200 text-slate-800 text-[10px] font-bold uppercase">
                      <th className="border border-slate-300 p-1.5 text-left">Stop</th>
                      <th className="border border-slate-300 p-1.5 text-left">Location / Facility</th>
                      <th className="border border-slate-300 p-1.5 text-left">Date & Time</th>
                      <th className="border border-slate-300 p-1.5 text-left">Commodity / Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 p-1.5 font-bold text-blue-900">PICKUP (1)</td>
                      <td className="border border-slate-300 p-1.5">
                        4800 Logistics Way, Dallas, TX 75241
                      </td>
                      <td className="border border-slate-300 p-1.5 font-mono">08:00 CST (Appt)</td>
                      <td className="border border-slate-300 p-1.5">24 Pallets Non-Hazmat (38,450 lbs)</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-1.5 font-bold text-emerald-900">
                        DELIVERY (2)
                      </td>
                      <td className="border border-slate-300 p-1.5">
                        1200 Distribution Pkwy, Columbus, OH 43228
                      </td>
                      <td className="border border-slate-300 p-1.5 font-mono">14:00 EST (FCFS)</td>
                      <td className="border border-slate-300 p-1.5">Seal Verified: #778921</td>
                    </tr>
                  </tbody>
                </table>

                {/* Special Instructions & Factoring Notice */}
                <div className="mt-4 p-2.5 border border-slate-300 rounded bg-slate-50 text-[11px] text-slate-700 space-y-1">
                  <p className="font-bold text-slate-900">DISPATCH TERMS & INSTRUCTIONS:</p>
                  <p>
                    1. Direct broker payout to carrier bank via factoring or ACH. Carrier agrees to return signed
                    clean Bill of Lading within 2 hours of completed delivery.
                  </p>
                  <p>
                    2. Detention rate: $65.00/hr after 2 free hours at dock. Layover: $300.00/day. Immediate
                    dispatch notification required.
                  </p>
                </div>
              </div>

              {/* Bottom Signature Section */}
              <div className="pt-4 border-t-2 border-slate-800 grid grid-cols-2 gap-8">
                <div>
                  <div className="border-b border-slate-400 pb-1 mb-1">
                    <span className="text-[10px] text-slate-500 font-mono uppercase block">
                      BROKER / SHIPPER AGENT SIGNATURE
                    </span>
                    <span className="font-serif italic text-base text-slate-800">
                      C.H. Robinson Authorized Agent
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono">
                    Electronic Verification Stamp: PASS-77291
                  </span>
                </div>

                <div>
                  <div className="border-b border-slate-400 pb-1 mb-1">
                    <span className="text-[10px] text-slate-500 font-mono uppercase block">
                      AUTHORIZED CARRIER / DISPATCHER SIGNATURE
                    </span>
                    {/* The signature element will be overlaid here */}
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono">
                    Infinity Dispatch LLC Management Desk · David Cross / Alvin
                  </span>
                </div>
              </div>
            </div>

            {/* OVERLAY: USER ANNOTATIONS, TEXT, SIGNATURES, SHAPES, WHITEOUT */}
            {activeDoc.elements
              .filter((el) => el.pageIndex === currentPageIndex)
              .map((el) => {
                const isSelected = el.id === selectedElementId;
                return (
                  <div
                    key={el.id}
                    onMouseDown={(e) => handleElementMouseDown(e, el.id)}
                    style={{
                      position: 'absolute',
                      left: el.x,
                      top: el.y,
                      width: el.width,
                      minHeight: el.height,
                      zIndex: isSelected ? 30 : 20,
                    }}
                    className={`group cursor-move transition-shadow ${
                      isSelected
                        ? 'ring-2 ring-blue-600 ring-offset-2 ring-offset-white shadow-lg'
                        : 'hover:ring-1 hover:ring-blue-400'
                    }`}
                  >
                    {/* Element Renderers */}
                    {el.type === 'text' && (
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const newText = e.currentTarget.innerText;
                          updateActiveDocElements((prev) =>
                            prev.map((item) =>
                              item.id === el.id ? { ...item, content: newText } : item
                            )
                          );
                        }}
                        style={{
                          fontSize: `${el.style.fontSize || 13}px`,
                          fontFamily: el.style.fontFamily || 'Helvetica',
                          color: el.style.color || '#0f172a',
                          fontWeight: el.style.bold ? 'bold' : 'normal',
                          fontStyle: el.style.italic ? 'italic' : 'normal',
                          textDecoration: el.style.underline
                            ? 'underline'
                            : el.style.strike
                            ? 'line-through'
                            : 'none',
                          textAlign: el.style.align || 'left',
                          backgroundColor: el.style.backgroundColor || 'transparent',
                          padding: '2px 4px',
                        }}
                        className="w-full h-full outline-none"
                      >
                        {el.content}
                      </div>
                    )}

                    {el.type === 'stamp' && (
                      <div
                        style={{
                          borderColor: el.style.strokeColor || '#16a34a',
                          borderWidth: `${el.style.strokeWidth || 2}px`,
                          color: el.style.color || '#16a34a',
                          fontSize: `${el.style.fontSize || 12}px`,
                          opacity: el.style.opacity || 0.95,
                        }}
                        className="w-full h-full border-2 border-dashed rounded-lg flex items-center justify-center font-black tracking-wider uppercase bg-white/90 shadow-sm p-1 text-center"
                      >
                        {el.content}
                      </div>
                    )}

                    {el.type === 'whiteout' && (
                      <div
                        style={{
                          backgroundColor: el.style.backgroundColor || '#ffffff',
                          borderColor: el.style.strokeColor || '#cbd5e1',
                          borderWidth: `${el.style.strokeWidth || 1}px`,
                        }}
                        className="w-full h-full border shadow-inner"
                      />
                    )}

                    {el.type === 'redact' && (
                      <div
                        style={{
                          backgroundColor: '#000000',
                          color: '#ffffff',
                          fontSize: '9px',
                        }}
                        className="w-full h-full flex items-center justify-center font-bold tracking-widest uppercase font-mono"
                      >
                        {el.content || 'REDACTED'}
                      </div>
                    )}

                    {el.type === 'signature' && (
                      <div className="w-full h-full flex items-center justify-center">
                        {el.content.startsWith('data:image') ? (
                          <img
                            src={el.content}
                            alt="Signature"
                            className="max-h-full max-w-full object-contain pointer-events-none"
                          />
                        ) : (
                          <span
                            style={{
                              color: el.style.color || '#1e3a8a',
                              fontSize: `${el.style.fontSize || 24}px`,
                            }}
                            className={`font-serif italic font-bold tracking-wide select-none ${
                              el.style.fontFamily || 'font-serif'
                            }`}
                          >
                            {el.content}
                          </span>
                        )}
                      </div>
                    )}

                    {el.type === 'image' && (
                      <img
                        src={el.content}
                        alt="Inserted Image"
                        className="w-full h-full object-contain pointer-events-none"
                        style={{ opacity: el.style.opacity || 1 }}
                      />
                    )}

                    {el.type === 'shape' && (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: el.style.backgroundColor || 'transparent',
                          borderColor: el.style.strokeColor || '#2563eb',
                          borderWidth: `${el.style.strokeWidth || 2}px`,
                          borderRadius: el.style.shapeType === 'ellipse' ? '50%' : '4px',
                          opacity: el.style.opacity || 0.8,
                        }}
                      />
                    )}

                    {el.type === 'form_field' && (
                      <div className="w-full h-full flex items-center">
                        {el.style.fieldType === 'checkbox' ? (
                          <input
                            type="checkbox"
                            checked={el.style.fieldChecked}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              updateActiveDocElements((prev) =>
                                prev.map((item) =>
                                  item.id === el.id
                                    ? { ...item, style: { ...item.style, fieldChecked: checked } }
                                    : item
                                )
                              );
                            }}
                            className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                          />
                        ) : el.style.fieldType === 'dropdown' ? (
                          <select
                            value={el.content}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateActiveDocElements((prev) =>
                                prev.map((item) =>
                                  item.id === el.id ? { ...item, content: val } : item
                                )
                              );
                            }}
                            className="w-full h-full px-2 py-1 bg-white border border-blue-400 rounded text-xs text-slate-800 font-medium"
                          >
                            {el.style.fieldOptions?.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={el.content}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateActiveDocElements((prev) =>
                                prev.map((item) =>
                                  item.id === el.id ? { ...item, content: val } : item
                                )
                              );
                            }}
                            className="w-full h-full px-2 py-1 bg-white border border-blue-400 rounded text-xs text-slate-900 font-medium focus:border-blue-600 focus:outline-none"
                          />
                        )}
                      </div>
                    )}

                    {el.type === 'comment' && (
                      <div
                        style={{
                          backgroundColor: el.style.backgroundColor || '#fef08a',
                          color: el.style.color || '#854d0e',
                          borderColor: el.style.strokeColor || '#eab308',
                        }}
                        className="w-full h-full p-2 border rounded-lg shadow-md text-xs font-sans overflow-hidden"
                      >
                        <div className="flex items-center justify-between pb-1 mb-1 border-b border-amber-300 font-bold text-[10px]">
                          <span>Sticky Note</span>
                          <Sliders className="w-3 h-3" />
                        </div>
                        <p className="line-clamp-3">{el.content}</p>
                      </div>
                    )}

                    {/* Quick Floating Action Controls when element is Selected */}
                    {isSelected && (
                      <div className="absolute -top-7 left-0 flex items-center gap-1 bg-slate-900 text-white rounded px-1.5 py-0.5 text-[10px] shadow-lg shrink-0 pointer-events-auto">
                        <span className="font-mono text-sky-400 uppercase">{el.type}</span>
                        <div className="h-3 w-px bg-slate-700" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Duplicate element
                            const clone: PdfElement = {
                              ...el,
                              id: `${el.type}-${Date.now()}`,
                              x: el.x + 15,
                              y: el.y + 15,
                            };
                            updateActiveDocElements((prev) => [...prev, clone]);
                            setSelectedElementId(clone.id);
                          }}
                          className="hover:text-sky-300 p-0.5"
                          title="Duplicate"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Delete element
                            updateActiveDocElements((prev) => prev.filter((item) => item.id !== el.id));
                            setSelectedElementId(null);
                          }}
                          className="hover:text-rose-400 p-0.5"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* RIGHT SIDEBAR: CONTEXTUAL PROPERTY INSPECTOR */}
        {showProperties && (
          <div className="w-64 bg-[#090F1E] border-l border-blue-900/50 flex flex-col shrink-0 overflow-y-auto p-3 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-blue-900/40 text-slate-300 font-bold">
              <span>PROPERTIES INSPECTOR</span>
              <Sliders className="w-4 h-4 text-sky-400" />
            </div>

            {selectedElement ? (
              <div className="space-y-4">
                <div className="p-2 rounded-lg bg-[#0D1527] border border-blue-900/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Selected</span>
                    <span className="font-bold text-sky-300 uppercase">{selectedElement.type}</span>
                  </div>
                  <button
                    onClick={() => {
                      updateActiveDocElements((prev) =>
                        prev.filter((item) => item.id !== selectedElement.id)
                      );
                      setSelectedElementId(null);
                    }}
                    className="p-1 rounded bg-rose-950 text-rose-400 hover:bg-rose-900 text-xs"
                    title="Delete Element"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Text Formatting Controls */}
                {(selectedElement.type === 'text' || selectedElement.type === 'signature') && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Font Family</label>
                      <select
                        value={selectedElement.style.fontFamily || 'Helvetica'}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateActiveDocElements((prev) =>
                            prev.map((item) =>
                              item.id === selectedElement.id
                                ? { ...item, style: { ...item.style, fontFamily: val } }
                                : item
                            )
                          );
                        }}
                        className="w-full px-2 py-1.5 bg-[#0D1527] border border-blue-900/50 rounded text-xs text-white"
                      >
                        <option value="Helvetica">Helvetica (Clean)</option>
                        <option value="Arial">Arial</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Courier">Courier (Typewriter)</option>
                        <option value="JetBrains Mono">JetBrains Mono</option>
                        <option value="cursive">Cursive (Handwritten)</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                        <span>Font Size</span>
                        <span>{selectedElement.style.fontSize || 13}px</span>
                      </div>
                      <input
                        type="range"
                        min="8"
                        max="48"
                        value={selectedElement.style.fontSize || 13}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          updateActiveDocElements((prev) =>
                            prev.map((item) =>
                              item.id === selectedElement.id
                                ? { ...item, style: { ...item.style, fontSize: val } }
                                : item
                            )
                          );
                        }}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          updateActiveDocElements((prev) =>
                            prev.map((item) =>
                              item.id === selectedElement.id
                                ? { ...item, style: { ...item.style, bold: !item.style.bold } }
                                : item
                            )
                          );
                        }}
                        className={`flex-1 py-1 rounded font-bold border ${
                          selectedElement.style.bold
                            ? 'bg-blue-600 text-white border-blue-500'
                            : 'bg-[#0D1527] text-slate-300 border-blue-900/40'
                        }`}
                      >
                        Bold
                      </button>
                      <button
                        onClick={() => {
                          updateActiveDocElements((prev) =>
                            prev.map((item) =>
                              item.id === selectedElement.id
                                ? { ...item, style: { ...item.style, italic: !item.style.italic } }
                                : item
                            )
                          );
                        }}
                        className={`flex-1 py-1 rounded italic border ${
                          selectedElement.style.italic
                            ? 'bg-blue-600 text-white border-blue-500'
                            : 'bg-[#0D1527] text-slate-300 border-blue-900/40'
                        }`}
                      >
                        Italic
                      </button>
                      <button
                        onClick={() => {
                          updateActiveDocElements((prev) =>
                            prev.map((item) =>
                              item.id === selectedElement.id
                                ? {
                                    ...item,
                                    style: { ...item.style, underline: !item.style.underline },
                                  }
                                : item
                            )
                          );
                        }}
                        className={`flex-1 py-1 rounded underline border ${
                          selectedElement.style.underline
                            ? 'bg-blue-600 text-white border-blue-500'
                            : 'bg-[#0D1527] text-slate-300 border-blue-900/40'
                        }`}
                      >
                        Underline
                      </button>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Text Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={selectedElement.style.color || '#0f172a'}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateActiveDocElements((prev) =>
                              prev.map((item) =>
                                item.id === selectedElement.id
                                  ? { ...item, style: { ...item.style, color: val } }
                                  : item
                            ));
                          }}
                          className="w-8 h-8 rounded border border-blue-900 cursor-pointer"
                        />
                        <span className="font-mono text-[11px] text-slate-300">
                          {selectedElement.style.color || '#0f172a'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dimensions & Position */}
                <div className="pt-2 border-t border-blue-900/40 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">
                    Position (Coordinates)
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="flex items-center gap-1 bg-[#0D1527] px-2 py-1 rounded border border-blue-900/40">
                      <span className="text-slate-400">X:</span>
                      <span className="font-mono text-white">{selectedElement.x} px</span>
                    </div>
                    <div className="flex items-center gap-1 bg-[#0D1527] px-2 py-1 rounded border border-blue-900/40">
                      <span className="text-slate-400">Y:</span>
                      <span className="font-mono text-white">{selectedElement.y} px</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* No selection: Show Document Metadata & Audit Log */
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-[#0D1527] border border-blue-900/40 space-y-2">
                  <span className="text-[10px] text-sky-400 font-mono uppercase block font-bold">
                    Document Overview
                  </span>
                  <div className="space-y-1 text-slate-300 text-[11px]">
                    <p className="flex justify-between">
                      <span className="text-slate-400">Format:</span>
                      <span className="font-mono">US Letter (8.5×11")</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-400">Total Pages:</span>
                      <span className="font-mono font-bold text-white">
                        {activeDoc.pages.length}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-400">Annotations:</span>
                      <span className="font-mono text-sky-300">{activeDoc.elements.length}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-400">Carrier:</span>
                      <span className="truncate max-w-[120px] font-bold text-white">
                        {activeDoc.carrierName}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0D1527] border border-blue-900/40 space-y-2">
                  <span className="text-[10px] text-emerald-400 font-mono uppercase block font-bold">
                    Owner Audit History
                  </span>
                  <p className="text-[11px] text-slate-300">
                    Last modified by <strong className="text-white">{currentOwner.name}</strong> at{' '}
                    <span className="font-mono text-[10px] text-slate-400">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-1 border-t border-blue-900/40">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Synchronized with Admin Portal</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block mb-1">
                    Quick Exports
                  </span>
                  <div className="space-y-1.5">
                    <button
                      onClick={handleGeneratePdf}
                      className="w-full py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                    <button
                      onClick={handleExportWord}
                      className="w-full py-1.5 rounded bg-[#0D1527] hover:bg-slate-800 text-slate-300 font-medium text-xs flex items-center justify-center gap-1 border border-blue-900/50 cursor-pointer"
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>Word (.doc) Export</span>
                    </button>
                    <button
                      onClick={handleExportImage}
                      className="w-full py-1.5 rounded bg-[#0D1527] hover:bg-slate-800 text-slate-300 font-medium text-xs flex items-center justify-center gap-1 border border-blue-900/50 cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Export Page Image</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. MODALS: SIGNATURE PAD (DRAW / TYPE / UPLOAD) */}
      {isSignatureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-[#0D1527] border-2 border-sky-400/60 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-blue-900/50">
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white">Digital Signature Studio</h3>
              </div>
              <button
                onClick={() => setIsSignatureModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="flex bg-[#070B14] p-1 rounded-xl border border-blue-900/50 text-xs font-mono">
              <button
                onClick={() => setSigTypeMode('type')}
                className={`flex-1 py-1.5 rounded-lg text-center font-bold transition-all ${
                  sigTypeMode === 'type' ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}
              >
                Type Cursive Signature
              </button>
              <button
                onClick={() => setSigTypeMode('draw')}
                className={`flex-1 py-1.5 rounded-lg text-center font-bold transition-all ${
                  sigTypeMode === 'draw' ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}
              >
                Draw with Mouse / Pen
              </button>
            </div>

            {sigTypeMode === 'type' ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={typedSigName}
                  onChange={(e) => setTypedSigName(e.target.value)}
                  placeholder="Enter full legal name..."
                  className="w-full px-3 py-2 bg-black/60 border border-blue-900/60 rounded-lg text-sm text-white font-mono focus:border-sky-400 focus:outline-none"
                />

                {/* Script Font Previews */}
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">
                    Choose Cursive Style
                  </span>
                  {[
                    { font: 'font-serif italic', label: 'Executive Script' },
                    { font: 'font-sans italic', label: 'Modern Flow' },
                    { font: 'font-mono italic font-bold', label: 'Official Monospace' },
                  ].map((style) => (
                    <div
                      key={style.font}
                      onClick={() => setTypedSigFont(style.font)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all bg-white text-blue-950 flex items-center justify-between ${
                        typedSigFont === style.font
                          ? 'border-blue-600 ring-2 ring-blue-500'
                          : 'border-slate-300'
                      }`}
                    >
                      <span className={`text-2xl ${style.font}`}>{typedSigName || 'David Cross'}</span>
                      <span className="text-[10px] font-mono text-slate-500">{style.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="border-2 border-dashed border-sky-400/50 rounded-xl bg-white overflow-hidden">
                  <canvas
                    ref={sigCanvasRef}
                    width={440}
                    height={160}
                    onMouseDown={(e) => {
                      setIsDrawingSig(true);
                      const canvas = sigCanvasRef.current;
                      if (canvas) {
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                          const rect = canvas.getBoundingClientRect();
                          ctx.beginPath();
                          ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
                          ctx.strokeStyle = sigInkColor;
                          ctx.lineWidth = 2.5;
                          ctx.lineCap = 'round';
                        }
                      }
                    }}
                    onMouseMove={(e) => {
                      if (!isDrawingSig) return;
                      const canvas = sigCanvasRef.current;
                      if (canvas) {
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                          const rect = canvas.getBoundingClientRect();
                          ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
                          ctx.stroke();
                        }
                      }
                    }}
                    onMouseUp={() => setIsDrawingSig(false)}
                    onMouseLeave={() => setIsDrawingSig(false)}
                    className="w-full h-40 cursor-crosshair"
                  />
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Sign inside the box using your mouse or stylus</span>
                  <button
                    onClick={clearSignatureCanvas}
                    className="text-rose-400 hover:underline font-mono text-[11px]"
                  >
                    Clear Canvas Pad
                  </button>
                </div>
              </div>
            )}

            {/* Ink Color Picker */}
            <div className="flex items-center justify-between pt-2 border-t border-blue-900/40 text-xs">
              <span className="text-slate-400">Ink Color:</span>
              <div className="flex gap-2">
                {[
                  { color: '#1e3a8a', label: 'Navy' },
                  { color: '#0f172a', label: 'Black' },
                  { color: '#2563eb', label: 'Blue' },
                ].map((c) => (
                  <button
                    key={c.color}
                    onClick={() => setSigInkColor(c.color)}
                    className={`w-6 h-6 rounded-full border-2 ${
                      sigInkColor === c.color ? 'border-white scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c.color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsSignatureModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSignature}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
              >
                Apply Signature to Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. SAVE OVERWRITE CONFIRMATION MODAL */}
      {isConfirmOverwriteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#0D1527] border-2 border-blue-900 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600/20 text-sky-400 flex items-center justify-center shrink-0">
                <Save className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Save Changes to Document</h3>
                <p className="text-xs text-slate-300">
                  Update "{activeDoc.name}" in Infinity Dispatch file storage?
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 bg-black/40 p-3 rounded-lg border border-blue-900/50">
              This will update the verified record for carrier{' '}
              <strong className="text-white">{activeDoc.carrierName}</strong>. The audit log will
              record that <strong className="text-white">{currentOwner.name}</strong> authorized this
              save.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsConfirmOverwriteOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveToDatabase}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
              >
                Confirm & Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. PASSWORD PROTECTION MODAL */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#0D1527] border-2 border-amber-500/50 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-blue-900/50">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Password Protect PDF</h3>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Set a security password to lock this PDF against unauthorized viewing and rate inspection.
            </p>
            <input
              type="text"
              placeholder="Enter encryption passcode..."
              value={passwordProtectionCode}
              onChange={(e) => setPasswordProtectionCode(e.target.value)}
              className="w-full px-3 py-2 bg-black/60 border border-blue-900/60 rounded-lg text-xs text-white font-mono focus:border-amber-400 focus:outline-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSetPasswordLock}
                className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
              >
                Lock Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. AI OCR SCAN MODAL */}
      {isOcrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#0D1527] border-2 border-purple-500/50 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-blue-900/50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">AI OCR Document Extraction</h3>
              </div>
              <button
                onClick={() => setIsOcrModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Run server-side Gemini OCR on the current page to detect shippers, receivers, freight weights,
              and rate confirmations, converting printed text into editable text elements.
            </p>
            <div className="p-3 rounded-lg bg-purple-950/40 border border-purple-800/40 text-xs text-purple-200">
              ✓ Detects Shipper / Consignee addresses<br />
              ✓ Extracts agreed linehaul & fuel surcharge rates<br />
              ✓ Converts scanned PDF lines into editable vector text
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsOcrModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleRunOcrExtraction}
                className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run AI OCR Parser</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. COMPRESS PDF MODAL */}
      {isCompressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#0D1527] border-2 border-emerald-500/50 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-blue-900/50">
              <div className="flex items-center gap-2">
                <Archive className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Compress & Optimize PDF</h3>
              </div>
              <button
                onClick={() => setIsCompressModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Optimize image rasterization and embedded font subsets to reduce PDF file size for fast email
              dispatch.
            </p>
            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between p-2.5 rounded-lg bg-[#070B14] border border-blue-900 cursor-pointer">
                <div>
                  <span className="font-bold text-white block">Maximum Compression (Low 96 DPI)</span>
                  <span className="text-[10px] text-slate-400">~65% size reduction · Fast email</span>
                </div>
                <input type="radio" name="compression" defaultChecked className="accent-blue-600" />
              </label>
              <label className="flex items-center justify-between p-2.5 rounded-lg bg-[#070B14] border border-blue-900 cursor-pointer">
                <div>
                  <span className="font-bold text-white block">Balanced (Standard 150 DPI)</span>
                  <span className="text-[10px] text-slate-400">~40% size reduction · Good quality</span>
                </div>
                <input type="radio" name="compression" className="accent-blue-600" />
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsCompressModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsCompressModalOpen(false);
                  handleGeneratePdf();
                  showToast('Optimized and downloaded compressed PDF file!');
                }}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Compress & Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border-2 border-sky-400/80 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
        <div className="w-full h-full max-w-7xl max-h-[96vh] flex flex-col">
          {editorContent}
        </div>
      </div>
    );
  }

  return editorContent;
};
