import {
    createContext,
    ReactNode,
    useContext,
    useEffect
} from 'react'

import {
    isActiveQuarter,
    isFilesImage,
    isMaintainReportCardData,
    isSubjects
} from '@/utils/isObject'
import {
    Bimester,
    GetLocalStorage,
    LocalStorage_AcademicRecordType,
    MaintainReportCardData,
    Matter,
    StudentAcademicRecord,
    DefaultValues,
    Concept,
    SubjectSituation
} from '@/interfaces/types'

import { GenerateImageContext } from '@/contexts/GenerateImageContext'
import { useSchoolReportConfig } from '@/hooks/useSchoolReportConfig'
import { useSchoolReport } from '@/hooks/useSchoolReport'
import { useLoading } from '@/hooks/useLoading'
import { useSidebar } from '@/hooks/useSidebar'

interface LocalStorageContextData {
    getItemsLocalStorage: () => GetLocalStorage
}
interface LocalStorageProviderProps { children: ReactNode }

export const LocalStorageContext = createContext({} as LocalStorageContextData)

export function LocalStorageProvider({ children }: LocalStorageProviderProps) {
    const { isOpen, setIsOpen } = useSidebar()
    const { isLoading, setIsLoading } = useLoading()
    const { filesImage, setFilesImage } = useContext(GenerateImageContext)
    const { schoolReport, setSchoolReport, newAcademicRecord } = useSchoolReport()
    const {
        maintainReportCardData,
        minimumPassingGrade,
        minimumRecoveryGrade,
        minimumAttendancePercentageToPass,
        hasResponsibleTeacherName,
        hasSignatures,
        hasConcept,
        hasConceptValues,
        hasFinalResultValues,
        activeQuarter,
        subjects,
        inactiveSubjects
    } = useSchoolReportConfig()
    const {
        setMaintainReportCardData,
        setMinimumPassingGrade,
        setMinimumRecoveryGrade,
        setMinimumAttendancePercentageToPass,
        setHasResponsibleTeacherName,
        setHasSignatures,
        setHasConcept,
        setHasConceptValues,
        setHasFinalResultValues,
        setActiveQuarter,
        setSubjects,
        setInactiveSubjects
    } = useSchoolReportConfig()

    const getItemsLocalStorage = () => {
        const getLocalStorage: GetLocalStorage = {}

        getLocalStorage.minimum_passing_grade                 = localStorage.getItem('minimum_passing_grade')                 ? Number(localStorage.getItem('minimum_passing_grade'))                 : DefaultValues.MINIMUM_PASSING_GRADE
        getLocalStorage.minimum_recovery_grade                = localStorage.getItem('minimum_recovery_grade')                ? Number(localStorage.getItem('minimum_recovery_grade'))                : DefaultValues.MINIMUM_RECOVERY_GRADE
        getLocalStorage.minimum_attendance_percentage_to_pass = localStorage.getItem('minimum_attendance_percentage_to_pass') ? Number(localStorage.getItem('minimum_attendance_percentage_to_pass')) : DefaultValues.MINIMUM_ATTENDANCE_PERCENTAGE_TO_PASS

        getLocalStorage.has_responsible_teacher_name = localStorage.getItem('has_responsible_teacher_name') === 'false' ? false : true
        getLocalStorage.has_signatures               = localStorage.getItem('has_signatures')               === 'false' ? false : true
        getLocalStorage.has_concept                  = localStorage.getItem('has_concept')                  === 'false' ? false : true
        getLocalStorage.has_concept_values           = localStorage.getItem('has_concept_values')           === 'false' ? false : true
        getLocalStorage.has_final_result_values      = localStorage.getItem('has_final_result_values')      === 'false' ? false : true
        getLocalStorage.sidebar_open                 = localStorage.getItem('sidebar_open')                 === 'true'  ? true : false

        getLocalStorage.keep_values       = localStorage.getItem('keep_values')       ? JSON.parse(localStorage.getItem('keep_values')       as string) : JSON.parse(DefaultValues.KEEP_VALUES)
        getLocalStorage.active_quarter    = localStorage.getItem('active_quarter')    ? JSON.parse(localStorage.getItem('active_quarter')    as string) : JSON.parse(DefaultValues.ACTIVE_QUARTER)
        getLocalStorage.files_image       = localStorage.getItem('files_image')       ? JSON.parse(localStorage.getItem('files_image')       as string) : JSON.parse(DefaultValues.FILES_IMAGE)
        getLocalStorage.active_subjects   = localStorage.getItem('active_subjects')   ? JSON.parse(localStorage.getItem('active_subjects')   as string) : JSON.parse(DefaultValues.ACTIVE_SUBJECTS)
        getLocalStorage.inactive_subjects = localStorage.getItem('inactive_subjects') ? JSON.parse(localStorage.getItem('inactive_subjects') as string) : JSON.parse(DefaultValues.INACTIVE_SUBJECTS)

        const keepValues     = getLocalStorage.keep_values     as MaintainReportCardData
        const activeSubjects = getLocalStorage.active_subjects as Matter[]

        getLocalStorage.school                 = keepValues.school              ? (localStorage.getItem('school')                 ? String(localStorage.getItem('school'))                 : DefaultValues.INPUT_TEXT)   : DefaultValues.INPUT_TEXT
        getLocalStorage.teacher                = keepValues.teacher             ? (localStorage.getItem('teacher')                ? String(localStorage.getItem('teacher'))                : DefaultValues.INPUT_TEXT)   : DefaultValues.INPUT_TEXT
        getLocalStorage.student_name           = keepValues.studentName         ? (localStorage.getItem('student_name')           ? String(localStorage.getItem('student_name'))           : DefaultValues.INPUT_TEXT)   : DefaultValues.INPUT_TEXT
        getLocalStorage.student_number         = keepValues.studentNumber       ? (localStorage.getItem('student_number')         ? Number(localStorage.getItem('student_number'))         : DefaultValues.INPUT_NUMBER) : DefaultValues.INPUT_NUMBER
        getLocalStorage.student_year_and_class = keepValues.studentYearAndClass ? (localStorage.getItem('student_year_and_class') ? String(localStorage.getItem('student_year_and_class')) : DefaultValues.INPUT_TEXT)   : DefaultValues.INPUT_TEXT

        const generateDefaultBimesterValues = (subjects: string[]) => {
            return subjects.reduce(record => {
                const defaultValuesOfBimester: Bimester = JSON.parse(DefaultValues.BIMESTER)
                return [ ...record, defaultValuesOfBimester]
            }, [] as Bimester[])
        }
        const generateDefaultValues = (subjects: string[], academicRecordType: LocalStorage_AcademicRecordType) => {
            const valueMapping: Record<string, number | string> = {
                academic_record_total_classes:  DefaultValues.TOTAL_CLASSES,
                academic_record_total_absences: DefaultValues.TOTAL_ABSENCES,
                academic_record_concept:        DefaultValues.CONCEPT,
                academic_record_final_result:   DefaultValues.FINAL_RESULT
            }

            const value = valueMapping[academicRecordType]
            if (value === undefined) return {}

            return subjects.reduce((record, _, index) => {
                return { ...record, [index]: value }
            }, {} as { [key: number]: number | string })
        }

        getLocalStorage.academic_record_grades         = keepValues.academicRecordGrades       ? (localStorage.getItem('academic_record_grades')         ? JSON.parse(localStorage.getItem('academic_record_grades')         as string) : generateDefaultBimesterValues(activeSubjects)) : generateDefaultBimesterValues(activeSubjects)
        getLocalStorage.academic_record_absences       = keepValues.academicRecordAbsences     ? (localStorage.getItem('academic_record_absences')       ? JSON.parse(localStorage.getItem('academic_record_absences')       as string) : generateDefaultBimesterValues(activeSubjects)) : generateDefaultBimesterValues(activeSubjects)
        getLocalStorage.academic_record_total_classes  = keepValues.academicRecordTotalClasses ? (localStorage.getItem('academic_record_total_classes')  ? JSON.parse(localStorage.getItem('academic_record_total_classes')  as string) : generateDefaultValues(activeSubjects, 'academic_record_total_classes'))  : generateDefaultValues(activeSubjects, 'academic_record_total_classes')
        getLocalStorage.academic_record_total_absences = keepValues.academicRecordAbsences     ? (localStorage.getItem('academic_record_total_absences') ? JSON.parse(localStorage.getItem('academic_record_total_absences') as string) : generateDefaultValues(activeSubjects, 'academic_record_total_absences')) : generateDefaultValues(activeSubjects, 'academic_record_total_absences')
        getLocalStorage.academic_record_concept        = keepValues.academicRecordGrades       ? (localStorage.getItem('academic_record_concept')        ? JSON.parse(localStorage.getItem('academic_record_concept')        as string) : generateDefaultValues(activeSubjects, 'academic_record_concept'))        : generateDefaultValues(activeSubjects, 'academic_record_concept')
        getLocalStorage.academic_record_final_result   = keepValues.academicRecordGrades       ? (localStorage.getItem('academic_record_final_result')   ? JSON.parse(localStorage.getItem('academic_record_final_result')   as string) : generateDefaultValues(activeSubjects, 'academic_record_final_result'))   : generateDefaultValues(activeSubjects, 'academic_record_final_result')

        return getLocalStorage
    }

    useEffect(() => {
        const subjectsLocalStorage = getItemsLocalStorage().active_subjects as string[]
        const academicRecordData = subjectsLocalStorage.reduce((record, subject, index) => {
            const gradesLocalStorage        = getItemsLocalStorage().academic_record_grades         as { [key: number]: Bimester }
            const absencesLocalStorage      = getItemsLocalStorage().academic_record_absences       as { [key: number]: Bimester }
            const totalClassesLocalStorage  = getItemsLocalStorage().academic_record_total_classes  as { [key: number]: number }
            const totalAbsencesLocalStorage = getItemsLocalStorage().academic_record_total_absences as { [key: number]: number }
            const conceptLocalStorage       = getItemsLocalStorage().academic_record_concept        as { [key: number]: Concept }
            const finalResultLocalStorage   = getItemsLocalStorage().academic_record_final_result   as { [key: number]: SubjectSituation }

            return {
                ...record, [subject]: {
                    grades:        gradesLocalStorage[index],
                    absences:      absencesLocalStorage[index],
                    totalClasses:  totalClassesLocalStorage[index],
                    totalAbsences: totalAbsencesLocalStorage[index],
                    concept:       conceptLocalStorage[index],
                    finalResult:   finalResultLocalStorage[index]
                }
            }
        }, {} as StudentAcademicRecord)

        setSchoolReport({
            ...schoolReport,
            school:  getItemsLocalStorage().school  as string,
            teacher: getItemsLocalStorage().teacher as string,
            student: {
                name:         getItemsLocalStorage().student_name           as string,
                number:       getItemsLocalStorage().student_number         as number,
                yearAndClass: getItemsLocalStorage().student_year_and_class as string
            },
            studentAcademicRecord: { ...academicRecordData }
        })

        Object.entries(getItemsLocalStorage()).forEach(([localStorageName, value]) => {
            switch (localStorageName) {
                case 'minimum_passing_grade':                 return typeof value === 'number' && setMinimumPassingGrade(value)
                case 'minimum_recovery_grade':                return typeof value === 'number' && setMinimumRecoveryGrade(value)
                case 'minimum_attendance_percentage_to_pass': return typeof value === 'number' && setMinimumAttendancePercentageToPass(value)
                case 'has_responsible_teacher_name': return typeof value === 'boolean' && setHasResponsibleTeacherName(value)
                case 'has_signatures':               return typeof value === 'boolean' && setHasSignatures(value)
                case 'has_concept':                  return typeof value === 'boolean' && setHasConcept(value)
                case 'has_concept_values':           return typeof value === 'boolean' && setHasConceptValues(value)
                case 'has_final_result_values':      return typeof value === 'boolean' && setHasFinalResultValues(value)
                case 'sidebar_open':                 return typeof value === 'boolean' && setIsOpen(value)
                case 'keep_values':       return isMaintainReportCardData(value) && setMaintainReportCardData(value)
                case 'active_quarter':    return isActiveQuarter(value)          && setActiveQuarter(value)
                case 'files_image':       return isFilesImage(value)             && setFilesImage(value)
                case 'active_subjects':   return isSubjects(value)               && setSubjects(value)
                case 'inactive_subjects': return isSubjects(value)               && setInactiveSubjects(value)
            }
        })

        setTimeout(() => setIsLoading(false), 1000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (isLoading) return

        const updatedLocalStorage = () => {
            localStorage.setItem('minimum_passing_grade',                 String(minimumPassingGrade))
            localStorage.setItem('minimum_recovery_grade',                String(minimumRecoveryGrade))
            localStorage.setItem('minimum_attendance_percentage_to_pass', String(minimumAttendancePercentageToPass))

            localStorage.setItem('has_responsible_teacher_name', String(hasResponsibleTeacherName))
            localStorage.setItem('has_signatures',               String(hasSignatures))
            localStorage.setItem('has_concept',                  String(hasConcept))
            localStorage.setItem('has_concept_values',           String(hasConceptValues))
            localStorage.setItem('has_final_result_values',      String(hasFinalResultValues))
            localStorage.setItem('sidebar_open',                 String(isOpen))

            localStorage.setItem('keep_values',       JSON.stringify(maintainReportCardData))
            localStorage.setItem('active_quarter',    JSON.stringify(activeQuarter))
            localStorage.setItem('files_image',       JSON.stringify(filesImage))
            localStorage.setItem('active_subjects',   JSON.stringify(subjects))
            localStorage.setItem('inactive_subjects', JSON.stringify(inactiveSubjects))

            localStorage.setItem('school',                 schoolReport.school)
            localStorage.setItem('teacher',                schoolReport.teacher)
            localStorage.setItem('student_name',           schoolReport.student.name)
            localStorage.setItem('student_number',         String(schoolReport.student.number))
            localStorage.setItem('student_year_and_class', schoolReport.student.yearAndClass)

            const grades = subjects.reduce((record, subject, index) => {
                const { grades } = schoolReport.studentAcademicRecord[subject]
                return { ...record, [index]: grades }
            }, {})
            const absences = subjects.reduce((record, subject, index) => {
                const { absences } = schoolReport.studentAcademicRecord[subject]
                return { ...record, [index]: absences }
            }, {})
            const totalClasses = subjects.reduce((record, subject, index) => {
                const { totalClasses } = schoolReport.studentAcademicRecord[subject]
                return { ...record, [index]: totalClasses }
            }, {})
            const totalAbsences = subjects.reduce((record, subject, index) => {
                const { totalAbsences } = schoolReport.studentAcademicRecord[subject]
                return { ...record, [index]: totalAbsences }
            }, {})
            const concept = subjects.reduce((record, subject, index) => {
                const { concept } = schoolReport.studentAcademicRecord[subject]
                return { ...record, [index]: concept }
            }, {})
            const finalResult = subjects.reduce((record, subject, index) => {
                const { finalResult } = schoolReport.studentAcademicRecord[subject]
                return { ...record, [index]: finalResult }
            }, {})

            localStorage.setItem('academic_record_grades',         JSON.stringify(grades))
            localStorage.setItem('academic_record_absences',       JSON.stringify(absences))
            localStorage.setItem('academic_record_total_classes',  JSON.stringify(totalClasses))
            localStorage.setItem('academic_record_total_absences', JSON.stringify(totalAbsences))
            localStorage.setItem('academic_record_concept',        JSON.stringify(concept))
            localStorage.setItem('academic_record_final_result',   JSON.stringify(finalResult))
        }

        updatedLocalStorage()
    },
    [
        isLoading,
        schoolReport.school,
        schoolReport.student.name,
        schoolReport.student.number,
        schoolReport.student.yearAndClass,
        schoolReport.teacher,
        schoolReport.studentAcademicRecord,
        minimumPassingGrade,
        minimumRecoveryGrade,
        minimumAttendancePercentageToPass,
        hasResponsibleTeacherName,
        hasSignatures,
        hasConcept,
        hasConceptValues,
        hasFinalResultValues,
        maintainReportCardData,
        activeQuarter,
        filesImage,
        subjects,
        inactiveSubjects,
        isOpen
    ])

    return(
        <LocalStorageContext.Provider value={{ getItemsLocalStorage }}>
            {children}
        </LocalStorageContext.Provider>
    )
}