import { useContext, useRef } from 'react'

import { FormHandles, Scope, SubmitHandler } from '@unform/core'
import { Form } from '@unform/web'

import { GenerateImageContext } from '@/contexts/GenerateImageContext'
import { useSchoolReportConfig } from '@/hooks/useSchoolReportConfig'
import { useSchoolReport } from '@/hooks/useSchoolReport'
import { useSidebar } from '@/hooks/useSidebar'
import { Sidebar } from '@/components/sidebar'
import { Input } from '@/components/input'

import { SchoolReport } from '@/interfaces/types'
import { useTheme } from 'next-themes'
import Swal from 'sweetalert2'

import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    const formRef = useRef<FormHandles>(null)
    const mainRef = useRef<HTMLDivElement>(null)

    const { theme } = useTheme()
    const { isOpen } = useSidebar()
    const { generateImage } = useContext(GenerateImageContext)

    const {
        subjects,
        activeQuarter,
        // schoolReportColors,
        maintainReportCardData,
        minimumPassingGrade,
        hasResponsibleTeacherName,
        hasSignatures,
        hasConcept,
        hasConceptValues,
        hasFinalResultValues
    } = useSchoolReportConfig()

    const {
        schoolReport,
        setSchoolReport,
        schoolReportStartup,
        updateStudentAcademicRecord
    } = useSchoolReport()

    const handleFormSubmit: SubmitHandler<SchoolReport> = data => {
        const swalColors = {
            bg: theme === 'dark' ? '#111827' : '#ffffff',
            fg: theme === 'dark' ? '#f3f4f6' : '#374151'
        }
        let timerInterval: NodeJS.Timer

        Swal.fire({
            title: 'Carregando...',
            text: 'Gerando imagem do seu boletim escolar',
            timer: 1000,
            background: swalColors.bg,
            color: swalColors.fg,
            didOpen: () => Swal.showLoading(),
            willClose: () => clearInterval(timerInterval)
        })
        .then(result => {
            if (result.dismiss === Swal.DismissReason.timer) {
                generateImage()
                .then(() => {
                    Swal.fire({
                        title: 'Sucesso!',
                        text: 'Acesse sua imagem gerada na barra lateral desta página.',
                        icon: 'success',
                        background: swalColors.bg,
                        color: swalColors.fg,
                        iconColor: '#4ade80'
                    })
                    .then(() => console.info('Imagem gerada com sucesso!', { 'conteúdo': data }))
                })
                .then(() =>
                    setSchoolReport({
                        ...schoolReportStartup,
                        school:  maintainReportCardData.school  ? data.school  : '',
                        teacher: maintainReportCardData.teacher ? data.teacher : '',
                        student: {
                            name:         maintainReportCardData.name         ? data.student.name         : '',
                            number:       maintainReportCardData.number       ? data.student.number       : 0,
                            yearAndClass: maintainReportCardData.yearAndClass ? data.student.yearAndClass : ''
                        }
                    })
                )
                .catch(error => {
                    Swal.fire({
                        title: 'Erro ao gerar imagem!',
                        icon: 'error',
                        background: swalColors.bg,
                        color: swalColors.fg,
                        iconColor: '#f87171',
                        confirmButtonText: 'Tentar novamente',
                        confirmButtonColor: '#2778c4',
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                        cancelButtonColor: '#f87171'
                    })
                    .then(result => {
                        if (result.isConfirmed) {
                            const SubmitHandler = document.getElementById('generate-image') as HTMLButtonElement | null
                            if (SubmitHandler) SubmitHandler.click()
                        }
                    })
                    .finally(() => console.error('Erro ao gerar imagem!', error))
                })
            }
        })
    }

    const schoolReportColors = {
        card:              `bg-white`,
        border:            `border-gray-950`,
        clippingBorder:    `border-red-600`,
        signatures:        `bg-gray-950`,
        text:              `text-gray-950`,
        insufficientGrade: `text-red-600`,
        enoughGrade:       `text-green-500`
    }

    return (
        <div className={`w-screen h-screen flex items-end lg:justify-end`}>
            <Sidebar/>

            <div className={
                `${isOpen
                    ? 'lg:w-[calc(100%-20rem)] 2xl:w-5/6'
                    : 'lg:w-[95.9%]'
                } w-full h-[calc(100%-5.75rem)] lg:h-full flex flex-col items-center justify-center overflow-x-auto px-4 lg:px-8`
            }>
                <main
                    id='school-report'
                    ref={mainRef}
                    onMouseEnter={() => { if (mainRef.current) mainRef.current.classList.add(schoolReportColors.clippingBorder) }}
                    onMouseLeave={() => { if (mainRef.current) mainRef.current.classList.remove(schoolReportColors.clippingBorder) }}
                    className={`w-fit max-w-6xl ${schoolReportColors.text} ${schoolReportColors.card} border-2 border-solid hover:border-dashed ${inter.className} font-bold p-2 flex flex-col items-center justify-center gap-4 z-10`}
                >
                    <Form ref={formRef} onSubmit={handleFormSubmit} className={`w-full border ${schoolReportColors.border}`}>
                        <section>
                            <h1 className='text-center my-6'>BOLETIM ESCOLAR:&nbsp;<span>{schoolReport.academicYear}</span></h1>

                            <hr className={schoolReportColors.border} />

                            <div className='flex justify-between gap-12 p-1'>
                                <Input
                                    name='school'
                                    label='Escola:'
                                    type='text'
                                    className={`w-full lg:min-w-[24rem] ${schoolReportColors.card}`}
                                    onChange={event => setSchoolReport({...schoolReport, school: event.target.value})}
                                    value={schoolReport.school}
                                    container
                                    required
                                />
                                { hasResponsibleTeacherName &&
                                    <Input
                                        name='teacher'
                                        label='Prof:'
                                        type='text'
                                        className={`w-full ${schoolReportColors.card}`}
                                        onChange={event => setSchoolReport({...schoolReport, teacher: event.target.value})}
                                        value={schoolReport.teacher}
                                        container
                                        required
                                    />
                                }
                            </div>

                            <hr className={schoolReportColors.border} />

                            <div className='flex justify-between gap-1 sm:gap-0 p-1'>
                                <Scope path='student'>
                                    <Input
                                        name='name'
                                        label='Nome:'
                                        type='text'
                                        className={`w-full lg:min-w-[24rem] ${schoolReportColors.card}`}
                                        onChange={event => setSchoolReport({...schoolReport, student: {...schoolReport.student, name: event.target.value}})}
                                        value={schoolReport.student.name}
                                        container
                                        required
                                    />

                                    <div className='flex gap-1 lg:gap-8'>
                                        <Input
                                            name='number'
                                            label='N°:'
                                            type='number'
                                            className={`w-full sm:w-9 inputNumberValues ${schoolReportColors.card}`}
                                            onChange={event => setSchoolReport({...schoolReport, student: {...schoolReport.student, number: Number(event.target.value)}})}
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
                                            className={`w-full ${schoolReportColors.card}`}
                                            onChange={event => setSchoolReport({...schoolReport, student: {...schoolReport.student, yearAndClass: event.target.value}})}
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
                            <table className='w-full table-auto border-collapse border-spacing-0 break-all sm:break-normal'>
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
                                                                    className={`w-[2.6rem] inputNumberValues ${schoolReportColors.card} ${matter?.grades.firstQuarter >= minimumPassingGrade ? schoolReportColors.enoughGrade : schoolReportColors.insufficientGrade}`}
                                                                    onChange={event => updateStudentAcademicRecord(Number(event.target.value), subject, 'firstQuarter', 'grades')}
                                                                    value={matter?.grades.firstQuarter}
                                                                    step='0.1'
                                                                    min='0'
                                                                    max='10'
                                                                />
                                                            }
                                                        </td>
                                                        <td className={`tableItens border ${schoolReportColors.border}`}>
                                                            { activeQuarter.secondQuarter &&
                                                                <Input
                                                                    name='secondQuarter'
                                                                    type='number'
                                                                    className={`w-[2.6rem] inputNumberValues ${schoolReportColors.card} ${matter?.grades.secondQuarter >= minimumPassingGrade ? schoolReportColors.enoughGrade : schoolReportColors.insufficientGrade}`}
                                                                    onChange={event => updateStudentAcademicRecord(Number(event.target.value), subject, 'secondQuarter', 'grades')}
                                                                    value={matter?.grades.secondQuarter}
                                                                    step='0.1'
                                                                    min='0'
                                                                    max='10'
                                                                />
                                                            }
                                                        </td>
                                                        <td className={`tableItens border ${schoolReportColors.border}`}>
                                                            { activeQuarter.thirdQuarter &&
                                                                <Input
                                                                    name='thirdQuarter'
                                                                    type='number'
                                                                    className={`w-[2.6rem] inputNumberValues ${schoolReportColors.card} ${matter?.grades.thirdQuarter >= minimumPassingGrade ? schoolReportColors.enoughGrade : schoolReportColors.insufficientGrade}`}
                                                                    onChange={event => updateStudentAcademicRecord(Number(event.target.value), subject, 'thirdQuarter', 'grades')}
                                                                    value={matter?.grades.thirdQuarter}
                                                                    step='0.1'
                                                                    min='0'
                                                                    max='10'
                                                                />
                                                            }
                                                        </td>
                                                        <td className={`tableItens border border-r-2 ${schoolReportColors.border}`}>
                                                            { activeQuarter.fourthQuarter &&
                                                                <Input
                                                                    name='fourthQuarter'
                                                                    type='number'
                                                                    className={`w-[2.6rem] inputNumberValues ${schoolReportColors.card} ${matter?.grades.fourthQuarter >= minimumPassingGrade ? schoolReportColors.enoughGrade : schoolReportColors.insufficientGrade}`}
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
                                                                    className={`w-[2.6rem] inputNumberValues ${schoolReportColors.card}`}
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
                                                                    className={`w-[2.6rem] inputNumberValues ${schoolReportColors.card}`}
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
                                                                    className={`w-[2.6rem] inputNumberValues ${schoolReportColors.card}`}
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
                                                                    className={`w-[2.6rem] inputNumberValues ${schoolReportColors.card}`}
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
        </div>
    )
}