import {
    useContext,
    useState
} from 'react'
import { useTheme } from 'next-themes'
import {
    getCookie,
    setCookie
} from 'cookies-next'
import { convertToPascalCase } from '@/utils/converterText'
import Swal from 'sweetalert2'

import {
    MdOutlineLightMode,
    MdOutlineDarkMode,
    MdOutlineFileDownload,
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight
} from 'react-icons/md'
import {
    HiX,
    HiMenu,
    HiTrash,
    HiPlusSm,
    HiInformationCircle
} from 'react-icons/hi'
import { FaCircle } from 'react-icons/fa'
import { FcImageFile } from 'react-icons/fc'

import { ActiveQuarter } from '@/interfaces/types'

import { GenerateImageContext } from '@/contexts/GenerateImageContext'
import { useSchoolReportConfig } from '@/hooks/useSchoolReportConfig'
import { useSchoolReport } from '@/hooks/useSchoolReport'
import { useSwalTheme } from '@/hooks/useSwalTheme'
import { useSidebar } from '@/hooks/useSidebar'
import { Details } from '@/components/details'
import { Input } from '@/components/input'

export const Sidebar = () => {
    const { isOpen, toggleSidebar } = useSidebar()
    const swalColors = useSwalTheme()

    const [swalInfoTotalClassesShown, setSwalInfoTotalClassesShown] = useState(getCookie('swal_info_ttl_clss_shown') === true ?? false)
    const [clickedIndex, setClickedIndex] = useState<number | null>(null)
    const [activeSubjectIndex, setActiveSubjectIndex] = useState(0)
    const [otherSubject, setOtherSubject] = useState('')

    const {
        filesImage,
        deleteImage
    } = useContext(GenerateImageContext)

    const {
        minimumAttendancePercentageToPass,
        setMinimumAttendancePercentageToPass,
        minimumPassingGrade,
        setMinimumPassingGrade,
        minimumRecoveryGrade,
        setMinimumRecoveryGrade
    } = useSchoolReportConfig()

    const {
        subjects,
        inactiveSubjects,
        activeQuarter,
        maintainReportCardData,
        hasResponsibleTeacherName,
        hasSignatures,
        hasConcept,
        hasConceptValues,
        hasFinalResultValues,
        updateActiveQuarter,
        setMaintainReportCardData,
        setHasResponsibleTeacherName,
        setHasSignatures,
        setHasConcept,
        setHasConceptValues,
        setHasFinalResultValues
    } = useSchoolReportConfig()

    const {
        schoolReport,
        setSchoolReport,
        addSubjects,
        removeSubjects
    } = useSchoolReport()

    const { systemTheme, theme, setTheme } = useTheme()
    const currentTheme = theme === 'system' ? systemTheme : theme
    const toggleTheme = () => currentTheme === 'dark' ? setTheme('light') : setTheme('dark')

    const getQuarterKey = (quarterNumber: 1 | 2 | 3 | 4): keyof ActiveQuarter => {
        switch (quarterNumber) {
            case 1: return 'firstQuarter'
            case 2: return 'secondQuarter'
            case 3: return 'thirdQuarter'
            case 4: return 'fourthQuarter'
            default: throw new Error(`Invalid quarter number: ${quarterNumber}`)
        }
    }

    return (
        <aside className={
            `${isOpen
                ? 'min-w-[20rem] lg:w-1/12 2xl:w-1/6 h-full'
                : 'lg:w-[4.10%] lg:h-full'
            } w-full px-2 fixed top-0 left-0 z-20 transition-all duration-300 ease-in-out`
        }>
            <button className={`w-full flex items-center justify-center gap-2 py-8`} onClick={() => toggleSidebar()}>
                { isOpen ? <HiX className='text-2xl' /> : <HiMenu className='text-2xl' /> }
                <h1 className={`${isOpen ? '':  'lg:hidden'} text-xl`}>Boletim Escolar</h1>
            </button>

            { isOpen &&
                <div className={`max-h-[calc(100%-6rem)] px-2 pb-4 flex flex-col gap-2 overflow-y-auto scroll-smooth`}>
                    <Input
                        name='enoughGrade'
                        label='Nota de aprovação:'
                        withForm={false}
                        type='number'
                        className={`w-[2.6rem] inputNumberValues cursor-not-allowed`}
                        onChange={event => setMinimumPassingGrade(Number(event.target.value))}
                        value={minimumPassingGrade}
                        step='1'
                        min='1'
                        max='10'
                        container
                        readOnly
                        disabled
                    />
                    <Input
                        name='insufficientGrade'
                        label='Nota de recuperação:'
                        withForm={false}
                        type='number'
                        className={`w-[2.6rem] inputNumberValues cursor-not-allowed`}
                        onChange={event => setMinimumRecoveryGrade(Number(event.target.value))}
                        value={minimumRecoveryGrade}
                        step='1'
                        min='1'
                        max='10'
                        container
                        readOnly
                        disabled
                    />
                    <Input
                        name='frequencyPercentage'
                        label='Porcentagem minima de frequência para aprovação:'
                        withForm={false}
                        type='number'
                        className={`w-[2.6rem] inputNumberValues cursor-not-allowed`}
                        onChange={event => setMinimumAttendancePercentageToPass(Number(event.target.value))}
                        value={minimumAttendancePercentageToPass}
                        step='1'
                        min='1'
                        max='100'
                        container
                        readOnly
                        disabled
                    />

                    <Details summary='Habilitar / Desabilitar'>
                        <div className='divide-x divide-solid divide-transparent hover:divide-violet-500'>
                            <p className='font-bold'>Dados</p>
                            { [1, 2, 3, 4].map((quarterNumber) => {
                                const quarterKey: keyof ActiveQuarter = getQuarterKey(quarterNumber as 1 | 2 | 3 | 4)

                                return (
                                    <button
                                        key={quarterNumber}
                                        onClick={() => updateActiveQuarter(quarterNumber as 1 | 2 | 3 | 4)}
                                        className='w-full hover:bg-shadow-5 hover:dark:bg-shadow-15 flex items-center justify-between gap-2 py-1 px-3 rounded-md'
                                    >
                                        {quarterNumber}° Bimestre
                                        <FaCircle className={`${activeQuarter[quarterKey] ? 'text-green-400' : 'text-red-400'} text-lg`}/>
                                    </button>
                                )
                            }) }
                            <button
                                onClick={() => setHasConceptValues(!hasConceptValues)}
                                className={`${hasConcept ? 'hover:bg-shadow-5 hover:dark:bg-shadow-15' : 'cursor-not-allowed'} w-full flex items-center justify-between gap-2 py-1 px-3 rounded-md disabled:opacity-40`}
                                disabled={!hasConcept}
                            >
                                5° Conceito
                                <FaCircle className={`${hasConceptValues ? 'text-green-400' : 'text-red-400'} text-lg`} />
                            </button>
                            <button onClick={() => setHasFinalResultValues(!hasFinalResultValues)} className='w-full hover:bg-shadow-5 hover:dark:bg-shadow-15 flex items-center justify-between gap-2 py-1 px-3 rounded-md'>
                                Resultado final
                                <FaCircle className={`${hasFinalResultValues ? 'text-green-400' : 'text-red-400'} text-lg`} />
                            </button>
                        </div>

                        <div className='mt-2 divide-x divide-solid divide-transparent hover:divide-violet-500'>
                            <p className='font-bold'>Componentes</p>
                            <button onClick={() => setHasResponsibleTeacherName(!hasResponsibleTeacherName)} className='w-full hover:bg-shadow-5 hover:dark:bg-shadow-15 flex items-center justify-between gap-2 py-1 px-3 rounded-md'>
                                Professor(a)
                                <FaCircle className={`${hasResponsibleTeacherName ? 'text-green-400' : 'text-red-400'} text-lg`} />
                            </button>
                            <button onClick={() => setHasConcept(!hasConcept)} className='w-full hover:bg-shadow-5 hover:dark:bg-shadow-15 flex items-center justify-between gap-2 py-1 px-3 rounded-md'>
                                5° Conceito
                                <FaCircle className={`${hasConcept ? 'text-green-400' : 'text-red-400'} text-lg`} />
                            </button>
                            <button onClick={() => setHasSignatures(!hasSignatures)} className='w-full hover:bg-shadow-5 hover:dark:bg-shadow-15 flex items-center justify-between gap-2 py-1 px-3 rounded-md'>
                                Assinaturas
                                <FaCircle className={`${hasSignatures ? 'text-green-400' : 'text-red-400'} text-lg`} />
                            </button>
                        </div>
                    </Details>

                    <Details summary='Manter dados'>
                        <div className='divide-x divide-solid divide-transparent hover:divide-violet-500'>
                            <p className='font-bold'>Cabeçalho</p>
                            <button onClick={() => setMaintainReportCardData({...maintainReportCardData, school: !maintainReportCardData.school})} className='w-full hover:bg-shadow-5 hover:dark:bg-shadow-15 flex items-center justify-between gap-2 py-1 px-3 rounded-md'>
                                Escola
                                <FaCircle className={`${maintainReportCardData.school ? 'text-green-400' : 'text-red-400'} text-lg`} />
                            </button>
                            <button
                                onClick={() => setMaintainReportCardData({...maintainReportCardData, teacher: !maintainReportCardData.teacher})}
                                className={`${hasResponsibleTeacherName ? 'hover:bg-shadow-5 hover:dark:bg-shadow-15' : 'cursor-not-allowed'} w-full flex items-center justify-between gap-2 py-1 px-3 rounded-md disabled:opacity-40`}
                                disabled={!hasResponsibleTeacherName}
                            >
                                Professor(a)
                                <FaCircle className={`${maintainReportCardData.teacher ? 'text-green-400' : 'text-red-400'} text-lg`} />
                            </button>
                            <button onClick={() => setMaintainReportCardData({...maintainReportCardData, name: !maintainReportCardData.name})} className='w-full hover:bg-shadow-5 hover:dark:bg-shadow-15 flex items-center justify-between gap-2 py-1 px-3 rounded-md'>
                                Nome
                                <FaCircle className={`${maintainReportCardData.name ? 'text-green-400' : 'text-red-400'} text-lg`} />
                            </button>
                            <button onClick={() => setMaintainReportCardData({...maintainReportCardData, number: !maintainReportCardData.number})} className='w-full hover:bg-shadow-5 hover:dark:bg-shadow-15 flex items-center justify-between gap-2 py-1 px-3 rounded-md'>
                                N°
                                <FaCircle className={`${maintainReportCardData.number ? 'text-green-400' : 'text-red-400'} text-lg`} />
                            </button>
                            <button onClick={() => setMaintainReportCardData({...maintainReportCardData, yearAndClass: !maintainReportCardData.yearAndClass})} className='w-full hover:bg-shadow-5 hover:dark:bg-shadow-15 flex items-center justify-between gap-2 py-1 px-3 rounded-md'>
                                Ano
                                <FaCircle className={`${maintainReportCardData.yearAndClass ? 'text-green-400' : 'text-red-400'} text-lg`} />
                            </button>
                        </div>
                    </Details>

                    <Details summary='Imagens'>
                        { filesImage.length === 0
                            ?   <div className='w-full hover:bg-shadow-5 flex flex-col items-center justify-center border border-dashed border-violet-500 rounded-lg py-4'>
                                    <FcImageFile className='text-2xl' />
                                    Sem imagens
                                </div>
                            :   <>
                                    { filesImage.map((file, index) => {
                                        return (
                                            <div key={index} className='w-full flex items-center justify-between even:bg-shadow-5 dark:even:bg-shadow-15 rounded-md p-1 last:even:mb-3'>
                                                <span className={`pl-1 truncate cursor-default ${clickedIndex === index ? 'underline underline-offset-4' : ''}`}>{file.name}</span>

                                                <div className='flex flex-nowrap'>
                                                    <a
                                                        title={`Download do arquivo '${file.name}'`}
                                                        href={file.imageData}
                                                        download={file.name}
                                                        className='aspect-square hover:bg-green-400 text-green-400 hover:text-white p-1 rounded-md'
                                                        onClick={() => setClickedIndex(index)}
                                                    >
                                                        <MdOutlineFileDownload className='text-xl' />
                                                    </a>
                                                    <button title='Deletar imagem' onClick={() => deleteImage(index)} className='aspect-square hover:bg-red-400 text-red-400 hover:text-white p-1 rounded-md'>
                                                        <HiTrash className='text-lg' />
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    }) }
                                </>
                        }
                    </Details>

                    <Details summary='Matérias'>
                        <div className='bg-shadow-5 dark:bg-shadow-15 mb-2 flex flex-col gap-1 rounded-md'>
                            <div className='w-full bg-slate-200 dark:bg-gray-700 border border-shadow-5 dark:border-shadow-15 flex items-center justify-between gap-2 p-1 rounded-md'>
                                <button
                                    onClick={() => setActiveSubjectIndex(activeSubjectIndex - 1)}
                                    className='hover:bg-shadow-5 hover:dark:bg-shadow-15 border border-transparent p-1 rounded-md disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:dark:bg-transparent disabled:cursor-not-allowed'
                                    disabled={activeSubjectIndex === 0}
                                >
                                    <MdKeyboardArrowLeft className='text-xl' />
                                </button>
                                <p>{subjects[activeSubjectIndex]}</p>
                                <button
                                    onClick={() => setActiveSubjectIndex(activeSubjectIndex + 1)}
                                    className='hover:bg-shadow-5 hover:dark:bg-shadow-15 border border-transparent p-1 rounded-md disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:dark:bg-transparent disabled:cursor-not-allowed'
                                    disabled={activeSubjectIndex === subjects.length - 1}
                                >
                                    <MdKeyboardArrowRight className='text-xl' />
                                </button>
                            </div>

                            <div className='w-full flex items-center justify-between gap-2 py-1 px-3 rounded-md'>
                                <p className='relative'>
                                    Aulas dadas

                                    { swalInfoTotalClassesShown === false
                                        && <span className='w-4 h-4 bg-violet-500 absolute top-0 right-[-1.2rem] rounded-full animate-ping opacity-75' />
                                    }
                                    <HiInformationCircle
                                        title={`O item "Aulas dadas" refere-se à quantidade de aulas dadas em determinada matéria. \nEste item é importante porque entra no cálculo da porcentagem de faltas do aluno, \no que consequentemente pode determinar uma reprovação por falta.`}
                                        className=' text-black dark:text-white absolute top-0 right-[-1.2rem] cursor-help'
                                        onClick={() => {
                                            Swal.fire({
                                                title: 'Informação',
                                                text: 'O item "Aulas dadas" refere-se à quantidade de aulas dadas em determinada matéria. Este item é importante porque entra no cálculo da porcentagem de faltas do aluno, o que consequentemente pode determinar uma reprovação por falta.',
                                                icon: 'info',
                                                background: swalColors.bg,
                                                color: swalColors.fg,
                                                iconColor: swalColors.info.icon
                                            })
                                            .finally(() => {
                                                getCookie('swal_info_ttl_clss_shown') !== true && setCookie('swal_info_ttl_clss_shown', true)
                                                setSwalInfoTotalClassesShown(true)
                                            })
                                        }}
                                    />
                                </p>
                                <Input
                                    name='totalClasses'
                                    withForm={false}
                                    type='number'
                                    className={`w-12 inputNumberValues`}
                                    onChange={event => {
                                        setSchoolReport({
                                            ...schoolReport,
                                            studentAcademicRecord: {
                                                ...schoolReport.studentAcademicRecord,
                                                [subjects[activeSubjectIndex]]: {
                                                    ...schoolReport.studentAcademicRecord[subjects[activeSubjectIndex]],
                                                    totalClasses: Number(event.target.value)
                                                }
                                            }
                                        })
                                    }}
                                    value={schoolReport.studentAcademicRecord[subjects[activeSubjectIndex]].totalClasses}
                                    step='1'
                                    min='1'
                                    max='248'
                                />
                            </div>

                            <button
                                onClick={() => {
                                    if(activeSubjectIndex !== 0 && activeSubjectIndex === subjects.length - 1) setActiveSubjectIndex(activeSubjectIndex - 1)
                                    removeSubjects(subjects[activeSubjectIndex])
                                }}
                                className='w-fit bg-red-400 dark:bg-red-500 hover:bg-red-500 hover:dark:bg-red-400 mx-auto mb-2 px-6 flex items-center justify-center gap-2 py-1 rounded-md disabled:opacity-40 disabled:hover:bg-red-400 disabled:hover:dark:bg-red-500 disabled:cursor-not-allowed'
                                disabled={subjects.length === 1}
                            >
                                Remover matéria
                            </button>
                        </div>

                        <div className='divide-x divide-solid divide-transparent hover:divide-violet-500'>
                            <p className='font-bold'>Adicionar</p>
                            { inactiveSubjects.map((subject, index) => {
                                return (
                                    <div key={index} className='w-full hover:bg-shadow-5 hover:dark:bg-shadow-15 flex items-center justify-between gap-2 py-1 px-3 rounded-md'>
                                        <p>{subject}</p>
                                        <button onClick={() => addSubjects(subject)} className='bg-shadow-5 dark:bg-shadow-15 border border-transparent hover:border-violet-500 p-1 rounded-md' title={`Adicionar a matéria ${subject}`} aria-label={`Adicionar a matéria ${subject}`}>
                                            <HiPlusSm className='text-xl text-green-400' />
                                        </button>
                                    </div>
                                )
                            }) }

                            <div className='w-full hover:bg-shadow-5 hover:dark:bg-shadow-15 flex items-center justify-between gap-2 py-1 px-3 rounded-md'>
                                <input
                                    name='otherSubject'
                                    type='text'
                                    className={`w-full h-7 bg-shadow-5 dark:bg-shadow-15 px-2 rounded-md`}
                                    onChange={event => setOtherSubject(convertToPascalCase(event.target.value))}
                                    value={otherSubject}
                                    placeholder='Outra matéria'
                                />
                                <button onClick={() => addSubjects(otherSubject, true)} className='bg-shadow-5 dark:bg-shadow-15 border border-transparent hover:border-violet-500 p-1 rounded-md' title='Adicionar matéria' aria-label='Adicionar matéria'>
                                    <HiPlusSm className='text-xl text-green-400' />
                                </button>
                            </div>
                        </div>
                    </Details>

                    <Details summary='Cores'>
                        <button onClick={toggleTheme} className='w-full hover:bg-shadow-5 hover:dark:bg-shadow-15 border border-shadow-15 flex items-center justify-center gap-2 py-1 rounded-md'>
                            { currentTheme === 'dark'
                                ? <MdOutlineLightMode className='text-xl' />
                                : <MdOutlineDarkMode className='text-xl' />
                            } Mudar Tema
                        </button>
                    </Details>
                </div>
            }
        </aside>
    )
}