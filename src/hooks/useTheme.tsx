import { useTheme as useThemeNext } from 'next-themes'

export function useTheme() {
    const { systemTheme, theme, ...rest } = useThemeNext()
    const currentTheme = (theme === 'system' ? systemTheme : theme) ?? 'dark'

    return { currentTheme, systemTheme, theme, ...rest }
}