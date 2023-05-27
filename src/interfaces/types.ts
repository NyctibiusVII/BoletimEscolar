export type MaintainReportCardData = {
    school:       boolean
    teacher:      boolean
    name:         boolean
    number:       boolean
    yearAndClass: boolean
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