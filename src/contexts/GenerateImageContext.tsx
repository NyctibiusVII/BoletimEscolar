import {
    createContext,
    ReactNode
} from 'react'
import domtoimage from 'dom-to-image'

import { useSidebar } from '@/hooks/useSidebar'

export interface GenerateImageContextData {
    generateImage: () => Promise<void>
}
interface GenerateImageProviderProps { children: ReactNode }

export const GenerateImageContext = createContext({} as GenerateImageContextData)

export function GenerateImageProvider({ children }: GenerateImageProviderProps) {
    const {toggleSidebar} = useSidebar()

    const generateImage = async () => {
        const schoolReportNode: HTMLElement = document.getElementById('school-report') ?? document.body
        const buttonGenerateImage: HTMLElement | null = document.getElementById('generate-image')

        if(!buttonGenerateImage) return
        buttonGenerateImage.style.visibility = 'hidden'
        toggleSidebar(false)

        await domtoimage.toPng(schoolReportNode)
            .then(dataUrl => {
                var img = new Image()
                img.src = dataUrl
                document.body.appendChild(img)
            })
            .catch(error => console.error('Opa, algo deu errado!\nPor favor, recarregue a página.', error))
            .finally(() => buttonGenerateImage.style.visibility = 'visible')
    }

    return(
        <GenerateImageContext.Provider
            value={{
                generateImage
            }}>
            {children}
        </GenerateImageContext.Provider>
    )
}
