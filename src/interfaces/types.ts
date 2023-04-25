export interface FormInvoiceData {
    academicYear: number
    school:       string
    responsibleTeacherName?: string
    student: Student
    studentAcademicRecord: StudentAcademicRecord
}
type Student = {
    studentName:         string
    studentNumber:       number
    studentYearAndClass: string
}
type StudentAcademicRecord = {
    subject: Matter
    subjectSituation: 'Aprovado' | 'Reprovado' | 'Em recuperação'
    grades:   Grades
    absences: Absences
}
type Grades = {
    firstQuarter:  number
    secondQuarter: number
    thirdQuarter:  number
    fourthQuarter: number
}
type Absences = {
    firstQuarter:  number
    secondQuarter: number
    thirdQuarter:  number
    fourthQuarter: number
}
type Matter =
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
  | string;
/* Components/Form/Input */
interface InputType {
    name:  string
    label: string
    container?: boolean
}
/**
 * Defines the types of native input properties.
 */
export type InputProps = JSX.IntrinsicElements['input'] & InputType