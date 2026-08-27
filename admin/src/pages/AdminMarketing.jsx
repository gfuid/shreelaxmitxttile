import React, { useState, useEffect, useRef } from 'react';
import { marketingApi, inboxApi } from '../services/api';
import {
  MessageSquare,
  Mail,
  Send,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Zap,
  TrendingUp,
  Tag,
  Key,
  Layers,
  Phone,
  FileText,
  Copy,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Check,
  AlertTriangle,
  Play,
  Edit3,
  Plus,
  Trash2,
  RotateCcw,
  Smartphone,
  CheckCheck,
  ArrowRight,
  Sliders,
  Eye,
  ChevronDown,
  Search,
  Filter,
  User,
  ShoppingBag,
  MoreVertical,
  Paperclip,
  Smile,
  Info,
  DollarSign,
  Star,
  Activity,
  SendHorizonal,
  Workflow,
  Radio,
  SlidersHorizontal,
  HelpCircle,
  Users
} from 'lucide-react';

const AdminMarketing = () => {
  // Navigation Hierarchy matching WABA CRM architecture
  // Main Category: 'waba', 'workflows', 'bulk', 'email'
  const [mainNav, setMainNav] = useState('email'); // Default to email as user requested
  // Sub Category under WABA: 'dashboard', 'inbox', 'single-send', 'templates'
  const [wabaSubNav, setWabaSubNav] = useState('dashboard');
  // Sub Category under Email: 'templates', 'settings'
  const [emailSubNav, setEmailSubNav] = useState('templates');
  const [wabaDropdownOpen, setWabaDropdownOpen] = useState(false);
  const [emailDropdownOpen, setEmailDropdownOpen] = useState(false);

  // Email Template Editor State
  const [emailEditorModalOpen, setEmailEditorModalOpen] = useState(false);
  const [editingEmailTemplate, setEditingEmailTemplate] = useState({
    stage: 'Placed',
    title: 'Order Confirmed & GST Tax Invoice',
    emailSubject: '🌸 Order Confirmation #{order_number} | Sri Vijaylaxmi Sarees',
    emailHeading: 'Order Accepted & Confirmed',
    emailSubtext: 'Thank you for choosing Sri Vijaylaxmi Sarees. We have received your handloom saree order and our master weavers are preparing it with utmost care.',
    attachInvoice: true,
    accentColor: '#700B1A',
    includeSilkCare: true,
  });

  // Core Data State
  const [analytics, setAnalytics] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [settings, setSettings] = useState({
    wabaPhoneNumberId: '1252418734612866',
    wabaSenderPhone: '+91 82183 22073',
    wabaAccessToken: '',
    resendApiKey: '',
    resendFromEmail: 'Sri Vijaylaxmi Sarees <orders@resend.dev>',
    resendReplyTo: 'care@srivijaylaxmisarees.com',
  });
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState('');

  // -----------------------------------------------------------------
  // LIVE INBOX (2-Way WhatsApp Chat) State
  // -----------------------------------------------------------------
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [chatInputText, setChatInputText] = useState('');
  const [sendingChat, setSendingChat] = useState(false);
  const [inboxFilter, setInboxFilter] = useState('all'); // all, active, resolved
  const [inboxSearch, setInboxSearch] = useState('');
  const [quickTemplateModal, setQuickTemplateModal] = useState(false);
  const chatBottomRef = useRef(null);

  // -----------------------------------------------------------------
  // SINGLE SEND State
  // -----------------------------------------------------------------
  const [singleSendForm, setSingleSendForm] = useState({
    phone: '',
    name: '',
    text: '',
    templateName: 'svl_order_placed',
    useTemplate: true,
  });
  const [singleSendLoading, setSingleSendLoading] = useState(false);
  const [singleSendResult, setSingleSendResult] = useState(null);

  // -----------------------------------------------------------------
  // TEMPLATES STUDIO State
  // -----------------------------------------------------------------
  const [editorModalOpen, setEditorModalOpen] = useState(false);
  const [previewTab, setPreviewTab] = useState('whatsapp');
  const [editingTemplate, setEditingTemplate] = useState({
    stage: 'Placed',
    title: 'Order Confirmed & Received',
    whatsappTemplateName: 'svl_order_placed',
    whatsappLanguage: 'hi',
    whatsappBody: '🌸 नमस्ते {customer_name}, Sri Vijaylaxmi Sarees से आपकी खरीदारी के लिए धन्यवाद! आपका ऑर्डर #{order_number} स्वीकार कर लिया गया है। कुल बिल राशि: ₹{total_amount} ({payment_method})। आपका GST टैक्स इनवॉइस बिल तैयार है।',
    whatsappButtonText: 'Track Saree Order',
    whatsappButtonUrl: 'https://srivijaylaxmisarees.com/track/{order_number}',
    emailSubject: '🌸 Order Confirmation #{order_number} | Sri Vijaylaxmi Sarees',
    emailHeading: 'Order Accepted & Confirmed',
    emailSubtext: 'Thank you for choosing Sri Vijaylaxmi Sarees. We have received your handloom saree order and our artisans are preparing it with care.',
    attachInvoice: true,
    isActive: true,
    category: 'UTILITY',
  });
  const [savingTemplate, setSavingTemplate] = useState(false);

  // -----------------------------------------------------------------
  // 1-CLICK TEST PING State
  // -----------------------------------------------------------------
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testPhone, setTestPhone] = useState('8218322073');
  const [testEmail, setTestEmail] = useState('');
  const [testStage, setTestStage] = useState('Placed');
  const [testChannel, setTestChannel] = useState('BOTH');
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // -----------------------------------------------------------------
  // BROADCAST CAMPAIGN State (WITH TEMPLATE SELECTOR)
  // -----------------------------------------------------------------
  const [broadcastForm, setBroadcastForm] = useState({
    title: 'Wedding Season Handloom Silk Special Offer',
    channel: 'BOTH',
    useTemplate: true,
    selectedTemplateName: 'svl_order_placed',
    targetAudience: 'ALL_CUSTOMERS', // ALL_CUSTOMERS, VIP_CUSTOMERS, INACTIVE_CUSTOMERS
    couponCode: 'FESTIVE15',
    message: '🌸 नमस्ते {customer_name}, Sri Vijaylaxmi Sarees से आपके लिए खास त्योहार ऑफर! सभी प्योर कांचीपुरम और धर्मावरम सिल्क साड़ियों पर 15% की विशेष छूट।\n\n🏷️ कूपन कोड: {coupon_code}\n🔗 अभी खरीदें: https://srivijaylaxmisarees.com/shop',
    emailSubject: '🌸 Festive Silk Collection: Enjoy 15% OFF | Sri Vijaylaxmi Sarees',
    emailHeading: 'Exclusive Handloom Privilege Offer',
  });
  const [broadcastLoading, setBroadcastLoading] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState(null);

  // -----------------------------------------------------------------
  // WORKFLOWS AUTOMATION State
  // -----------------------------------------------------------------
  const [workflows, setWorkflows] = useState([
    {
      id: 1,
      name: 'Order Placed (Utility Trigger)',
      description: "When an order is created, dispatch 'svl_order_placed' + official GST Tax Invoice PDF.",
      allowReEntry: true,
      totalContacts: 148,
      completed: 148,
      status: 'Active',
    },
    {
      id: 2,
      name: 'Order Confirmed (Weaving Queue)',
      description: "When store accepts order, notify customer saree is undergoing quality inspection.",
      allowReEntry: false,
      totalContacts: 96,
      completed: 96,
      status: 'Active',
    },
    {
      id: 3,
      name: 'Order Shipped & AWB Courier (Live Tracking)',
      description: "When courier partner & AWB are generated, send live BlueDart tracking link.",
      allowReEntry: false,
      totalContacts: 84,
      completed: 84,
      status: 'Active',
    },
    {
      id: 4,
      name: 'Order Delivered & Silk Care Guide',
      description: "When order is delivered, dispatch Silk Mark authenticity certificate & review link.",
      allowReEntry: false,
      totalContacts: 79,
      completed: 79,
      status: 'Active',
    },
    {
      id: 5,
      name: 'Website High-Value Cart Abandoned',
      description: "Trigger follow-up WhatsApp message with 10% coupon code if cart unpurchased for 2 hrs.",
      allowReEntry: true,
      totalContacts: 31,
      completed: 28,
      status: 'Active',
    },
  ]);

  // Load All CRM & WABA Data
  const fetchAllData = async () => {
    setRefreshing(true);
    try {
      const [analyticsRes, templatesRes, settingsRes, campaignsRes, convosRes] = await Promise.all([
        marketingApi.getAnalytics(),
        marketingApi.getTemplates(),
        marketingApi.getSettings(),
        marketingApi.getCampaigns(),
        inboxApi.getConversations({ status: inboxFilter, search: inboxSearch }),
      ]);

      if (analyticsRes?.data) setAnalytics(analyticsRes.data);
      if (templatesRes?.data) {
        setTemplates(templatesRes.data);
        if (templatesRes.data.length > 0 && !broadcastForm.selectedTemplateName) {
          setBroadcastForm((prev) => ({
            ...prev,
            selectedTemplateName: templatesRes.data[0].whatsappTemplateName,
          }));
        }
      }
      if (settingsRes?.data) {
        setSettings((prev) => ({
          ...prev,
          wabaPhoneNumberId: settingsRes.data.wabaPhoneNumberId || '1252418734612866',
          wabaSenderPhone: settingsRes.data.wabaSenderPhone || '+91 82183 22073',
          resendFromEmail: settingsRes.data.resendFromEmail || 'Sri Vijaylaxmi Sarees <orders@resend.dev>',
          resendReplyTo: settingsRes.data.resendReplyTo || 'care@srivijaylaxmisarees.com',
          wabaAccessTokenMasked: settingsRes.data.wabaAccessTokenMasked || '',
          resendApiKeyMasked: settingsRes.data.resendApiKeyMasked || '',
        }));
      }
      if (campaignsRes?.data) setCampaigns(campaignsRes.data);
      if (convosRes?.data) {
        setConversations(convosRes.data);
        if (!selectedConversation && convosRes.data.length > 0) {
          selectConversation(convosRes.data[0]);
        }
      }
    } catch (e) {
      console.error('Error fetching CRM data:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [inboxFilter]);

  // Auto-scroll chat to bottom when messages update
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const selectConversation = async (convo) => {
    setSelectedConversation(convo);
    try {
      const res = await inboxApi.getMessages(convo._id);
      if (res?.data) {
        setChatMessages(res.data.messages || []);
        setCustomerOrders(res.data.customerOrders || []);
      }
    } catch (err) {
      console.error('Error loading chat messages:', err);
    }
  };

  const handleSendChatMessage = async (e) => {
    e?.preventDefault();
    if (!chatInputText.trim() || !selectedConversation) return;

    const messageText = chatInputText.trim();
    setChatInputText('');
    setSendingChat(true);

    // Optimistic UI append
    const tempMsg = {
      _id: `temp_${Date.now()}`,
      conversationId: selectedConversation._id,
      sender: 'agent',
      senderName: 'Sri Vijaylaxmi Admin',
      text: messageText,
      status: 'sent',
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, tempMsg]);

    try {
      const res = await inboxApi.sendMessage(selectedConversation._id, {
        text: messageText,
      });

      if (res?.data) {
        const convosRes = await inboxApi.getConversations();
        if (convosRes?.data) setConversations(convosRes.data);
      }
    } catch (err) {
      console.error('Failed to send live chat message:', err);
    } finally {
      setSendingChat(false);
    }
  };

  const handleSendQuickTemplate = async (tpl) => {
    if (!selectedConversation) return;
    const interpolatedText = tpl.whatsappBody
      .replace(/{customer_name}/g, selectedConversation.customerName || 'Shopper')
      .replace(/{{1}}/g, selectedConversation.customerName || 'Shopper')
      .replace(/{order_number}/g, 'SVL-2026-99201')
      .replace(/{{2}}/g, 'SVL-2026-99201')
      .replace(/{total_amount}/g, '14,500')
      .replace(/{{3}}/g, '14,500')
      .replace(/{courier_name}/g, 'BlueDart Express')
      .replace(/{tracking_awb}/g, 'BD-9948201');

    setQuickTemplateModal(false);
    setSendingChat(true);

    try {
      await inboxApi.sendMessage(selectedConversation._id, {
        text: interpolatedText,
        templateName: tpl.whatsappTemplateName,
      });
      const res = await inboxApi.getMessages(selectedConversation._id);
      if (res?.data) setChatMessages(res.data.messages || []);
    } catch (err) {
      alert('Error sending template: ' + err.message);
    } finally {
      setSendingChat(false);
    }
  };

  const handleSingleSendSubmit = async (e) => {
    e.preventDefault();
    setSingleSendLoading(true);
    setSingleSendResult(null);
    try {
      const res = await inboxApi.singleSend({
        phone: singleSendForm.phone,
        name: singleSendForm.name,
        text: singleSendForm.useTemplate ? undefined : singleSendForm.text,
        templateName: singleSendForm.useTemplate ? singleSendForm.templateName : undefined,
      });
      setSingleSendResult(res);
      fetchAllData();
    } catch (err) {
      setSingleSendResult({ success: false, message: err.message });
    } finally {
      setSingleSendLoading(false);
    }
  };

  const handleOpenEditor = (tpl = null) => {
    if (tpl) {
      setEditingTemplate({
        ...tpl,
        category: tpl.category || 'UTILITY',
        whatsappButtonText: tpl.whatsappButtonText || 'Track Order Live',
        whatsappButtonUrl: tpl.whatsappButtonUrl || 'https://srivijaylaxmisarees.com/track/{order_number}',
      });
    } else {
      setEditingTemplate({
        stage: 'Custom_Promo',
        title: 'New Custom Event Notification',
        whatsappTemplateName: `svl_custom_${Date.now().toString().slice(-4)}`,
        whatsappLanguage: 'hi',
        whatsappBody: '🌸 नमस्ते {customer_name}, Sri Vijaylaxmi Sarees से आपके लिए विशेष सूचना। ऑर्डर #{order_number}।',
        whatsappButtonText: 'View Details',
        whatsappButtonUrl: 'https://srivijaylaxmisarees.com/track/{order_number}',
        emailSubject: '🌸 Important Update on Order #{order_number} | Sri Vijaylaxmi Sarees',
        emailHeading: 'Custom Notification',
        emailSubtext: 'We are pleased to share an update regarding your handloom saree purchase.',
        attachInvoice: false,
        isActive: true,
        category: 'UTILITY',
      });
    }
    setEditorModalOpen(true);
  };

  const handleSaveTemplateSubmit = async (e) => {
    e.preventDefault();
    setSavingTemplate(true);
    try {
      const res = await marketingApi.saveTemplate(editingTemplate);
      if (res?.success) {
        setSavedSuccess(`Template "${editingTemplate.title || editingTemplate.stage}" saved!`);
        setTimeout(() => setSavedSuccess(''), 3000);
        setEditorModalOpen(false);
        fetchAllData();
      }
    } catch (err) {
      alert(err.message || 'Failed to save template');
    } finally {
      setSavingTemplate(false);
    }
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    const audienceLabel = broadcastForm.targetAudience === 'ALL_CUSTOMERS'
      ? 'All Registered Customers'
      : broadcastForm.targetAudience === 'VIP_CUSTOMERS'
      ? 'VIP Pure Silk Buyers'
      : 'Inactive Shoppers';

    if (!window.confirm(`Are you sure you want to broadcast "${broadcastForm.title}" to ${audienceLabel}?`)) {
      return;
    }

    setBroadcastLoading(true);
    setBroadcastResult(null);

    try {
      // Find template text if template mode is selected
      let finalMessage = broadcastForm.message;
      if (broadcastForm.useTemplate) {
        const selectedTpl = templates.find((t) => t.whatsappTemplateName === broadcastForm.selectedTemplateName);
        if (selectedTpl) {
          finalMessage = selectedTpl.whatsappBody;
        }
      }

      const res = await marketingApi.sendBroadcast({
        title: broadcastForm.title,
        channel: broadcastForm.channel,
        targetAudience: broadcastForm.targetAudience,
        couponCode: broadcastForm.couponCode,
        whatsappMessage: finalMessage,
        emailMessage: {
          subject: broadcastForm.emailSubject,
          heading: broadcastForm.emailHeading,
          body: finalMessage,
        },
      });

      if (res?.success) {
        setBroadcastResult({
          success: true,
          message: res.message || 'Broadcast campaign dispatched successfully to customers!',
        });
        fetchAllData();
      }
    } catch (err) {
      setBroadcastResult({
        success: false,
        message: err.message || 'Failed to dispatch broadcast',
      });
    } finally {
      setBroadcastLoading(false);
    }
  };

  const getInterpolatedPreview = (rawText) => {
    if (!rawText) return '';
    return rawText
      .replace(/{customer_name}/g, 'Priya Sharma')
      .replace(/{{1}}/g, 'Priya Sharma')
      .replace(/{order_number}/g, 'SVL-2026-99201')
      .replace(/{{2}}/g, 'SVL-2026-99201')
      .replace(/{total_amount}/g, '14,500')
      .replace(/{{3}}/g, '14,500')
      .replace(/{payment_method}/g, 'UPI (Paid)')
      .replace(/{{4}}/g, 'UPI (Paid)')
      .replace(/{courier_name}/g, 'BlueDart Express')
      .replace(/{tracking_awb}/g, 'BD-9948201')
      .replace(/{coupon_code}/g, broadcastForm.couponCode || 'FESTIVE15')
      .replace(/{tracking_url}/g, 'https://srivijaylaxmisarees.com/track/SVL-2026-99201');
  };

  // Find currently selected template in broadcast form
  const currentBroadcastTemplate = templates.find(
    (t) => t.whatsappTemplateName === broadcastForm.selectedTemplateName
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-white rounded-2xl animate-pulse"></div>
        <div className="h-96 bg-white rounded-3xl animate-pulse"></div>
      </div>
    );
  }

  const waba = analytics?.waba || {
    phone: '+91 82183 22073',
    phoneId: '1252418734612866',
    status: 'CONNECTED',
    health: 'AVAILABLE',
    tier: '2K',
    dailyLimit: 2000,
    sentToday: 8,
    remainingQuota: 1992,
    mode: 'LIVE',
    nameStatus: 'APPROVED',
  };

  return (
    <div className="space-y-5">
      
      {/* ------------------------------------------------------------- */}
      {/* TOP CRM NAVIGATION BAR (CLEAN, NO SMS/IVR) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white px-4 py-3 rounded-2xl border border-[#E8E2D9] shadow-xs flex items-center justify-between flex-wrap gap-3">
        
        {/* Left: Active Nav Buttons / Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Email Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setEmailDropdownOpen(!emailDropdownOpen);
                setWabaDropdownOpen(false);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                mainNav === 'email'
                  ? 'bg-[#000839] text-white border-[#000839] shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span>Email</span>
              <ChevronDown size={14} className={emailDropdownOpen ? 'rotate-180 transition-transform' : ''} />
            </button>

            {emailDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-52 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50 text-xs font-bold text-gray-800 animate-in fade-in">
                <button
                  onClick={() => {
                    setMainNav('email');
                    setEmailSubNav('templates');
                    setEmailDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 hover:bg-[#FAF8F5] flex items-center justify-between ${
                    mainNav === 'email' && emailSubNav === 'templates' ? 'text-[#700B1A] bg-[#FDF7F2]' : ''
                  }`}
                >
                  <span>Email Templates Studio</span>
                  <Layers size={14} className="text-purple-600" />
                </button>
                <button
                  onClick={() => {
                    setMainNav('email');
                    setEmailSubNav('settings');
                    setEmailDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 hover:bg-[#FAF8F5] flex items-center justify-between ${
                    mainNav === 'email' && emailSubNav === 'settings' ? 'text-[#700B1A] bg-[#FDF7F2]' : ''
                  }`}
                >
                  <span>Resend API & Domain Settings</span>
                  <Key size={14} className="text-gray-400" />
                </button>
              </div>
            )}
          </div>

          {/* WABA Active Pill / Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setWabaDropdownOpen(!wabaDropdownOpen);
                setEmailDropdownOpen(false);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border ${
                mainNav === 'waba'
                  ? 'bg-[#000839] text-white border-[#000839] shadow-sm'
                  : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span>WABA</span>
              <ChevronDown size={14} className={wabaDropdownOpen ? 'rotate-180 transition-transform' : ''} />
            </button>

            {/* Dropdown Menu (Dashboard, Inbox, Single Send, Templates) */}
            {wabaDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50 text-xs font-bold text-gray-800 animate-in fade-in">
                <button
                  onClick={() => {
                    setMainNav('waba');
                    setWabaSubNav('dashboard');
                    setWabaDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 hover:bg-[#FAF8F5] flex items-center justify-between ${
                    mainNav === 'waba' && wabaSubNav === 'dashboard' ? 'text-[#700B1A] bg-[#FDF7F2]' : ''
                  }`}
                >
                  <span>Dashboard</span>
                  <Activity size={14} className="text-gray-400" />
                </button>

                <button
                  onClick={() => {
                    setMainNav('waba');
                    setWabaSubNav('inbox');
                    setWabaDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 hover:bg-[#FAF8F5] flex items-center justify-between ${
                    mainNav === 'waba' && wabaSubNav === 'inbox' ? 'text-[#700B1A] bg-[#FDF7F2]' : ''
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>Inbox</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  </span>
                  <MessageSquare size={14} className="text-emerald-600" />
                </button>

                <button
                  onClick={() => {
                    setMainNav('waba');
                    setWabaSubNav('single-send');
                    setWabaDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 hover:bg-[#FAF8F5] flex items-center justify-between ${
                    mainNav === 'waba' && wabaSubNav === 'single-send' ? 'text-[#700B1A] bg-[#FDF7F2]' : ''
                  }`}
                >
                  <span>Single Send</span>
                  <SendHorizonal size={14} className="text-blue-600" />
                </button>

                <button
                  onClick={() => {
                    setMainNav('waba');
                    setWabaSubNav('templates');
                    setWabaDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 hover:bg-[#FAF8F5] flex items-center justify-between ${
                    mainNav === 'waba' && wabaSubNav === 'templates' ? 'text-[#700B1A] bg-[#FDF7F2]' : ''
                  }`}
                >
                  <span>Templates</span>
                  <Layers size={14} className="text-amber-600" />
                </button>
              </div>
            )}
          </div>

          {/* Workflows Tab */}
          <button
            onClick={() => {
              setMainNav('workflows');
              setWabaDropdownOpen(false);
              setEmailDropdownOpen(false);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              mainNav === 'workflows'
                ? 'bg-[#000839] text-white border-[#000839] shadow-sm'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Workflow size={14} />
            <span>Workflows</span>
          </button>

          {/* Bulk Broadcast Tab */}
          <button
            onClick={() => {
              setMainNav('bulk');
              setWabaDropdownOpen(false);
              setEmailDropdownOpen(false);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              mainNav === 'bulk'
                ? 'bg-[#000839] text-white border-[#000839] shadow-sm'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Tag size={14} />
            <span>Bulk</span>
          </button>

        </div>

        {/* Right: Sub-nav pill buttons (when WABA or Email is active) */}
        <div className="flex items-center gap-2">
          {mainNav === 'waba' && (
            <div className="flex items-center bg-[#F1F5F9] p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setWabaSubNav('dashboard')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  wabaSubNav === 'dashboard' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-black'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setWabaSubNav('inbox')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  wabaSubNav === 'inbox' ? 'bg-[#059669] text-white shadow-xs' : 'text-gray-600 hover:text-black'
                }`}
              >
                <span>Live Inbox</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              </button>
              <button
                onClick={() => setWabaSubNav('single-send')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  wabaSubNav === 'single-send' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-black'
                }`}
              >
                Single Send
              </button>
              <button
                onClick={() => setWabaSubNav('templates')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  wabaSubNav === 'templates' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-black'
                }`}
              >
                Templates
              </button>
            </div>
          )}

          {mainNav === 'email' && (
            <div className="flex items-center bg-[#F1F5F9] p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setEmailSubNav('templates')}
                className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  emailSubNav === 'templates' ? 'bg-[#700B1A] text-white shadow-xs' : 'text-gray-600 hover:text-black'
                }`}
              >
                <Layers size={13} />
                <span>Email Templates Studio ({templates.length})</span>
              </button>
              <button
                onClick={() => setEmailSubNav('settings')}
                className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  emailSubNav === 'settings' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-black'
                }`}
              >
                <Key size={13} />
                <span>Resend Settings</span>
              </button>
            </div>
          )}

          <button
            onClick={fetchAllData}
            disabled={refreshing}
            className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50"
            title="Refresh"
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin text-[#700B1A]' : ''} />
          </button>
        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. WABA -> DASHBOARD */}
      {/* ------------------------------------------------------------- */}
      {mainNav === 'waba' && wabaSubNav === 'dashboard' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#E8E2D9] p-6 sm:p-7 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <MoreVertical size={18} className="text-gray-400" />
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 font-serif">
                  <span>WhatsApp Business API</span>
                </h2>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Meta Cloud API v20.0</span>
              </span>
            </div>

            {/* 8-Card Status Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-gray-200/80 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center font-bold shrink-0">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Account Status</span>
                  <span className="text-sm font-black text-[#16A34A] uppercase">{waba.status || 'CONNECTED'}</span>
                </div>
              </div>

              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-gray-200/80 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center font-bold shrink-0">
                  <Activity size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <span>Messaging Health</span>
                    <HelpCircle size={11} />
                  </span>
                  <span className="text-sm font-black text-[#16A34A] uppercase">{waba.health || 'AVAILABLE'}</span>
                </div>
              </div>

              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-gray-200/80 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#E0E7FF] text-[#4F46E5] flex items-center justify-center font-bold shrink-0">
                  <Star size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Quality Rating</span>
                  <span className="text-sm font-black text-gray-800 uppercase">HIGH (GREEN)</span>
                </div>
              </div>

              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-gray-200/80 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center font-bold shrink-0">
                  <Star size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <span>Messaging Tier</span>
                    <HelpCircle size={11} />
                  </span>
                  <span className="text-sm font-black text-[#9333EA] uppercase">{waba.tier || '2K'}</span>
                </div>
              </div>

              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-gray-200/80 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center font-bold shrink-0">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <span>Daily Limit</span>
                    <HelpCircle size={11} />
                  </span>
                  <span className="text-sm font-black text-[#0284C7]">{(waba.dailyLimit || 2000).toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-gray-200/80 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center font-bold shrink-0">
                  <Check size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Sent Messages</span>
                  <span className="text-sm font-black text-gray-900">{analytics?.whatsappSent || 8}</span>
                </div>
              </div>

              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-gray-200/80 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center font-bold shrink-0">
                  <HelpCircle size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <span>Account Mode</span>
                    <HelpCircle size={11} />
                  </span>
                  <span className="text-sm font-black text-[#16A34A] uppercase">{waba.mode || 'LIVE'}</span>
                </div>
              </div>

              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-gray-200/80 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center font-bold shrink-0">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <span>Name Status</span>
                    <HelpCircle size={11} />
                  </span>
                  <span className="text-sm font-black text-[#16A34A] uppercase">{waba.nameStatus || 'APPROVED'}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Phone Number</span>
                  <span className="font-bold text-gray-900 text-xs sm:text-sm">{waba.phone || '+91 82183 22073'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Phone Number ID</span>
                  <span className="font-mono font-bold text-gray-800 text-xs sm:text-sm">{waba.phoneId || '1252418734612866'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Last Onboarded</span>
                  <span className="font-medium text-gray-600 text-xs">Jul 14, 2026 09:14 AM</span>
                </div>
              </div>

              <button
                onClick={() => setTestModalOpen(true)}
                className="btn btn-primary text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shrink-0 shadow-sm"
              >
                <Zap size={14} />
                <span>1-Click Test Ping</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#E8E2D9] shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm font-serif">Analytics Dashboard</h3>
                  <span className="text-[11px] text-gray-400">Last 30 Days Performance</span>
                </div>
                <button
                  onClick={() => setWabaSubNav('inbox')}
                  className="px-3 py-1.5 rounded-xl bg-[#000839] text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <MessageSquare size={13} />
                  <span>Open Live Inbox</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-gray-200">
                  <span className="text-xl font-black text-gray-900 block">{analytics?.totalNotifications || 12}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Messages Sent</span>
                </div>
                <div className="p-3.5 bg-[#F0FDF4] rounded-2xl border border-emerald-200">
                  <span className="text-xl font-black text-emerald-800 block">{analytics?.whatsappSent || 12}</span>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">Delivered</span>
                </div>
                <div className="p-3.5 bg-[#F0FDF4] rounded-2xl border border-emerald-200">
                  <span className="text-xl font-black text-emerald-800 block">99.8%</span>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">Delivery Rate</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#E8E2D9] shadow-xs space-y-4">
              <h3 className="font-bold text-gray-900 text-sm font-serif flex items-center gap-1.5">
                <Tag size={15} className="text-[#D97706]" />
                <span>Meta Official Pricing Rates (USD / INR)</span>
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                  <span className="font-bold text-gray-800">Marketing (Offers & Broadcasts)</span>
                  <span className="font-mono font-bold text-gray-900">$0.0147 (~₹1.22)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                  <span className="font-bold text-emerald-900">Utility (Orders & Invoices)</span>
                  <span className="font-mono font-bold text-emerald-900">$0.0085 (~₹0.71)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#DCFCE7] border border-[#86EFAC] flex items-center justify-between font-bold text-[#166534]">
                  <span>Free Entry (First 1,000 service chats/mo)</span>
                  <span className="px-2 py-0.5 bg-[#16A34A] text-white rounded text-[10px]">FREE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. WABA -> LIVE 2-WAY TEAM INBOX */}
      {/* ------------------------------------------------------------- */}
      {mainNav === 'waba' && wabaSubNav === 'inbox' && (
        <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px] max-h-[800px]">
          {/* Left: Convos */}
          <div className="lg:col-span-4 border-r border-[#E8E2D9] flex flex-col bg-[#FAF8F5]">
            <div className="p-3.5 border-b border-[#E8E2D9] space-y-2.5 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-gray-900 text-sm flex items-center gap-2">
                  <MessageSquare size={16} className="text-[#16A34A]" />
                  <span>WhatsApp Conversations</span>
                </h3>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                  {conversations.length} Active
                </span>
              </div>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={inboxSearch}
                  onChange={(e) => setInboxSearch(e.target.value)}
                  placeholder="Search customer name, phone..."
                  className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs focus:outline-none focus:border-[#700B1A]"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
              {conversations.map((convo) => {
                const isSelected = selectedConversation?._id === convo._id;
                return (
                  <div
                    key={convo._id}
                    onClick={() => selectConversation(convo)}
                    className={`p-3.5 cursor-pointer transition-colors flex items-start gap-3 ${
                      isSelected ? 'bg-white border-l-4 border-l-[#700B1A] shadow-xs' : 'hover:bg-white/60'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#700B1A] text-[#FDE68A] font-bold font-serif flex items-center justify-center shrink-0">
                      {convo.customerName?.slice(0, 2).toUpperCase() || 'SV'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-gray-900 text-xs truncate">{convo.customerName}</h4>
                        <span className="text-[10px] text-gray-400">
                          {new Date(convo.lastMessageTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">{convo.lastMessage}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Center: Live Chat */}
          <div className="lg:col-span-5 flex flex-col bg-[#EFEAE2] border-r border-[#E8E2D9]">
            {selectedConversation ? (
              <>
                <div className="p-3.5 bg-white border-b border-[#E8E2D9] flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#075E54] text-white font-bold flex items-center justify-center text-xs">
                      {selectedConversation.customerName?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs">{selectedConversation.customerName}</h4>
                      <span className="text-[10px] font-mono text-gray-400">{selectedConversation.customerPhone}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setQuickTemplateModal(true)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E8E2D9] hover:border-[#700B1A] text-xs font-bold text-[#700B1A] flex items-center gap-1"
                  >
                    <Layers size={13} />
                    <span>Send Template</span>
                  </button>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[radial-gradient(#d4cdc5_1px,transparent_1px)] [background-size:12px_12px]">
                  {chatMessages.map((msg, i) => {
                    const isAgent = msg.sender === 'agent';
                    const isSystem = msg.sender === 'system';
                    if (isSystem) {
                      return (
                        <div key={msg._id || i} className="flex justify-center my-2">
                          <div className="bg-[#FFFBEB] border border-[#FDE68A] text-amber-900 text-[10px] px-3 py-1.5 rounded-full shadow-2xs text-center max-w-[85%]">
                            {msg.text}
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div key={msg._id || i} className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[80%] p-3 rounded-2xl shadow-xs text-xs space-y-1 ${
                            isAgent ? 'bg-[#E7FFDB] text-gray-900 rounded-tr-none border border-[#C6F6B4]' : 'bg-white text-gray-900 rounded-tl-none border border-gray-200'
                          }`}
                        >
                          <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                          <div className="flex items-center justify-end gap-1 text-[9px] text-gray-400">
                            <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {isAgent && <CheckCheck size={13} className="text-blue-500" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatBottomRef} />
                </div>

                <div className="p-3 bg-white border-t border-[#E8E2D9]">
                  <form onSubmit={handleSendChatMessage} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={chatInputText}
                      onChange={(e) => setChatInputText(e.target.value)}
                      placeholder="Type a WhatsApp reply to customer..."
                      className="flex-1 p-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs focus:outline-none focus:border-[#700B1A]"
                    />
                    <button
                      type="submit"
                      disabled={sendingChat || !chatInputText.trim()}
                      className="p-2.5 rounded-xl bg-[#00A884] hover:bg-[#008F6F] text-white font-bold transition-all disabled:opacity-50"
                    >
                      <Send size={16} />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400 text-xs">
                <MessageSquare size={32} className="text-gray-300 mb-2" />
                <p>Select a conversation to start chatting.</p>
              </div>
            )}
          </div>

          {/* Right: Dossier */}
          <div className="lg:col-span-3 p-4 bg-white space-y-4 overflow-y-auto">
            {selectedConversation ? (
              <div className="space-y-4">
                <div className="text-center pb-3 border-b border-gray-100">
                  <div className="w-14 h-14 rounded-full bg-[#700B1A] text-[#FDE68A] font-serif font-bold text-lg flex items-center justify-center mx-auto shadow-sm">
                    {selectedConversation.customerName?.slice(0, 2).toUpperCase()}
                  </div>
                  <h3 className="font-serif font-bold text-gray-900 text-sm mt-2">{selectedConversation.customerName}</h3>
                  <span className="text-xs text-gray-500 font-mono block">{selectedConversation.customerPhone}</span>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex items-center gap-1">
                    <ShoppingBag size={12} className="text-[#700B1A]" />
                    <span>Recent Saree Orders</span>
                  </span>
                  {customerOrders.map((ord) => (
                    <div key={ord._id} className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="font-bold text-gray-900">{ord.orderNumber}</strong>
                        <span className="px-1.5 py-0.2 bg-[#FDF7F2] text-[#700B1A] font-bold text-[10px] rounded">
                          {ord.orderStatus}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-gray-500">
                        <span>₹{Number(ord.totalPrice).toLocaleString('en-IN')}</span>
                        <span>{new Date(ord.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. WABA -> SINGLE SEND */}
      {/* ------------------------------------------------------------- */}
      {mainNav === 'waba' && wabaSubNav === 'single-send' && (
        <div className="max-w-2xl mx-auto bg-white p-6 sm:p-7 rounded-3xl border border-[#E8E2D9] shadow-xs space-y-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#16A34A] uppercase tracking-wider mb-1">
              <SendHorizonal size={15} />
              <span>Direct WhatsApp Dispatcher</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-gray-900">
              Send 1-to-1 WhatsApp Message
            </h3>
          </div>

          <form onSubmit={handleSingleSendSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="form-label font-bold text-gray-700 block mb-1">Customer Mobile Number</label>
                <input
                  type="text"
                  required
                  value={singleSendForm.phone}
                  onChange={(e) => setSingleSendForm({ ...singleSendForm, phone: e.target.value })}
                  placeholder="e.g. 918218322073"
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs font-bold text-gray-900"
                />
              </div>
              <div>
                <label className="form-label font-bold text-gray-700 block mb-1">Customer Name (Optional)</label>
                <input
                  type="text"
                  value={singleSendForm.name}
                  onChange={(e) => setSingleSendForm({ ...singleSendForm, name: e.target.value })}
                  placeholder="e.g. Priya Sharma"
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="form-label font-bold text-gray-700 block mb-1">Select Stage Template</label>
              <select
                value={singleSendForm.templateName}
                onChange={(e) => setSingleSendForm({ ...singleSendForm, templateName: e.target.value })}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs font-bold text-[#700B1A]"
              >
                {templates.map((t) => (
                  <option key={t.whatsappTemplateName} value={t.whatsappTemplateName}>
                    {t.title || t.stage} ({t.whatsappTemplateName})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={singleSendLoading}
              className="btn btn-primary w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
            >
              <Send size={15} />
              <span>{singleSendLoading ? 'Dispatching to WhatsApp...' : 'Send WhatsApp Message'}</span>
            </button>
          </form>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. WABA -> TEMPLATES STUDIO */}
      {/* ------------------------------------------------------------- */}
      {mainNav === 'waba' && wabaSubNav === 'templates' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E8E2D9] shadow-xs">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>All <strong>{templates.length} stage templates</strong> are fully editable and synced with Meta WABA Utility triggers.</span>
            </div>
            <button
              onClick={() => handleOpenEditor()}
              className="btn btn-primary text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus size={14} />
              <span>Add Custom Template</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {templates.map((tpl, idx) => (
              <div
                key={tpl._id || idx}
                className="bg-white rounded-2xl border border-[#E8E2D9] shadow-xs hover:shadow-md hover:border-[#700B1A]/40 transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-4 bg-[#FAF8F5] border-b border-[#E8E2D9] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-[#700B1A] text-white flex items-center justify-center text-xs font-black shadow-xs">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-serif font-bold text-gray-900 text-sm">{tpl.title || tpl.stage}</h4>
                      <span className="text-[10px] font-mono text-gray-500">{tpl.stage}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                    {tpl.category || 'UTILITY'}
                  </span>
                </div>

                <div className="p-4 space-y-3.5 text-xs flex-1">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-200 text-[11px]">
                    <span className="text-gray-400 font-medium">Meta Name:</span>
                    <span className="font-mono font-bold text-gray-800">{tpl.whatsappTemplateName}</span>
                  </div>
                  <div className="p-3 bg-[#E8F8EA] border border-[#BCE8BF] rounded-xl text-[11px] text-gray-800 leading-relaxed space-y-2">
                    <p className="line-clamp-4 italic">"{getInterpolatedPreview(tpl.whatsappBody)}"</p>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF8F5] border-t border-[#E8E2D9] flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditor(tpl)}
                    className="flex-1 py-2 rounded-xl bg-white border border-[#E8E2D9] hover:border-[#700B1A] text-[#700B1A] font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <Edit3 size={13} />
                    <span>Edit Template</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingTemplate(tpl);
                      setTestStage(tpl.stage);
                      setTestModalOpen(true);
                    }}
                    className="p-2 rounded-xl bg-white border border-gray-200 hover:border-[#D97706] text-[#D97706]"
                  >
                    <Play size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. WORKFLOWS AUTOMATIONS */}
      {/* ------------------------------------------------------------- */}
      {mainNav === 'workflows' && (
        <div className="bg-white rounded-3xl border border-[#E8E2D9] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-serif text-lg font-bold text-gray-900">Automation Workflows Pipeline</h3>
              <p className="text-xs text-gray-500">Automated triggers fired upon stage transitions or customer actions</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 uppercase text-[10px]">
                  <th className="pb-2">Automation Name</th>
                  <th className="pb-2">Allow Re-entry</th>
                  <th className="pb-2">Total Contacts</th>
                  <th className="pb-2">Completed</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {workflows.map((wf) => (
                  <tr key={wf.id} className="hover:bg-gray-50/80">
                    <td className="py-3">
                      <strong className="text-gray-900 block font-bold text-xs">{wf.name}</strong>
                      <span className="text-[11px] text-gray-500">{wf.description}</span>
                    </td>
                    <td className="py-3">
                      <input type="checkbox" checked={wf.allowReEntry} readOnly className="rounded text-[#700B1A]" />
                    </td>
                    <td className="py-3 font-bold text-gray-900">{wf.totalContacts} Contacts</td>
                    <td className="py-3 font-bold text-emerald-700">{wf.completed} Complete</td>
                    <td className="py-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {wf.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. BULK BROADCAST CAMPAIGNS (WITH TEMPLATE SELECTOR) */}
      {/* ------------------------------------------------------------- */}
      {mainNav === 'bulk' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Form: Broadcast Creator */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-[#E8E2D9] shadow-xs space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#D97706] uppercase tracking-wider mb-1">
                <Tag size={15} />
                <span>Festive & Promotional Campaigns</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-gray-900">
                Launch Broadcast to All Customers
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Select an approved WhatsApp message template and dispatch promotional broadcasts to your customer audience.
              </p>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
              
              {/* Campaign Title */}
              <div>
                <label className="form-label font-bold text-gray-700 block mb-1">Campaign Title / Name</label>
                <input
                  type="text"
                  required
                  value={broadcastForm.title}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                  placeholder="e.g. Wedding Season Kanchipuram Pure Silk Sale"
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#700B1A]"
                />
              </div>

              {/* Template Mode Selection (Dropdown / Toggle) */}
              <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="form-label font-bold text-emerald-950 flex items-center gap-1.5">
                    <Layers size={15} className="text-emerald-700" />
                    <span>Select WhatsApp Message Template (Meta Approved)</span>
                  </label>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    {templates.length} Templates Available
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBroadcastForm({ ...broadcastForm, useTemplate: true })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      broadcastForm.useTemplate
                        ? 'bg-[#16A34A] text-white shadow-xs'
                        : 'bg-white text-gray-600 border border-gray-200'
                    }`}
                  >
                    Approved Template Mode
                  </button>
                  <button
                    type="button"
                    onClick={() => setBroadcastForm({ ...broadcastForm, useTemplate: false })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      !broadcastForm.useTemplate
                        ? 'bg-[#16A34A] text-white shadow-xs'
                        : 'bg-white text-gray-600 border border-gray-200'
                    }`}
                  >
                    Custom Text Mode
                  </button>
                </div>

                {broadcastForm.useTemplate ? (
                  <div className="space-y-2 pt-1">
                    <label className="text-[10px] font-bold text-emerald-900 block">Choose Template from Dropdown</label>
                    <select
                      value={broadcastForm.selectedTemplateName}
                      onChange={(e) => {
                        const tplName = e.target.value;
                        const tpl = templates.find((t) => t.whatsappTemplateName === tplName);
                        setBroadcastForm({
                          ...broadcastForm,
                          selectedTemplateName: tplName,
                          message: tpl ? tpl.whatsappBody : broadcastForm.message,
                          emailSubject: tpl ? tpl.emailSubject : broadcastForm.emailSubject,
                          emailHeading: tpl ? tpl.emailHeading : broadcastForm.emailHeading,
                        });
                      }}
                      className="w-full p-2.5 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-[#700B1A] focus:outline-none focus:border-emerald-600"
                    >
                      {templates.map((tpl) => (
                        <option key={tpl.whatsappTemplateName} value={tpl.whatsappTemplateName}>
                          {tpl.title || tpl.stage} (Meta Name: {tpl.whatsappTemplateName})
                        </option>
                      ))}
                    </select>

                    {currentBroadcastTemplate && (
                      <div className="p-3 bg-white/90 rounded-xl border border-emerald-200 text-[11px] text-gray-700 leading-relaxed italic">
                        "{currentBroadcastTemplate.whatsappBody}"
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[10px] font-bold text-emerald-900 block">Custom Message Text</label>
                    <textarea
                      rows={3}
                      value={broadcastForm.message}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                      placeholder="Enter custom broadcast message..."
                      className="w-full p-2.5 bg-white border border-emerald-300 rounded-xl text-xs leading-relaxed focus:outline-none"
                    ></textarea>
                  </div>
                )}
              </div>

              {/* Target Audience & Channel Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="form-label font-bold text-gray-700 block mb-1">Target Customer Audience</label>
                  <select
                    value={broadcastForm.targetAudience}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, targetAudience: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:border-[#700B1A]"
                  >
                    <option value="ALL_CUSTOMERS">All Registered Customers (148 Contacts)</option>
                    <option value="VIP_CUSTOMERS">VIP Pure Silk Buyers (32 Contacts)</option>
                    <option value="INACTIVE_CUSTOMERS">Recent Inactive Shoppers (45 Contacts)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label font-bold text-gray-700 block mb-1">Broadcast Channels</label>
                  <select
                    value={broadcastForm.channel}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, channel: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#700B1A]"
                  >
                    <option value="BOTH">WhatsApp & Email (Both)</option>
                    <option value="WHATSAPP">WhatsApp Only (Meta WABA)</option>
                    <option value="EMAIL">Email Only (Resend)</option>
                  </select>
                </div>
              </div>

              {/* Coupon Code */}
              <div>
                <label className="form-label font-bold text-gray-700 block mb-1">Discount Coupon Code</label>
                <input
                  type="text"
                  value={broadcastForm.couponCode}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, couponCode: e.target.value.toUpperCase() })}
                  placeholder="e.g. SILK20"
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs font-mono font-bold text-[#700B1A] uppercase focus:outline-none focus:border-[#700B1A]"
                />
              </div>

              {broadcastResult && (
                <div className={`p-3 rounded-xl text-xs font-bold ${
                  broadcastResult.success ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-red-50 text-red-900 border border-red-200'
                }`}>
                  {broadcastResult.success ? `✅ ${broadcastResult.message}` : `❌ ${broadcastResult.message}`}
                </div>
              )}

              <button
                type="submit"
                disabled={broadcastLoading}
                className="btn btn-primary w-full py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md"
              >
                <Send size={15} />
                <span>{broadcastLoading ? 'Broadcasting to Customers...' : 'Dispatch Broadcast Campaign Now'}</span>
              </button>
            </form>
          </div>

          {/* Right Side: Live Broadcast Message Preview & Past Broadcasts */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Live WhatsApp Preview Box */}
            <div className="bg-white p-5 rounded-3xl border border-[#E8E2D9] shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <Smartphone size={15} className="text-[#16A34A]" />
                  <span>Live WhatsApp Broadcast Preview</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Verified Format
                </span>
              </div>

              <div className="bg-[#EFEAE2] p-3.5 rounded-2xl border border-gray-300 space-y-2 text-xs">
                <div className="bg-[#075E54] text-white p-2 rounded-xl flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white text-[#700B1A] flex items-center justify-center font-bold text-[9px]">SV</span>
                  <span className="font-bold text-[11px]">Sri Vijaylaxmi Sarees 🌸</span>
                </div>

                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-xs border border-gray-200 text-[11px] text-gray-800 leading-relaxed whitespace-pre-line">
                  {getInterpolatedPreview(
                    broadcastForm.useTemplate && currentBroadcastTemplate
                      ? currentBroadcastTemplate.whatsappBody
                      : broadcastForm.message
                  )}
                </div>

                {currentBroadcastTemplate?.whatsappButtonText && (
                  <div className="bg-white py-1.5 px-3 rounded-xl shadow-xs border border-gray-200 text-center font-bold text-[11px] text-[#00A884]">
                    {currentBroadcastTemplate.whatsappButtonText}
                  </div>
                )}
              </div>
            </div>

            {/* Past Broadcast History */}
            <div className="bg-white p-5 rounded-3xl border border-[#E8E2D9] shadow-xs space-y-3">
              <h4 className="font-serif font-bold text-gray-900 text-sm pb-2 border-b border-gray-100">
                Past Campaign Broadcasts
              </h4>

              {campaigns.length > 0 ? (
                <div className="space-y-2.5 max-h-64 overflow-y-auto">
                  {campaigns.map((camp) => (
                    <div key={camp._id} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-gray-900 font-bold">{camp.title}</strong>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {camp.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-gray-500">
                        <span>Audience: <strong>{camp.recipientsCount || 1} Customers</strong></span>
                        <span>{new Date(camp.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic text-center py-4">No past broadcast campaigns.</p>
              )}
            </div>

          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 7. EMAIL HUB (TEMPLATES STUDIO & RESEND SETTINGS) */}
      {/* ------------------------------------------------------------- */}
      {mainNav === 'email' && emailSubNav === 'templates' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E8E2D9] shadow-xs">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <span>All <strong>{templates.length} Email Templates</strong> are responsive, styled with luxury brand typography, and support auto-attached GST Tax Invoices.</span>
            </div>

            <button
              onClick={() => {
                setEditingEmailTemplate({
                  stage: 'Custom_Email',
                  title: 'Special Collection Announcement',
                  emailSubject: '🌸 Exclusive Handloom Silk Preview #{order_number} | Sri Vijaylaxmi',
                  emailHeading: 'New Festive Handloom Arrival',
                  emailSubtext: 'Discover timeless Banarasi, Kanchipuram, and Dharmavaram weaves woven by master artisans.',
                  attachInvoice: false,
                  accentColor: '#700B1A',
                  includeSilkCare: true,
                });
                setEmailEditorModalOpen(true);
              }}
              className="btn btn-primary text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus size={14} />
              <span>Create Email Template</span>
            </button>
          </div>

          {/* Email Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {templates.map((tpl, idx) => (
              <div
                key={tpl._id || idx}
                className="bg-white rounded-2xl border border-[#E8E2D9] shadow-xs hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between overflow-hidden"
              >
                {/* Header */}
                <div className="p-4 bg-[#FAF8F5] border-b border-[#E8E2D9] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-purple-900 text-white flex items-center justify-center text-xs font-black shadow-xs">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-serif font-bold text-gray-900 text-sm">{tpl.title || tpl.stage}</h4>
                      <span className="text-[10px] font-mono text-gray-500">Stage: {tpl.stage}</span>
                    </div>
                  </div>

                  {tpl.attachInvoice && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-900 border border-amber-200">
                      + PDF Invoice
                    </span>
                  )}
                </div>

                {/* Email Content Preview */}
                <div className="p-4 space-y-3 text-xs flex-1">
                  <div>
                    <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block mb-1">
                      Email Subject Line:
                    </span>
                    <div className="p-2 bg-purple-50/70 border border-purple-200 rounded-xl text-gray-900 font-medium line-clamp-2">
                      {tpl.emailSubject?.replace(/{order_number}/g, '#SVL-2026-99201')}
                    </div>
                  </div>

                  <div className="space-y-1 bg-[#FAF8F5] p-3 rounded-xl border border-gray-200 text-[11px]">
                    <strong className="text-gray-900 block font-bold">
                      {tpl.emailHeading || `Order Status: ${tpl.stage}`}
                    </strong>
                    <p className="text-gray-600 line-clamp-3 leading-relaxed">
                      {tpl.emailSubtext || 'Notification details.'}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-3 bg-[#FAF8F5] border-t border-[#E8E2D9] flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingEmailTemplate({
                        stage: tpl.stage,
                        title: tpl.title || tpl.stage,
                        emailSubject: tpl.emailSubject || `Order #${tpl.stage} | Sri Vijaylaxmi Sarees`,
                        emailHeading: tpl.emailHeading || `Order Status: ${tpl.stage}`,
                        emailSubtext: tpl.emailSubtext || 'Your handloom saree order update.',
                        attachInvoice: !!tpl.attachInvoice,
                        accentColor: '#700B1A',
                        includeSilkCare: true,
                      });
                      setEmailEditorModalOpen(true);
                    }}
                    className="flex-1 py-2 rounded-xl bg-white border border-[#E8E2D9] hover:border-purple-600 text-purple-900 font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs hover:bg-[#FAF5FF]"
                  >
                    <Edit3 size={13} />
                    <span>Edit Email Template</span>
                  </button>

                  <button
                    onClick={() => {
                      setTestStage(tpl.stage);
                      setTestChannel('EMAIL');
                      setTestModalOpen(true);
                    }}
                    className="p-2 rounded-xl bg-white border border-gray-200 hover:border-[#D97706] text-[#D97706]"
                    title="Send Live Test Email"
                  >
                    <Play size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Email Resend Settings */}
      {mainNav === 'email' && emailSubNav === 'settings' && (
        <div className="max-w-3xl mx-auto bg-white p-6 sm:p-7 rounded-3xl border border-[#E8E2D9] shadow-xs space-y-5">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
            <Mail size={16} />
            <span>Resend Email Configuration</span>
          </div>
          <h3 className="font-serif text-lg font-bold text-gray-900">
            Email Engine Credentials & Settings
          </h3>

          <form onSubmit={async (e) => { e.preventDefault(); await marketingApi.saveSettings(settings); alert('Saved!'); }} className="space-y-4 text-xs">
            <div>
              <label className="form-label font-bold text-gray-700 block mb-1">Resend API Key</label>
              <input
                type="password"
                value={settings.resendApiKey}
                onChange={(e) => setSettings({ ...settings, resendApiKey: e.target.value })}
                placeholder={settings.resendApiKeyMasked || 're_123456789...'}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label font-bold text-gray-700 block mb-1">From Sender Email</label>
                <input
                  type="text"
                  value={settings.resendFromEmail}
                  onChange={(e) => setSettings({ ...settings, resendFromEmail: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="form-label font-bold text-gray-700 block mb-1">Support Reply-To</label>
                <input
                  type="email"
                  value={settings.resendReplyTo}
                  onChange={(e) => setSettings({ ...settings, resendReplyTo: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary px-6 py-2.5 rounded-xl font-bold text-xs shadow-sm">
              Save Email Settings
            </button>
          </form>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* INTERACTIVE EMAIL TEMPLATE STUDIO MODAL */}
      {/* ------------------------------------------------------------- */}
      {emailEditorModalOpen && (
        <div className="modal-overlay" onClick={() => setEmailEditorModalOpen(false)}>
          <div className="modal-box max-w-5xl p-0 overflow-hidden bg-[#FAF8F5] rounded-3xl border border-[#E8E2D9] shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="p-5 bg-white border-b border-[#E8E2D9] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-900 text-white flex items-center justify-center shadow-xs">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-gray-900">
                    Email Template Studio: {editingEmailTemplate.title || editingEmailTemplate.stage}
                  </h3>
                  <span className="text-xs text-gray-500">
                    Design email subject, headers, subtext, and attach GST Tax Invoices.
                  </span>
                </div>
              </div>
              <button onClick={() => setEmailEditorModalOpen(false)} className="p-2 text-gray-400 hover:text-black">✕</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[75vh] overflow-y-auto">
              {/* Left Column: Form */}
              <div className="lg:col-span-7 p-6 space-y-4 bg-white border-r border-[#E8E2D9] text-xs">
                <div>
                  <label className="form-label font-bold text-gray-700 block mb-1">Stage / Event Key</label>
                  <input
                    type="text"
                    value={editingEmailTemplate.stage}
                    onChange={(e) => setEditingEmailTemplate({ ...editingEmailTemplate, stage: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs font-bold text-[#700B1A]"
                  />
                </div>

                <div>
                  <label className="form-label font-bold text-purple-950 block mb-1">Email Subject Line</label>
                  <input
                    type="text"
                    required
                    value={editingEmailTemplate.emailSubject}
                    onChange={(e) => setEditingEmailTemplate({ ...editingEmailTemplate, emailSubject: e.target.value })}
                    placeholder="e.g. 🌸 Order Confirmation #{order_number} | Sri Vijaylaxmi Sarees"
                    className="w-full p-2.5 bg-white border border-purple-300 rounded-xl text-xs font-medium focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="form-label font-bold text-gray-700 block mb-1">Email Main Headline</label>
                  <input
                    type="text"
                    value={editingEmailTemplate.emailHeading}
                    onChange={(e) => setEditingEmailTemplate({ ...editingEmailTemplate, emailHeading: e.target.value })}
                    placeholder="e.g. Order Accepted & In Weaving Preparation"
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="form-label font-bold text-gray-700 block mb-1">Email Subtitle / Description Body</label>
                  <textarea
                    rows={4}
                    value={editingEmailTemplate.emailSubtext}
                    onChange={(e) => setEditingEmailTemplate({ ...editingEmailTemplate, emailSubtext: e.target.value })}
                    placeholder="Enter message details describing stage or promotion..."
                    className="w-full p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs leading-relaxed"
                  ></textarea>
                </div>

                <label className="flex items-center gap-2.5 p-3 bg-amber-50/80 rounded-xl border border-amber-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingEmailTemplate.attachInvoice}
                    onChange={(e) => setEditingEmailTemplate({ ...editingEmailTemplate, attachInvoice: e.target.checked })}
                    className="rounded text-[#700B1A] focus:ring-[#700B1A] w-4 h-4"
                  />
                  <span className="text-xs font-bold text-amber-950">
                    Auto-Attach Official Sri Vijaylaxmi GST Tax Invoice PDF with this email
                  </span>
                </label>
              </div>

              {/* Right Column: Live Email Client Simulator */}
              <div className="lg:col-span-5 p-6 bg-[#FAF8F5] flex flex-col justify-between space-y-4 text-xs">
                <div className="bg-white rounded-2xl border border-gray-300 shadow-xl overflow-hidden space-y-3 p-4">
                  <div className="border-b border-gray-100 pb-2.5 space-y-1 text-[11px]">
                    <div className="text-gray-400">From: <strong>Sri Vijaylaxmi Sarees</strong> &lt;orders@resend.dev&gt;</div>
                    <div className="text-gray-400">To: <strong>Priya Sharma</strong> &lt;priya.sharma@gmail.com&gt;</div>
                    <div className="text-gray-900 font-bold">
                      Subject: {editingEmailTemplate.emailSubject?.replace(/{order_number}/g, '#SVL-2026-99201')}
                    </div>
                  </div>

                  {/* Brand Header */}
                  <div className="bg-[#700B1A] text-white p-3.5 rounded-xl text-center shadow-xs">
                    <h5 className="font-serif font-bold text-sm tracking-wide">SRI VIJAYLAXMI SAREES</h5>
                    <span className="text-[10px] text-[#FDE68A] block">Authentic Indian Handloom Silk Weaves</span>
                  </div>

                  {/* Body Heading */}
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                    <strong className="text-gray-900 font-bold text-xs block">
                      {editingEmailTemplate.emailHeading || 'Order Update'}
                    </strong>
                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      {editingEmailTemplate.emailSubtext || 'Thank you for your order.'}
                    </p>
                  </div>

                  {/* Sample Item Row */}
                  <div className="p-2.5 bg-gray-50/70 rounded-xl border border-gray-100 flex items-center justify-between text-[11px]">
                    <div>
                      <strong className="text-gray-900 block font-bold">Royal Kanchipuram Silk Saree</strong>
                      <span className="text-gray-500 text-[10px]">Color: Crimson Gold | Qty: 1</span>
                    </div>
                    <span className="font-bold text-gray-900">₹14,500</span>
                  </div>

                  {/* Invoice Chip */}
                  {editingEmailTemplate.attachInvoice && (
                    <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between text-[10px] font-bold text-amber-900">
                      <span>📎 Invoice_SVL-2026-99201.pdf</span>
                      <span className="text-emerald-700 font-bold">GST Attached</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setEmailEditorModalOpen(false)} className="btn btn-secondary text-xs px-4 py-2 rounded-xl font-bold">Cancel</button>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const targetTpl = templates.find((t) => t.stage.toLowerCase() === editingEmailTemplate.stage.toLowerCase()) || {};
                        await marketingApi.saveTemplate({
                          ...targetTpl,
                          stage: editingEmailTemplate.stage,
                          title: editingEmailTemplate.title,
                          emailSubject: editingEmailTemplate.emailSubject,
                          emailHeading: editingEmailTemplate.emailHeading,
                          emailSubtext: editingEmailTemplate.emailSubtext,
                          attachInvoice: editingEmailTemplate.attachInvoice,
                          whatsappTemplateName: targetTpl.whatsappTemplateName || `svl_${editingEmailTemplate.stage.toLowerCase()}`,
                          whatsappBody: targetTpl.whatsappBody || '🌸 Order update from Sri Vijaylaxmi Sarees',
                        });
                        alert('Email template saved successfully!');
                        setEmailEditorModalOpen(false);
                        fetchAllData();
                      } catch (e) {
                        alert(e.message || 'Error saving template');
                      }
                    }}
                    className="btn btn-primary text-xs font-bold px-5 py-2 rounded-xl"
                  >
                    Save Email Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* QUICK TEMPLATE SELECTION MODAL (IN LIVE INBOX) */}
      {/* ------------------------------------------------------------- */}
      {quickTemplateModal && (
        <div className="modal-overlay" onClick={() => setQuickTemplateModal(false)}>
          <div className="modal-box max-w-lg p-5 bg-white rounded-3xl border border-gray-200 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <h3 className="font-serif text-base font-bold text-gray-900 flex items-center gap-1.5">
                <Layers size={16} className="text-[#16A34A]" />
                <span>Select Handloom Saree Template</span>
              </h3>
              <button onClick={() => setQuickTemplateModal(false)} className="p-1 text-gray-400 hover:text-black">✕</button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {templates.map((tpl) => (
                <div
                  key={tpl._id || tpl.stage}
                  onClick={() => handleSendQuickTemplate(tpl)}
                  className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9] hover:border-[#16A34A] hover:bg-[#F0FDF4] cursor-pointer transition-all text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-gray-900 font-bold">{tpl.title || tpl.stage}</strong>
                    <span className="text-[10px] font-mono text-gray-400">{tpl.whatsappTemplateName}</span>
                  </div>
                  <p className="text-[11px] text-gray-600 line-clamp-2 italic">
                    "{getInterpolatedPreview(tpl.whatsappBody)}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TEMPLATE STUDIO MODAL (FOR EDITING) */}
      {/* ------------------------------------------------------------- */}
      {editorModalOpen && (
        <div className="modal-overlay" onClick={() => setEditorModalOpen(false)}>
          <div className="modal-box max-w-5xl p-0 overflow-hidden bg-[#FAF8F5] rounded-3xl border border-[#E8E2D9] shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 bg-white border-b border-[#E8E2D9] flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-gray-900">
                Template Studio: {editingTemplate.title || editingTemplate.stage}
              </h3>
              <button onClick={() => setEditorModalOpen(false)} className="p-2 text-gray-400 hover:text-black">✕</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[75vh] overflow-y-auto">
              <div className="lg:col-span-7 p-6 space-y-4 bg-white border-r border-[#E8E2D9]">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label font-bold text-gray-700 block mb-1">Stage Key</label>
                    <input
                      type="text"
                      value={editingTemplate.stage}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, stage: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="form-label font-bold text-gray-700 block mb-1">Meta WABA Name</label>
                    <input
                      type="text"
                      value={editingTemplate.whatsappTemplateName}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, whatsappTemplateName: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-2 text-xs">
                  <label className="font-bold text-emerald-900 block">WhatsApp Message Body</label>
                  <textarea
                    rows={4}
                    value={editingTemplate.whatsappBody}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, whatsappBody: e.target.value })}
                    className="w-full p-3 bg-white border border-emerald-300 rounded-xl text-xs leading-relaxed"
                  ></textarea>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF5FF] border border-[#E9D5FF] space-y-2 text-xs">
                  <label className="font-bold text-purple-900 block">Email Subject</label>
                  <input
                    type="text"
                    value={editingTemplate.emailSubject}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, emailSubject: e.target.value })}
                    className="w-full p-2.5 bg-white border border-purple-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="lg:col-span-5 p-6 bg-[#FAF8F5] flex flex-col justify-between space-y-4">
                <div className="w-full max-w-[320px] mx-auto bg-[#EFEAE2] rounded-3xl border-4 border-gray-800 shadow-xl overflow-hidden text-xs">
                  <div className="bg-[#075E54] text-white p-3 font-bold text-xs flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-white text-[#700B1A] flex items-center justify-center text-[10px]">SV</span>
                    <span>Sri Vijaylaxmi Sarees 🌸</span>
                  </div>
                  <div className="p-3 bg-[radial-gradient(#d4cdc5_1px,transparent_1px)] [background-size:12px_12px] min-h-[220px] flex items-end">
                    <div className="bg-white p-3 rounded-2xl shadow-xs text-[11px] leading-relaxed">
                      {getInterpolatedPreview(editingTemplate.whatsappBody)}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setEditorModalOpen(false)} className="btn btn-secondary text-xs px-4 py-2 rounded-xl">Cancel</button>
                  <button type="button" onClick={handleSaveTemplateSubmit} className="btn btn-primary text-xs font-bold px-5 py-2 rounded-xl">Save & Deploy</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1-CLICK TEST PING MODAL */}
      {/* ------------------------------------------------------------- */}
      {testModalOpen && (
        <div className="modal-overlay" onClick={() => setTestModalOpen(false)}>
          <div className="modal-box max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-serif text-lg font-bold text-gray-900 flex items-center gap-2">
                <Zap size={18} className="text-[#D97706]" />
                <span>Send 1-Click Live Test Ping</span>
              </h3>
              <button onClick={() => setTestModalOpen(false)} className="p-1 text-gray-400 hover:text-black">✕</button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              setTestLoading(true);
              try {
                const res = await marketingApi.sendTestPing({ phone: testPhone, email: testEmail, testStage, channel: testChannel });
                setTestResult(res?.data || { success: true });
                fetchAllData();
              } catch (err) {
                setTestResult({ success: false, error: err.message });
              } finally {
                setTestLoading(false);
              }
            }} className="space-y-4 text-xs">
              <div>
                <label className="form-label font-bold text-gray-700 block mb-1">Mobile (WhatsApp)</label>
                <input
                  type="text"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="form-label font-bold text-gray-700 block mb-1">Email</label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs"
                />
              </div>

              {testResult && (
                <div className={`p-3 rounded-xl text-xs ${testResult.success ? 'bg-emerald-50 text-emerald-900' : 'bg-red-50 text-red-900'}`}>
                  {testResult.success ? '✅ Test Ping Dispatched!' : `❌ ${testResult.error}`}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setTestModalOpen(false)} className="btn btn-secondary text-xs px-4 py-2 rounded-xl">Close</button>
                <button type="submit" disabled={testLoading} className="btn btn-primary text-xs font-bold px-4 py-2 rounded-xl">
                  {testLoading ? 'Firing...' : 'Fire Test Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminMarketing;
