import {
    createContext,
    ReactNode,
    useEffect,
    useState
} from 'react'

import { useSchoolReportConfig } from '@/hooks/useSchoolReportConfig'

import {
    ActiveQuarter,
    Bimester,
    Concept,
    Matter,
    SchoolReport,
    StudentAcademicRecord,
    SubjectSituation
} from '@/interfaces/types'

export interface SchoolReportContextData {
    schoolReport:    SchoolReport
    setSchoolReport: (value: SchoolReport) => void
    updateStudentAcademicRecord: (
        value:    number,
        subject:  Matter,
        bimester: keyof Bimester,
        academicRecord: 'grades' | 'absences'
    ) => void
}
interface SchoolReportProviderProps { children: ReactNode }

export const SchoolReportContext = createContext({} as SchoolReportContextData)

export function SchoolReportProvider({ children }: SchoolReportProviderProps) {
    const {
        subjects,
        activeQuarter,
        minimumAttendancePercentageToPass,
        minimumPassingGrade,
        minimumRecoveryGrade
    } = useSchoolReportConfig()

    const noteWeight = Object.values(activeQuarter).filter(Boolean).length

    const studentAcademicRecord = () => {
        const newStudentAcademicRecord: StudentAcademicRecord = {}
        subjects.forEach(subject => {
            newStudentAcademicRecord[subject] = {
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
                totalClasses: 1, // pegar esse valor com o usuário e avisa-lo. valor min é 1, max é 248
                totalAbsences: 0,
                finalResult: SubjectSituation.DISAPPROVED
            }
        })
        return newStudentAcademicRecord
    }
    const schoolReportStartup: SchoolReport = {
        school: '',
        teacher: '',
        academicYear: new Date().getFullYear(),
        student: {
            name: '',
            number: 0,
            yearAndClass: ''
        },
        studentAcademicRecord: studentAcademicRecord()
    }
    const [schoolReport, setSchoolReport] = useState<SchoolReport>(schoolReportStartup)

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

    const updateStudentAcademicRecord = (
        value:    number,
        subject:  Matter,
        bimester: keyof Bimester,
        academicRecord: 'grades' | 'absences'
    ) => {
        const dataUpdate = (prevState: SchoolReport) => {
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

    useEffect(() => {
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
    }, [activeQuarter, subjects])

    return(
        <SchoolReportContext.Provider
            value={{
                schoolReport,
                setSchoolReport,
                updateStudentAcademicRecord
            }}>
            {children}
        </SchoolReportContext.Provider>
    )
}
