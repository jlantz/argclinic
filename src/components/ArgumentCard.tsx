/*
 * Copyright (C) 2024 Jason Lantz
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { useState } from 'react';
import { Argument } from '../types/argument';
import { ScoreIndicator } from './ArgumentScoring';

interface Props {
  argument: Argument;
  originalText: string;
  onCreateCounter: () => void;
  onEdit: () => void;
  onSave: () => void;
  isFiltered?: boolean;
}

export const ArgumentCard: React.FC<Props> = ({
  argument,
  originalText,
  onCreateCounter,
  onEdit,
  onSave,
  isFiltered = false
}) => {
  // ...existing useState and renderContext code...

  return (
    <div className={`p-4 rounded-lg border ${
      isFiltered ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col gap-2">
          <h4 className="font-bold text-lg">Original Argument</h4>
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
      </div>

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

      <div className="mt-4 flex justify-end">
        <button
          onClick={onCreateCounter}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Counter This Argument
        </button>
      </div>
    </div>
  );
};
