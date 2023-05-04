import {
    createContext,
    ReactNode,
    useState
} from 'react'

import { ActiveQuarter, Matter, SchoolReportColors } from '@/interfaces/types'

export interface SchoolReportConfigContextData {
    subjects:             Matter[]
    setSubjects:          (value: Matter[]) => void
    activeQuarter:        ActiveQuarter
    setActiveQuarter      (value: ActiveQuarter): void
    schoolReportColors:   SchoolReportColors
    setSchoolReportColors (value: SchoolReportColors): void
    minimumAttendancePercentageToPass: number
    minimumPassingGrade:               number
    minimumRecoveryGrade:              number
    setMinimumAttendancePercentageToPass (value: number): void
    setMinimumPassingGrade               (value: number): void
    setMinimumRecoveryGrade              (value: number): void
    hasResponsibleTeacherName: boolean
    hasSignatures:             boolean
    hasConcept:                boolean
    hasConceptValues:          boolean
    hasFinalResultValues:      boolean
    setHasResponsibleTeacherName (value: boolean): void
    setHasSignatures             (value: boolean): void
    setHasConcept                (value: boolean): void
    setHasConceptValues          (value: boolean): void
    setHasFinalResultValues      (value: boolean): void
}
interface SchoolReportConfigProviderProps { children: ReactNode }

export const SchoolReportConfigContext = createContext({} as SchoolReportConfigContextData)

export function SchoolReportConfigProvider({ children }: SchoolReportConfigProviderProps) {
    const [minimumAttendancePercentageToPass, setMinimumAttendancePercentageToPass] = useState(25)
    const [minimumPassingGrade,                             setMinimumPassingGrade] = useState(6)
    const [minimumRecoveryGrade,                           setMinimumRecoveryGrade] = useState(4)

    const [hasResponsibleTeacherName, setHasResponsibleTeacherName] = useState(true)
    const [hasSignatures,                         setHasSignatures] = useState(true)
    const [hasConcept,                               setHasConcept] = useState(true)
    const [hasConceptValues,                   setHasConceptValues] = useState(true)
    const [hasFinalResultValues,           setHasFinalResultValues] = useState(true)

    const schoolReportColorsStartup: SchoolReportColors = {
        card:              `bg-white`,
        border:            `border-gray-950`,
        clippingBorder:    `border-red-600`,
        signatures:        `bg-gray-950`,
        text:              `text-gray-950`,
        insufficientGrade: `text-red-600`,
        enoughGrade:       `text-green-500`
    }
    const [schoolReportColors, setSchoolReportColors] = useState<SchoolReportColors>(schoolReportColorsStartup)

    const [activeQuarter, setActiveQuarter] = useState<ActiveQuarter>({
        firstQuarter:  true,
        secondQuarter: true,
        thirdQuarter:  true,
        fourthQuarter: true
    })

    const [subjects, setSubjects] = useState<Matter[]>([
        'Português',
        'Matemática',
        'Ciências',
        'História',
        'Geografia'
    ])

    return(
        <SchoolReportConfigContext.Provider
            value={{
                subjects,
                setSubjects,
                activeQuarter,
                setActiveQuarter,
                schoolReportColors,
                setSchoolReportColors,
                minimumAttendancePercentageToPass,
                minimumPassingGrade,
                minimumRecoveryGrade,
                setMinimumAttendancePercentageToPass,
                setMinimumPassingGrade,
                setMinimumRecoveryGrade,
                hasResponsibleTeacherName,
                hasSignatures,
                hasConcept,
                hasConceptValues,
                hasFinalResultValues,
                setHasResponsibleTeacherName,
                setHasSignatures,
                setHasConcept,
                setHasConceptValues,
                setHasFinalResultValues
            }}>
            {children}
        </SchoolReportConfigContext.Provider>
    )
}
