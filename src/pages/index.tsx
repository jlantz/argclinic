import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { Argument, DebateFormat, ParsedArgumentsResponse, ArgumentGroup } from '../types/argument';
import axios from 'axios';
import { saveAs } from 'file-saver'; // Replace the dynamic import with this direct import
import { ArgumentAssessment } from '../components/ArgumentAssessment';
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function Home() {
  const [activeFormat, setActiveFormat] = useState<DebateFormat>('Policy');
  const [argumentInput, setArgumentInput] = useState('');
  const [resolutionInput, setResolutionInput] = useState(''); // Add resolution state
  const [parsedArguments, setParsedArguments] = useState<Argument[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editedArgument, setEditedArgument] = useState<Argument | null>(null);
  
  // Add start and end date states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Add state to handle new resolution input
  const [isNewResolution, setIsNewResolution] = useState(false);
  const [newResolution, setNewResolution] = useState('');

  const [debateThreads, setDebateThreads] = useState<Record<string, Argument[]>>({});
  const [argumentCategories, setArgumentCategories] = useState<Record<string, string>>({});

  // Define existing resolutions for each format
  const resolutions: Record<DebateFormat, string[]> = {
    Policy: [
      'The United States federal government should substantially increase its expenditure on education.',
      'The government should implement universal basic income.',
    ],
    LD: [
      'Resolved: The United States federal government should substantially increase its expenditure on education.',
      'Resolved: The government should implement universal basic income.',
    ],
    'Public Forum': [
      'Resolved: The United States federal government should substantially increase its expenditure on education.',
      'Resolved: The government should implement universal basic income.',
    ],
    MSPDP: [
      'Resolved: The United States federal government should substantially increase its expenditure on education.',
      'Resolved: The government should implement universal basic income.',
    ],
  };

  const [isLoading, setIsLoading] = useState(false);
  const [showFilteredArguments, setShowFilteredArguments] = useState(false);
  const [argumentGroups, setArgumentGroups] = useState<ArgumentGroup[]>([]);
  const [filteredArguments, setFilteredArguments] = useState<Argument[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Add grouping logic
  const groupArguments = (args: Argument[]) => {
    const groups: Record<string, ArgumentGroup> = {};
    const filtered: Argument[] = [];

    args.forEach(arg => {
      if (arg.relevance >= 0.6) {
        if (!groups[arg.topic]) {
          groups[arg.topic] = {
            topic: arg.topic,
            relevance: arg.relevance,
            arguments: []
          };
        }
        groups[arg.topic].arguments.push(arg);
      } else {
        filtered.push(arg);
      }
    });

    setArgumentGroups(Object.values(groups).sort((a, b) => b.relevance - a.relevance));
    setFilteredArguments(filtered);
  };

  const validateInput = () => {
    const errors: Record<string, string> = {};
    
    if (!argumentInput.trim()) {
      errors.text = 'Please enter your argument text';
    }
    
    const resolutionToUse = isNewResolution ? newResolution : resolutionInput;
    if (!resolutionToUse.trim()) {
      errors.resolution = 'Please select or enter a resolution';
    }
    
    if (!activeFormat) {
      errors.format = 'Please select a debate format';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleParseArgument = async () => {
    if (!validateInput()) {
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);
      setFieldErrors({});

      const resolutionToUse = isNewResolution ? newResolution : resolutionInput;
      const response = await axios.post<ParsedArgumentsResponse>('/api/parse-argument', { 
        text: argumentInput,
        format: activeFormat,
        resolution: resolutionToUse,
        startDate,
        endDate,
      });

      setParsedArguments(response.data.arguments);

      const classification = await axios.post('/api/classify-argument', {
        text: argumentInput,
        resolution: resolutionToUse
      });
      setArgumentCategories(prev => ({
        ...prev,
        [response.data.arguments[0].id]: classification.data.category
      }));

      // Group the arguments after parsing
      groupArguments(response.data.arguments);
    } catch (error) {
      const responseData = error.response?.data;
      if (responseData?.field) {
        setFieldErrors({
          [responseData.field]: responseData.error
        });
      } else {
        setErrorMessage(responseData?.error || 'Failed to parse arguments. Please try again.');
      }
      console.error('Error parsing arguments:', responseData || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMarkdown = (arg: Argument) => {
    try {
      const markdownContent = `
# Argument ${arg.id} - ${argumentCategories[arg.id] || 'Uncategorized'}
${debateThreads[arg.id]?.length ? '🗣️ Active Debate Thread' : '💭 Single Argument'}

**Original Argument:**
**Assertion:** ${arg.assertion}
**Reasoning:** ${arg.reasoning}
**Evidence:**
${arg.evidence.map(ev => `- ${ev.content} (${ev.source}, ${ev.date})`).join('\n')}
**Significance:** ${arg.significance}
**Result:** ${arg.result}
**Certainty:** ${arg.certainty * 100}%
**Assessment:**
- **A Strength:** ${arg.assessment?.aStrength || ''}
- **R Strength:** ${arg.assessment?.rStrength || ''}
- **E Strength:** ${arg.assessment?.eStrength || ''}
- **S Strength:** ${arg.assessment?.sStrength || ''}
- **R Weakness:** ${arg.assessment?.rWeakness || ''}

${debateThreads[arg.id]?.map((counterArg, index) => `
## Counter-Argument ${index + 1}
**Assertion:** ${counterArg.assertion}
**Reasoning:** ${counterArg.reasoning}
**Evidence:**
${counterArg.evidence.map(ev => `- ${ev.content} (${ev.source}, ${ev.date})`).join('\n')}
**Significance:** ${counterArg.significance}
**Result:** ${counterArg.result}
**Certainty:** ${counterArg.certainty * 100}%
**Assessment:**
- **A Strength:** ${counterArg.assessment?.aStrength || ''}
- **R Strength:** ${counterArg.assessment?.rStrength || ''}
- **E Strength:** ${counterArg.assessment?.eStrength || ''}
- **S Strength:** ${counterArg.assessment?.sStrength || ''}
- **R Weakness:** ${counterArg.assessment?.rWeakness || ''}
`).join('\n') || ''}
`;
      const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
      saveAs(blob, `argument_${arg.id}.md`);
    } catch (error) {
      console.error('Error saving Markdown:', error);
      setErrorMessage('Failed to save Markdown file.');
    }
  };

  const handleEditArgument = (arg: Argument) => {
    setEditedArgument(arg);
  };

  const handleUpdateArgument = () => {
    if (editedArgument) {
      setParsedArguments(parsedArguments.map(arg => arg.id === editedArgument.id ? editedArgument : arg));
      setEditedArgument(null);
    }
  };

  const handleCreateCounterArgument = async (originalArg: Argument) => {
    try {
      setIsLoading(true);
      const response = await axios.post('/api/create-counter', {
        originalArgument: originalArg,
        resolution: isNewResolution ? newResolution : resolutionInput,
        format: activeFormat
      });
      
      setDebateThreads(prev => ({
        ...prev,
        [originalArg.id]: [...(prev[originalArg.id] || []), response.data.argument]
      }));
    } catch (error) {
      setErrorMessage('Failed to create counter-argument');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">ArgClinic</h1>
      
      <Tabs.Root defaultValue="Policy" value={activeFormat} onValueChange={setActiveFormat}>
        <Tabs.List className="flex border-b mb-4">
          <Tabs.Trigger value="Policy" className="px-4 py-2">Policy</Tabs.Trigger>
          <Tabs.Trigger value="LD" className="px-4 py-2">LD</Tabs.Trigger>
          <Tabs.Trigger value="Public Forum" className="px-4 py-2">Public Forum</Tabs.Trigger>
          <Tabs.Trigger value="MSPDP" className="px-4 py-2">MSPDP</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="Policy">
          <h2 className="text-2xl font-semibold mb-4">Policy Debate Arguments</h2>
          
          {/* Debate Resolution Input with Pill, Dropdown, and New Resolution Option */}
          <div className="mb-4 flex items-center space-x-2">
            {/* Pill Label */}
            <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
              Resolution
            </span>
            {/* Resolution Dropdown */}
            <select
              value={isNewResolution ? 'other' : resolutionInput}
              onChange={(e) => {
                if (e.target.value === 'other') {
                  setIsNewResolution(true);
                  setResolutionInput('');
                } else {
                  setIsNewResolution(false);
                  setResolutionInput(e.target.value);
                  setNewResolution('');
                }
              }}
              className="flex-1 p-2 border rounded"
            >
              <option value="">Select a resolution...</option>
              {resolutions[activeFormat].map((res, index) => (
                <option key={index} value={res}>{res}</option>
              ))}
              <option value="other">Other</option>
            </select>
            {/* Conditionally render new resolution input */}
            {isNewResolution && (
              <input
                type="text"
                value={newResolution}
                onChange={(e) => setNewResolution(e.target.value)}
                className="flex-1 p-2 border rounded"
                placeholder="Enter a new resolution..."
              />
            )}
            {/* Start Date Input */}
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border rounded"
              placeholder="Start Date"
            />
            {/* End Date Input */}
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border rounded"
              placeholder="End Date"
            />
          </div>
          
          {/* Argument Input Form */}
          <div className="mb-4">
            <textarea
              value={argumentInput}
              onChange={(e) => {
                setArgumentInput(e.target.value);
                setFieldErrors(prev => ({ ...prev, text: '' }));
              }}
              className={`w-full p-2 border rounded ${
                fieldErrors.text ? 'border-red-500' : ''
              }`}
              placeholder="Enter your arguments here..."
            />
            {fieldErrors.text && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.text}</p>
            )}
            <button 
              onClick={handleParseArgument} 
              disabled={isLoading}
              className={`mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Processing...' : 'Parse Arguments'}
            </button>
          </div>
          {/* Display Parsed Arguments */}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {Object.entries(fieldErrors).map(([field, error]) => (
            <p key={field} className="text-red-500 text-sm mt-1">
              {error}
            </p>
          ))}
          {isLoading && <LoadingSpinner />}
          {parsedArguments.length > 0 && (
            <div className="mt-4">
              <h3 className="text-2xl font-semibold mb-2">Parsed ARESR Arguments</h3>
              {parsedArguments.map((arg) => (
                <div key={arg.id} className="mb-8 p-6 border rounded-lg shadow-lg bg-white">
                  <ArgumentAssessment 
                    argument={arg}
                    category={argumentCategories[arg.id]}
                    debateThread={debateThreads[arg.id]}
                    onCreateCounter={() => handleCreateCounterArgument(arg)}
                    onEdit={() => handleEditArgument(arg)}
                    onSave={() => handleSaveMarkdown(arg)}
                  />
                </div>
              ))}
            </div>
          )}
        </Tabs.Content>
        
        {/* Add other format content */}
        <Tabs.Content value="LD">
          <h2 className="text-2xl font-semibold mb-4">LD Debate Arguments</h2>
          {/* Similar structure for LD */}
          <div className="mb-4 flex items-center space-x-2">
            <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
              Resolution
            </span>
            <select
              value={isNewResolution ? 'other' : resolutionInput}
              onChange={(e) => {
                if (e.target.value === 'other') {
                  setIsNewResolution(true);
                  setResolutionInput('');
                } else {
                  setIsNewResolution(false);
                  setResolutionInput(e.target.value);
                  setNewResolution('');
                }
              }}
              className="flex-1 p-2 border rounded"
            >
              <option value="">Select a resolution...</option>
              {resolutions[activeFormat].map((res, index) => (
                <option key={index} value={res}>{res}</option>
              ))}
              <option value="other">Other</option>
            </select>
            {isNewResolution && (
              <input
                type="text"
                value={newResolution}
                onChange={(e) => setNewResolution(e.target.value)}
                className="flex-1 p-2 border rounded"
                placeholder="Enter a new resolution..."
              />
            )}
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border rounded"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border rounded"
              placeholder="End Date"
            />
          </div>
          <div className="mb-4">
            <textarea
              value={argumentInput}
              onChange={(e) => {
                setArgumentInput(e.target.value);
                setFieldErrors(prev => ({ ...prev, text: '' }));
              }}
              className={`w-full p-2 border rounded ${
                fieldErrors.text ? 'border-red-500' : ''
              }`}
              placeholder="Enter your arguments here..."
            />
            {fieldErrors.text && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.text}</p>
            )}
            <button 
              onClick={handleParseArgument} 
              disabled={isLoading}
              className={`mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Processing...' : 'Parse Arguments'}
            </button>
          </div>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {Object.entries(fieldErrors).map(([field, error]) => (
            <p key={field} className="text-red-500 text-sm mt-1">
              {error}
            </p>
          ))}
          {isLoading && <LoadingSpinner />}
          {parsedArguments.length > 0 && (
            <div className="mt-4">
              <h3 className="text-2xl font-semibold mb-2">Parsed ARESR Arguments</h3>
              {parsedArguments.map((arg) => (
                <div key={arg.id} className="mb-8 p-6 border rounded-lg shadow-lg bg-white">
                  <ArgumentAssessment 
                    argument={arg}
                    category={argumentCategories[arg.id]}
                    debateThread={debateThreads[arg.id]}
                    onCreateCounter={() => handleCreateCounterArgument(arg)}
                    onEdit={() => handleEditArgument(arg)}
                    onSave={() => handleSaveMarkdown(arg)}
                  />
                </div>
              ))}
            </div>
          )}
        </Tabs.Content>
        <Tabs.Content value="Public Forum">
          <h2 className="text-2xl font-semibold mb-4">Public Forum Debate Arguments</h2>
          {/* Similar structure for Public Forum */}
          <div className="mb-4 flex items-center space-x-2">
            <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
              Resolution
            </span>
            <select
              value={isNewResolution ? 'other' : resolutionInput}
              onChange={(e) => {
                if (e.target.value === 'other') {
                  setIsNewResolution(true);
                  setResolutionInput('');
                } else {
                  setIsNewResolution(false);
                  setResolutionInput(e.target.value);
                  setNewResolution('');
                }
              }}
              className="flex-1 p-2 border rounded"
            >
              <option value="">Select a resolution...</option>
              {resolutions[activeFormat].map((res, index) => (
                <option key={index} value={res}>{res}</option>
              ))}
              <option value="other">Other</option>
            </select>
            {isNewResolution && (
              <input
                type="text"
                value={newResolution}
                onChange={(e) => setNewResolution(e.target.value)}
                className="flex-1 p-2 border rounded"
                placeholder="Enter a new resolution..."
              />
            )}
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border rounded"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border rounded"
              placeholder="End Date"
            />
          </div>
          <div className="mb-4">
            <textarea
              value={argumentInput}
              onChange={(e) => {
                setArgumentInput(e.target.value);
                setFieldErrors(prev => ({ ...prev, text: '' }));
              }}
              className={`w-full p-2 border rounded ${
                fieldErrors.text ? 'border-red-500' : ''
              }`}
              placeholder="Enter your arguments here..."
            />
            {fieldErrors.text && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.text}</p>
            )}
            <button 
              onClick={handleParseArgument} 
              disabled={isLoading}
              className={`mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Processing...' : 'Parse Arguments'}
            </button>
          </div>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {Object.entries(fieldErrors).map(([field, error]) => (
            <p key={field} className="text-red-500 text-sm mt-1">
              {error}
            </p>
          ))}
          {isLoading && <LoadingSpinner />}
          {parsedArguments.length > 0 && (
            <div className="mt-4">
              <h3 className="text-2xl font-semibold mb-2">Parsed ARESR Arguments</h3>
              {parsedArguments.map((arg) => (
                <div key={arg.id} className="mb-8 p-6 border rounded-lg shadow-lg bg-white">
                  <ArgumentAssessment 
                    argument={arg}
                    category={argumentCategories[arg.id]}
                    debateThread={debateThreads[arg.id]}
                    onCreateCounter={() => handleCreateCounterArgument(arg)}
                    onEdit={() => handleEditArgument(arg)}
                    onSave={() => handleSaveMarkdown(arg)}
                  />
                </div>
              ))}
            </div>
          )}
        </Tabs.Content>
        <Tabs.Content value="MSPDP">
          <h2 className="text-2xl font-semibold mb-4">MSPDP Debate Arguments</h2>
          {/* Similar structure for MSPDP */}
          <div className="mb-4 flex items-center space-x-2">
            <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
              Resolution
            </span>
            <select
              value={isNewResolution ? 'other' : resolutionInput}
              onChange={(e) => {
                if (e.target.value === 'other') {
                  setIsNewResolution(true);
                  setResolutionInput('');
                } else {
                  setIsNewResolution(false);
                  setResolutionInput(e.target.value);
                  setNewResolution('');
                }
              }}
              className="flex-1 p-2 border rounded"
            >
              <option value="">Select a resolution...</option>
              {resolutions[activeFormat].map((res, index) => (
                <option key={index} value={res}>{res}</option>
              ))}
              <option value="other">Other</option>
            </select>
            {isNewResolution && (
              <input
                type="text"
                value={newResolution}
                onChange={(e) => setNewResolution(e.target.value)}
                className="flex-1 p-2 border rounded"
                placeholder="Enter a new resolution..."
              />
            )}
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border rounded"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border rounded"
              placeholder="End Date"
            />
          </div>
          <div className="mb-4">
            <textarea
              value={argumentInput}
              onChange={(e) => {
                setArgumentInput(e.target.value);
                setFieldErrors(prev => ({ ...prev, text: '' }));
              }}
              className={`w-full p-2 border rounded ${
                fieldErrors.text ? 'border-red-500' : ''
              }`}
              placeholder="Enter your arguments here..."
            />
            {fieldErrors.text && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.text}</p>
            )}
            <button 
              onClick={handleParseArgument} 
              disabled={isLoading}
              className={`mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Processing...' : 'Parse Arguments'}
            </button>
          </div>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {Object.entries(fieldErrors).map(([field, error]) => (
            <p key={field} className="text-red-500 text-sm mt-1">
              {error}
            </p>
          ))}
          {isLoading && <LoadingSpinner />}
          {parsedArguments.length > 0 && (
            <div className="mt-4">
              <h3 className="text-2xl font-semibold mb-2">Parsed ARESR Arguments</h3>
              {parsedArguments.map((arg) => (
                <div key={arg.id} className="mb-8 p-6 border rounded-lg shadow-lg bg-white">
                  <ArgumentAssessment 
                    argument={arg}
                    category={argumentCategories[arg.id]}
                    debateThread={debateThreads[arg.id]}
                    onCreateCounter={() => handleCreateCounterArgument(arg)}
                    onEdit={() => handleEditArgument(arg)}
                    onSave={() => handleSaveMarkdown(arg)}
                  />
                </div>
              ))}
            </div>
          )}
        </Tabs.Content>
      </Tabs.Root>

      {/* Display grouped arguments */}
      {argumentGroups.map((group) => (
        <div key={group.topic} className="mb-8">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            {group.topic}
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {(group.relevance * 100).toFixed(0)}% Relevant
            </span>
          </h3>
          <div className="space-y-4">
            {group.arguments.map((arg) => (
              <ArgumentCard
                key={arg.id}
                argument={arg}
                originalText={argumentInput}
                onCreateCounter={() => handleCreateCounterArgument(arg)}
                onEdit={() => handleEditArgument(arg)}
                onSave={() => handleSaveMarkdown(arg)}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Show filtered arguments if enabled */}
      {showFilteredArguments && filteredArguments.length > 0 && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-bold mb-4">
            Below Threshold Arguments
            <span className="text-sm text-gray-500 ml-2">
              ({filteredArguments.length} arguments)
            </span>
          </h3>
          <div className="space-y-4">
            {filteredArguments.map((arg) => (
              <ArgumentCard
                key={arg.id}
                argument={arg}
                originalText={argumentInput}
                onCreateCounter={() => handleCreateCounterArgument(arg)}
                onEdit={() => handleEditArgument(arg)}
                onSave={() => handleSaveMarkdown(arg)}
                isFiltered
              />
            ))}
          </div>
        </div>
      )}

      {/* Edit Assessment Modal */}
      {editedArgument && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/2">
            <h3 className="text-xl font-semibold mb-4">Edit Assessment for Argument {editedArgument.id}</h3>
            {/* Assessment Editing Form */}
            <div className="mb-2">
              <label className="block mb-1"><strong>A Strength:</strong></label>
              <input
                type="text"
                value={editedArgument.assessment?.aStrength || ''}
                onChange={(e) => setEditedArgument({ ...editedArgument, assessment: { ...editedArgument.assessment, aStrength: e.target.value } })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1"><strong>R Strength:</strong></label>
              <input
                type="text"
                value={editedArgument.assessment?.rStrength || ''}
                onChange={(e) => setEditedArgument({ ...editedArgument, assessment: { ...editedArgument.assessment, rStrength: e.target.value } })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1"><strong>E Strength:</strong></label>
              <input
                type="text"
                value={editedArgument.assessment?.eStrength || ''}
                onChange={(e) => setEditedArgument({ ...editedArgument, assessment: { ...editedArgument.assessment, eStrength: e.target.value } })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1"><strong>S Strength:</strong></label>
              <input
                type="text"
                value={editedArgument.assessment?.sStrength || ''}
                onChange={(e) => setEditedArgument({ ...editedArgument, assessment: { ...editedArgument.assessment, sStrength: e.target.value } })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1"><strong>R Weakness:</strong></label>
              <input
                type="text"
                value={editedArgument.assessment?.rWeakness || ''}
                onChange={(e) => setEditedArgument({ ...editedArgument, assessment: { ...editedArgument.assessment, rWeakness: e.target.value } })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleUpdateArgument}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={() => setEditedArgument(null)}
                className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
