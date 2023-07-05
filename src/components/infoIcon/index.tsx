import { useState } from 'react'
import {
    getCookie,
    setCookie
} from 'cookies-next'

import Swal from 'sweetalert2'
import { useSwalTheme } from '@/hooks/useSwalTheme'
import { InfoIconProps } from '@/interfaces/types'
import { HiInformationCircle } from '@/utils/reactIconsImports'

/**
 * @param topic - Name of the information topic. Used as a unique identifier.
 * @param description - Description of the information.
 * @returns An information icon that, when clicked, displays a dialog box with the information description.
 * @example
 * <InfoIcon topic='Topic' description='Information description' />
 * @observation The parent component must have 'relative position' for the icon to be correctly positioned.
*/
export const InfoIcon = ({ topic, description, ...rest }: InfoIconProps) => {
    const swalColors = useSwalTheme()

    topic = topic.replace(/\s/g, '_').toLowerCase()

    const [show, setShow] = useState(!(getCookie(`swal_info__${topic}`) === true) ?? true)

    return (
        <>
            { show && <span className='w-4 h-4 bg-violet-500 absolute top-0 right-[-1.2rem] rounded-full animate-ping opacity-75' /> }

            <HiInformationCircle
                title={description}
                className='text-black dark:text-white absolute top-0 right-[-1.2rem] cursor-help'
                onClick={() => {
                    Swal.fire({
                        title: 'Informação',
                        text: description,
                        icon: 'info',
                        background: swalColors.bg,
                        color: swalColors.fg,
                        iconColor: swalColors.info.icon
                    })
                    .finally(() => {
                        if (show) {
                            setShow(false)
                            setCookie(`swal_info__${topic}`, true)
                        }
                    })
                }}
                { ...rest }
            />
        </>
    )
}