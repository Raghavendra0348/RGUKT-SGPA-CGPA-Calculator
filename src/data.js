import subjects from '../subjects.json';

export const departments = [
  { id: 'cse', code: 'CSE', name: 'Computer Science', detail: 'Engineering', icon: 'code' },
  { id: 'ece', code: 'ECE', name: 'Electronics & Communication', detail: 'Engineering', icon: 'chip' },
  { id: 'eee', code: 'EEE', name: 'Electrical & Electronics', detail: 'Engineering', icon: 'bolt' },
  { id: 'civil', code: 'Civil', name: 'Civil Engineering', detail: 'Engineering', icon: 'building' },
  { id: 'mech', code: 'Mech', name: 'Mechanical Engineering', detail: 'Engineering', icon: 'gear' },
  { id: 'mme', code: 'MME', name: 'Metallurgical & Materials', detail: 'Engineering', icon: 'layers' },
  { id: 'chemical', code: 'Chemical', name: 'Chemical Engineering', detail: 'Engineering', icon: 'flask' },
  { id: 'puc_mpc', code: 'MPC', name: 'Mathematics, Physics & Chemistry', detail: 'Pre-university', icon: 'book' },
  { id: 'puc_mbipc', code: 'MBiPC', name: 'Biology, Mathematics & Sciences', detail: 'Pre-university', icon: 'leaf' },
];
export const configs = { ...subjects, puc_mpc: {
  branch: 'PUC', year: 1, sem: 1, title: 'PUC MPC (P-01 & P-02)',
  maxPoints: 240, divisor: 24, cgpaSemesters: 4,
  subjects: [['PHYSICS', 4], ['CHEMISTRY', 4], ['MATHS', 5], ['IT', 1], ['ENG', 3], ['TELUGU', 3], ['PHYSICS LAB', 1], ['CHEMISTRY LAB', 1], ['IT LAB', 1]].map(([name, credits]) => ({ id: name, name, credits })),
} };

export function readRoute() {
  const params = new URLSearchParams(location.search);
  const file = decodeURIComponent(location.pathname.split('/').pop() || 'index.html');
  const legacy = file.match(/^([a-z]+)[(_](e\ds\d)\)?\.html$/);
  let key = params.get('key') || (file === 'puc.html' ? 'puc_mpc' : legacy ? `${legacy[1]}_${legacy[2]}` : '');
  const branch = params.get('branch') || (key ? key.split('_')[0] : file.replace('_semester.html', ''));
  return { file, key, branch, mode: params.get('mode') === 'cgpa' ? 'cgpa' : 'sgpa' };
}
