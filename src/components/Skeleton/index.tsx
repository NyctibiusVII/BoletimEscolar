import {
    ComponentMappingType,
    DefaultValues,
    ProportionalSizeMappingType,
    ProportionalSizeResolverProps,
    SizeResolverProps,
    SizeMappingType,
    SkeletonComponentsProps,
    SkeletonContainerProps,
    SkeletonListProps,
    SkeletonProportionalComponentsProps,
    SkeletonProps
} from '@/interfaces/types'

const Skeleton: SkeletonProps = () => <></>

const Component = (className: string) =>
    <div className={`${className} ${DefaultValues.SKELETON_STYLE} bg-shadow-15`} />

const sizeResolver = ({ width: w, height: h, ComponentType: type }: SizeResolverProps) => {
    const sizeTypeValue = {
        w: {
            fit: 'w-fit min-w-[0.5rem]',
            full: 'w-[calc(100%-1rem)]'
        },
        h: {
            fit: 'h-fit min-h-[0.5rem]',
            full: 'h-[calc(100%-1rem)]'
        }
    }

    /* --- Size Mapping --- */
    const sizeMappingContainer = () => {
        const width: SizeMappingType = {
            fit:  'px-1',
            sm:   'w-20',
            md:   'w-40',
            lg:   'w-60',
            xl:   'w-80',
            full: sizeTypeValue.w.full,
        }
        const height: SizeMappingType = {
            fit:  'py-1',
            sm:   'h-20',
            md:   'h-40',
            lg:   'h-60',
            xl:   'h-80',
            full: sizeTypeValue.h.full,
        }

        return `${width[w]} ${height[h]}`
    }
    const sizeMappingItem = () => {
        const width: SizeMappingType = {
            fit:  sizeTypeValue.w.fit,
            sm:   'w-4',
            md:   'w-8',
            lg:   'w-12',
            xl:   'w-16',
            full: sizeTypeValue.w.full,
        }
        const height: SizeMappingType = {
            fit:  'h-fit min-h-[1ch]',
            sm:   'h-3',
            md:   'h-6',
            lg:   'h-9',
            xl:   'h-12',
            full: sizeTypeValue.h.full,
        }

        return `${width[w]} ${height[h]}`
    }
    const sizeMappingList = () => {
        const width: SizeMappingType = {
            fit:  sizeTypeValue.w.fit,
            sm:   'w-20',
            md:   'w-40',
            lg:   'w-60',
            xl:   'w-80',
            full: sizeTypeValue.w.full,
        }
        const height: SizeMappingType = {
            fit:  sizeTypeValue.h.fit,
            sm:   sizeTypeValue.h.fit,
            md:   sizeTypeValue.h.fit,
            lg:   sizeTypeValue.h.fit,
            xl:   sizeTypeValue.h.fit,
            full: sizeTypeValue.h.full,
        }

        return `${width[w]} ${height[h]}`
    }

    /* --- Component Mapping --- */
    const componentMapping: ComponentMappingType = {
        container: sizeMappingContainer(),
        item:      sizeMappingItem(),
        list:      sizeMappingList()
    }
    if (!componentMapping[type]) throw new Error(`Type ${type} is not supported`)

    const sizeMapping = componentMapping[type]
    if (!sizeMapping) throw new Error(`Size [${w}, ${h}] is not supported`)

    return sizeMapping
}
const proportionalSizeResolver = (size: ProportionalSizeResolverProps) => {
    /* --- Size Mapping --- */
    const sizeMapping: ProportionalSizeMappingType = {
        fit:  'w-fit h-fit min-w-[1ch] min-h-[1ch]',
        sm:   'w-8 h-8',
        md:   'w-12 h-12',
        lg:   'w-16 h-16',
        xl:   'w-20 h-20',
        full: 'w-[calc(100%-1rem)] h-[calc(100%-1rem)]'
    }

    if (!sizeMapping[size]) throw new Error(`Size ${size} is not supported`)

    return sizeMapping[size]
}

const Container = ({ width='fit', height='fit', className='', children }: SkeletonContainerProps) =>
    <div className={`rounded-lg ${sizeResolver({ width, height, ComponentType: 'container' })} ${className}`}>{children}</div>

const Card = ({ size='md', className='' }: SkeletonProportionalComponentsProps) =>
    Component(`${proportionalSizeResolver(size)} ${className}`)

const Item = ({ width='full', height='sm', className='' }: SkeletonComponentsProps) =>
    Component(`${sizeResolver({ width, height, ComponentType: 'item' })} ${className}`)

const List = ({ width='md', height='fit', className='', count=3 }: SkeletonListProps) =>
    <div className={`mx-auto ${sizeResolver({ width, height, ComponentType: 'list' })} ${className}`}>
        { Array(count).fill(null).map((_, index) => <Item key={index} height={height} className='my-2' />) }
    </div>

const Avatar = ({ size='md', className='' }: SkeletonProportionalComponentsProps) =>
    Component(`!rounded-full ${proportionalSizeResolver(size)} ${className}`)

Skeleton.Container = Container
Skeleton.Card      = Card
Skeleton.Item      = Item
Skeleton.List      = List
Skeleton.Avatar    = Avatar

export default Skeleton
export { Skeleton }