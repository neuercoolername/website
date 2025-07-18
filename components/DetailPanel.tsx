'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closeDetailPanel } from '@/store/slices/portfolioSlice';
import { addMessage } from '@/store/slices/consoleSlice';

export default function DetailPanel() {
  const dispatch = useAppDispatch();
  const { selectedProject } = useAppSelector(state => state.portfolio);

  const handleClose = () => {
    dispatch(closeDetailPanel());
    dispatch(addMessage({
      content: 'Detail panel closed',
      type: 'interaction'
    }));
  };

  if (!selectedProject) return null;

  return (
    <div className={`
      w-full h-full transition-all duration-300
      ${selectedProject ? 'block' : 'hidden'}
    `}>
      {/* Header */}
      <div className="p-6 border-b border-white/40">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-medium text-gray-800 leading-tight">
            {selectedProject.title}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          {selectedProject.meta}
        </p>
        <div className="flex flex-wrap gap-2">
          {selectedProject.tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-gray-100/80 text-gray-600 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {selectedProject.description}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Links</h3>
            <div className="space-y-2">
              {selectedProject.links.map((link: string, index: number) => (
                <button
                  key={index}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100/50 rounded transition-colors"
                >
                  {link} →
                </button>
              ))}
            </div>
          </div>

          {/* Related Projects */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Related Projects</h3>
            <div className="space-y-2">
              {selectedProject.related.map((related: string, index: number) => (
                <div
                  key={index}
                  className="px-3 py-2 text-sm text-gray-600 bg-gray-50/50 rounded"
                >
                  {related}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}