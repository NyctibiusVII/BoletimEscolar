import {
    createContext,
    ReactNode,
    useState
} from 'react'

import {
    ActiveQuarter,
    MaintainReportCardData,
    Matter,
    SchoolReportColors
} from '@/interfaces/types'

export interface SchoolReportConfigContextData {
    subjects:                 Matter[]
    inactiveSubjects:         Matter[]
    setSubjects:              (value: Matter[]) => void
    setInactiveSubjects:      (value: Matter[]) => void
    activeQuarter:            ActiveQuarter
    setActiveQuarter          (value: ActiveQuarter): void
    updateActiveQuarter       (quarterNumber: 1 | 2 | 3 | 4): void
    schoolReportColors:       SchoolReportColors
    setSchoolReportColors     (value: SchoolReportColors): void
    maintainReportCardData:   MaintainReportCardData
    setMaintainReportCardData (value: MaintainReportCardData): void
    recalculateValues:   number
    setRecalculateValues (value: number): void
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
    const [recalculateValues, setRecalculateValues] = useState(0)

    const [minimumPassingGrade,                             setMinimumPassingGrade] = useState(6)
    const [minimumRecoveryGrade,                           setMinimumRecoveryGrade] = useState(4)
    const [minimumAttendancePercentageToPass, setMinimumAttendancePercentageToPass] = useState(25)

    const [hasResponsibleTeacherName, setHasResponsibleTeacherName] = useState(true)
    const [hasSignatures,                         setHasSignatures] = useState(true)
    const [hasConcept,                               setHasConcept] = useState(true)
    const [hasConceptValues,                   setHasConceptValues] = useState(true)
    const [hasFinalResultValues,           setHasFinalResultValues] = useState(true)

    const [maintainReportCardData, setMaintainReportCardData] = useState<MaintainReportCardData>({
        school:                     true,
        teacher:                    true,
        studentName:                false,
        studentNumber:              false,
        studentYearAndClass:        false,
        academicRecordGrades:       false,
        academicRecordAbsences:     false,
        academicRecordTotalClasses: true
    })

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
    const updateActiveQuarter = (quarterNumber: 1 | 2 | 3 | 4) => {
        const quarterMap = {
            1: 'firstQuarter',
            2: 'secondQuarter',
            3: 'thirdQuarter',
            4: 'fourthQuarter'
        }
        const updatedQuarter = quarterMap[quarterNumber]

        if (updatedQuarter) {
            setActiveQuarter({
                ...activeQuarter,
                [updatedQuarter]: !activeQuarter[updatedQuarter as keyof ActiveQuarter]
            })
        }
    }

    const [subjects, setSubjects] = useState<Matter[]>([
        'Português',
        'Matemática',
        'Artes',
        'Ciências',
        'História',
        'Geografia',
        'Educação Física'
    ])
    const [inactiveSubjects, setInactiveSubjects] = useState<Matter[]>([
        'Inglês',
        'Física',
        'Química',
        'Biologia',
        'Filosofia',
        'Sociologia',
        'Ensino Religioso'
    ])

    return(
        <SchoolReportConfigContext.Provider
            value={{
                subjects,
                inactiveSubjects,
                setSubjects,
                setInactiveSubjects,
                activeQuarter,
                setActiveQuarter,
                updateActiveQuarter,
                schoolReportColors,
                setSchoolReportColors,
                maintainReportCardData,
                setMaintainReportCardData,
                recalculateValues,
                setRecalculateValues,
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
