export type Bimester = {
    firstQuarter:  number
    secondQuarter: number
    thirdQuarter:  number
    fourthQuarter: number
}
export type Matter =
  | 'Português'
  | 'Matemática'
  | 'História'
  | 'Geografia'
  | 'Física'
  | 'Química'
  | 'Biologia'
  | 'Filosofia'
  | 'Sociologia'
  | 'Inglês'
  | 'Espanhol'
  | 'Educação Física'
  | 'Artes'
  | 'Ensino Religioso'
  | 'Tecnologia'
  | 'Convivência'
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
interface AcademicRecord {
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
interface Student {
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
/* Components/Form/Input */
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