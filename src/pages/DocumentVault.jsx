import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Upload, Trash2, Shield, Lock,
  Cloud, Plus, AlertCircle, CheckCircle2,
  FolderOpen, FileCheck, Info
} from 'lucide-react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { getDocuments, uploadDocument, deleteDocument } from '../services/documentService';
import CurvedLoop from '../components/animations/CurvedLoop';
import ElectricBorder from '../components/animations/ElectricBorder';

const docTypes = [
  'Passport', 'Visa', 'Aadhar Card', 'Vaccination Certificate',
  'Flight Ticket', 'Hotel Booking', 'Travel Insurance', 'ID Card', 'Other'
];

export default function DocumentVault() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [docs, setDocs] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('Passport');
  const [customType, setCustomType] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    if (isSignedIn) loadDocuments();
  }, [isSignedIn]);

  const loadDocuments = async () => {
    try {
      const token = await getToken();
      if (!token) throw new Error('No authentication token found');
      const data = await getDocuments(token);
      setDocs(data);
    } catch (err) {
      console.error('Fetch docs error:', err);
    }
  };

  const handleUpload = async (e) => {
    e?.preventDefault();
    if (!file || !name) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('type', type === 'Other' ? customType || 'Other' : type);

    try {
      const token = await getToken();
      if (!token) throw new Error('No authentication token found');
      await uploadDocument(formData, token);
      loadDocuments();
      resetForm();
      setShowUploadModal(false);
    } catch (err) {
      console.error('Upload Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setFile(null);
    setCustomType('');
    setType('Passport');
  };

  const handleDelete = async (id) => {
    if (deletingId === id) return;
    if (!confirm('Are you sure you want to permanently delete this document?')) return;

    setDeletingId(id);
    try {
      const token = await getToken();
      if (!token) throw new Error('No authentication token found');
      await deleteDocument(id, token);
      loadDocuments();
    } catch (err) {
      console.error('Delete failed:', err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (!isLoaded) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-600"></div>
    </div>
  );

  if (!isSignedIn) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6 text-center">
      <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mb-6">
        <Lock className="w-10 h-10 text-sky-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Vault Locked</h2>
      <p className="text-slate-600 mb-8 max-w-md">Please sign in to access your secure document wallet and manage your travel papers.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* 🚀 Top Marquee */}
      <div className="bg-sky-600 text-white overflow-hidden shadow-lg mb-8">
        <CurvedLoop
          marqueeText="ONE UPLOAD. ENDLESS JOURNEYS. ✦ PASSPORT READY. ADVENTURE AWAITS. ✦ SECURE DOCS. TRAVEL LIGHT. ✦ YOUR VISA. OUR VAULT. ✦ UPLOAD NOW. WANDER FREELY. ✦"
          speed={1.5}
          curveAmount={0}
          className="text-white/90 tracking-tighter"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-sky-600 rounded-lg shadow-lg shadow-sky-200">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Travel Wallet</h1>
            </div>
            <p className="text-slate-600">Secure storage for your travel documentation</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowUploadModal(true)}
            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold shadow-xl shadow-slate-200 transition-all hover:bg-slate-800"
          >
            <Plus className="w-5 h-5" />
            New Document
          </motion.button>
        </header>

        {/* Stats & Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-600">Secure Vault</p>
              <h3 className="text-lg font-bold text-slate-900">256-bit Encrypted</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
            <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center">
              <Cloud className="w-6 h-6 text-sky-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-sky-600">Total Files</p>
              <h3 className="text-lg font-bold text-slate-900">{docs.length} Documents</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-600">Verified Access</p>
              <h3 className="text-lg font-bold text-slate-900">{user?.firstName || 'User'}</h3>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <AnimatePresence mode="popLayout">
          {docs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {docs.map((doc) => (
                <ElectricBorder
                  key={doc._id}
                  color="#7df9ff"
                  speed={1}
                  chaos={0.08}
                  borderRadius={24}
                >
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group bg-white rounded-3xl border border-slate-100 shadow-sm transition-all overflow-hidden"
                  >
                    <div
                      onClick={() => doc.url && window.open(doc.url, '_blank')}
                      className="aspect-[4/3] bg-slate-50 relative overflow-hidden flex items-center justify-center cursor-pointer"
                    >
                      {doc.url?.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
                        <img
                          src={doc.url}
                          alt={doc.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center">
                            <FileText className="w-8 h-8 text-sky-600" />
                          </div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Digital Document</span>
                        </div>
                      )}
                      <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(doc._id);
                          }}
                          disabled={deletingId === doc._id}
                          className="p-2.5 bg-white/95 backdrop-blur-sm text-rose-600 rounded-xl shadow-lg hover:bg-rose-600 hover:text-white transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h4 className="font-bold text-slate-900 truncate flex-1">{doc.name}</h4>
                        <span className="px-2.5 py-1 bg-sky-50 text-sky-700 text-[10px] font-black uppercase tracking-wider rounded-md">
                          {doc.type}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                        <span>Ref: #{doc._id.slice(-6).toUpperCase()}</span>
                        <div className="flex gap-3">
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1"
                          >
                            View
                          </a>
                          <span className="text-slate-200">|</span>
                          <a
                            href={doc.url}
                            download={doc.name}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-slate-500 hover:text-slate-700 font-bold"
                          >
                            Download
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </ElectricBorder>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-200"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No documents yet</h3>
              <p className="text-slate-500 max-w-sm">Upload your first travel document like a passport or visa to get started with your secure wallet.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 🔮 Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-[11000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !loading && setShowUploadModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Add New Doc</h3>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <Plus className="rotate-45" />
                  </button>
                </div>

                <form onSubmit={handleUpload} className="space-y-6">
                  {/* File Upload Area */}
                  <div className="relative group">
                    <input
                      type="file"
                      id="file-upload"
                      required
                      onChange={(e) => setFile(e.target.files[0])}
                      className="hidden"
                    />
                    <label
                      htmlFor="file-upload"
                      className={`
                        relative flex flex-col items-center justify-center w-full min-h-[160px] 
                        rounded-3xl border-2 border-dashed cursor-pointer transition-all gap-3 overflow-hidden
                        ${file ? 'border-sky-500 bg-sky-50' : 'border-slate-200 hover:border-sky-400 hover:bg-slate-50/50'}
                      `}
                    >
                      {file ? (
                        <div className="flex flex-col items-center text-center p-4">
                          <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-2">
                            <CheckCircle2 className="w-6 h-6 text-sky-600" />
                          </div>
                          <p className="text-sm font-bold text-slate-900 max-w-[200px] truncate">{file.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">Click to change file</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-slate-100 group-hover:bg-sky-100 rounded-xl flex items-center justify-center mb-2 transition-colors">
                            <Upload className="w-6 h-6 text-slate-400 group-hover:text-sky-600" />
                          </div>
                          <p className="text-sm font-bold text-slate-900">Select Document</p>
                          <p className="text-[10px] text-slate-400 font-medium">PDF, JPG, PNG (Max 10MB)</p>
                        </div>
                      )}
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Title</label>
                      <input
                        type="text"
                        required
                        value={name}
                        placeholder="My Passport"
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all font-medium text-slate-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Type</label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all font-medium text-slate-700 appearance-none cursor-pointer"
                      >
                        {docTypes.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {type === 'Other' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-2"
                    >
                      <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Specify Category</label>
                      <input
                        type="text"
                        placeholder="Custom Document Type"
                        value={customType}
                        onChange={(e) => setCustomType(e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-sky-500 underline focus:border-sky-500 outline-none transition-all font-medium text-slate-700"
                      />
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !file || !name}
                    className="w-full py-5 bg-sky-600 hover:bg-sky-700 text-white rounded-3xl font-black text-lg shadow-xl shadow-sky-200 transition-all disabled:opacity-50 disabled:shadow-none mt-2 active:scale-[0.98]"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Uploading...</span>
                      </div>
                    ) : (
                      'Safeguard Document'
                    )}
                  </button>
                </form>

                <div className="mt-6 flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <Info className="w-5 h-5 text-sky-600 mt-0.5" />
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Your documents are stored securely using industry-standard encryption. Only you have access to these files through your verified account.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
