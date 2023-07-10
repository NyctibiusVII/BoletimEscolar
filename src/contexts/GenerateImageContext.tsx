import {
    createContext,
    ReactNode,
    useState
} from 'react'

import domtoimage from 'dom-to-image'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
// @ts-ignore
import * as JSZipUtils from 'jszip-utils'

import {
    DownloadableDataTypes,
    FilesImage,
    Student
} from '@/interfaces/types'

import { useSidebar }      from '@/hooks/useSidebar'
import { useSchoolReport } from '@/hooks/useSchoolReport'

export interface GenerateImageContextData {
    filesImage:        { name: string; imageData: string }[]
    setFilesImage:     (value: FilesImage) => void
    generateImage:     () => Promise<void>
    generateZipImages: (images: FilesImage) => void
    deleteImage:       (index: number) => void
}
interface GenerateImageProviderProps { children: ReactNode }

export const GenerateImageContext = createContext({} as GenerateImageContextData)

export function GenerateImageProvider({ children }: GenerateImageProviderProps) {
    const { schoolReport } = useSchoolReport()
    const { toggleSidebar } = useSidebar()
    const [filesImage, setFilesImage] = useState<FilesImage>([])

    const generateImage = async () => {
        const schoolReportNode: HTMLElement = document.getElementById('school-report') ?? document.body
        const buttonGenerateImage = document.getElementById('generate-image') as HTMLButtonElement | null

        if(!buttonGenerateImage) return
        buttonGenerateImage.style.visibility = 'hidden'
        toggleSidebar(false)

        try {
            const dataUrl = await domtoimage.toPng(schoolReportNode)
            const fileName = generateFileName(schoolReport.student)
            setFilesImage(prevImageUrls => [...prevImageUrls, { name: fileName, imageData: dataUrl }])
        }
        catch (error) { console.error('Opa, algo deu errado!\nPor favor, recarregue a página.', error) }
        finally { buttonGenerateImage.style.visibility = 'visible' }
    }

    const generateFileName = (student: Student) => {
        const { name, number, yearAndClass } = student

        return `${name}__n°${number}__${yearAndClass}__${getCurrentTime()}.png`
            .replace(/[\\/:*?"<>|\s]/g, '-')
            .toLowerCase()
    }

    const generateZipImages = (images: FilesImage) => {
        const zip = new JSZip()
        let count = 0

        images.forEach(({ name, imageData }) => {
            JSZipUtils.getBinaryContent(imageData, (err: any, data: DownloadableDataTypes) => {
                if (err) throw err

                zip.file(`Boletins/${name}`, data, { binary: true, base64: true })
                count++

                if (count === images.length) {
                    zip.generateAsync({ type: 'blob' }).then(content => saveAs(content, `Boletins__${getCurrentTime()}.zip`))
                }
            })
        })

    }

    const deleteImage = (index: number) => {
        setFilesImage(prevImageUrls => {
            const updatedImageUrls = [...prevImageUrls]
            updatedImageUrls.splice(index, 1)

            return updatedImageUrls
        })
    }

    const getCurrentTime = () => {
        const date = new Date()
        const [hour, minute, second] = date.toLocaleTimeString().split(':')

        return `${hour}h-${minute}m-${second}s`
    }

    return(
        <GenerateImageContext.Provider
            value={{
                filesImage,
                setFilesImage,
                generateImage,
                generateZipImages,
                deleteImage
            }}>
            {children}
        </GenerateImageContext.Provider>
    )
}
