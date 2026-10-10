import React from 'react';
import { File, Download, CheckCircle, XCircle, Loader, ShieldCheck } from 'lucide-react';

const FileTransferProgress = ({ transfer }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusIcon = () => {
    if (transfer.verified === true) {
      return <CheckCircle size={17} className="text-emerald-400" />;
    }
    if (transfer.verified === false) {
      return <XCircle size={17} className="text-red-400" />;
    }
    return <Loader size={17} className="text-amber-400 animate-spin" />;
  };

  return (
    <div className="px-4 py-3 bg-slate-900 border border-slate-800 rounded-md mb-2 shadow-sm">
      <div className="flex items-center space-x-3.5">
        <div className="w-9 h-9 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
          <File size={18} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs sm:text-sm font-semibold text-slate-100 truncate">
              {transfer.fileName}
            </span>
            {getStatusIcon()}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-sm h-1.5 mb-1.5 overflow-hidden">
            <div
              className={`h-full rounded-sm transition-all duration-300 ${
                transfer.verified === true
                  ? 'bg-emerald-400'
                  : transfer.verified === false
                  ? 'bg-red-400'
                  : 'bg-amber-400'
              }`}
              style={{ width: `${transfer.progress}%` }}
            />
          </div>

          {/* Progress Details */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>
              {transfer.receiving ? 'Receiving' : 'Streaming'}: {Math.round(transfer.progress)}%
            </span>
            <span>
              {transfer.chunksReceived || transfer.chunksSent} / {transfer.totalChunks} chunks (16KB)
            </span>
          </div>

          {/* Verification Status */}
          {transfer.verified === true && (
            <div className="mt-1.5 text-[11px] text-emerald-400 flex items-center space-x-1 font-mono">
              <ShieldCheck size={13} />
              <span>P2P SHA-256 Checksum Verified</span>
            </div>
          )}

          {transfer.verified === false && (
            <div className="mt-1.5 text-[11px] text-red-400 flex items-center space-x-1 font-mono">
              <XCircle size={13} />
              <span>Integrity Verification Failed</span>
            </div>
          )}
        </div>

        {/* Download Button */}
        {transfer.verified === true && transfer.blob && typeof transfer.onDownload === 'function' && (
          <button
            onClick={transfer.onDownload}
            className="p-2 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold transition-colors cursor-pointer flex-shrink-0 active:translate-y-[1px]"
            title="Download verified file"
          >
            <Download size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default FileTransferProgress;
