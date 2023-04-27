import { useRef, useState } from 'react'
import { GetStaticProps } from 'next'

import { FormHandles, Scope, SubmitHandler } from '@unform/core'
import { Form } from '@unform/web'

import { Input } from '@/components/form/input'

import {
    StudentAcademicRecord,
    Bimester,
    Matter,
    SchoolReport,
    Concept,
    SubjectSituation
} from '@/interfaces/types'

import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

interface HomeProps {
    academicYear: number
}

export default function Home({ academicYear }: HomeProps) {
    const formRef = useRef<FormHandles>(null)

    const hasResponsibleTeacherName = true
    const hasConcept           = true
    const hasConceptValues     = true
    const hasFinalResultValues = true

    const [activeQuarter, setActiveQuarter] = useState({
        firstQuarter:  true,
        secondQuarter: true,
        thirdQuarter:  true,
        fourthQuarter: true
    })

    const insufficientGradeColor = 'red-600'
    const enoughGradeColor       = 'green-500'
    const percentageOfAbsencesToFail = 25
    const passingGrade  = 6
    const recoveryGrade = 4
    const noteWeight    = 4

    const [subjects, setSubjects] = useState<Matter[]>([
        'Português', 'Matemática', 'Ciências', 'História', 'Geografia', 'Tecnologia', 'Convivência'
    ])

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
                totalClasses: 1,
                totalAbsences: 0,
                finalResult: SubjectSituation.DISAPPROVED
            }
        })
        return newStudentAcademicRecord
    }
    const schoolReportStartup: SchoolReport = {
        school: '',
        teacher: '',
        academicYear,
        student: {
            name: '',
            number: 0,
            yearAndClass: ''
        },
        studentAcademicRecord: studentAcademicRecord()
    }
    const [schoolReport, setSchoolReport] = useState<SchoolReport>(schoolReportStartup)

    const updateStudentAcademicRecord = (
        value:    number,
        subject:  Matter,
        bimester: keyof Bimester,
        academicRecord: 'grades' | 'absences'
    ) => {
        const dataUpdate = (prevState: SchoolReport) => {
            const { grades, absences, totalClasses } = { ...prevState.studentAcademicRecord[subject] }
            grades[bimester]   = academicRecord === 'grades'   ? value : grades[bimester]
            absences[bimester] = academicRecord === 'absences' ? value : absences[bimester]

            const gradesByQuarter   = Object.values(grades)
            const absencesByQuarter = Object.values(absences)

            const average = (
                (activeQuarter.firstQuarter  ? gradesByQuarter[0] : 0) +
                (activeQuarter.secondQuarter ? gradesByQuarter[1] : 0) +
                (activeQuarter.thirdQuarter  ? gradesByQuarter[2] : 0) +
                (activeQuarter.fourthQuarter ? gradesByQuarter[3] : 0)
            ) / noteWeight

            const concept =
                average >= 7
                    ? Concept.A
                    : average >= 5
                        ? Concept.B
                        : average >= 3
                            ? Concept.C
                            : Concept.D

            const newTotalAbsences = (
                (activeQuarter.firstQuarter  ? absencesByQuarter[0] : 0) +
                (activeQuarter.secondQuarter ? absencesByQuarter[1] : 0) +
                (activeQuarter.thirdQuarter  ? absencesByQuarter[2] : 0) +
                (activeQuarter.fourthQuarter ? absencesByQuarter[3] : 0)
            )

            const presencePercentage = totalClasses === 0 ? 0 : ((totalClasses - newTotalAbsences) / totalClasses) * 100

            const finalResult =
                average >= passingGrade
                    ? SubjectSituation.APPROVED
                    : presencePercentage < percentageOfAbsencesToFail
                        ? SubjectSituation.FAILED_FOR_ABSENCE
                        : average >= recoveryGrade
                            ? SubjectSituation.RECOVERY
                            : SubjectSituation.DISAPPROVED

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

    const handleFormSubmit: SubmitHandler<SchoolReport> = data => {
        // sendData(schoolReport)
        console.log(data)
        // setSchoolReport(schoolReportStartup)
    }

    return(
        <div className='min-h-screen flex flex-col items-center justify-center'>
            <main className={`w-auto min-w-[30rem] bg-white border-2 border-solid border-gray-70 ${inter.className} font-bold p-2 flex flex-col items-center justify-center gap-4 hover:border-dashed hover:border-red-600`}>
                <Form ref={formRef} onSubmit={handleFormSubmit} className='border'>
                    <section>
                        <h1 className='text-center my-6'>BOLETIM ESCOLAR:&nbsp;<span>{schoolReport.academicYear}</span></h1>

                        <hr />

                        <div className='flex justify-between gap-12 p-1'>
                            <Input
                                name='school'
                                label='Escola:'
                                type='text'
                                className='w-full min-w-[24rem]'
                                onChange={event => setSchoolReport(prevState => ({ ...prevState, school: event.target.value }))}
                                value={schoolReport.school}
                                container
                                required
                            />
                            { hasResponsibleTeacherName &&
                                <Input
                                    name='teacher'
                                    label='Prof:'
                                    type='text'
                                    className='w-36'
                                    onChange={event => setSchoolReport(prevState => ({ ...prevState, teacher: event.target.value }))}
                                    value={schoolReport.teacher}
                                    container
                                    required
                                />
                            }
                        </div>

                        <hr />

                        <div className='flex justify-between gap-12 p-1'>
                            <Scope path='student'>
                                <Input
                                    name='name'
                                    label='Nome:'
                                    type='text'
                                    className='w-full min-w-[24rem]'
                                    onChange={event => setSchoolReport(prevState => ({ ...prevState, student: { ...prevState.student, name: event.target.value } }))}
                                    value={schoolReport.student.name}
                                    container
                                    required
                                />

                                <div className='flex gap-8'>
                                    <Input
                                        name='number'
                                        label='N°:'
                                        type='number'
                                        className='w-9'
                                        onChange={event => setSchoolReport(prevState => ({ ...prevState, student: { ...prevState.student, number: Number(event.target.value) } }))}
                                        value={schoolReport.student.number}
                                        step='1'
                                        min='1'
                                        max='99'
                                        container
                                        required
                                    />
                                    <Input
                                        name='yearAndClass'
                                        label='Ano:'
                                        type='text'
                                        className='w-12'
                                        onChange={event => setSchoolReport(prevState => ({ ...prevState, student: { ...prevState.student, yearAndClass: event.target.value } }))}
                                        value={schoolReport.student.yearAndClass}
                                        minLength={1}
                                        maxLength={4}
                                        container
                                        required
                                    />
                                </div>
                            </Scope>
                        </div>
                    </section>

                    <Scope path='studentAcademicRecord'>
                        <table className='table-auto border-collapse border-spacing-0'>
                            <thead>
                                <tr>
                                    <th className='tableItens w-40 border border-t-2 border-r-2' rowSpan={2}>Componentes curriculares</th>
                                    <th className='tableItens border border-t-2 border-r-2' colSpan={4}>Notas</th>
                                    <th className='tableItens border border-t-2 border-r-2' colSpan={4}>Faltas</th>
                                    { hasConcept && <th className='tableItens w-20 border border-t-2' rowSpan={2}>5° Conceito</th> }
                                    <th className='tableItens w-20 border border-t-2' rowSpan={2}>Total de faltas</th>
                                    <th className='tableItens w-30 border border-t-2' rowSpan={2}>Resultado final</th>
                                </tr>
                                <tr>
                                    <th className='tableItens w-14 border'>1° Bim</th>
                                    <th className='tableItens w-14 border'>2° Bim</th>
                                    <th className='tableItens w-14 border'>3° Bim</th>
                                    <th className='tableItens w-14 border border-r-2'>4° Bim</th>
                                    <th className='tableItens w-14 border'>1° Bim</th>
                                    <th className='tableItens w-14 border'>2° Bim</th>
                                    <th className='tableItens w-14 border'>3° Bim</th>
                                    <th className='tableItens w-14 border border-r-2'>4° Bim</th>
                                </tr>
                            </thead>

                            <tbody>
                                { subjects.map((subject, index) => {
                                    const matter = schoolReport.studentAcademicRecord[`${subject}`]

                                    return (
                                        <Scope path={`${subject}`} key={index}>
                                            <tr key={index}>
                                                <td className='tableItens border border-r-2'>{subject}</td>
                                                <Scope path='grades'>
                                                    <td className='tableItens border'>
                                                        { activeQuarter.firstQuarter &&
                                                            <Input
                                                                name='firstQuarter'
                                                                type='number'
                                                                className={`w-10 text-${ matter?.grades.firstQuarter >= passingGrade ? enoughGradeColor : insufficientGradeColor }`}
                                                                onChange={event => updateStudentAcademicRecord(Number(event.target.value), subject, 'firstQuarter', 'grades')}
                                                                value={matter?.grades.firstQuarter}
                                                                step='0.1'
                                                                min='0'
                                                                max='10'
                                                            />
                                                        }
                                                    </td>
                                                    <td className='tableItens border'>
                                                        { activeQuarter.firstQuarter &&
                                                            <Input
                                                                name='secondQuarter'
                                                                type='number'
                                                                className={`w-10 text-${ matter?.grades.secondQuarter >= passingGrade ? enoughGradeColor : insufficientGradeColor }`}
                                                                onChange={event => updateStudentAcademicRecord(Number(event.target.value), subject, 'secondQuarter', 'grades')}
                                                                value={matter?.grades.secondQuarter}
                                                                step='0.1'
                                                                min='0'
                                                                max='10'
                                                            />
                                                        }
                                                    </td>
                                                    <td className='tableItens border'>
                                                        { activeQuarter.firstQuarter &&
                                                            <Input
                                                                name='thirdQuarter'
                                                                type='number'
                                                                className={`w-10 text-${ matter?.grades.thirdQuarter >= passingGrade ? enoughGradeColor : insufficientGradeColor }`}
                                                                onChange={event => updateStudentAcademicRecord(Number(event.target.value), subject, 'thirdQuarter', 'grades')}
                                                                value={matter?.grades.thirdQuarter}
                                                                step='0.1'
                                                                min='0'
                                                                max='10'
                                                            />
                                                        }
                                                    </td>
                                                    <td className='tableItens border border-r-2'>
                                                        { activeQuarter.firstQuarter &&
                                                            <Input
                                                                name='fourthQuarter'
                                                                type='number'
                                                                className={`w-10 text-${ matter?.grades.fourthQuarter >= passingGrade ? enoughGradeColor : insufficientGradeColor }`}
                                                                onChange={event => updateStudentAcademicRecord(Number(event.target.value), subject, 'fourthQuarter', 'grades')}
                                                                value={matter?.grades.fourthQuarter}
                                                                step='0.1'
                                                                min='0'
                                                                max='10'
                                                            />
                                                        }
                                                    </td>
                                                </Scope>

                                                <Scope path='absences'>
                                                    <td className='tableItens border'>
                                                        { activeQuarter.firstQuarter &&
                                                            <Input
                                                                name='firstQuarter'
                                                                type='number'
                                                                className='w-10'
                                                                onChange={event => updateStudentAcademicRecord(Number(event.target.value), subject, 'firstQuarter', 'absences')}
                                                                value={matter?.absences.firstQuarter}
                                                                step='1'
                                                                min='0'
                                                                max='62'
                                                            />
                                                        }
                                                    </td>
                                                    <td className='tableItens border'>
                                                        { activeQuarter.secondQuarter &&
                                                            <Input
                                                                name='secondQuarter'
                                                                type='number'
                                                                className='w-10'
                                                                onChange={event => updateStudentAcademicRecord(Number(event.target.value), subject, 'secondQuarter', 'absences')}
                                                                value={matter?.absences.secondQuarter}
                                                                step='1'
                                                                min='0'
                                                                max='62'
                                                            />
                                                        }
                                                    </td>
                                                    <td className='tableItens border'>
                                                        { activeQuarter.thirdQuarter &&
                                                            <Input
                                                                name='thirdQuarter'
                                                                type='number'
                                                                className='w-10'
                                                                onChange={event => updateStudentAcademicRecord(Number(event.target.value), subject, 'thirdQuarter', 'absences')}
                                                                value={matter?.absences.thirdQuarter}
                                                                step='1'
                                                                min='0'
                                                                max='62'
                                                            />
                                                        }
                                                    </td>
                                                    <td className='tableItens border border-r-2'>
                                                        { activeQuarter.fourthQuarter &&
                                                            <Input
                                                                name='fourthQuarter'
                                                                type='number'
                                                                className='w-10'
                                                                onChange={event => updateStudentAcademicRecord(Number(event.target.value), subject, 'fourthQuarter', 'absences')}
                                                                value={matter?.absences.fourthQuarter}
                                                                step='1'
                                                                min='0'
                                                                max='62'
                                                            />
                                                        }
                                                    </td>
                                                </Scope>

                                                { hasConcept &&
                                                    <td className='tableItens border'>
                                                        { hasConceptValues &&
                                                            <Input
                                                                name='concept'
                                                                type='text'
                                                                className='w-8 disabled:bg-transparent text-center'
                                                                value={matter?.concept}
                                                                maxLength={1}
                                                                minLength={1}
                                                                readOnly
                                                                disabled
                                                            />
                                                        }
                                                    </td>
                                                }
                                                <td className='tableItens border'>
                                                    <Input
                                                        name='totalAbsences'
                                                        type='number'
                                                        className='w-16 disabled:bg-transparent'
                                                        value={matter?.totalAbsences}
                                                        readOnly
                                                        disabled
                                                    />
                                                </td>
                                                <td className='tableItens border'>
                                                    { hasFinalResultValues &&
                                                        <Input
                                                            name='finalResult'
                                                            type='text'
                                                            className='w-30 disabled:bg-transparent text-sm text-center'
                                                            value={matter?.finalResult}
                                                            readOnly
                                                            disabled
                                                        />
                                                    }
                                                </td>
                                            </tr>
                                        </Scope>
                                    )
                                }) }
                            </tbody>
                        </table>
                    </Scope>

                    <button type='submit'>ENVIAR</button>
                </Form>

                <div className='w-full flex flex-col gap-4'>
                    <div className='flex gap-4'>
                        <div className='w-full flex items-end'><p className='w-24'>1° Bim:</p><span className='w-full h-0.5 bg-black' /></div>
                        <div className='w-full flex items-end'><p className='w-24'>2° Bim:</p><span className='w-full h-0.5 bg-black' /></div>
                    </div>

                    <div className='flex gap-4'>
                        <div className='w-full flex items-end'><p className='w-24'>3° Bim:</p><span className='w-full h-0.5 bg-black' /></div>
                        <div className='w-full flex items-end'><p className='w-24'>4° Bim:</p><span className='w-full h-0.5 bg-black' /></div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const academicYear = new Date().getFullYear()

    return {
        props: {academicYear},
        revalidate: 60 * 60 * 24 // 24 hours
    }
}