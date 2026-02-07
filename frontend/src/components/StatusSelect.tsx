import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface StatusOption {
  value: string;
  labelKey: string;
  color: string;
}

const STATUS_OPTIONS: StatusOption[] = [
  { value: 'All Status', labelKey: 'filters.allStatus', color: 'bg-gray-400' },
  { value: 'Received', labelKey: 'mailStatus.received', color: 'bg-blue-500' },
  { value: 'Pending', labelKey: 'mailStatus.pending', color: 'bg-yellow-500' },
  { value: 'Notified', labelKey: 'mailStatus.notified', color: 'bg-purple-500' },
  { value: 'Picked Up', labelKey: 'mailStatus.pickedUp', color: 'bg-green-500' },
  { value: 'Scanned Document', labelKey: 'mailStatus.scanned', color: 'bg-cyan-500' },
  { value: 'Forward', labelKey: 'mailStatus.forward', color: 'bg-orange-500' },
  { value: 'Abandoned Package', labelKey: 'mailStatus.abandonedPackage', color: 'bg-red-500' },
  { value: 'Resolved', labelKey: 'mailStatus.resolved', color: 'bg-slate-500' },
];

interface StatusSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function StatusSelect({ value, onChange, className = '' }: StatusSelectProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const selectedOption = STATUS_OPTIONS.find(opt => opt.value === value) || STATUS_OPTIONS[0];

  const handleSelect = (option: StatusOption) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-between gap-2"
      >
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${selectedOption.color}`} />
          <span>{t(selectedOption.labelKey)}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option)}
              className={`w-full px-4 py-2.5 flex items-center gap-2 hover:bg-gray-50 transition-colors text-left ${
                option.value === value ? 'bg-gray-50' : ''
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${option.color}`} />
              <span className="text-gray-700">{t(option.labelKey)}</span>
              {option.value === value && (
                <span className="ml-auto text-green-600">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
