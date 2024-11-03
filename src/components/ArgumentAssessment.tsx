import { Argument } from '../types/argument';

interface Props {
  argument: Argument;
  category: string;
  debateThread?: Argument[];
  onCreateCounter: () => void;
  onEdit: () => void;
  onSave: () => void;
  isLoading?: boolean;
}

export const ArgumentAssessment: React.FC<Props> = ({
  argument,
  category,
  debateThread,
  onCreateCounter,
  onEdit,
  onSave,
  isLoading = false
}) => {
  const getQualityEmoji = (strength: number) => {
    if (strength > 0.8) return '🌟';
    if (strength > 0.6) return '💪';
    if (strength > 0.4) return '👍';
    return '⚠️';
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          {category || 'Uncategorized'} {getQualityEmoji(argument.certainty)}
        </span>
        {debateThread && (
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
            🗣️ {debateThread.length} Responses
          </span>
        )}
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold">Original Argument</h3>
          {/* Existing argument content */}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCreateCounter}
            disabled={isLoading}
            className={`px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? '⏳ Processing...' : '🗣️ Counter This Argument'}
          </button>
          {/* Existing buttons */}
        </div>

        {debateThread?.map((counter, index) => (
          <div key={index} className="p-4 bg-purple-50 rounded-lg ml-8 border-l-4 border-purple-300">
            <h4 className="font-bold">Counter-Argument {index + 1}</h4>
            {/* Counter argument content */}
          </div>
        ))}
      </div>
    </div>
  );
};
