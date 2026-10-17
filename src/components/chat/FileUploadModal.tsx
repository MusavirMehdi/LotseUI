import React, { useState, useRef } from 'react';
import { X, Upload, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../../api/client';

export interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (uploadId: string, fileName: string, kind: string) => void;
}

const DOCUMENT_KINDS = [
  { value: 'degree', label: 'University Degree / Diploma', desc: 'Bachelor or Master degree certificate' },
  { value: 'marksheet', label: 'Marksheet / Transcripts', desc: 'Semester marksheets or Class 12 certificates' },
  { value: 'language_certificate', label: 'Language Certificate', desc: 'Goethe, TestDaF, IELTS or TOEFL score report' },
  { value: 'experience_letter', label: 'Work Experience Letter', desc: 'Official employment proof or service certificate' },
  { value: 'cv', label: 'Curriculum Vitae (CV)', desc: 'Current resume in German or English' },
];

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [kind, setKind] = useState<string>('degree');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds the 5MB limit.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const res = await api.uploadFile(selectedFile, kind);
      onUploadSuccess(res.id, selectedFile.name, kind);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Upload failed. Please ensure file is valid PDF, PNG, or JPEG.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-[var(--surface-card)] border border-[var(--border-strong)] rounded-2xl p-6 shadow-2xl text-[var(--text-primary)]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close upload modal"
          className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-950 dark:text-white">Upload Document for Verification</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Verified documents take highest authority in LOTSE qualification rules.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Document Kind Selector */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Select Document Category
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DOCUMENT_KINDS.map((k) => (
                <button
                  key={k.value}
                  type="button"
                  onClick={() => setKind(k.value)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    kind === k.value
                      ? 'border-blue-600 bg-blue-500/10 text-zinc-950 dark:text-white'
                      : 'border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-zinc-600 dark:text-zinc-400 hover:border-black/20 dark:hover:border-white/20'
                  }`}
                >
                  <div className="text-xs font-semibold">{k.label}</div>
                  <div className="text-[11px] text-zinc-500 mt-0.5 leading-snug">{k.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* File Picker Drop Area */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Document File (PDF, PNG, JPG, max 5MB)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
              onChange={handleFileChange}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[var(--border-strong)] hover:border-blue-500 rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[var(--surface-elevated)]/50"
            >
              {selectedFile ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <FileText className="w-5 h-5" />
                  <span>{selectedFile.name}</span>
                  <span className="text-zinc-400">({(selectedFile.size / 1024).toFixed(0)} KB)</span>
                </div>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-zinc-400 mb-1.5" />
                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Click to browse files
                  </span>
                  <span className="text-[11px] text-zinc-400 mt-0.5">
                    Supported: PDF, PNG, JPEG (Validated via magic bytes)
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="px-4 py-2 rounded-xl text-xs font-medium border border-[var(--border-subtle)] text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="px-5 py-2 rounded-xl text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Upload & Extract</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
