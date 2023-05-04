import { useContext } from 'react'

import { SchoolReportConfigContext, SchoolReportConfigContextData } from '@/contexts/SchoolReportConfigContext'

export function useSchoolReportConfig(): SchoolReportConfigContextData {
    const context = useContext(SchoolReportConfigContext)

    if (!context) throw new Error('useSchoolReportConfig must be used within an SchoolReportConfigProvider')

    return context
}