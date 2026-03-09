'use client';

import { useAppDispatch } from '@/store/hooks';
import { setSidebarPanel } from '@/store/slices/portfolioSlice';

const email = ['mail', 'davidamberg.de'].join('@');

export default function AboutPanel() {
  const dispatch = useAppDispatch();
  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-6 border-b border-white/40">
        <button
          onClick={() => dispatch(setSidebarPanel('default'))}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors mb-8 block"
        >
          ← back
        </button>
        <h1 className="text-2xl font-light text-gray-700">David Amberg</h1>
      </div>

      <div className="p-6">
        <a
          href={`mailto:${email}`}
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          {email}
        </a>
      </div>
    </div>
  );
}
