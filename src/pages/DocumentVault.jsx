import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { FolderOpen, Download, Trash2, Upload } from 'lucide-react';
import { getDocuments, uploadDocument, deleteDocument } from '../services/documentService';
import DocumentList from '../components/DocumentList.jsx';

const documentTypes = [
  'Passport',
  'Visa',
  'Flight Ticket',
  'Hotel Booking',
  'Travel Insurance',
  'Itinerary',
  'Vaccination',
  'Event Ticket',
  'Other'
];

export default function DocumentVault() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [docs, setDocs] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('Passport');
  const [customType, setCustomType] = useState('');  // 👈 RENAMED: Clearer
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

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

  const handleUpload = async () => {
    if (!file || !name) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    // 👈 FIXED: Use customType when "Other" selected
    formData.append('type', type === 'Other' ? customType || name : type);
    try {
      const token = await getToken();
      if (!token) throw new Error('No authentication token found');
      await uploadDocument(formData, token);
      loadDocuments();
      setName('');
      setFile(null);
      setCustomType('');  // 👈 Clear custom type
      setType('Passport');
    } catch (err) {
      console.error('Upload Error:', err);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (deletingId === id) return;
    if (!confirm('Delete this document?')) return;

    setDeletingId(id);
    try {
      const token = await getToken();
      if (!token) throw new Error('No authentication token found');
      await deleteDocument(id, token);
      loadDocuments();
    } catch (err) {
      console.error('Delete failed:', err.message);
      alert('Delete failed: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };


  if (!isLoaded) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!isSignedIn) return <div className="flex items-center justify-center min-h-screen text-gray-600">Please sign in to access Document Wallet.</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex items-center gap-4 mb-8">
        <FolderOpen className="w-12 h-12 text-emerald-500" />
        <div>
          <h1 className="text-3xl font-bold">Document Wallet</h1>
          <p className="text-gray-600">Welcome, {user?.firstName || user?.emailAddresses?.[0]?.emailAddress}!</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Upload size={20} className="text-emerald-500" />
          Upload Document
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 👈 Document Type Dropdown */}
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              if (e.target.value !== 'Other') setCustomType('');  // 👈 Clear when not Other
            }}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            {documentTypes.map(t => <option key={t}>{t}</option>)}
          </select>

          {/* 👈 FIXED: Shows ONLY when "Other" selected + "Document Type" placeholder */}
          {type === 'Other' && (
            <input
              placeholder="Document Type"  // 👈 CHANGED: Clearer label
              value={customType}
              onChange={(e) => setCustomType(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          )}

          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            accept="image/*,.pdf,.doc,.docx"
            className="p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-emerald-500 file:text-white hover:file:bg-emerald-600"
          />

          <div className="md:col-span-1 flex gap-2">
            <input
              placeholder="Document name"  // 👈 Separate from type
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg flex-1 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <button
              onClick={handleUpload}
              disabled={!file || !name || (type === 'Other' && !customType)}  // 👈 Validate custom type
              className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Upload
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <DocumentList docs={docs} onDelete={handleDelete} deletingId={deletingId} />
    </div>
  );
}
