export const matchThevalueinMessage = (message: string) => {
  const valueMatch = message.match(/(\d+)/);
  const value = valueMatch ? parseInt(valueMatch[1]) : null;
  return value;
};
