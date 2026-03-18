import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function roleClass(role: string | undefined, type: 'text' | 'bg' | 'border' | 'ring' | 'shadow' = 'text', shade = '600') {
  const color = role === 'Admin' ? 'emerald' : 'blue';
  const prefix = type === 'shadow' ? 'shadow' : type;
  return `${prefix}-${color}-${shade}`;
}
