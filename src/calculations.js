export const GRADES = ['EX', 'A', 'B', 'C', 'D', 'E', 'REM'];
export function calculateSGPA(config, grades) {
  const penalty = config.subjects.reduce((sum, subject, index) => {
    const grade = grades[index] ?? 'EX';
    if (!GRADES.includes(grade)) throw new Error('Choose a valid grade.');
    return sum + (grade === 'REM' ? 0 : GRADES.indexOf(grade) * subject.credits);
  }, 0);
  return (config.maxPoints - penalty) / config.divisor;
}
export function calculateCGPA(values) {
  const filled = values.filter(value => String(value).trim() !== '');
  if (!filled.length) throw new Error('Enter at least one semester SGPA.');
  const numbers = filled.map(Number);
  if (numbers.some(value => !Number.isFinite(value) || value < 0 || value > 10)) {
    throw new Error('Each SGPA must be between 0 and 10.');
  }
  return numbers.reduce((sum, value) => sum + value, 0) / numbers.length;
}
export function division(score) {
  return score >= 8 ? 'Distinction' : score >= 7 ? 'First class' : score >= 6 ? 'Second class' : 'Below passing threshold';
}

export function withCredits(config, values) {
  if (values.length !== config.subjects.length) throw new Error('Enter credits for every subject.');
  const credits = values.map(value => {
    if (String(value).trim() === '' || !Number.isFinite(Number(value)) || Number(value) < 0) {
      throw new Error('Enter a valid credit value of zero or more for every subject.');
    }
    return Number(value);
  });
  if (credits.every((value, index) => value === config.subjects[index].credits)) return config;
  const total = credits.reduce((sum, value) => sum + value, 0);
  if (!Number.isFinite(total) || total <= 0) throw new Error('Total credits must be greater than zero.');
  return { ...config, subjects: config.subjects.map((subject, index) => ({ ...subject, credits: credits[index] })), divisor: total, maxPoints: total * 10 };
}
