import {
    createContext,
    ReactNode,
    useState
} from 'react'
import domtoimage from 'dom-to-image'

import { Student } from '@/interfaces/types'
import { useSidebar } from '@/hooks/useSidebar'
import { useSchoolReport } from '@/hooks/useSchoolReport'

export interface GenerateImageContextData {
    filesImage:    { name: string; imageData: string }[]
    generateImage: () => Promise<void>
    deleteImage:   (index: number) => void
}
interface GenerateImageProviderProps { children: ReactNode }

export const GenerateImageContext = createContext({} as GenerateImageContextData)

export function GenerateImageProvider({ children }: GenerateImageProviderProps) {
    const { schoolReport } = useSchoolReport()
    const { toggleSidebar } = useSidebar()
    const [filesImage, setFilesImage] = useState<{ name: string; imageData: string }[]>([])

    const generateImage = async () => {
        const schoolReportNode: HTMLElement = document.getElementById('school-report') ?? document.body
        const buttonGenerateImage = document.getElementById('generate-image') as HTMLButtonElement | null

        if(!buttonGenerateImage) return
        buttonGenerateImage.style.visibility = 'hidden'
        toggleSidebar(false)

        try {
            const dataUrl = await domtoimage.toPng(schoolReportNode)
            const fileName = generateFileName(schoolReport.student, new Date())
            setFilesImage(prevImageUrls => [...prevImageUrls, { name: fileName, imageData: dataUrl }])
        }
        catch (error) { console.error('Opa, algo deu errado!\nPor favor, recarregue a página.', error) }
        finally { buttonGenerateImage.style.visibility = 'visible' }
    }

    const generateFileName = (student: Student, date: Date) => {
        const { name, number, yearAndClass } = student

        const [hour, minute, second] = date.toLocaleTimeString().split(':')
        const dateFile = `${hour}h-${minute}m-${second}s`

        return `${name}__n°${number}__${yearAndClass}__${dateFile}.png`
            .replace(/[\\/:*?"<>|\s]/g, '-')
            .toLowerCase()
    }

    const deleteImage = (index: number) => {
        setFilesImage(prevImageUrls => {
            const updatedImageUrls = [...prevImageUrls]
            updatedImageUrls.splice(index, 1)

            return updatedImageUrls
        })
    }

    return(
        <GenerateImageContext.Provider
            value={{
                filesImage,
                generateImage,
                deleteImage
            }}>
            {children}
        </GenerateImageContext.Provider>
    )
}
