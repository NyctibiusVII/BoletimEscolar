import { HiMenu, HiX } from 'react-icons/hi'
import { MdOutlineLightMode, MdOutlineDarkMode } from 'react-icons/md'
import { FaCircle } from 'react-icons/fa'
import { useTheme } from 'next-themes'

import { useSchoolReportConfig } from '@/hooks/useSchoolReportConfig'
import { useSidebar } from '@/hooks/useSidebar'
import { Details } from '@/components/details'
import { Input } from '@/components/input'

import { ActiveQuarter } from '@/interfaces/types'

export const Sidebar = () => {
    const {isOpen, toggleSidebar} = useSidebar()

    const { systemTheme, theme, setTheme } = useTheme()
    const currentTheme = theme === 'system' ? systemTheme : theme
    const toggleTheme = () => currentTheme === 'dark' ? setTheme('light') : setTheme('dark')

    const {
        minimumAttendancePercentageToPass,
        setMinimumAttendancePercentageToPass,
        minimumPassingGrade,
        setMinimumPassingGrade,
        minimumRecoveryGrade,
        setMinimumRecoveryGrade
    } = useSchoolReportConfig()
    const {
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
                        className={`w-[2.6rem] inputNumberValues disabled:bg-transparent cursor-not-allowed`}
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
                        className={`w-[2.6rem] inputNumberValues disabled:bg-transparent cursor-not-allowed`}
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
                        className={`w-[2.6rem] inputNumberValues disabled:bg-transparent cursor-not-allowed`}
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
                        <p>content</p>
                    </Details>
                    <Details summary='Matérias'>
                        <p>content</p>
                    </Details>
                    <Details summary='Cores'>
                        <button onClick={toggleTheme} className='w-full hover:bg-shadow-5 hover:dark:bg-shadow-15 border border-shadow-15 flex items-center justify-center gap-2 py-1 rounded-md'>
                            { currentTheme === 'dark'
                                ? <MdOutlineLightMode className='text-xl' />
                                : <MdOutlineDarkMode className='text-xl' />
                            } Mudar Tema
                        </button>


                        {/*

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>, component: string) => {
        const selectedOption = event.target.value

        // switch (component) {
        //     case 'card': setSchoolReportColors({...schoolReportColors, card: selectedOption})
        //         break;
        //     case 'border': setSchoolReportColors({...schoolReportColors, border: selectedOption})
        //         break;
        //     case 'clippingBorder': setSchoolReportColors({...schoolReportColors, clippingBorder: selectedOption})
        //         break;
        //     case 'signatures': setSchoolReportColors({...schoolReportColors, signatures: selectedOption})
        //         break;
        //     case 'text': setSchoolReportColors({...schoolReportColors, text: selectedOption})
        //         break;
        //     case 'insufficientGrade': setSchoolReportColors({...schoolReportColors, insufficientGrade: selectedOption})
        //         break;
        //     case 'enoughGrade': setSchoolReportColors({...schoolReportColors, enoughGrade: selectedOption})
        //         break;

        //     default:
        //         break;
        // }
    }


    // const color = schoolReportColors.card.replace(/bg-(\w+)/, '$1')

    type reportCardComponentsType =
        | 'card'
        | 'border'
        | 'clippingBorder'
        | 'signatures'
        | 'text'
        | 'insufficientGrade'
        | 'enoughGrade'
    type reportCardComponentsList = {
        name:  reportCardComponentsType
        type:  string
        title: string
    }
    const reportCardComponents: reportCardComponentsList[]  = [
        { name: 'card',              type: 'bg',     title: 'Cartão'               },
        { name: 'border',            type: 'border', title: 'Borda'                },
        { name: 'clippingBorder',    type: 'border', title: 'Borda de recorte'     },
        { name: 'signatures',        type: 'bg',     title: 'Linha de assinaturas' },
        { name: 'text',              type: 'text',   title: 'Texto'                },
        { name: 'insufficientGrade', type: 'text',   title: 'Nota insuficiente'    },
        { name: 'enoughGrade',       type: 'text',   title: 'Nota suficiente'      }
      ]

    const colors = [
        'black',
        'white',
        'slate-500',
        'gray-500',
        'gray-950',
        'zinc-500',
        'neutral-500',
        'stone-500',
        'red-500',
        'orange-500',
        'red-600',
        'amber-500',
        'yellow-500',
        'lime-500',
        'green-500',
        'emerald-500',
        'teal-500',
        'cyan-500',
        'sky-500',
        'blue-500',
        'indigo-500',
        'violet-500',
        'purple-500',
        'fuchsia-500',
        'pink-500',
        'rose-500'
    ]

                        */}
                        {/* <div className='w-full flex items-center justify-between'>
                            <p>Cartão</p>

                            <select
                                onChange={event => handleSelectChange(event, 'card')}
                                className={`appearance-none ${schoolReportColors.card}`
                            }>
                                <option value='bg-white' className='bg-white'>color</option>
                                <option value='bg-green-500' className='bg-green-500'>color</option>
                            </select>
                        </div> */}

                        {/* { reportCardComponents.map((component: reportCardComponentsList) => {
                            return (
                                <div key={component.name} className='w-full flex items-center justify-between'>
                                    <p>{component.title}</p>

                                    <select
                                        onChange={event => handleSelectChange(event, component.type)}
                                        className={`appearance-none ${schoolReportColors[component.name]}`
                                    }>
                                        { colors.map(color => {
                                            return (
                                                <option key={color} value={component.type + '-' + color} className={`bg-${color}`}>{color}</option>
                                            )
                                        }) }
                                    </select>
                                </div>
                            )
                        })} */}
                    </Details>
                </div>
            }
        </aside>
    )
}