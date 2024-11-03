import { Score } from '../types/argument';

interface Props {
  label: string;
  score: Score;
}

export const ScoreIndicator: React.FC<Props> = ({ label, score }) => {
  const getScoreColor = (value: number) => {
    if (value >= 0.8) return 'bg-green-500';
    if (value >= 0.6) return 'bg-blue-500';
    if (value >= 0.4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="font-semibold">{label}</span>
        <span className="text-sm">{(score.value * 100).toFixed(0)}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full">
        <div 
          className={`h-full rounded-full ${getScoreColor(score.value)}`}
          style={{ width: `${score.value * 100}%` }}
        />
      </div>
      <p className="text-sm text-gray-600 mt-1">{score.reason}</p>
    </div>
  );
};
