import { useRef, useState } from 'react'
import { GetStaticProps } from 'next'

import { FormHandles, Scope, SubmitHandler } from '@unform/core'
import { Form } from '@unform/web'

import { Input } from '@/components/form/input'

import { FormInvoiceData } from '@/interfaces/types'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

interface HomeProps {
    academicYear: number
}

export default function Home(props: HomeProps) {
    const formRef = useRef<FormHandles>(null)

    const [school, setSchool] = useState('')
    const [teacher, setTeacher] = useState('')
    const hasResponsibleTeacherName = true

    const [studentName, setStudentName] = useState('')
    const [studentNumber, setStudentNumber] = useState(1)
    const [studentYearAndClass, setStudentYearAndClass] = useState('')

    const handleFormSubmit: SubmitHandler<FormInvoiceData> = async (data, { reset }) => {
        // sendData(data)
        reset()
    }

    return (
        <div className='min-h-screen flex flex-col items-center justify-center'>
            <main className={`w-auto min-w-[30rem] bg-white border-2 border-solid border-gray-70 ${inter.className} font-bold p-2 flex flex-col items-center justify-center gap-4 hover:border-dashed hover:border-red-600`}>
                <Form ref={formRef} onSubmit={handleFormSubmit} className='border'>
                    <section>
                        <h1 className='text-center my-6'>BOLETIM ESCOLAR:&nbsp;<span>{props.academicYear}</span></h1>

                        <hr />

                        <div className='flex gap-12 p-1'>
                            <Input
                                name='school'
                                label='Escola:'
                                type='text'
                                className='w-full min-w-[24rem]'
                                onChange={event => setSchool(event.target.value)}
                                value={school}
                                container
                                required
                            />
                            { hasResponsibleTeacherName &&
                                <Input
                                    name='responsibleTeacherName'
                                    label='Prof:'
                                    type='text'
                                    className='w-36'
                                    onChange={event => setTeacher(event.target.value)}
                                    value={teacher}
                                    container
                                    required
                                />
                            }
                        </div>

                        <hr />

                        <div className='flex justify-between gap-12 p-1'>
                            <Scope path='student'>
                                <Input
                                    name='studentName'
                                    label='Nome:'
                                    type='text'
                                    className='w-full min-w-[24rem]'
                                    onChange={event => setStudentName(event.target.value)}
                                    value={studentName}
                                    container
                                    required
                                />

                                <div className='flex gap-8'>
                                    <Input
                                        name='studentNumber'
                                        label='N°:'
                                        type='number'
                                        className='w-9'
                                        onChange={event => setStudentNumber(Number(event.target.value))}
                                        value={studentNumber}
                                        step='1'
                                        min='1'
                                        max='99'
                                        container
                                        required
                                    />
                                    <Input
                                        name='studentYearAndClass'
                                        label='Ano:'
                                        type='text'
                                        className='w-12'
                                        onChange={event => setStudentYearAndClass(event.target.value)}
                                        value={studentYearAndClass}
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

                    </Scope>
                </Form>

                <div className='w-full flex flex-col gap-4'>
                    <div className='flex gap-4'>
                        <div className='w-full flex items-end'><p className='w-24'>1° Bim:</p><span className='w-full h-0.5 bg-black' /></div>
                        <div className='w-full flex items-end'><p className='w-24'>2° Bim:</p><span className='w-full h-0.5 bg-black' /></div>
                    </div>

                    <div className='flex gap-4'>
                        <div className='w-full flex items-end'><p className='w-24'>3° Bim:</p><span className='w-full h-0.5 bg-black' /></div>
                        <div className='w-full flex items-end'><p className='w-24'>4° Bim:</p><span className='w-full h-0.5 bg-black' /></div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const academicYear = new Date().getFullYear()

    return {
        props: {academicYear},
        revalidate: 60 * 60 * 24 // 24 hours
    }
}