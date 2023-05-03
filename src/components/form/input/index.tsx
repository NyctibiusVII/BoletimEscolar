import { useEffect, useRef } from 'react'
import { useField } from '@unform/core'

import { InputProps } from '@/interfaces/types'

export const Input = ({ withForm=true, ...props }: InputProps) => withForm ? <UnFormInput {...props}/> : <InputComponent {...props}/>

const InputComponent = ({ name, label, labelPosition='before', container=false, className, ...props }: InputProps) => {
    const Input = <input className={`inputNumberValues border border-dashed rounded-lg pl-1 ${className}`} {...props}/>
    const Label = <label htmlFor={name} className='max-w-[13rem]'>{label}</label>

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
const UnFormInput = ({ name, label, labelPosition='before', container=false, ...props }: InputProps) => {
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