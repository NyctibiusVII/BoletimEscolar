import {
    useRef,
    useState
} from 'react'
import Draggable from 'react-draggable'
import { BlockPicker } from 'react-color'

import { ColorPickerProps } from '@/interfaces/types'
import { useSchoolReportConfig } from '@/hooks/useSchoolReportConfig'

export const ColorPicker = ({ item, className, ...rest }: ColorPickerProps) => {
    const [show, setShow] = useState(false)
    const {schoolReportColors, setSchoolReportColors} = useSchoolReportConfig()

    const cardRef = useRef<HTMLDivElement>(null)
    const cardWidth = 240
    const cardHeight = 252

    const colors = [
        '#ffffff', '#e5e7eb', '#d1d5db', '#9ca3af', '#1f2937', '#111827', '#030712',
        '#6d28d9', '#9333ea', '#d946ef', '#db2777', '#f43f5e', '#dc2626', '#fb923c',
        '#fbbf24', '#fde047', '#a3e635', '#22c55e', '#34d399', '#06b6d4', '#2563eb'
    ]

    return (
        <>
            <button
                onClick={() => setShow(!show)} {...rest}
                className={`w-12 h-5 border border-gray-700 shadow-[0_0_0_1px_#e2e8f0_inset] rounded-md disabled:cursor-not-allowed ${className}`}
                style={{ backgroundColor: schoolReportColors[item] }}
            />
            { show &&
                <div className='w-full h-full fixed inset-0 z-30'>
                    <div onClick={() => setShow(false)} className='w-full h-full fixed inset-0 z-40' />
                    <Draggable
                        nodeRef={cardRef}
                        bounds='parent'
                        defaultClassName='hover:cursor-grab'
                        defaultClassNameDragging='!cursor-grabbing'
                        defaultPosition={{
                            x: (window.innerWidth / 2) - (cardWidth / 2),
                            y: (window.innerHeight / 2) - (cardHeight / 2)
                        }}
                    >
                        <div ref={cardRef} className='fixed z-50'>
                            <BlockPicker
                                triangle='hide'
                                colors={colors}
                                color={schoolReportColors[item]}
                                className='color-picker'
                                onChangeComplete={color => setSchoolReportColors({ ...schoolReportColors, [item]: color.hex })}
                                styles={{
                                    default: {
                                        card: {
                                            width: cardWidth,
                                            height: cardHeight,
                                            backgroundColor: '#ffffff1a',
                                            border: '1px solid #ffffff1a',
                                            borderRadius: '0.5rem',
                                            boxShadow: `0 0 20rem -3rem ${schoolReportColors[item]}, 0 0 1.5rem 0 #0000000d`,
                                            backdropFilter: 'blur(12px)'
                                        },
                                        label: {
                                            backgroundColor: '#0000000d',
                                            border: '1px dashed #ffffffcc',
                                            borderRadius: '0.5rem',
                                            fontWeight: 600,
                                            textTransform: 'uppercase',
                                            padding: '0 0.5rem',
                                            userSelect: 'text',
                                            cursor: 'text',
                                            zIndex: 1000,
                                        },
                                        input: { color: '#9ca3af' }
                                    }
                                }}
                            />
                        </div>
                    </Draggable>
                </div>
            }
        </>
    )
}