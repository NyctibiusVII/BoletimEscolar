import { useEffect, useRef, useState } from 'react'
import { GetStaticProps } from 'next'

import { FormHandles, Scope, SubmitHandler } from '@unform/core'
import { Form } from '@unform/web'
import domtoimage from 'dom-to-image'

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
    const mainRef = useRef<HTMLDivElement>(null)

    const hasResponsibleTeacherName = true
    const hasSignatures = true
    const hasConcept = true
    const hasConceptValues = true
    const hasFinalResultValues = true

    const [activeQuarter, setActiveQuarter] = useState({
        firstQuarter: true,
        secondQuarter: true,
        thirdQuarter: true,
        fourthQuarter: true
    })
    const noteWeight = Object.values(activeQuarter).filter(Boolean).length

    const [schoolReportColors, setSchoolReportColors] = useState({
        card:              `bg-white`,
        border:            `border-gray-95`,
        clippingBorder:    `border-red-600`,
        signatures:        `bg-gray-95`,
        text:              `text-gray-95`,
        insufficientGrade: `text-red-600`,
        enoughGrade:       `text-green-500`
    })
    const minimumAttendancePercentageToPass = 25
    const minimumPassingGrade = 6
    const minimumRecoveryGrade = 4

    const [subjects, setSubjects] = useState<Matter[]>([
        'Português', 'Matemática', 'Ciências', 'História', 'Geografia'
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
            grades[bimester] = academicRecord === 'grades' ? value : grades[bimester]
            absences[bimester] = academicRecord === 'absences' ? value : absences[bimester]

            const gradesByQuarter = Object.values(grades)
            const absencesByQuarter = Object.values(absences)

            const sumGradesByActiveQuarter = Object.keys(activeQuarter).reduce((acc, quarter, index) => {
                return activeQuarter[quarter as keyof typeof activeQuarter] ? acc + gradesByQuarter[index] : acc
            }, 0)
            const average = sumGradesByActiveQuarter / noteWeight

            const concept =
                average >= 7
                    ? Concept.A
                    : average >= 5
                        ? Concept.B
                        : average >= 3
                            ? Concept.C
                            : Concept.D

            const newTotalAbsences = Object.keys(activeQuarter).reduce((acc, quarter, index) => {
                return activeQuarter[quarter as keyof typeof activeQuarter] ? acc + absencesByQuarter[index] : acc
            }, 0)
            const presencePercentage = totalClasses === 0 ? 0 : ((totalClasses - newTotalAbsences) / totalClasses) * 100

            const finalResult =
                average >= minimumPassingGrade
                    ? SubjectSituation.APPROVED
                    : presencePercentage < minimumAttendancePercentageToPass
                        ? SubjectSituation.FAILED_FOR_ABSENCE
                        : average >= minimumRecoveryGrade
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
        console.log(data)
        generateImage()
        // setSchoolReport(schoolReportStartup)
    }

    const generateImage = () => {
        const schoolReportNode: HTMLElement = document.getElementById('school-report') ?? document.body
        const buttonGenerateImage: HTMLElement | null = document.getElementById('generate-image')

        if(!buttonGenerateImage) return
        buttonGenerateImage.style.visibility = 'hidden'

        domtoimage.toPng(schoolReportNode)
            .then(dataUrl => {
                var img = new Image()
                img.src = dataUrl
                document.body.appendChild(img)
            })
            .catch(error => console.error('Opa, algo deu errado!\nPor favor, recarregue a página.', error))
            .finally(() => buttonGenerateImage.style.visibility = 'visible')
    }

    return (
        <div className={`min-h-screen ${schoolReportColors.text} flex flex-col items-center justify-center`}>
            <main
                id='school-report'
                ref={mainRef}
                onMouseEnter={() => { if (mainRef.current) mainRef.current.classList.add(schoolReportColors.clippingBorder) }}
                onMouseLeave={() => { if (mainRef.current) mainRef.current.classList.remove(schoolReportColors.clippingBorder) }}
                className={`w-auto min-w-[30rem] ${schoolReportColors.card} border-2 border-solid hover:border-dashed ${inter.className} font-bold p-2 flex flex-col items-center justify-center gap-4`}
            >
                <Form ref={formRef} onSubmit={handleFormSubmit} className={`border ${schoolReportColors.border}`}>
                    <section>
                        <h1 className='text-center my-6'>BOLETIM ESCOLAR:&nbsp;<span>{schoolReport.academicYear}</span></h1>

                        <hr className={schoolReportColors.border} />

                        <div className='flex justify-between gap-12 p-1'>
                            <Input
                                name='school'
                                label='Escola:'
                                type='text'
                                className={`w-full min-w-[24rem] ${schoolReportColors.card}`}
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
                                    className={`w-36 ${schoolReportColors.card}`}
                                    onChange={event => setSchoolReport(prevState => ({ ...prevState, teacher: event.target.value }))}
                                    value={schoolReport.teacher}
                                    container
                                    required
                                />
                            }
                        </div>

                        <hr className={schoolReportColors.border} />

                        <div className='flex justify-between gap-12 p-1'>
                            <Scope path='student'>
                                <Input
                                    name='name'
                                    label='Nome:'
                                    type='text'
                                    className={`w-full min-w-[24rem] ${schoolReportColors.card}`}
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
                                        className={`w-9 ${schoolReportColors.card}`}
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
                                        className={`w-12 ${schoolReportColors.card}`}
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
                                    <th className={`tableItens w-40 border border-t-2 border-r-2 ${schoolReportColors.border}`} rowSpan={2}>Componentes curriculares</th>
                                    <th className={`tableItens border border-t-2 border-r-2 ${schoolReportColors.border}`} colSpan={4}>Notas</th>
                                    <th className={`tableItens border border-t-2 border-r-2 ${schoolReportColors.border}`} colSpan={4}>Faltas</th>
                                    { hasConcept && <th className={`tableItens w-20 border border-t-2 ${schoolReportColors.border}`} rowSpan={2}>5° Conceito</th> }
                                    <th className={`tableItens w-20 border border-t-2 ${schoolReportColors.border}`} rowSpan={2}>Total de faltas</th>
                                    <th className={`tableItens w-30 border border-t-2 ${schoolReportColors.border}`} rowSpan={2}>Resultado final</th>
                                </tr>
                                <tr>
                                    <th className={`tableItens w-14 border ${schoolReportColors.border}`}>1° Bim</th>
                                    <th className={`tableItens w-14 border ${schoolReportColors.border}`}>2° Bim</th>
                                    <th className={`tableItens w-14 border ${schoolReportColors.border}`}>3° Bim</th>
                                    <th className={`tableItens w-14 border border-r-2 ${schoolReportColors.border}`}>4° Bim</th>
                                    <th className={`tableItens w-14 border ${schoolReportColors.border}`}>1° Bim</th>
                                    <th className={`tableItens w-14 border ${schoolReportColors.border}`}>2° Bim</th>
                                    <th className={`tableItens w-14 border ${schoolReportColors.border}`}>3° Bim</th>
                                    <th className={`tableItens w-14 border border-r-2 ${schoolReportColors.border}`}>4° Bim</th>
                                </tr>
                            </thead>

                            <tbody>
                                { subjects.map(subject => {
                                    const matter = schoolReport.studentAcademicRecord[`${subject}`]

                                    return (
                                        <Scope path={`${subject}`} key={subject}>
                                            <tr key={subject}>
                                                <td className={`tableItens border border-r-2 ${schoolReportColors.border}`}>{subject}</td>
                                                <Scope path='grades'>
                                                    <td className={`tableItens border ${schoolReportColors.border}`}>
                                                        { activeQuarter.firstQuarter &&
                                                            <Input
                                                                name='firstQuarter'
                                                                type='number'
                                                                className={`w-10 ${schoolReportColors.card} ${matter?.grades.firstQuarter >= minimumPassingGrade ? schoolReportColors.enoughGrade : schoolReportColors.insufficientGrade}`}
                                                                onChange={event => updateStudentAcademicRecord(Number(event.target.value), subject, 'firstQuarter', 'grades')}
                                                                value={matter?.grades.firstQuarter}
                                                                step='0.1'
                                                                min='0'
                                                                max='10'
                                                            />
                                                        }
                                                    </td>
                                                    <td className={`tableItens border ${schoolReportColors.border}`}>
                                                        { activeQuarter.firstQuarter &&
                                                            <Input
                                                                name='secondQuarter'
                                                                type='number'
                                                                className={`w-10 ${schoolReportColors.card} ${matter?.grades.firstQuarter >= minimumPassingGrade ? schoolReportColors.enoughGrade : schoolReportColors.insufficientGrade}`}
                                                                onChange={event => updateStudentAcademicRecord(Number(event.target.value), subject, 'secondQuarter', 'grades')}
                                                                value={matter?.grades.secondQuarter}
                                                                step='0.1'
                                                                min='0'
                                                                max='10'
                                                            />
                                                        }
                                                    </td>
                                                    <td className={`tableItens border ${schoolReportColors.border}`}>
                                                        { activeQuarter.firstQuarter &&
                                                            <Input
                                                                name='thirdQuarter'
                                                                type='number'
                                                                className={`w-10 ${schoolReportColors.card} ${matter?.grades.firstQuarter >= minimumPassingGrade ? schoolReportColors.enoughGrade : schoolReportColors.insufficientGrade}`}
                                                                onChange={event => updateStudentAcademicRecord(Number(event.target.value), subject, 'thirdQuarter', 'grades')}
                                                                value={matter?.grades.thirdQuarter}
                                                                step='0.1'
                                                                min='0'
                                                                max='10'
                                                            />
                                                        }
                                                    </td>
                                                    <td className={`tableItens border border-r-2 ${schoolReportColors.border}`}>
                                                        { activeQuarter.firstQuarter &&
                                                            <Input
                                                                name='fourthQuarter'
                                                                type='number'
                                                                className={`w-10 ${schoolReportColors.card} ${matter?.grades.firstQuarter >= minimumPassingGrade ? schoolReportColors.enoughGrade : schoolReportColors.insufficientGrade}`}
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
                                                    <td className={`tableItens border ${schoolReportColors.border}`}>
                                                        { activeQuarter.firstQuarter &&
                                                            <Input
                                                                name='firstQuarter'
                                                                type='number'
                                                                className={`w-10 ${schoolReportColors.card}`}
                                                                onChange={event => updateStudentAcademicRecord(Number(event.target.value), subject, 'firstQuarter', 'absences')}
                                                                value={matter?.absences.firstQuarter}
                                                                step='1'
                                                                min='0'
                                                                max='62'
                                                            />
                                                        }
                                                    </td>
                                                    <td className={`tableItens border ${schoolReportColors.border}`}>
                                                        { activeQuarter.secondQuarter &&
                                                            <Input
                                                                name='secondQuarter'
                                                                type='number'
                                                                className={`w-10 ${schoolReportColors.card}`}
                                                                onChange={event => updateStudentAcademicRecord(Number(event.target.value), subject, 'secondQuarter', 'absences')}
                                                                value={matter?.absences.secondQuarter}
                                                                step='1'
                                                                min='0'
                                                                max='62'
                                                            />
                                                        }
                                                    </td>
                                                    <td className={`tableItens border ${schoolReportColors.border}`}>
                                                        { activeQuarter.thirdQuarter &&
                                                            <Input
                                                                name='thirdQuarter'
                                                                type='number'
                                                                className={`w-10 ${schoolReportColors.card}`}
                                                                onChange={event => updateStudentAcademicRecord(Number(event.target.value), subject, 'thirdQuarter', 'absences')}
                                                                value={matter?.absences.thirdQuarter}
                                                                step='1'
                                                                min='0'
                                                                max='62'
                                                            />
                                                        }
                                                    </td>
                                                    <td className={`tableItens border border-r-2 ${schoolReportColors.border}`}>
                                                        { activeQuarter.fourthQuarter &&
                                                            <Input
                                                                name='fourthQuarter'
                                                                type='number'
                                                                className={`w-10 ${schoolReportColors.card}`}
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
                                                    <td className={`tableItens border ${schoolReportColors.border}`}>
                                                        {hasConceptValues &&
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
                                                <td className={`tableItens border ${schoolReportColors.border}`}>
                                                    <Input
                                                        name='totalAbsences'
                                                        type='number'
                                                        className='w-16 disabled:bg-transparent'
                                                        value={matter?.totalAbsences}
                                                        readOnly
                                                        disabled
                                                    />
                                                </td>
                                                <td className={`tableItens border ${schoolReportColors.border}`}>
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

                    <button
                        id='generate-image'
                        type='submit'
                        className='text-white bg-green-500 hover:bg-green-600 border border-white rounded-lg py-2 px-4 shadow-lg fixed right-16 bottom-16 transition-colors'
                    >
                        Gerar Imagem
                    </button>
                </Form>

                { hasSignatures &&
                    <div className='w-full flex flex-col gap-4'>
                        <div className='flex gap-4'>
                            <div className='w-full flex items-end'><p className='w-24'>1° Bim:</p><span className={`w-full h-0.5 ${schoolReportColors.signatures}`} /></div>
                            <div className='w-full flex items-end'><p className='w-24'>2° Bim:</p><span className={`w-full h-0.5 ${schoolReportColors.signatures}`} /></div>
                        </div>

                        <div className='flex gap-4'>
                            <div className='w-full flex items-end'><p className='w-24'>3° Bim:</p><span className={`w-full h-0.5 ${schoolReportColors.signatures}`} /></div>
                            <div className='w-full flex items-end'><p className='w-24'>4° Bim:</p><span className={`w-full h-0.5 ${schoolReportColors.signatures}`} /></div>
                        </div>
                    </div>
                }
            </main>
        </div>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const academicYear = new Date().getFullYear()

    return {
        props: { academicYear },
        revalidate: 60 * 60 * 24 // 24 hours
    }
}