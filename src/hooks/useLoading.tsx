import { useContext } from 'react'

import { LoadingContext, LoadingContextData } from '@/contexts/LoadingContext'

export function useLoading(): LoadingContextData {
    const context = useContext(LoadingContext)

    if (!context) throw new Error('useLoading must be used within an LoadingProvider')

    return context
}