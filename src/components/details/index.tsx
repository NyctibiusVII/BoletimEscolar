import { useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'

import { DetailsProps } from '@/interfaces/types'

export const Details = ({ summary = 'Title', children }: DetailsProps) => {
    const [detailsOpen, setDetailsOpen] = useState(false)
    const [detailsId, setDetailsId] = useState('')

    useEffect(() => setDetailsId(uuid()), [])

    useEffect(() => {
        const details = document.querySelector(`details[data-details-id="${detailsId}"]`) as HTMLDetailsElement
        if (!details) return

        const handleToggle = () => setDetailsOpen(details.open)
        details.addEventListener('toggle', handleToggle)

        return () => details.removeEventListener('toggle', handleToggle)
    }, [detailsId])

    return (
        <details data-details-id={detailsId} open={detailsOpen}>
            <summary className={`${detailsOpen ? 'rounded-t-lg' : 'rounded-lg'} px-4 py-1 cursor-pointer`}>
                {summary}
            </summary>
            <div className='rounded-b-lg px-4 py-1'>
                {children}
            </div>
        </details>
    )
}
