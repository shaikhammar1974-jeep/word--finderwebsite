import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  title?: string;
  items: FaqItem[];
  className?: string;
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  title = 'Frequently Asked Questions',
  items,
  className = ''
}) => {
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const toggle = (idx: number) => {
    setOpenIndices(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <section className={`py-8 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
          <HelpCircle className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => {
          const isOpen = openIndices.includes(idx);
          return (
            <div
              key={idx}
              className="border border-slate-200 bg-white rounded-xl overflow-hidden transition-all duration-200 hover:border-slate-300"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
                className="w-full px-5 py-4 text-left font-semibold text-slate-800 flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <span className="text-base sm:text-lg">{item.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-slate-600 leading-relaxed text-sm sm:text-base border-t border-slate-100">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
