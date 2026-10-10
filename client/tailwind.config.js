/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // THIS IS CRITICAL
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vscode-dark': '#090d16',
        'vscode-darker': '#0f172a',
        'vscode-card': '#1e293b',
        'vscode-hover': '#243247',
        'vscode-border': '#334155',
        'vscode-text-secondary': '#94a3b8',
        'vscode-text-muted': '#64748b',
        'vscode-accent': '#38bdf8',
        'metamask-orange': '#f59e0b',
        'metamask-orange-dark': '#d97706',
        'metamask-yellow': '#fbbf24',
        'bw-dark': '#090d16',
        'bw-surface': '#0f172a',
        'bw-card': '#1e293b',
        'bw-border': 'rgba(255, 255, 255, 0.08)',
        'bw-cyan': '#0ea5e9',
        'bw-amber': '#f59e0b',
        'bw-emerald': '#10b981',
      },
    },
  },
  plugins: [],
}
