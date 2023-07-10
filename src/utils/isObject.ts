import {
    ActiveQuarter,
    FilesImage,
    MaintainReportCardData,
    Matter,
    SchoolReportColors
} from '@/interfaces/types'

export const isActiveQuarter = (obj: any): obj is ActiveQuarter => {
    return typeof obj === 'object'
        && 'firstQuarter'  in obj
        && 'secondQuarter' in obj
        && 'thirdQuarter'  in obj
        && 'fourthQuarter' in obj
}
export const isFilesImage = (obj: any): obj is FilesImage => {
    return Array.isArray(obj)
        && obj.every(item =>
                typeof item === 'object'
                && 'name' in item
                && 'imageData' in item
            )
}
export const isMaintainReportCardData = (obj: any): obj is MaintainReportCardData => {
    return typeof obj === 'object'
        && 'school'              in obj
        && 'teacher'             in obj
        && 'studentName'         in obj
        && 'studentNumber'       in obj
        && 'studentYearAndClass' in obj
}
export const isSubjects = (obj: any): obj is Matter[] => {
    return Array.isArray(obj) && obj.every(item => typeof item === 'string')
}
export const isSchoolReportColors = (obj: any): obj is SchoolReportColors => {
    return typeof obj === 'object'
        && 'card'              in obj
        && 'border'            in obj
        && 'clippingBorder'    in obj
        && 'signatures'        in obj
        && 'text'              in obj
        && 'insufficientGrade' in obj
        && 'enoughGrade'       in obj
}