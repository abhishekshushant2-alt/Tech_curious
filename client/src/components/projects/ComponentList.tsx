import React from 'react';
import { ExternalLink, Cpu, ShoppingCart } from 'lucide-react';
import { ComponentItem } from '../../lib/types';

interface ComponentListProps {
  components: ComponentItem[];
}

export const ComponentList: React.FC<ComponentListProps> = ({ components }) => {
  if (!components || components.length === 0) return null;

  return (
    <div className="rounded-2xl bg-white dark:bg-dark-surface border border-black/[0.06] dark:border-white/[0.07] overflow-hidden shadow-sm">
      <div className="p-4 sm:p-5 border-b border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-brand-500" />
          <h3 className="text-sm sm:text-base font-display font-bold text-slate-950 dark:text-white">
            Bill of Materials (BOM)
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">{components.length} items</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 dark:bg-dark-elevated/70 text-slate-400 uppercase tracking-wider text-[10px] font-mono border-b border-black/[0.05] dark:border-white/[0.06]">
            <tr>
              <th className="py-2.5 px-4 sm:px-6">Component</th>
              <th className="py-2.5 px-4 text-center">Qty</th>
              <th className="py-2.5 px-4 sm:px-6 text-right">Source Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
            {components.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-dark-elevated/40 transition-colors">
                <td className="py-3 px-4 sm:px-6 font-medium text-slate-900 dark:text-zinc-200">
                  {item.name}
                </td>
                <td className="py-3 px-4 text-center font-mono text-slate-500 text-xs">
                  {item.quantity}
                </td>
                <td className="py-3 px-4 sm:px-6 text-right">
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      <span>Buy Part</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-400">Standard</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
