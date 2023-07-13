import {
    useContext,
    useEffect,
    useLayoutEffect,
    useRef,
    useState
} from 'react'
import Swal from 'sweetalert2'

import {
    Bimester,
    Concept,
    DefaultValues,
    SchoolReportStyles,
    SchoolReportType,
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
import { useTheme }              from '@/hooks/useTheme'
import { Input } from '@/components/input'

const inter = Inter({ subsets: ['latin'] })

export const SchoolReport = () => {
    const formRef = useRef<FormHandles>(null)
    const mainRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const [mainWidth, setMainWidth] = useState(0)
    const [isMainHovered, setIsMainHovered] = useState(false)
    const [isMainScreenshot, setIsMainScreenshot] = useState(false)
    const [handleResizeTimeout, setHandleResizeTimeout] = useState(100)
    const [paddingYTableItems, setPaddingYTableItems] = useState('py-[0.35rem]')

    const { generateImage } = useContext(GenerateImageContext)
    const { getItemsLocalStorage } = useContext(LocalStorageContext)
    const { currentTheme } = useTheme()
    const swalColors = useSwalTheme()

    const {
        subjects,
        activeQuarter,
        schoolReportColors,
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
        newAcademicRecord,
        updateStudentAcademicRecord
    } = useSchoolReport()

    const handleFormSubmit: SubmitHandler<SchoolReportType> = data => {
        let timerInterval: NodeJS.Timer
        setIsMainScreenshot(true)

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
                        iconColor: swalColors.success.icon
                    })
                    .then(() => setIsMainScreenshot(false))
                    .then(() => console.info('Imagem gerada com sucesso!', { 'data': schoolReport }))
                })
                .then(() => {
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
                                grades:        maintainReportCardData.academicRecordGrades       ? gradesLocalStorage[index]        : newAcademicRecord.grades,
                                absences:      maintainReportCardData.academicRecordAbsences     ? absencesLocalStorage[index]      : newAcademicRecord.absences,
                                totalClasses:  maintainReportCardData.academicRecordTotalClasses ? totalClassesLocalStorage[index]  : newAcademicRecord.totalClasses,
                                totalAbsences: maintainReportCardData.academicRecordAbsences     ? totalAbsencesLocalStorage[index] : newAcademicRecord.totalAbsences,
                                concept:       maintainReportCardData.academicRecordGrades       ? conceptLocalStorage[index]       : newAcademicRecord.concept,
                                finalResult:   maintainReportCardData.academicRecordGrades       ? finalResultLocalStorage[index]   : newAcademicRecord.finalResult
                            }
                        }
                    }, {} as StudentAcademicRecord)

                    setSchoolReport({
                        ...schoolReportStartup,
                        school:  maintainReportCardData.school  ? data.school  : DefaultValues.INPUT_TEXT,
                        teacher: maintainReportCardData.teacher ? data.teacher : DefaultValues.INPUT_TEXT,
                        student: {
                            name:         maintainReportCardData.studentName         ? data.student.name         : DefaultValues.INPUT_TEXT,
                            number:       maintainReportCardData.studentNumber       ? data.student.number       : DefaultValues.INPUT_NUMBER,
                            yearAndClass: maintainReportCardData.studentYearAndClass ? data.student.yearAndClass : DefaultValues.INPUT_TEXT
                        },
                        studentAcademicRecord: { ...academicRecordData }
                    })
                })
                .catch(error => {
                    Swal.fire({
                        title: 'Erro ao gerar imagem!',
                        icon: 'error',
                        background: swalColors.bg,
                        color: swalColors.fg,
                        iconColor: swalColors.error.icon,
                        confirmButtonText: 'Tentar novamente',
                        confirmButtonColor: swalColors.button.confirm,
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                        cancelButtonColor: swalColors.button.cancel
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

    const styles: SchoolReportStyles = {
        card: {
            width: `${mainWidth}px`,
            backgroundColor: schoolReportColors.card,
            color: schoolReportColors.text,
            ...((isMainHovered || isMainScreenshot) && { borderColor: schoolReportColors.clippingBorder }),
            ...((isMainHovered && currentTheme === 'dark') && { boxShadow: `0 0 20rem -8rem ${schoolReportColors.clippingBorder}` })
        },
        border: { borderColor: schoolReportColors.border },
        signatures: { borderColor: schoolReportColors.signatures },
    }

    useEffect(() => {
        switch (subjects.length) {
            case 9:  return setPaddingYTableItems('py-[0.275rem]')
            case 10: return setPaddingYTableItems('py-[0.20rem]')
            case 11: return setPaddingYTableItems('py-[0.125rem]')
            case 12: return setPaddingYTableItems('py-[0.05rem]')
            default: return setPaddingYTableItems('py-[0.35rem]')
        }
    }, [subjects])

    useLayoutEffect(() => {
        const handleResize = () => {
            if (!(mainRef.current && containerRef.current)) return
            setMainWidth((containerRef.current.offsetHeight / 9) * 16)
            if (handleResizeTimeout > 1) setHandleResizeTimeout(0)
            mainRef.current.style.opacity = '1'
        }

        setTimeout(() => {
            handleResize()
            window.addEventListener('resize', handleResize)
        }, handleResizeTimeout)

        return () => window.removeEventListener('resize', handleResize)
    }, [subjects, hasSignatures, handleResizeTimeout])

    return (
        <div ref={containerRef} className='max-w-fit m-auto'>
            <main
                id='school-report'
                ref={mainRef}
                onMouseEnter={() => setIsMainHovered(true)}
                onMouseLeave={() => setIsMainHovered(false)}
                className={`font-bold ${inter.className} line-clamp-2 text-[0.5rem] xl:text-[0.7rem] 2xl:text-[1rem] border-2 border-transparent border-dashed p-3 transition-[color,background-color,box-shadow,width,height] duration-700 opacity-0 flex flex-col items-center justify-center gap-3 xl:gap-4 2xl:gap-6 overflow-hidden z-10`}
                style={styles.card}
            >
                <Form
                    ref={formRef}
                    onSubmit={handleFormSubmit}
                    className='w-full border border-b-0 transition-border-color'
                    style={styles.border}
                >
                    <section>
                        <h1 className='text-center uppercase my-4 xl:my-6 2xl:my-8'>
                            Boletim escolar:&nbsp;
                            <span>{schoolReport.academicYear}</span>
                        </h1>

                        <hr className='transition-border-color' style={styles.border} />

                        <div className={`min-h-[1rem] xl:min-h-[1.5rem] 2xl:min-h-[2rem] flex justify-between gap-8 px-2 ${paddingYTableItems}`}>
                            <Input
                                name='school'
                                label='Escola:'
                                type='text'
                                className='w-full'
                                onChange={event => setSchoolReport({...schoolReport, school: event.target.value})}
                                value={schoolReport.school}
                                containerStyle={`${hasResponsibleTeacherName ? 'w-[70%]' : 'w-full'}`}
                                container
                                required
                            />
                            { hasResponsibleTeacherName &&
                                <Input
                                    name='teacher'
                                    label='Prof:'
                                    type='text'
                                    className='w-full'
                                    onChange={event => setSchoolReport({...schoolReport, teacher: event.target.value})}
                                    value={schoolReport.teacher}
                                    containerStyle='w-[30%]'
                                    container
                                    required
                                />
                            }
                        </div>

                        <hr className='transition-border-color' style={styles.border} />

                        <div className={`min-h-[1rem] xl:min-h-[1.5rem] 2xl:min-h-[2rem] flex justify-between gap-8 px-2 ${paddingYTableItems}`}>
                            <Scope path='student'>
                                <Input
                                    name='name'
                                    label='Nome:'
                                    type='text'
                                    className='w-full'
                                    onChange={event => setSchoolReport({...schoolReport, student: {...schoolReport.student, name: event.target.value}})}
                                    value={schoolReport.student.name}
                                    containerStyle='w-[70%]'
                                    container
                                    required
                                />

                                <div className='w-[30%] flex gap-2'>
                                    <Input
                                        name='number'
                                        label='N°:'
                                        type='number'
                                        className='w-12 inputNumberValues'
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
                                        className='w-full'
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
                        <table className='w-full border-collapse border-spacing-0'>
                            <thead>
                                <tr>
                                    <th className='tableItens border-l-0 px-2' style={styles.border} rowSpan={2}>Disciplina</th>
                                    <th className='tableItens py-1' style={styles.border} colSpan={4}>Notas</th>
                                    <th className='tableItens py-1' style={styles.border} colSpan={4}>Faltas</th>
                                    { hasConcept && <th className='tableItens px-2' style={styles.border} rowSpan={2}>5°<br />Conceito</th> }
                                    <th className='tableItens px-2' style={styles.border} rowSpan={2}>Total de faltas</th>
                                    <th className='tableItens border-r-0 px-2' style={styles.border} rowSpan={2}>Resultado final</th>
                                </tr>
                                <tr>
                                    <th className='tableItens w-14 2xl:w-16 py-2' style={styles.border}>1°<br />Bim</th>
                                    <th className='tableItens w-14 2xl:w-16 py-2' style={styles.border}>2°<br />Bim</th>
                                    <th className='tableItens w-14 2xl:w-16 py-2' style={styles.border}>3°<br />Bim</th>
                                    <th className='tableItens w-14 2xl:w-16 py-2' style={styles.border}>4°<br />Bim</th>
                                    <th className='tableItens w-14 2xl:w-16 py-2' style={styles.border}>1°<br />Bim</th>
                                    <th className='tableItens w-14 2xl:w-16 py-2' style={styles.border}>2°<br />Bim</th>
                                    <th className='tableItens w-14 2xl:w-16 py-2' style={styles.border}>3°<br />Bim</th>
                                    <th className='tableItens w-14 2xl:w-16 py-2' style={styles.border}>4°<br />Bim</th>
                                </tr>
                            </thead>

                            <tbody>
                                { subjects.map(subject => {
                                const matter = schoolReport.studentAcademicRecord[`${subject}`]

                                return (
                                    <Scope path={`${subject}`} key={subject}>
                                        <tr key={subject}>
                                            <td className={`tableItens border-l-0 px-2 ${paddingYTableItems}`} style={styles.border}>
                                                <Input
                                                    name='subject'
                                                    type='text'
                                                    className='min-w-[4.2rem] xl:min-w-[6rem] 2xl:min-w-[9rem] w-full text-center'
                                                    value={subject}
                                                    readOnly
                                                    disabled
                                                />
                                            </td>

                                            <Scope path='grades'>
                                                <td className='tableItens' style={styles.border}>
                                                    { activeQuarter.firstQuarter &&
                                                        <Input
                                                            name='firstQuarter'
                                                            type='number'
                                                            className='w-full text-center pl-3 inputNumberValues transition-[color] duration-700'
                                                            style={{ color: matter.grades.firstQuarter >= minimumPassingGrade ? schoolReportColors.enoughGrade : schoolReportColors.insufficientGrade }}
                                                            onChange={event => updateStudentAcademicRecord(Number(event.target.value), subject, 'firstQuarter', 'grades')}
                                                            value={matter.grades.firstQuarter}
                                                            step='0.1'
                                                            min='0'
                                                            max='10'
                                                        />
                                                    }
                                                </td>
                                                <td className='tableItens' style={styles.border}>
                                                    { activeQuarter.secondQuarter &&
                                                        <Input
                                                            name='secondQuarter'
                                                            type='number'
                                                            className='w-full text-center pl-3 inputNumberValues transition-[color] duration-700'
                                                            style={{ color: matter.grades.secondQuarter >= minimumPassingGrade ? schoolReportColors.enoughGrade : schoolReportColors.insufficientGrade }}
                                                            onChange={event => updateStudentAcademicRecord(Number(event.target.value), subject, 'secondQuarter', 'grades')}
                                                            value={matter.grades.secondQuarter}
                                                            step='0.1'
                                                            min='0'
                                                            max='10'
                                                        />
                                                    }
                                                </td>
                                                <td className='tableItens' style={styles.border}>
                                                    { activeQuarter.thirdQuarter &&
                                                        <Input
                                                            name='thirdQuarter'
                                                            type='number'
                                                            className='w-full text-center pl-3 inputNumberValues transition-[color] duration-700'
                                                            style={{ color: matter.grades.thirdQuarter >= minimumPassingGrade ? schoolReportColors.enoughGrade : schoolReportColors.insufficientGrade }}
                                                            onChange={event => updateStudentAcademicRecord(Number(event.target.value), subject, 'thirdQuarter', 'grades')}
                                                            value={matter.grades.thirdQuarter}
                                                            step='0.1'
                                                            min='0'
                                                            max='10'
                                                        />
                                                    }
                                                </td>
                                                <td className='tableItens' style={styles.border}>
                                                    { activeQuarter.fourthQuarter &&
                                                        <Input
                                                            name='fourthQuarter'
                                                            type='number'
                                                            className='w-full text-center pl-3 inputNumberValues transition-[color] duration-700'
                                                            style={{ color: matter.grades.fourthQuarter >= minimumPassingGrade ? schoolReportColors.enoughGrade : schoolReportColors.insufficientGrade }}
                                                            onChange={event => updateStudentAcademicRecord(Number(event.target.value), subject, 'fourthQuarter', 'grades')}
                                                            value={matter.grades.fourthQuarter}
                                                            step='0.1'
                                                            min='0'
                                                            max='10'
                                                        />
                                                    }
                                                </td>
                                            </Scope>

                                            <Scope path='absences'>
                                                <td className='tableItens' style={styles.border}>
                                                    { activeQuarter.firstQuarter &&
                                                        <Input
                                                            name='firstQuarter'
                                                            type='number'
                                                            className='w-full text-center pl-3 inputNumberValues'
                                                            onChange={event => updateStudentAcademicRecord(Number(event.target.value), subject, 'firstQuarter', 'absences')}
                                                            value={matter.absences.firstQuarter}
                                                            step='1'
                                                            min='0'
                                                            max='62'
                                                        />
                                                    }
                                                </td>
                                                <td className='tableItens' style={styles.border}>
                                                    { activeQuarter.secondQuarter &&
                                                        <Input
                                                            name='secondQuarter'
                                                            type='number'
                                                            className='w-full text-center pl-3 inputNumberValues'
                                                            onChange={event => updateStudentAcademicRecord(Number(event.target.value), subject, 'secondQuarter', 'absences')}
                                                            value={matter.absences.secondQuarter}
                                                            step='1'
                                                            min='0'
                                                            max='62'
                                                        />
                                                    }
                                                </td>
                                                <td className='tableItens' style={styles.border}>
                                                    { activeQuarter.thirdQuarter &&
                                                        <Input
                                                            name='thirdQuarter'
                                                            type='number'
                                                            className='w-full text-center pl-3 inputNumberValues'
                                                            onChange={event => updateStudentAcademicRecord(Number(event.target.value), subject, 'thirdQuarter', 'absences')}
                                                            value={matter.absences.thirdQuarter}
                                                            step='1'
                                                            min='0'
                                                            max='62'
                                                        />
                                                    }
                                                </td>
                                                <td className='tableItens' style={styles.border}>
                                                    { activeQuarter.fourthQuarter &&
                                                        <Input
                                                            name='fourthQuarter'
                                                            type='number'
                                                            className='w-full text-center pl-3 inputNumberValues'
                                                            onChange={event => updateStudentAcademicRecord(Number(event.target.value), subject, 'fourthQuarter', 'absences')}
                                                            value={matter.absences.fourthQuarter}
                                                            step='1'
                                                            min='0'
                                                            max='62'
                                                        />
                                                    }
                                                </td>
                                            </Scope>

                                            { hasConcept &&
                                                <td className='tableItens' style={styles.border}>
                                                    { hasConceptValues &&
                                                        <Input
                                                            name='concept'
                                                            type='text'
                                                            className='w-full text-center'
                                                            value={matter.concept}
                                                            maxLength={1}
                                                            minLength={1}
                                                            readOnly
                                                            disabled
                                                        />
                                                    }
                                                </td>
                                            }
                                            <td className='tableItens' style={styles.border}>
                                                <Input
                                                    name='totalAbsences'
                                                    type='text'
                                                    className='w-full text-center decoration-slice'
                                                    value={matter.totalAbsences}
                                                    readOnly
                                                    disabled
                                                />
                                            </td>
                                            <td className='tableItens border-r-0 px-2' style={styles.border}>
                                                { hasFinalResultValues &&
                                                    <Input
                                                        name='finalResult'
                                                        type='text'
                                                        className='min-w-[4.8rem] xl:min-w-[6.7rem] 2xl:min-w-[10rem] w-full text-center'
                                                        value={matter.finalResult}
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
                        className='text-white bg-green-500 hover:bg-green-600 focus-visible:bg-green-600 active:bg-green-700 border border-white rounded-lg shadow-lg px-4 py-2 fixed right-8 bottom-8 interact-scale delay-75 active:delay-0 active:duration-200'
                    >
                        Gerar Imagem
                    </button>
                </Form>

                { hasSignatures &&
                    <div className='w-full'>
                        <div className='flex justify-between gap-10 xl:gap-12'>
                            <p className='w-full border-b-[0.07rem] border-solid transition-border-color' style={styles.signatures}>1° Bim:</p>
                            <p className='w-full border-b-[0.07rem] border-solid transition-border-color' style={styles.signatures}>2° Bim:</p>
                        </div>
                        <div className='flex justify-between gap-10 xl:gap-12 mt-3 xl:mt-4 2xl:mt-6'>
                            <p className='w-full border-b-[0.07rem] border-solid transition-border-color' style={styles.signatures}>3° Bim:</p>
                            <p className='w-full border-b-[0.07rem] border-solid transition-border-color' style={styles.signatures}>4° Bim:</p>
                        </div>
                    </div>
                }
            </main>
        </div>
    )
}