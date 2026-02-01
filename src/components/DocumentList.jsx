import { Download, Trash2 } from 'lucide-react';

export default function DocumentList({ docs, onDelete }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {docs.map(doc => (
        <div key={doc._id} className="bg-white p-6 rounded-xl shadow-lg border">
          <h3 className="font-semibold text-lg mb-2">{doc.name}</h3>
          <p className="text-sm text-gray-500 mb-4">Type: {doc.type}</p>
          
          {/* 👈 FIXED: download={doc.name} forces PDF save */}
          <a 
            href={doc.url} 
            download={doc.name}  // 👈 THIS FIXES PDF "Failed to load"
            target="_blank" 
            rel="noopener noreferrer" 
            className="block mb-4 p-2 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download size={20} />
            <span>Download {doc.type.toLowerCase().includes('pdf') ? 'PDF' : 'File'}</span>
          </a>
          
          <button
            onClick={() => onDelete(doc._id)}
            className="text-red-500 hover:text-red-700 flex items-center gap-2 p-2 rounded-lg hover:bg-red-50 w-full justify-center transition-all"
          >
            <Trash2 size={20} />
            <span>Delete</span>
          </button>
        </div>
      ))}
      {docs.length === 0 && (
        <div className="col-span-full text-center py-12 text-gray-500 bg-gray-50 rounded-xl">
          <p className="text-lg mb-4">No documents yet</p>
          <p>Upload your first travel document like passport or visa!</p>
        </div>
      )}
    </div>
  );
}
