import {
    createContext,
    ReactNode,
    useEffect,
    useState
} from 'react'

import {
    AcademicRecord,
    ActiveQuarter,
    Bimester,
    Concept,
    Matter,
    SchoolReportType,
    StudentAcademicRecord,
    SubjectSituation
} from '@/interfaces/types'

import { useSchoolReportConfig } from '@/hooks/useSchoolReportConfig'
import { useLoading }            from '@/hooks/useLoading'

export interface SchoolReportContextData {
    schoolReport:        SchoolReportType
    setSchoolReport:     (value: SchoolReportType) => void
    schoolReportStartup: SchoolReportType
    updateStudentAcademicRecord: (
        value:    number,
        subject:  Matter,
        bimester: keyof Bimester,
        academicRecord: 'grades' | 'absences'
    ) => void
    updateTotalClasses:  (value: number, subject: Matter) => void
    newAcademicRecord:   AcademicRecord
    addSubjects:         (subject: string, custom?: boolean) => void
    removeSubjects:      (subject: string) => void
}
interface SchoolReportProviderProps { children: ReactNode }

export const SchoolReportContext = createContext({} as SchoolReportContextData)

export function SchoolReportProvider({ children }: SchoolReportProviderProps) {
    const { isLoading } = useLoading()
    const {
        subjects,
        setSubjects,
        inactiveSubjects,
        setInactiveSubjects,
        activeQuarter,
        recalculateValues,
        setRecalculateValues,
        minimumAttendancePercentageToPass,
        minimumPassingGrade,
        minimumRecoveryGrade
    } = useSchoolReportConfig()

    const noteWeight = Object.values(activeQuarter).filter(Boolean).length

    const studentAcademicRecord = () => {
        const newStudentAcademicRecord: StudentAcademicRecord = {}
        subjects.forEach(subject => newStudentAcademicRecord[subject] = newAcademicRecord)
        return newStudentAcademicRecord
    }
    const newAcademicRecord: AcademicRecord = {
        grades: {
            firstQuarter:  0,
            secondQuarter: 0,
            thirdQuarter:  0,
            fourthQuarter: 0
        },
        absences: {
            firstQuarter:  0,
            secondQuarter: 0,
            thirdQuarter:  0,
            fourthQuarter: 0
        },
        concept: Concept.D,
        totalClasses: 56, /* Min = Dois meses de 28 dias | Max = Oito meses ou 248 aulas */
        totalAbsences: 0,
        finalResult: SubjectSituation.DISAPPROVED
    }
    const schoolReportStartup: SchoolReportType = {
        school:  '',
        teacher: '',
        academicYear: new Date().getFullYear(),
        student: {
            name:         '',
            number:       0,
            yearAndClass: ''
        },
        studentAcademicRecord: studentAcademicRecord()
    }
    const [schoolReport, setSchoolReport] = useState<SchoolReportType>(schoolReportStartup)

    const addSubjects = (subject: string, custom=false) => {
        if (custom) {
            if (subject.length === 0) return
            if (subjects.includes(subject)) return
        }

        setSubjects([...subjects, subject])
        setSchoolReport(prevState => {
            return {
                ...prevState,
                studentAcademicRecord: {
                    ...prevState.studentAcademicRecord,
                    [subject]: newAcademicRecord
                }
            }
        })
        setInactiveSubjects(inactiveSubjects.filter(item => item !== subject))
    }
    const removeSubjects = (subject: string) => {
        if (subjects.length === 1) return
        if (subjects.includes(subject)) {
            setSubjects(subjects.filter(item => item !== subject))
            setInactiveSubjects([...inactiveSubjects, subject])
        }
        if (inactiveSubjects.includes(subject)) {
            setInactiveSubjects(inactiveSubjects.filter(item => item !== subject))
        }
    }

    const calculateAverageOfGrades = (grades: Bimester) => {
        const gradesByQuarter = Object.values(grades)

        const sumGradesByActiveQuarter = Object.keys(activeQuarter).reduce((acc, quarter, index) => {
            return activeQuarter[quarter as keyof typeof activeQuarter] ? acc + gradesByQuarter[index] : acc
        }, 0)
        return sumGradesByActiveQuarter / noteWeight
    }
    const calculateOfTotalAbsences = (absences: Bimester) => {
        const absencesByQuarter = Object.values(absences)

        const newTotalAbsences = Object.keys(activeQuarter).reduce((acc, quarter, index) => {
            return activeQuarter[quarter as keyof typeof activeQuarter] ? acc + absencesByQuarter[index] : acc
        }, 0)
        return newTotalAbsences
    }
    const calculateConcept = (average: number) => {
        const concept =
            average >= 7
                ? Concept.A
                : average >= 5
                    ? Concept.B
                    : average >= 3
                        ? Concept.C
                        : Concept.D
        return concept
    }
    const calculateFinalResult = (average: number, totalClasses: number, newTotalAbsences: number) => {
        const presencePercentage = totalClasses === 0 ? 0 : ((totalClasses - newTotalAbsences) / totalClasses) * 100
        const finalResult =
            average >= minimumPassingGrade
                ? SubjectSituation.APPROVED
                : presencePercentage < minimumAttendancePercentageToPass
                    ? SubjectSituation.FAILED_FOR_ABSENCE
                    : average >= minimumRecoveryGrade
                        ? SubjectSituation.RECOVERY
                        : SubjectSituation.DISAPPROVED
        return finalResult
    }

    const updateStudentAcademicRecord = (value: number, subject: Matter, bimester: keyof Bimester, academicRecord: 'grades' | 'absences') => {
        const dataUpdate = (prevState: SchoolReportType) => {
            const { grades, absences, totalClasses } = { ...prevState.studentAcademicRecord[subject] }
            grades[bimester] = academicRecord === 'grades' ? value : grades[bimester]
            absences[bimester] = academicRecord === 'absences' ? value : absences[bimester]

            const average = calculateAverageOfGrades(grades)
            const concept = calculateConcept(average)
            const newTotalAbsences = calculateOfTotalAbsences(absences)
            const finalResult = calculateFinalResult(average, totalClasses, newTotalAbsences)

            return { absences, concept, finalResult, grades, newTotalAbsences }
        }

        setSchoolReport(prevState => {
            const { absences, concept, finalResult, grades, newTotalAbsences } = dataUpdate(prevState)

            const updatedAcademicRecord = {
                ...prevState.studentAcademicRecord[subject],
                absences,
                grades,
                finalResult,
                concept,
                totalAbsences: newTotalAbsences
            }

            return {
                ...prevState,
                studentAcademicRecord: {
                    ...prevState.studentAcademicRecord,
                    [subject]: updatedAcademicRecord
                }
            }
        })
    }
    const updateTotalClasses = (value: number, subject: Matter) => {
        setSchoolReport(prevState => {
            return {
                ...prevState,
                studentAcademicRecord: {
                    ...prevState.studentAcademicRecord,
                    [subject]: {
                        ...prevState.studentAcademicRecord[subject],
                        totalClasses: value
                    }
                }
            }
        })
        setRecalculateValues(recalculateValues + 1)
    }

    useEffect(() => {
        if (isLoading) return

        const recalculatingComponentWithOwnValues = () => {
            const updatedStudentAcademicRecord = { ...schoolReport.studentAcademicRecord }

            subjects.forEach((subject: Matter) => {
                const academicRecord = updatedStudentAcademicRecord[subject]
                const grades = { ...academicRecord.grades }
                const absences = { ...academicRecord.absences }

                const activeQuarterKeys = Object.keys(activeQuarter) as (keyof ActiveQuarter)[]

                activeQuarterKeys.forEach((quarter) => {
                    if (activeQuarter[quarter]) {
                        const activeQuarterGrade = grades[quarter]
                        const activeQuarterAbsences = absences[quarter]

                        grades[quarter] = activeQuarterGrade
                        absences[quarter] = activeQuarterAbsences
                    }
                })

                updatedStudentAcademicRecord[subject] = {
                    ...academicRecord,
                    grades,
                    absences,
                    concept: calculateConcept(calculateAverageOfGrades(grades)),
                    totalAbsences: calculateOfTotalAbsences(absences),
                    finalResult: calculateFinalResult(
                        calculateAverageOfGrades(grades),
                        academicRecord.totalClasses,
                        calculateOfTotalAbsences(absences)
                    )
                }
            })

            setSchoolReport(prevState => ({
                ...prevState,
                studentAcademicRecord: updatedStudentAcademicRecord
            }))
        }

        recalculatingComponentWithOwnValues()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeQuarter, subjects, minimumPassingGrade, minimumRecoveryGrade, minimumAttendancePercentageToPass, recalculateValues])

    return(
        <SchoolReportContext.Provider
            value={{
                schoolReport,
                setSchoolReport,
                schoolReportStartup,
                updateStudentAcademicRecord,
                updateTotalClasses,
                newAcademicRecord,
                addSubjects,
                removeSubjects
            }}>
            {children}
        </SchoolReportContext.Provider>
    )
}
