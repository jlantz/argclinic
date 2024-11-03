import { AresrArgument, Argument, DebateFormat } from './argument';

describe('Argument Types', () => {
  it('should create a valid ARESR argument', () => {
    const aresrArg: AresrArgument = {
      assertion: 'Test assertion',
      reasoning: 'Test reasoning',
      evidence: [{
        source: 'Test source',
        content: 'Test content'
      }],
      significance: 'Test significance',
      result: 'Test result'
    };

    expect(aresrArg.assertion).toBeTruthy();
    expect(aresrArg.evidence.length).toBe(1);
  });

  it('should create a valid full Argument', () => {
    const arg: Argument = {
      id: '1',
      title: 'Test Argument',
      format: 'Policy' as DebateFormat,
      tags: ['test'],
      createdAt: new Date(),
      updatedAt: new Date(),
      assertion: 'Test assertion',
      reasoning: 'Test reasoning',
      evidence: [{
        source: 'Test source',
        content: 'Test content'
      }],
      significance: 'Test significance',
      result: 'Test result'
    };

    expect(arg.id).toBe('1');
    expect(arg.format).toBe('Policy');
  });
});
