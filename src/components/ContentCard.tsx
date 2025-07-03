// src/components/ContentCard.tsx
import { ThumbsUp, Image as ImageIcon, FileText, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import type { AIContent } from '../types/index'; // Assicurati di avere questo tipo o definiscilo qui

// Se non hai un file types/index.ts, puoi definire i tipi qui:
// type AIContent = {
//   id: number;
//   user_id: string;
//   content_type: 'IMAGE' | 'VIDEO' | 'POST';
//   prompt: string;
//   generated_url: string | null;
//   generated_text: string | null;
//   ai_strategy_plan: string;
//   votes: number;
//   user: { display_name: string; avatar_url: string; };
// };

interface ContentCardProps {
  content: AIContent;
  onVote: (contentId: number) => Promise<void>;
  currentUserUid: string | null;
}

export default function ContentCard({ content, onVote, currentUserUid }: ContentCardProps) {
  const isOwner = currentUserUid === content.user_id;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-200"
    >
      {content.content_type === 'IMAGE' && content.generated_url && (
        <img src={content.generated_url} alt={content.prompt} className="w-full h-48 object-cover" />
      )}
      {content.content_type === 'VIDEO' && content.generated_url && (
        <video controls src={content.generated_url} className="w-full h-48 object-cover"></video>
      )}
      {content.content_type === 'POST' && content.generated_text && (
        <div className="p-4 bg-gray-900 h-48 overflow-y-auto">
          <p className="text-gray-300 text-sm whitespace-pre-wrap">{content.generated_text}</p>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
          {content.content_type === 'IMAGE' && <ImageIcon className="h-4 w-4" />}
          {content.content_type === 'POST' && <FileText className="h-4 w-4" />}
          {content.content_type === 'VIDEO' && <Video className="h-4 w-4" />}
          <span className="capitalize">{content.content_type.toLowerCase()}</span>
        </div>
        <p className="font-semibold text-white mb-2 line-clamp-2">{content.prompt}</p>
        <div className="flex items-center text-sm text-gray-400 mb-4">
          <img src={content.user.avatar_url || '/default-avatar.png'} alt={content.user.display_name} className="w-6 h-6 rounded-full mr-2" />
          <span>{content.user.display_name}</span>
        </div>
        <div className="flex justify-between items-center">
          <button
            onClick={() => onVote(content.id)}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              isOwner ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
            disabled={isOwner}
          >
            <ThumbsUp size={16} /> {content.votes}
          </button>
        </div>
      </div>
    </motion.div>
  );
}