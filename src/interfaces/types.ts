export type FilesImage = {
    name: string
    imageData: string
}[]
export type MaintainReportCardData = {
    school:                     boolean
    teacher:                    boolean
    studentName:                boolean
    studentNumber:              boolean
    studentYearAndClass:        boolean
    academicRecordGrades:       boolean
    academicRecordAbsences:     boolean
    academicRecordTotalClasses: boolean
}
export type ActiveQuarter = {
    firstQuarter:  boolean
    secondQuarter: boolean
    thirdQuarter:  boolean
    fourthQuarter: boolean
}
export type Bimester = {
    firstQuarter:  number
    secondQuarter: number
    thirdQuarter:  number
    fourthQuarter: number
}
export type SchoolReportColors = {
    card:              string
    border:            string
    clippingBorder:    string
    signatures:        string
    text:              string
    insufficientGrade: string
    enoughGrade:       string
}
export type Matter =
  | 'Português'
  | 'Matemática'
  | 'História'
  | 'Geografia'
  | 'Física'
  | 'Química'
  | 'Biologia'
  | 'Ciências'
  | 'Filosofia'
  | 'Sociologia'
  | 'Inglês'
  | 'Educação Física'
  | 'Artes'
  | 'Ensino Religioso'
  | string
export enum SubjectSituation {
    APPROVED           = 'Aprovado',
    RECOVERY           = 'Em recuperação',
    FAILED_FOR_ABSENCE = 'Reprovado por falta',
    DISAPPROVED        = 'Reprovado'
}
export enum Concept {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D'
}
export interface AcademicRecord {
    grades:   Bimester
    absences: Bimester
    concept:  Concept
    totalClasses:  number
    totalAbsences: number
    finalResult:   SubjectSituation
}
export interface StudentAcademicRecord {
    [subject: Matter]: AcademicRecord
}
export interface Student {
    name:         string
    number:       number
    yearAndClass: string
}
export interface SchoolReport {
    school:       string
    teacher:      string
    academicYear: number
    student:               Student
    studentAcademicRecord: StudentAcademicRecord
}
/* Components/InfoIcon */
type InfoIconType = {
    topic:       string
    description: string
}
export type InfoIconProps = JSX.IntrinsicElements['svg'] & InfoIconType
/* Components/Input */
type InputType = {
    name:           string
    label?:         string
    labelPosition?: 'before' | 'after'
    container?:     boolean
    withForm?:      boolean
}
/**
 * Defines the types of native input properties.
 */
export type InputProps = JSX.IntrinsicElements['input'] & InputType
/* Components/Details */
type DetailsType = { summary?: string }
/**
 * Defines the types of native details properties.
 */
export type DetailsProps = JSX.IntrinsicElements['details'] & DetailsType
/* Contexts/LocalStorageContext */
export type GetLocalStorage = Record<
    string,
    | string
    | number
    | boolean
    | object
    | MaintainReportCardData
    | ActiveQuarter
    | FilesImage
    | Matter[]
    | Bimester
>
export type LocalStorage_AcademicRecordType =
    | 'academic_record_total_classes'
    | 'academic_record_total_absences'
    | 'academic_record_concept'
    | 'academic_record_final_result'
/**
 * Defines the default values.
 */
export enum DefaultValues {
    INPUT_TEXT   = '',
    INPUT_NUMBER = 0,
    MINIMUM_PASSING_GRADE                 = 6,
    MINIMUM_RECOVERY_GRADE                = 4,
    MINIMUM_ATTENDANCE_PERCENTAGE_TO_PASS = 25,
    KEEP_VALUES       = '{"school":true,"teacher":true,"studentName":false,"studentNumber":false,"studentYearAndClass":false,"academicRecordGrades":false,"academicRecordAbsences":false,"academicRecordTotalClasses":true}',
    BIMESTER          = '{"firstQuarter":0,"secondQuarter":0,"thirdQuarter":0,"fourthQuarter":0}',
    ACTIVE_QUARTER    = '{"firstQuarter":true,"secondQuarter":true,"thirdQuarter":true,"fourthQuarter":true}',
    ACTIVE_SUBJECTS   = '["Português","Matemática","Ciências","História","Geografia"]',
    INACTIVE_SUBJECTS = '["Física","Química","Biologia","Filosofia","Sociologia","Inglês","Educação Física","Artes","Ensino Religioso"]',
    MATTER            = '["Português","Matemática","Ciências","História","Geografia","Física","Química","Biologia","Filosofia","Sociologia","Inglês","Educação Física","Artes","Ensino Religioso"]',
    FILES_IMAGE       = '[]',
    TOTAL_CLASSES  = 56,
    TOTAL_ABSENCES = 0,
    CONCEPT      = Concept.D,
    FINAL_RESULT = SubjectSituation.DISAPPROVED
}