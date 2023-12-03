import {
    useContext,
    useEffect,
    useState
} from 'react'

import {
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
    HiX,
    HiMenu,
    HiPlusSm,
    FaCircle,
    FcImageFile,
    MdFolderZip,
    VscReset
} from '@/utils/reactIconsImports'
import { convertToPascalCase } from '@/utils/converterText'

import {
    ActiveQuarter,
    DefaultValues
} from '@/interfaces/types'

import { GenerateImageContext } from '@/contexts/GenerateImageContext'
import { useSchoolReportConfig } from '@/hooks/useSchoolReportConfig'
import { useSchoolReport }       from '@/hooks/useSchoolReport'
import { useSidebar }            from '@/hooks/useSidebar'
import { useTheme }              from '@/hooks/useTheme'
import { ColorPicker } from '@/components/colorPicker'
import { InfoIcon }    from '@/components/infoIcon'
import { Details }     from '@/components/details'
import { Input }       from '@/components/input'

export const Sidebar = () => {
    const { isOpen, toggleSidebar } = useSidebar()

    const [clickedIndex, setClickedIndex] = useState<number | null>(null)
    const [activeSubjectIndex, setActiveSubjectIndex] = useState(0)
    const [otherSubject, setOtherSubject] = useState('')
    const [switchSubjectButtonDisabled, isSwitchSubjectButtonDisabled] = useState(false)

    const {
        filesImage,
        generateZipImages,
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
        schoolReportColorsStartup,
        updateActiveQuarter,
        setMaintainReportCardData,
        setHasResponsibleTeacherName,
        setHasSignatures,
        setHasConcept,
        setHasConceptValues,
        setHasFinalResultValues,
        setSchoolReportColors
    } = useSchoolReportConfig()

    const {
        schoolReport,
        updateTotalClasses,
        addSubjects,
        removeSubjects
    } = useSchoolReport()

    const { currentTheme, setTheme } = useTheme()
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
    const switchSubjectWithAnimation = (intention: 'previous' | 'next') => {
        const switchSubject   = document.getElementById('switch-subject')   as HTMLDivElement
        const previousSubject = document.getElementById('previous-subject') as HTMLParagraphElement
        const currentSubject  = document.getElementById('current-subject')  as HTMLParagraphElement
        const nextSubject     = document.getElementById('next-subject')     as HTMLParagraphElement

        isSwitchSubjectButtonDisabled(true)

        const currentSubjectAlignment   = (switchSubject.offsetWidth / 2) - (currentSubject.offsetWidth / 2)
        currentSubject.style.transition = 'left 300ms ease-in-out, right 300ms ease-in-out, opacity 150ms linear'
        currentSubject.style.opacity    = '0'

        if (intention === 'previous') {
            const previousSubjectAlignment   = (switchSubject.offsetWidth / 2) - (previousSubject.offsetWidth / 2)
            previousSubject.style.transition = 'left 300ms ease-in-out, opacity 150ms linear'
            previousSubject.style.opacity    = '100'
            previousSubject.style.left       = `${previousSubjectAlignment}px`

            currentSubject.style.left = `${currentSubjectAlignment}px`
        }
        else if (intention === 'next') {
            const alignmentNextSubject   = (switchSubject.offsetWidth / 2) - (nextSubject.offsetWidth / 2)
            nextSubject.style.transition = 'right 300ms ease-in-out, opacity 150ms linear'
            nextSubject.style.opacity    = '100'
            nextSubject.style.right      = `${alignmentNextSubject}px`

            currentSubject.style.right = `${currentSubjectAlignment}px`
        }

        setTimeout(() => {
            currentSubject.style.transition = 'none'
            currentSubject.style.opacity    = '100'

            if (intention === 'previous') {
                previousSubject.style.transition = 'none'
                previousSubject.style.opacity    = '0'
                previousSubject.style.left       = '0'

                currentSubject.style.left = '-50%'
                setActiveSubjectIndex(activeSubjectIndex - 1)
            }
            else if (intention === 'next') {
                nextSubject.style.transition = 'none'
                nextSubject.style.opacity    = '0'
                nextSubject.style.right      = '0'

                currentSubject.style.right = '-50%'
                setActiveSubjectIndex(activeSubjectIndex + 1)
            }

            isSwitchSubjectButtonDisabled(false)
        }, 300)
    }

    useEffect(() => {
        const asideContent = document.getElementById('aside-content')

        if (asideContent) {
            const handleScroll = () => asideContent.scrollTop > 0
                ? asideContent.classList.add('asideContentInsetShadow')
                : asideContent.classList.remove('asideContentInsetShadow')

            handleScroll()
            asideContent.addEventListener('scroll', handleScroll)

            return () => asideContent.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <aside className={
            `w-full px-2 shadow-[0_0.5rem_2rem_0_rgba(0,0,0,0.2)] lg:shadow-[0.5rem_0_2rem_0_rgba(0,0,0,0.2)] transition-[width,height] duration-500 lg:duration-200 fixed top-0 left-0 z-20
            ${ !isOpen
                ? 'lg:w-[calc(2%+2rem)] h-[calc(2%+2rem)] lg:h-full flex items-center lg:items-start'
                : 'min-w-[220px] lg:min-w-0 lg:w-[18rem] h-full lg:transition-none'
            }`
        }>
            <button
                type='button'
                aria-label={isOpen ? 'Fechar Menu' : 'Abrir Menu'}
                onClick={() => toggleSidebar()}
                className={
                    `mx-auto text-slate-200k text-xl flex items-center justify-center gap-2
                    ${!isOpen
                        ? 'w-[calc(100%-5rem)] sm:w-[calc(100%-15rem)] h-[1.5rem] lg:w-10 lg:h-10 2xl:w-12 2xl:h-12 lg:mt-[70%]'
                        : 'w-full my-2 lg:my-6'
                    }`
                }
            >
                { isOpen ?
                    <>
                        <HiX className='text-2xl' />
                        <h1 aria-hidden={true}>Boletim Escolar</h1>
                    </>
                    :
                    <HiMenu className='lg:text-3xl' />
                }
            </button>

            { isOpen &&
                <>
                    <div id='aside-content' className='h-[calc(100%-2.75rem)] lg:h-[calc(100%-4.75rem)] rounded-md p-2 pt-0 flex flex-col gap-2 overflow-y-auto scroll-smooth'>
                        <div className='flex flex-nowrap items-baseline gap-2 lg:justify-between'>
                            <p>Nota de aprovação:</p>
                            <Input
                                id='enoughGrade'
                                name='enoughGrade'
                                withForm={false}
                                type='number'
                                className={`w-12 h-7 inputNumberValues`}
                                onChange={event => setMinimumPassingGrade(Number(event.target.value))}
                                value={minimumPassingGrade}
                                step='1'
                                min='1'
                                max='10'
                                label='Nota miníma para aprovação'
                                labelStyle='sr-only'
                            />
                        </div>
                        <div className='flex flex-nowrap items-baseline gap-2 lg:justify-between'>
                            <p>Nota de recuperação:</p>
                            <Input
                                id='insufficientGrade'
                                name='insufficientGrade'
                                withForm={false}
                                type='number'
                                className={`w-12 h-7 inputNumberValues`}
                                onChange={event => setMinimumRecoveryGrade(Number(event.target.value))}
                                value={minimumRecoveryGrade}
                                step='1'
                                min='1'
                                max='10'
                                label='Nota miníma para ficar de recuperação'
                                labelStyle='sr-only'
                            />
                        </div>
                        <div className='flex flex-nowrap items-baseline gap-2 lg:justify-between'>
                            <p>Presença minima (%):</p>
                            <Input
                                id='frequencyPercentage'
                                name='frequencyPercentage'
                                withForm={false}
                                type='number'
                                className={`w-12 h-7 inputNumberValues`}
                                onChange={event => setMinimumAttendancePercentageToPass(Number(event.target.value))}
                                value={minimumAttendancePercentageToPass}
                                step='1'
                                min='1'
                                max='100'
                                label='Porcentagem da frequência miníma de aulas'
                                labelStyle='sr-only'
                            />
                        </div>

                        <hr className='border-slate-300 dark:border-gray-700 my-4' />

                        <Details summary='Habilitar / Desabilitar'>
                            <div className='divide-x divide-solid divide-transparent hover:divide-violet-500'>
                                <p className='w-fit font-bold relative overflow-visible'>
                                    Dados
                                    <InfoIcon topic='Habilitar / Desabilitar - Dados' aria-haspopup='true' description='Os itens de "Dados" providos de "Habilitar / Desabilitar" refere-se à possibilidade de apresentar ou não os resultados dos respectivos campos do boletim escolar.' />
                                </p>

                                <div>
                                    { [1, 2, 3, 4].map(quarterNumber => {
                                        const quarterKey: keyof ActiveQuarter = getQuarterKey(quarterNumber as 1 | 2 | 3 | 4)

                                        return (
                                            <button
                                                key={quarterNumber}
                                                onClick={() => updateActiveQuarter(quarterNumber as 1 | 2 | 3 | 4)}
                                                aria-pressed={activeQuarter[quarterKey]}
                                                className='w-full hover:bg-shadow-5 hover:dark:bg-shadow-15 flex items-center justify-between gap-2 py-1 px-3 rounded-md transition-[background-color]'
                                            >
                                                {quarterNumber}° Bimestre
                                                <FaCircle className={`${activeQuarter[quarterKey] ? 'glow-on' : 'glow-off'} text-lg`}/>
                                            </button>
                                        )
                                    }) }
                                    <button
                                        onClick={() => setHasConceptValues(!hasConceptValues)}
                                        aria-pressed={hasConceptValues}
                                        className={`${hasConcept ? 'hover:bg-shadow-5 hover:dark:bg-shadow-15' : 'cursor-not-allowed'} w-full flex items-center justify-between gap-2 py-1 px-3 rounded-md disabled:opacity-40 transition-[background-color]`}
                                        disabled={!hasConcept}
                                    >
                                        5° Conceito
                                        <FaCircle className={`${hasConcept ? hasConceptValues ? 'glow-on' : 'glow-off' : hasConceptValues ? 'text-green-400' : 'text-red-400'} text-lg`} />
                                    </button>
                                    <button
                                        onClick={() => setHasFinalResultValues(!hasFinalResultValues)}
                                        aria-pressed={hasFinalResultValues}
                                        className='w-full hover:bg-shadow-5 hover:dark:bg-shadow-15 flex items-center justify-between gap-2 py-1 px-3 rounded-md transition-[background-color]'
                                    >
                                        Resultado final
                                        <FaCircle className={`${hasFinalResultValues ? 'glow-on' : 'glow-off'} text-lg`} />
                                    </button>
                                </div>
                            </div>

                            <div className='mt-2 divide-x divide-solid divide-transparent hover:divide-violet-500'>
                                <p className='w-fit font-bold relative overflow-visible'>
                                    Componentes
                                    <InfoIcon topic='Habilitar / Desabilitar - Componentes' aria-haspopup='true' description='Os itens de "Componentes" providos de "Habilitar / Desabilitar" refere-se à possibilidade de apresentar ou não os respectivos campos do boletim escolar.' />
                                </p>

                                <div>
                                    <button
                                        onClick={() => setHasResponsibleTeacherName(!hasResponsibleTeacherName)}
                                        aria-pressed={hasResponsibleTeacherName}
                                        className='w-full hover:bg-shadow-5 hover:dark:bg-shadow-15 flex items-center justify-between gap-2 py-1 px-3 rounded-md transition-[background-color]'
                                    >
                                        Professor(a)
                                        <FaCircle className={`${hasResponsibleTeacherName ? 'glow-on' : 'glow-off'} text-lg`} />
                                    </button>
                                    <button
                                        onClick={() => setHasConcept(!hasConcept)}
                                        aria-pressed={hasConcept}
                                        className='w-full hover:bg-shadow-5 hover:dark:bg-shadow-15 flex items-center justify-between gap-2 py-1 px-3 rounded-md transition-[background-color]'
                                    >
                                        5° Conceito
                                        <FaCircle className={`${hasConcept ? 'glow-on' : 'glow-off'} text-lg`} />
                                    </button>
                                    <button
                                        onClick={() => setHasSignatures(!hasSignatures)}
                                        aria-pressed={hasSignatures}
                                        className='w-full hover:bg-shadow-5 hover:dark:bg-shadow-15 flex items-center justify-between gap-2 py-1 px-3 rounded-md transition-[background-color]'
                                    >
                                        Assinaturas
                                        <FaCircle className={`${hasSignatures ? 'glow-on' : 'glow-off'} text-lg`} />
                                    </button>
                                </div>
                            </div>
                        </Details>

                        <Details summary='Manter dados'>
                            <div className='divide-x divide-solid divide-transparent hover:divide-violet-500'>
                                <p className='w-fit font-bold relative overflow-visible'>
                                    Cabeçalho
                                    <InfoIcon topic='Manter dados' aria-haspopup='true' description='Os itens de "Cabeçalho" providos de "Manter Dados" refere-se à salvar os dados digitados dos respectivos campos no LocalStorage, assim, a página poderá ser recarregada e a informação não se perderá!' />
                                </p>

                                <div>
                                    <button
                                        onClick={() => setMaintainReportCardData({
                                            ...maintainReportCardData,
                                            school: !maintainReportCardData.school
                                        })}
                                        aria-pressed={maintainReportCardData.school}
                                        className='w-full hover:bg-shadow-5 hover:dark:bg-shadow-15 flex items-center justify-between gap-2 py-1 px-3 rounded-md transition-[background-color]'>
                                        Escola
                                        <FaCircle className={`${maintainReportCardData.school ? 'glow-on' : 'glow-off'} text-lg`} />
                                    </button>
                                    <button
                                        onClick={() => setMaintainReportCardData({
                                            ...maintainReportCardData,
                                            teacher: !maintainReportCardData.teacher
                                        })}
                                        aria-pressed={maintainReportCardData.teacher}
                                        className={`${hasResponsibleTeacherName ? 'hover:bg-shadow-5 hover:dark:bg-shadow-15' : 'cursor-not-allowed'} w-full flex items-center justify-between gap-2 py-1 px-3 rounded-md transition-[background-color] disabled:opacity-40`}
                                        disabled={!hasResponsibleTeacherName}
                                    >
                                        Professor(a)
                                        <FaCircle className={`${maintainReportCardData.teacher ? 'glow-on' : 'glow-off'} text-lg`} />
                                    </button>
                                    <button
                                        onClick={() => setMaintainReportCardData({
                                            ...maintainReportCardData,
                                            studentName: !maintainReportCardData.studentName
                                        })}
                                        aria-pressed={maintainReportCardData.studentName}
                                        className='w-full hover:bg-shadow-5 hover:dark:bg-shadow-15 flex items-center justify-between gap-2 py-1 px-3 rounded-md transition-[background-color]'>
                                        Nome
                                        <FaCircle className={`${maintainReportCardData.studentName ? 'glow-on' : 'glow-off'} text-lg`} />
                                    </button>
                                    <button
                                        onClick={() => setMaintainReportCardData({
                                            ...maintainReportCardData,
                                            studentNumber: !maintainReportCardData.studentNumber
                                        })}
                                        aria-pressed={maintainReportCardData.studentNumber}
                                        className='w-full hover:bg-shadow-5 hover:dark:bg-shadow-15 flex items-center justify-between gap-2 py-1 px-3 rounded-md transition-[background-color]'>
                                        N°
                                        <FaCircle className={`${maintainReportCardData.studentNumber ? 'glow-on' : 'glow-off'} text-lg`} />
                                    </button>
                                    <button
                                        onClick={() => setMaintainReportCardData({
                                            ...maintainReportCardData,
                                            studentYearAndClass: !maintainReportCardData.studentYearAndClass
                                        })}
                                        aria-pressed={maintainReportCardData.studentYearAndClass}
                                        className='w-full hover:bg-shadow-5 hover:dark:bg-shadow-15 flex items-center justify-between gap-2 py-1 px-3 rounded-md transition-[background-color]'>
                                        Ano
                                        <FaCircle className={`${maintainReportCardData.studentYearAndClass ? 'glow-on' : 'glow-off'} text-lg`} />
                                    </button>
                                </div>
                            </div>

                            <div className='mt-2 divide-x divide-solid divide-transparent hover:divide-violet-500'>
                                <p className='w-fit font-bold relative overflow-visible'>
                                    Grade curricular
                                    <InfoIcon topic='Grade curricular' aria-haspopup='true' description='Os itens de "Grade curricular" providos de "Manter Dados" refere-se à salvar as notas, faltas e o total de aulas dadas em determinada matéria no LocalStorage, assim, a página poderá ser recarregada e a informação não se perderá!' />
                                </p>

                                <div>
                                    <button
                                        onClick={() => setMaintainReportCardData({
                                            ...maintainReportCardData,
                                            academicRecordGrades: !maintainReportCardData.academicRecordGrades
                                        })}
                                        aria-pressed={maintainReportCardData.academicRecordGrades}
                                        className='w-full hover:bg-shadow-5 hover:dark:bg-shadow-15 flex items-center justify-between gap-2 py-1 px-3 rounded-md transition-[background-color]'
                                    >
                                        Notas
                                        <FaCircle className={`${maintainReportCardData.academicRecordGrades ? 'glow-on' : 'glow-off'} text-lg`} />
                                    </button>
                                    <button
                                        onClick={() => setMaintainReportCardData({
                                            ...maintainReportCardData,
                                            academicRecordAbsences: !maintainReportCardData.academicRecordAbsences
                                        })}
                                        aria-pressed={maintainReportCardData.academicRecordAbsences}
                                        className='w-full hover:bg-shadow-5 hover:dark:bg-shadow-15 flex items-center justify-between gap-2 py-1 px-3 rounded-md transition-[background-color]'
                                    >
                                        Faltas
                                        <FaCircle className={`${maintainReportCardData.academicRecordAbsences ? 'glow-on' : 'glow-off'} text-lg`} />
                                    </button>
                                    <button
                                        onClick={() => setMaintainReportCardData({
                                            ...maintainReportCardData,
                                            academicRecordTotalClasses: !maintainReportCardData.academicRecordTotalClasses
                                        })}
                                        aria-pressed={maintainReportCardData.academicRecordTotalClasses}
                                        className='w-full hover:bg-shadow-5 hover:dark:bg-shadow-15 flex items-center justify-between gap-2 py-1 px-3 rounded-md transition-[background-color]'
                                    >
                                        Aulas dadas
                                        <FaCircle className={`${maintainReportCardData.academicRecordTotalClasses ? 'glow-on' : 'glow-off'} text-lg`} />
                                    </button>
                                </div>
                            </div>
                        </Details>

                        <Details summary='Imagens' containerClassName='max-h-[11.6rem]'>
                            { filesImage.length === 0
                                ?   <div className='w-full hover:bg-shadow-5 flex flex-col items-center justify-center border border-dashed border-violet-500 rounded-lg py-4 transition-colors'>
                                        <FcImageFile className='text-2xl drop-shadow-[4px_-4px_0_#1e40af]' />
                                        Sem imagens
                                    </div>
                                :   <>
                                        { filesImage.length > 1 &&
                                            <button
                                                title='Baixar todas as imagens em um arquivo .zip'
                                                className={`w-full bg-shadow-5 font-bold text-violet-500 hover:text-green-500 dark:text-violet-400 dark:hover:text-green-400 border border-dashed hover:border-solid border-violet-500 hover:border-green-500 dark:border-violet-400 dark:hover:border-green-400 ${clickedIndex === -1 ? 'underline' : ''} flex items-center justify-center gap-2 mt-1 mb-2 rounded-lg transition-colors`}
                                                onClick={() => {
                                                    setClickedIndex(-1)
                                                    generateZipImages(filesImage)
                                                }}
                                            >
                                                Baixar tudo
                                                <MdFolderZip className='text-lg' />
                                            </button>
                                        }
                                        { filesImage.map((file, index) => {
                                            return (
                                                <div key={index} className='w-full flex items-center justify-between even:bg-shadow-5 dark:even:bg-shadow-15 rounded-md p-1 last:even:mb-3'>
                                                    <span className={`pl-1 cursor-default ${clickedIndex === index ? 'underline underline-offset-4' : ''}`}>{file.name}</span>

                                                    <div className='flex flex-nowrap'>
                                                        <a
                                                            title={`Download do arquivo '${file.name}'`}
                                                            aria-label={`Download do arquivo '${file.name}'`}
                                                            href={file.imageData}
                                                            download={file.name}
                                                            onClick={() => setClickedIndex(index)}
                                                            className='w-7 h-7 hover:bg-green-400 active:bg-green-500 text-green-400 hover:text-white active:text-white animate-download text-xl p-1 flex items-center justify-center rounded-md transition-colors'
                                                        >
                                                            <svg stroke='currentColor' fill='currentColor' strokeWidth='0' viewBox='0 0 24 24' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'>
                                                                <path fill='none' d='M 0 0 L 24 0 L 24 24 L 0 24 L 0 0 Z' />
                                                                <path className='download-top-icon' d='M 17 11 L 15.59 9.59 L 13 12.17 L 13 4 L 11 4 L 11 12.17 L 8.41 9.59 L 7 11 L 12 16 L 17 11 Z' />
                                                                <path d='M 18 15 L 18 18 L 6 18 L 6 15 L 4 15 L 4 18 C 4 19.1 4.9 20 6 20 L 18 20 C 19.1 20 20 19.1 20 18 L 20 15 L 18 15 Z' />
                                                            </svg>
                                                        </a>
                                                        <button
                                                            title='Deletar imagem'
                                                            aria-label='Deletar imagem'
                                                            onClick={() => deleteImage(index)}
                                                            className='w-7 h-7 hover:bg-red-400 active:bg-red-500 text-red-400 hover:text-white active:text-white animate-trash text-lg p-1 flex items-center justify-center rounded-md transition-colors'
                                                        >
                                                            <svg stroke='currentColor' fill='currentColor' strokeWidth='0' viewBox='-1 -1 20 20' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'>
                                                                <path className='trash-top-icon' fillRule='evenodd' d='M 8 1.001 C 7.622 1.001 7.276 1.215 7.107 1.554 L 6.383 3.001 L 3.001 3.001 C 2.231 3.001 1.751 3.834 2.136 4.501 C 2.315 4.81 2.645 5.001 3.001 5.001 L 15 5.001 C 15.769 5.001 16.25 4.168 15.865 3.501 C 15.687 3.192 15.356 3.001 15 3.001 L 11.618 3.001 L 10.894 1.554 C 10.725 1.215 10.38 1.001 10.001 1.001 L 8 1.001 Z' clipRule='evenodd' transform='matrix(1, -0.000138, 0.000138, 1, -0.000414, 0.001242)' />
                                                                <path className='trash-bottom-icon' fillRule='evenodd' d='M 15.001 5.001 C 15.77 5.001 2.646 5.001 3.002 5.001 L 3 15.001 C 3 16.106 3.896 17.001 5.001 17.001 L 12.998 17.001 C 14.103 17.001 14.999 16.106 14.999 15.001 L 15.001 5.001 Z M 6.001 7.001 C 6.001 6.231 6.834 5.75 7.501 6.135 C 7.811 6.314 8 6.644 8 7.001 L 7.999 13.001 C 7.999 13.771 7.167 14.252 6.5 13.867 C 6.191 13.688 6 13.358 6 13.001 L 6.001 7.001 Z M 11 6.001 C 10.449 6.001 10.001 6.449 10.001 7.001 L 10 13.001 C 10 13.771 10.832 14.252 11.499 13.867 C 11.809 13.688 11.999 13.358 11.999 13.001 L 12 7.001 C 12 6.449 11.552 6.001 11 6.001 Z' clipRule='evenodd' transform='matrix(1, -0.000138, 0.000138, 1, -0.001518, 0.001244)' />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        }) }
                                    </>
                            }
                        </Details>

                        <Details summary='Matérias'>
                            <div className='bg-shadow-5 dark:bg-shadow-15 mb-2 flex flex-col gap-1 rounded-md overflow-hidden'>
                                <div id='switch-subject' className='w-full bg-slate-200 dark:bg-gray-700 border border-shadow-5 dark:border-shadow-15 relative flex items-center justify-between gap-2 p-1 rounded-md'>
                                    <button
                                        onClick={() => switchSubjectWithAnimation('previous')}
                                        className='hover:bg-shadow-5 hover:dark:bg-shadow-15 border border-transparent p-1 rounded-md disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:dark:bg-transparent disabled:cursor-not-allowed transition-[background-color] z-[25]'
                                        disabled={activeSubjectIndex === 0 || switchSubjectButtonDisabled}
                                        title='Matéria anterior'
                                        aria-label='Matéria anterior'
                                    >
                                        <MdKeyboardArrowLeft className='text-xl' />
                                    </button>
                                    <p id='previous-subject' className='w-fit opacity-0 absolute left-0 z-[21]'>{subjects[activeSubjectIndex - 1]}</p>
                                    <p id='current-subject' className='w-fit mx-auto absolute -left-2/4 -right-2/4 z-[22]'>{subjects[activeSubjectIndex]}</p>
                                    <p id='next-subject' className='w-fit opacity-0 absolute right-0 z-[23]'>{subjects[activeSubjectIndex + 1]}</p>
                                    <button
                                        onClick={() => switchSubjectWithAnimation('next')}
                                        className='hover:bg-shadow-5 hover:dark:bg-shadow-15 border border-transparent p-1 rounded-md disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:dark:bg-transparent disabled:cursor-not-allowed transition-[background-color] z-[25]'
                                        disabled={activeSubjectIndex === subjects.length - 1 || switchSubjectButtonDisabled}
                                        title='Próxima matéria'
                                        aria-label='Próxima matéria'
                                    >
                                        <MdKeyboardArrowRight className='text-xl' />
                                    </button>
                                </div>

                                <div className='w-full flex items-center justify-between gap-2 py-1 px-3 rounded-md'>
                                    <p className='relative overflow-visible'>
                                        Aulas dadas
                                        <InfoIcon topic='Matérias' aria-haspopup='true' description='O item "Aulas dadas" refere-se à quantidade de aulas dadas em determinada matéria. Este item é importante porque entra no cálculo da porcentagem de faltas do aluno, o que consequentemente pode determinar uma reprovação por falta.' />
                                    </p>

                                    <Input
                                        id='totalClasses'
                                        name='totalClasses'
                                        withForm={false}
                                        type='number'
                                        className={`w-12 h-7 inputNumberValues`}
                                        onChange={event => updateTotalClasses(Number(event.target.value), subjects[activeSubjectIndex])}
                                        value={schoolReport.studentAcademicRecord[subjects[activeSubjectIndex]].totalClasses}
                                        step='1'
                                        min='1'
                                        max='248'
                                        label={`Total de aulas dadas em ${schoolReport.studentAcademicRecord[subjects[activeSubjectIndex]]}`}
                                        labelStyle='sr-only'
                                    />
                                </div>

                                <button
                                    title={`Remover a matéria ${subjects[activeSubjectIndex]}`}
                                    onClick={() => {
                                        if(activeSubjectIndex !== 0 && activeSubjectIndex === subjects.length - 1) setActiveSubjectIndex(activeSubjectIndex - 1)
                                        removeSubjects(subjects[activeSubjectIndex])
                                    }}
                                    className='w-[calc(100%-1.5rem)] bg-red-400 hover:bg-red-500 active:bg-red-600 text-white mx-auto mb-2 py-1 px-6 flex items-center justify-center gap-2 rounded-md disabled:opacity-40 disabled:hover:bg-red-400 disabled:cursor-not-allowed transition-colors'
                                    disabled={subjects.length <= 7}
                                >
                                    Remover matéria
                                </button>
                            </div>

                            <div className='divide-x divide-solid divide-transparent hover:divide-violet-500'>
                                <p className='font-bold'>Adicionar</p>

                                <div className='max-h-[20rem] overflow-auto'>
                                    { inactiveSubjects.map((subject, index) => {
                                        const isCustomSubject = !JSON.parse(DefaultValues.MATTER).includes(subject)

                                        return (
                                            <div key={index} className='w-full hover:bg-shadow-5 hover:dark:bg-shadow-15 flex items-center justify-between gap-2 py-1 px-3 rounded-md transition-[background-color]'>
                                                <p>{subject}</p>
                                                <div className='flex gap-2'>
                                                    { isCustomSubject &&
                                                        <button
                                                            title={`Excluir a matéria ${subject} permanentemente!`}
                                                            aria-label={`Excluir a matéria ${subject} permanentemente!`}
                                                            onClick={() => removeSubjects(subject)}
                                                            className='w-8 h-8 bg-shadow-5 dark:bg-shadow-15 animate-trash text-red-400 text-lg border border-dashed border-transparent hover:border-red-400 active:border-solid flex items-center justify-center p-1 rounded-md transition-[border-color]'
                                                        >
                                                            <svg stroke='currentColor' fill='currentColor' strokeWidth='0' viewBox='-1 -1 20 20' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'>
                                                                <path className='trash-top-icon' fillRule='evenodd' d='M 8 1.001 C 7.622 1.001 7.276 1.215 7.107 1.554 L 6.383 3.001 L 3.001 3.001 C 2.231 3.001 1.751 3.834 2.136 4.501 C 2.315 4.81 2.645 5.001 3.001 5.001 L 15 5.001 C 15.769 5.001 16.25 4.168 15.865 3.501 C 15.687 3.192 15.356 3.001 15 3.001 L 11.618 3.001 L 10.894 1.554 C 10.725 1.215 10.38 1.001 10.001 1.001 L 8 1.001 Z' clipRule='evenodd' transform='matrix(1, -0.000138, 0.000138, 1, -0.000414, 0.001242)' />
                                                                <path className='trash-bottom-icon' fillRule='evenodd' d='M 15.001 5.001 C 15.77 5.001 2.646 5.001 3.002 5.001 L 3 15.001 C 3 16.106 3.896 17.001 5.001 17.001 L 12.998 17.001 C 14.103 17.001 14.999 16.106 14.999 15.001 L 15.001 5.001 Z M 6.001 7.001 C 6.001 6.231 6.834 5.75 7.501 6.135 C 7.811 6.314 8 6.644 8 7.001 L 7.999 13.001 C 7.999 13.771 7.167 14.252 6.5 13.867 C 6.191 13.688 6 13.358 6 13.001 L 6.001 7.001 Z M 11 6.001 C 10.449 6.001 10.001 6.449 10.001 7.001 L 10 13.001 C 10 13.771 10.832 14.252 11.499 13.867 C 11.809 13.688 11.999 13.358 11.999 13.001 L 12 7.001 C 12 6.449 11.552 6.001 11 6.001 Z' clipRule='evenodd' transform='matrix(1, -0.000138, 0.000138, 1, -0.001518, 0.001244)' />
                                                            </svg>
                                                        </button>
                                                    }
                                                    <button
                                                        title={`Adicionar a matéria ${subject}`}
                                                        aria-label={`Adicionar a matéria ${subject}`}
                                                        onClick={() => addSubjects(subject)}
                                                        className='w-8 h-8 bg-shadow-5 dark:bg-shadow-15 animate-add border border-dashed border-transparent hover:border-green-400 active:border-solid flex items-center justify-center p-1 rounded-md disabled:opacity-40 disabled:hover:border-transparent disabled:cursor-not-allowed transition-[border-color]'
                                                        disabled={subjects.length >= 12}
                                                    >
                                                        <HiPlusSm className='text-2xl text-green-400' />
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    }) }

                                    <div className='w-full hover:bg-shadow-5 hover:dark:bg-shadow-15 flex items-center justify-between gap-2 py-1 px-3 rounded-md transition-colors'>
                                        <label htmlFor='otherSubject' className='sr-only'>Adicionar outra matéria</label>
                                        <input
                                            id='otherSubject'
                                            name='otherSubject'
                                            type='text'
                                            className={`w-full h-7 bg-shadow-5 dark:bg-shadow-15 px-2 rounded-md`}
                                            onChange={event => setOtherSubject(convertToPascalCase(event.target.value))}
                                            value={otherSubject}
                                            placeholder='Outra matéria'
                                        />
                                        <button
                                            onClick={() => addSubjects(otherSubject, true)}
                                            className='w-14 h-7 bg-green-400 hover:bg-green-500 active:bg-green-600 flex items-center justify-center p-1 rounded-md disabled:opacity-40 disabled:hover:bg-green-400 disabled:cursor-not-allowed transition-colors'
                                            disabled={subjects.length >= 12}
                                            title={`Adicionar matéria ${otherSubject}`}
                                            aria-label={`Adicionar matéria ${otherSubject}`}
                                        >
                                            <HiPlusSm className='text-xl text-white' />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Details>

                        <Details summary='Cores' containerClassName='flex flex-col gap-2'>
                            <div className='divide-x divide-solid divide-transparent hover:divide-violet-500'>
                                <p className='w-full font-bold flex items-center justify-between'>
                                    Boletim

                                    <button
                                        title='Restaurar cores'
                                        aria-label='Restaurar cores'
                                        onClick={() => setSchoolReportColors(schoolReportColorsStartup)}
                                        className='w-7 h-7 hover:w-32 focus-visible:w-32 hover:bg-red-400 focus-visible:bg-red-400 hover:active:bg-red-500 animate-restore-colors text-md font-medium dark:text-white hover:text-white focus-visible:text-white flex items-center justify-center hover:gap-1 focus-visible:gap-1 rounded-md transition-[width,background-color,color] duration-500'
                                    >
                                        <VscReset className='text-lg reset-icon' />
                                        <p className='w-0 text-clip'>Restaurar</p>
                                    </button>
                                </p>

                                <div>
                                    <div className='w-full hover:bg-shadow-5 hover:dark:bg-shadow-15 flex items-center justify-between gap-2 py-1 px-3 rounded-md transition-[background-color]'>
                                        <p>Cartão</p>
                                        <ColorPicker item='card' />
                                    </div>
                                    <div className='w-full hover:bg-shadow-5 hover:dark:bg-shadow-15 flex items-center justify-between gap-2 py-1 px-3 rounded-md transition-[background-color]'>
                                        <p>Texto</p>
                                        <ColorPicker item='text' />
                                    </div>
                                    <div className='w-full hover:bg-shadow-5 hover:dark:bg-shadow-15 flex items-center justify-between gap-2 py-1 px-3 rounded-md transition-[background-color]'>
                                        <p>Borda</p>
                                        <ColorPicker item='border' />
                                    </div>
                                    <div className='w-full hover:bg-shadow-5 hover:dark:bg-shadow-15 flex items-center justify-between gap-2 py-1 px-3 rounded-md transition-[background-color]'>
                                        <p>Borda de recorte</p>
                                        <ColorPicker item='clippingBorder' />
                                    </div>
                                    <div className={`${hasSignatures ? 'hover:bg-shadow-5 hover:dark:bg-shadow-15' : 'opacity-40 cursor-not-allowed'} w-full flex items-center justify-between gap-2 py-1 px-3 rounded-md transition-[background-color]`}>
                                        <p>Assinatura</p>
                                        <ColorPicker item='signatures' disabled={!hasSignatures} />
                                    </div>
                                    <div className='w-full hover:bg-shadow-5 hover:dark:bg-shadow-15 flex items-center justify-between gap-2 py-1 px-3 rounded-md transition-[background-color]'>
                                        <p>Notas positivas</p>
                                        <ColorPicker item='enoughGrade' />
                                    </div>
                                    <div className='w-full hover:bg-shadow-5 hover:dark:bg-shadow-15 flex items-center justify-between gap-2 py-1 px-3 rounded-md transition-[background-color]'>
                                        <p>Notas negativas</p>
                                        <ColorPicker item='insufficientGrade' />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className='w-fit font-bold mb-1'>Aplicação</p>
                                <button onClick={toggleTheme} className='w-full border border-shadow-15 hover:border-shadow-30 dark:hover:border-gray-800 flex items-center justify-center gap-3 py-1 rounded-md transition-colors'>
                                    <span className='w-2 h-2 dark:scale-[2] bg-gray-700 shadow-[12px_-12px_0_1px_#111827_inset,0_-7.5px_0_-2.7px_#111827,5.5px_-5.5px_0_-2.7px_#111827,0_7.5px_0_-2.7px_#111827,-5.5px_5.5px_0_-2.7px_#111827,-7.5px_0_0_-2.7px_#111827,-5.5px_-5.5px_0_-2.7px_#111827,7.5px_0_0_-2.7px_#111827,5.5px_5.5px_0_-2.7px_#111827] dark:shadow-[3.5px_-3.5px_0_0_#f3f4f6_inset,0_0_0_-3px_#111827,0_0_0_-3px_#111827,0_0_0_-3px_#111827,0_0_0_-3px_#111827,0_0_0_-3px_#111827,0_0_0_-3px_#111827,0_0_0_-3px_#111827,0_0_0_-3px_#111827] rounded-full transition-[box-shadow] duration-500' />
                                    Mudar Tema
                                </button>
                            </div>
                        </Details>
                    </div>
                </>
            }
        </aside>
    )
}