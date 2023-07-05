import {
    useContext,
    useRef
} from 'react'
import Swal from 'sweetalert2'

import {
    Bimester,
    Concept,
    DefaultValues,
    SchoolReport,
    StudentAcademicRecord,
    SubjectSituation
} from '@/interfaces/types'

import {
    FormHandles,
    Scope,
    SubmitHandler
} from '@unform/core'
import { Form }  from '@unform/web'
import { Inter } from 'next/font/google'

import { GenerateImageContext } from '@/contexts/GenerateImageContext'
import { LocalStorageContext }  from '@/contexts/LocalStorageContext'
import { useSchoolReportConfig } from '@/hooks/useSchoolReportConfig'
import { useSchoolReport }       from '@/hooks/useSchoolReport'
import { useSwalTheme }          from '@/hooks/useSwalTheme'
import { useLoading }            from '@/hooks/useLoading'
import { useSidebar }            from '@/hooks/useSidebar'
import { SkeletonHome } from '@/components/Skeleton/pages/SkeletonHome'
import { Sidebar }      from '@/components/sidebar'
import { Input }        from '@/components/input'

import { useTheme }   from '@/hooks/useTheme'

export default function Home() {
    const { currentTheme } = useTheme()
    const { isLoading } = useLoading()
    const { isOpen } = useSidebar()
    const { generateImage } = useContext(GenerateImageContext)
    const { getItemsLocalStorage } = useContext(LocalStorageContext)
    const swalColors = useSwalTheme()

    useEffect(() => {
        const body = document.getElementsByTagName('body') as HTMLCollectionOf<HTMLBodyElement>
        if (!body) return

        const backgroundImage = {
            bg: currentTheme === 'dark' ? '#030712' : '#e2e8f0',
            fg: currentTheme === 'dark' ? '#111827' : '#cbd5e1'
        }
                        }
                    }, {} as StudentAcademicRecord)

        body[0].style.backgroundImage = `radial-gradient(${backgroundImage.fg} 2px, ${backgroundImage.bg} 2px)`
        body[0].style.backgroundSize = '40px 40px'
    }, [currentTheme])

    return isLoading
        ? <SkeletonHome />
        : <div className={`w-screen h-screen flex items-end lg:justify-end`}>
            <Sidebar />

            <div
                className={
                    `${isOpen
                        ? 'lg:w-[calc(100%-20rem)] 2xl:w-5/6'
                        : 'lg:w-[95.9%]'
                    } w-full h-[calc(100%-5.75rem)] lg:h-full flex flex-col items-center justify-center overflow-x-auto px-4 lg:px-8`
                }
            >
                <main
                    id='school-report'
                    ref={mainRef}
                    onMouseEnter={() => { if (mainRef.current) mainRef.current.classList.add(schoolReportColors.clippingBorder) }}
                    onMouseLeave={() => { if (mainRef.current) mainRef.current.classList.remove(schoolReportColors.clippingBorder) }}
                    className={`w-fit max-w-6xl ${schoolReportColors.text} ${schoolReportColors.card} border-2 border-solid hover:border-dashed ${inter.className} font-bold p-2 flex flex-col items-center justify-center gap-4 z-10`}
                >
                    <Form ref={formRef} onSubmit={handleFormSubmit} className={`w-full border ${schoolReportColors.border}`}>
                        <section>
                            <h1 className='my-6 text-center'>BOLETIM ESCOLAR:&nbsp;<span>{schoolReport.academicYear}</span></h1>

                            <hr className={schoolReportColors.border} />

                            <div className='flex justify-between gap-12 p-1'>
                                <Input
                                    name='school'
                                    label='Escola:'
                                    type='text'
                                    className={`w-full lg:min-w-[24rem]`}
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
                                        className={`w-full`}
                                        onChange={event => setSchoolReport({...schoolReport, teacher: event.target.value})}
                                        value={schoolReport.teacher}
                                        container
                                        required
                                    />
                                }
                            </div>

                            <hr className={schoolReportColors.border} />

                            <div className='flex justify-between gap-1 p-1 sm:gap-0'>
                                <Scope path='student'>
                                    <Input
                                        name='name'
                                        label='Nome:'
                                        type='text'
                                        className={`w-full lg:min-w-[24rem]`}
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
                                            className={`w-full sm:w-9 inputNumberValues`}
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
                                            className={`w-full`}
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
                            <table className='w-full break-all border-collapse table-auto border-spacing-0 sm:break-normal'>
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
                                                                className={`w-[2.6rem] inputNumberValues ${matter?.grades.firstQuarter >= minimumPassingGrade ? schoolReportColors.enoughGrade : schoolReportColors.insufficientGrade}`}
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
                                                                className={`w-[2.6rem] inputNumberValues ${matter?.grades.secondQuarter >= minimumPassingGrade ? schoolReportColors.enoughGrade : schoolReportColors.insufficientGrade}`}
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
                                                                className={`w-[2.6rem] inputNumberValues ${matter?.grades.thirdQuarter >= minimumPassingGrade ? schoolReportColors.enoughGrade : schoolReportColors.insufficientGrade}`}
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
                                                                className={`w-[2.6rem] inputNumberValues ${matter?.grades.fourthQuarter >= minimumPassingGrade ? schoolReportColors.enoughGrade : schoolReportColors.insufficientGrade}`}
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
                                                                className={`w-[2.6rem] inputNumberValues`}
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
                                                                className={`w-[2.6rem] inputNumberValues`}
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
                                                                className={`w-[2.6rem] inputNumberValues`}
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
                                                                className={`w-[2.6rem] inputNumberValues`}
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
                                                                className='w-8 text-center'
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
                                                        className='w-16'
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
                                                            className='text-sm text-center w-30'
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
                            className='fixed px-4 py-2 text-white transition-colors bg-green-500 border border-white rounded-lg shadow-lg hover:bg-green-600 right-16 bottom-16'
                        >
                            Gerar Imagem
                        </button>
                    </Form>

                    { hasSignatures &&
                        <div className='flex flex-col w-full gap-4'>
                            <div className='flex gap-4'>
                                <div className='flex items-end w-full'><p className='w-24'>1° Bim:</p><span className={`w-full h-0.5 ${schoolReportColors.signatures}`} /></div>
                                <div className='flex items-end w-full'><p className='w-24'>2° Bim:</p><span className={`w-full h-0.5 ${schoolReportColors.signatures}`} /></div>
                            </div>

                            <div className='flex gap-4'>
                                <div className='flex items-end w-full'><p className='w-24'>3° Bim:</p><span className={`w-full h-0.5 ${schoolReportColors.signatures}`} /></div>
                                <div className='flex items-end w-full'><p className='w-24'>4° Bim:</p><span className={`w-full h-0.5 ${schoolReportColors.signatures}`} /></div>
                            </div>
                        </div>
                    }
                </main>
            </div>
        </div>
}