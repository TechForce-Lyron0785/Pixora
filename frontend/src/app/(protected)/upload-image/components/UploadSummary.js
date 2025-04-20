"use client"
import { HelpCircle } from 'lucide-react';

const UploadSummary = ({ 
  files, 
  imageDetails, 
  selectedVisibility, 
  categories, 
  licenses 
}) => {
  return (
    <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6">
      <h3 className="font-medium mb-4">Upload Summary</h3>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Files Selected:</span>
          <span>{files.length}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Total Size:</span>
          <span>
            {files.length > 0
              ? `${files.reduce((total, file) => total + parseFloat(file.size), 0).toFixed(2)} MB`
              : '0 MB'}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Category:</span>
          <span>
            {imageDetails.category
              ? categories.find(c => c.id === imageDetails.category)?.name
              : 'Not selected'}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">License:</span>
          <span>
            {imageDetails.license
              ? licenses.find(l => l.id === imageDetails.license)?.name
              : 'Not selected'}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Visibility:</span>
          <span className="capitalize">{selectedVisibility}</span>
        </div>
      </div>

      <div className="border-t border-white/10 pt-4 pb-2">
        <h4 className="text-sm font-medium mb-3">Upload Progress</h4>

        {files.map((file, index) => (
          <div key={index} className="mb-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-400 truncate max-w-[180px]">{file.name}</span>
              <span>{file.progress}%</span>
            </div>

            <div className="w-full bg-zinc-800 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full ${file.error
                  ? 'bg-red-500'
                  : file.uploaded
                    ? 'bg-green-500'
                    : 'bg-violet-500'
                  }`}
                style={{ width: `${file.progress}%` }}
              ></div>
            </div>

            {file.error && (
              <p className="text-xs text-red-400 mt-1">{file.error}</p>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 pt-4 mt-4">
        <h4 className="text-sm font-medium mb-3">Need Help?</h4>
        <div className="text-sm text-gray-400">
          <p className="mb-2">
            If you&apos;re having trouble uploading your images, check out our
            <a href="#" className="text-violet-400 hover:text-violet-300 ml-1">upload guide</a>.
          </p>
          <p>
            Still need assistance?
            <a href="#" className="text-violet-400 hover:text-violet-300 ml-1">Contact support</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadSummary; 