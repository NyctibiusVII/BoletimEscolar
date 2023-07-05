import { useTheme } from '@/hooks/useTheme'

export const useSwalTheme = () => {
    const { currentTheme } = useTheme()

    const swalColors = {
        bg: currentTheme === 'dark' ? '#111827' : '#ffffff',
        fg: currentTheme === 'dark' ? '#f3f4f6' : '#374151',
        accent: '#8b5cf6',
        info: { icon: '#2778c4' },
        error: { icon: '#f87171' },
        success: { icon: '#4ade80' },
        warning: { icon: '#fcd34d' },
        question: { icon: currentTheme === 'dark' ? '#334155' : '#cbd5e1'},
        button: {
            confirm: '#2778c4',
            cancel: '#f87171'
        }
    }

    return swalColors
}