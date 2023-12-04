function isAssistant(type: string): boolean {
  return type === 'HumanAssistant' || type === 'ArtificialAssistant';
}

export default isAssistant;
