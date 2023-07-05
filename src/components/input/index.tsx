import { useEffect, useRef } from 'react'
import { useField } from '@unform/core'

import { InputProps } from '@/interfaces/types'

export const Input = ({ withForm=true, ...props }: InputProps) => withForm ? <UnFormInput {...props}/> : <InputComponent {...props}/>

const InputComponent = ({ name, label, labelPosition='before', container=false, labelStyle='', containerStyle='', className, ...props }: InputProps) => {
    const Input = <input className={`text-center border border-dashed border-violet-500 rounded-lg pl-1 ${className}`} {...props}/>
    const Label = <label htmlFor={name} className={labelStyle}>{label}</label>

    return <>{ container ?
        <div className={`${containerStyle} flex flex-nowrap gap-2`}>
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
const UnFormInput = ({ name, label, labelPosition='before', container=false, labelStyle='', containerStyle='', ...props }: InputProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const {
        fieldName,
        defaultValue,
        registerField
    } = useField(name)

    const Input =
        <input id={fieldName} ref={inputRef} defaultValue={defaultValue} {...props}/>
    const Label =
        <label htmlFor={fieldName} className={labelStyle}>{label}</label>

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
        <div className={`${containerStyle} flex flex-nowrap gap-1`}>
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