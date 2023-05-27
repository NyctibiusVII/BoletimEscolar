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
 * @param topic - Nome do tópico da informação. Usado como identificador único.
 * @param description - Descrição da informação.
 * @returns Um ícone de informação que ao ser clicado mostra uma caixa de diálogo com a descrição da informação.
 * @example
 * <InfoIcon topic='Tópico' description='Descrição da informação' />
 * @observation O componente pai deve ter 'posição relativa' para que o ícone fique posicionado corretamente.
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