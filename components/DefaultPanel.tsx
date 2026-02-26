'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectTag } from '@/store/slices/portfolioSlice';

export default function DefaultPanel() {
  const dispatch = useAppDispatch();
  const { projects } = useAppSelector((state) => state.projects);
  const { selectedTag } = useAppSelector((state) => state.portfolio);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    if (projects && projects.length > 0) {
      const tags = [...new Set(projects.flatMap((p) => p.tags))];
      setAllTags(tags.sort());
    }
  }, [projects]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-6 border-b border-white/40">
        <h1 className="text-2xl font-light text-gray-700">David Amberg</h1>
      </div>
      test
      <div className="p-4 border-b border-white/40">
        <div className="space-y-1">
          <button className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100/50 rounded transition-colors">
            About →
          </button>
          <button className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100/50 rounded transition-colors">
            Imprint →
          </button>
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => dispatch(selectTag(selectedTag === tag ? null : tag))}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  selectedTag === tag
                    ? 'bg-gray-800 text-white border-gray-800'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
