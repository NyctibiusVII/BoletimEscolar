import { useContext } from 'react'

import { SchoolReportContext, SchoolReportContextData } from '@/contexts/SchoolReportContext'

export function useSchoolReport(): SchoolReportContextData {
    const context = useContext(SchoolReportContext)

    if (!context) throw new Error('useSchoolReport must be used within an SchoolReportProvider')

    return context
}