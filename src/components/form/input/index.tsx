import { useEffect, useRef } from 'react'
import { useField } from '@unform/core'

import type { InputProps } from '@/interfaces/types'

export const Input = ({ name, label, container=false, ...rest }: InputProps) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const { fieldName, defaultValue, registerField, error } = useField(name)

    const InputComponent =
        <input
            id={fieldName}
            ref={inputRef}
            defaultValue={defaultValue}
            {...rest}
        />

    const LabelComponent =
        <label htmlFor={fieldName}>{label}</label>

    const ContainerComponent = (Component: JSX.Element) =>
        <div className={`flex flex-nowrap gap-1 ${fieldName}`}>{Component}</div>

    useEffect(() => {
        return registerField({
            name: fieldName,
            ref: inputRef.current,
            getValue: ref => {
                return ref.value
            },
            setValue: (ref, value) => {
                ref.value = value
            },
            clearValue: ref => {
                ref.value = ''
            }
        })
    }, [fieldName, registerField])

    return (
        <>
            { container ?
                ContainerComponent(<>{LabelComponent} {InputComponent}</>)
                :
                <>{LabelComponent} {InputComponent}</>
            }

            { error && <span>{error}</span> }
        </>
    )
}