import { useEffect, useRef } from 'react'
import { useField } from '@unform/core'

import { InputProps } from "@/interfaces/types"

export const Input = ({ name, label, labelPosition='before', container=false, ...props }: InputProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const {
        fieldName,
        defaultValue,
        registerField
    } = useField(name)

    const Input =
        <input id={fieldName} ref={inputRef} defaultValue={defaultValue} {...props}/>
    const Label =
        <label htmlFor={fieldName}>{label}</label>

    useEffect(() => {
        return registerField({
            name: fieldName,
            ref:  inputRef.current,
            getValue:   ref => ref.value,
            setValue:  (ref, value) => ref.value = value,
            clearValue: ref => ref.value = ''
        })
    }, [fieldName, registerField])

    return <>{ container ?
        <div className={'flex flex-nowrap gap-1'}>
            {
                (label && labelPosition === 'after') && <>{Input}{Label}</>
                ||
                (label) && <>{Label}{Input}</>
                || Input
            }
        </div>
        :
        <>{
            (label && labelPosition === 'after') && <>{Input}{Label}</>
            ||
            (label) && <>{Label}{Input}</>
            || Input
        }</>
    }</>
}