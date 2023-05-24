import { useTheme } from 'next-themes'

export const useSwalTheme = () => {
    const { theme } = useTheme()

    const swalColors = {
        bg: theme === 'dark' ? '#111827' : '#ffffff',
        fg: theme === 'dark' ? '#f3f4f6' : '#374151',
        accent: '#8b5cf6',
        info: { icon: '#2778c4' },
        error: { icon: '#f87171' },
        success: { icon: '#4ade80' },
        warning: { icon: '#fcd34d' },
        question: { icon: theme === 'dark' ? '#334155' : '#cbd5e1'},
        button: {
            confirm: '#2778c4',
            cancel: '#f87171'
        }
    }

    return swalColors
}