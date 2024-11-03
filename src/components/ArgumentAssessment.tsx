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

  const [showContext, setShowContext] = useState(false);

  const renderContext = () => {
    if (!argument.context) return null;
    const { text, startIndex, endIndex } = argument.context;
    const before = text.slice(0, startIndex);
    const highlighted = text.slice(startIndex, endIndex);
    const after = text.slice(endIndex);

    return (
      <div className="p-4 bg-gray-100 rounded-lg mt-4">
        <h5 className="font-bold">Context</h5>
        <p>
          {before}
          <span className="bg-yellow-200">{highlighted}</span>
          {after}
        </p>
      </div>
    );
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
          <p className="text-gray-700">{argument.assertion}</p>
          <div className="flex gap-2">
            {argument.tags?.length > 0 ? 
              argument.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-200 rounded-full text-sm">
                  {tag}
                </span>
              )) : 
              <span className="px-2 py-1 bg-gray-200 rounded-full text-sm">
                Uncategorized
              </span>
            }
          </div>
        </div>

        {argument.context && (
          <button
            onClick={() => setShowContext(!showContext)}
            className="text-blue-500 text-sm hover:underline"
          >
            {showContext ? 'Hide Context' : 'Show Context'}
          </button>
        )}

        {showContext && renderContext()}

        {argument.assessment && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <ScoreIndicator label="Overall Strength" score={argument.assessment.overallScore} />
            <ScoreIndicator label="Assertion" score={argument.assessment.aScore} />
            <ScoreIndicator label="Reasoning" score={argument.assessment.rScore} />
            <ScoreIndicator label="Evidence" score={argument.assessment.eScore} />
            <ScoreIndicator label="Significance" score={argument.assessment.sScore} />
          </div>
        )}

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
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            Edit
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Save
          </button>
        </div>

        {debateThread?.map((counter, index) => (
          <div key={index} className="p-4 bg-purple-50 rounded-lg ml-8 border-l-4 border-purple-300">
            <h4 className="font-bold">Counter-Argument {index + 1}</h4>
            <p className="text-gray-700">{counter.assertion}</p>
            <div className="flex gap-2">
              {counter.tags?.length > 0 ? 
                counter.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-200 rounded-full text-sm">
                    {tag}
                  </span>
                )) : 
                <span className="px-2 py-1 bg-gray-200 rounded-full text-sm">
                  Uncategorized
                </span>
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
