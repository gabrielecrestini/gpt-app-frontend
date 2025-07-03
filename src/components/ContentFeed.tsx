// src/components/ContentFeed.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoaderCircle } from 'lucide-react';
import ContentCard from './ContentCard';
import type { AIContent } from '../types/index'; // Assicurati di avere questo tipo o definiscilo qui

type ContentTypeFilter = 'ALL' | 'IMAGE' | 'VIDEO' | 'POST';

interface ContentFeedProps {
  feed: AIContent[];
  isLoadingFeed: boolean;
  onVote: (contentId: number) => Promise<void>;
  currentUserUid: string | null;
}

export default function ContentFeed({ feed, isLoadingFeed, onVote, currentUserUid }: ContentFeedProps) {
  const [filter, setFilter] = useState<ContentTypeFilter>('ALL');

  const filteredFeed = filter === 'ALL' ? feed : feed.filter(item => item.content_type === filter);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
      <h2 className="text-3xl font-bold mb-6">Esplora le Creazioni</h2>

      <div className="flex gap-2 mb-8">
        {(['ALL', 'IMAGE', 'POST', 'VIDEO'] as const).map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filter === type ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            {type.charAt(0) + type.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {isLoadingFeed ? (
        <div className="flex justify-center items-center h-64">
          <LoaderCircle className="animate-spin h-12 w-12" />
        </div>
      ) : (
        <div className="masonry-grid">
          <AnimatePresence>
            {filteredFeed.length > 0 ? (
              filteredFeed.map(content => (
                <ContentCard key={content.id} content={content} onVote={onVote} currentUserUid={currentUserUid} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-500 py-10 col-span-full"
              >
                Nessun contenuto disponibile per questa categoria.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}