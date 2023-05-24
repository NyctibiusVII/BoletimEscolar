import {
    createContext,
    ReactNode,
    useEffect,
    useState
} from 'react'

import { useSchoolReportConfig } from '@/hooks/useSchoolReportConfig'

import {
    AcademicRecord,
    ActiveQuarter,
    Bimester,
    Concept,
    Matter,
    SchoolReport,
    StudentAcademicRecord,
    SubjectSituation
} from '@/interfaces/types'

import {
    getCookie,
    setCookie,
    deleteCookie,
    hasCookie
} from 'cookies-next'

export interface SchoolReportContextData {
    schoolReport:        SchoolReport
    setSchoolReport:     (value: SchoolReport) => void
    schoolReportStartup: SchoolReport
    updateStudentAcademicRecord: (
        value:    number,
        subject:  Matter,
        bimester: keyof Bimester,
        academicRecord: 'grades' | 'absences'
    ) => void
    newAcademicRecord:   AcademicRecord
    addSubjects:         (subject: string, custom?: boolean) => void
    removeSubjects:      (subject: string) => void
}
interface SchoolReportProviderProps { children: ReactNode }

export const SchoolReportContext = createContext({} as SchoolReportContextData)

export function SchoolReportProvider({ children }: SchoolReportProviderProps) {
    const {
        subjects,
        setSubjects,
        inactiveSubjects,
        setInactiveSubjects,
        activeQuarter,
        maintainReportCardData,
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
    const schoolReportStartup: SchoolReport = {
        school:  maintainReportCardData.school  ? (getCookie('keep_school_data')  ? String(getCookie('keep_school_data'))  : '') : '',
        teacher: maintainReportCardData.teacher ? (getCookie('keep_teacher_data') ? String(getCookie('keep_teacher_data')) : '') : '',
        academicYear: new Date().getFullYear(),
        student: {
            name:         maintainReportCardData.name         ? (getCookie('keep_name_data')           ? String(getCookie('keep_name_data'))           : '') : '',
            number:       maintainReportCardData.number       ? (getCookie('keep_number_data')         ? Number(getCookie('keep_number_data'))         : 0)  : 0,
            yearAndClass: maintainReportCardData.yearAndClass ? (getCookie('keep_year_and_class_data') ? String(getCookie('keep_year_and_class_data')) : '') : ''
        },
        studentAcademicRecord: studentAcademicRecord()
    }
    const [schoolReport, setSchoolReport] = useState<SchoolReport>(schoolReportStartup)

    const addSubjects = (subject: string, custom=false) => {
        if (custom) {
            if (subject.length === 0) return
            if (subjects.includes(subject)) return
        }

        setSubjects([...subjects, subject])
        setSchoolReport({
            ...schoolReport,
            studentAcademicRecord: {
                ...schoolReport.studentAcademicRecord,
                [subject]: newAcademicRecord
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

    useEffect(() => {
        const { school, teacher, name, number, yearAndClass } = maintainReportCardData
        const updatedCookies: Record<string, string> = {}

        school       ? updatedCookies.keep_school_data         = schoolReport.school                 : (hasCookie('keep_school_data')         && deleteCookie('keep_school_data'))
        teacher      ? updatedCookies.keep_teacher_data        = schoolReport.teacher                : (hasCookie('keep_teacher_data')        && deleteCookie('keep_teacher_data'))
        name         ? updatedCookies.keep_name_data           = schoolReport.student.name           : (hasCookie('keep_name_data')           && deleteCookie('keep_name_data'))
        number       ? updatedCookies.keep_number_data         = String(schoolReport.student.number) : (hasCookie('keep_number_data')         && deleteCookie('keep_number_data'))
        yearAndClass ? updatedCookies.keep_year_and_class_data = schoolReport.student.yearAndClass   : (hasCookie('keep_year_and_class_data') && deleteCookie('keep_year_and_class_data'))

        Object.entries(updatedCookies).forEach(([cookieName, value]) => setCookie(cookieName, value))
    }, [maintainReportCardData, schoolReport.school, schoolReport.student.name, schoolReport.student.number, schoolReport.student.yearAndClass, schoolReport.teacher])

    return(
        <SchoolReportContext.Provider
            value={{
                schoolReport,
                setSchoolReport,
                schoolReportStartup,
                updateStudentAcademicRecord,
                newAcademicRecord,
                addSubjects,
                removeSubjects
            }}>
            {children}
        </SchoolReportContext.Provider>
    )
}
