/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    colors: {
      'transparent': 'transparent',
      'white': '#ffffff',
      'gray-50': '#f9fafb',
      'gray-10': '#f3f4f6',
      'gray-20': '#e5e7eb',
      'gray-30': '#d1d5db',
      'gray-40': '#9ca3af',
      'gray-50': '#6b7280',
      'gray-60': '#4b5563',
      'gray-70': '#374151',
      'gray-80': '#1f2937',
      'gray-90': '#111827',
      'gray-95': '#030712',
      'black': '#000000',
      'red-600': '#dc2626'
    },
    opacity: {
      '0': '0',
      '20': '0.2',
      '40': '0.4',
      '60': '0.6',
      '80': '0.8',
      '100': '1'
    }
  }
}
