import { Skeleton } from '@/components/Skeleton'
import { useSidebar } from '@/hooks/useSidebar'

export const SkeletonHome = () => {
    const { isOpen } = useSidebar()

    return (
        <div className={`w-screen h-screen flex items-end lg:justify-end`}>
            <Skeleton.Container className={
                `w-full shadow-[0_0.5rem_2rem_0_rgba(0,0,0,0.2)] lg:shadow-[0.5rem_0_2rem_0_rgba(0,0,0,0.2)] fixed top-0 left-0 z-20
                ${!isOpen
                    ? 'lg:w-[calc(2%+2rem)] h-[calc(2%+2rem)] lg:h-full flex items-center lg:items-start'
                    : 'min-w-[220px] lg:w-fit lg:min-w-[18rem] h-full'} skeleton-sidebar !rounded-none`
            }>
                <Skeleton.Card size='sm' className={
                    `my-1
                    ${!isOpen
                        ? 'w-[calc(100%-5rem)] sm:w-[calc(100%-15rem)] h-[1.5rem] lg:w-10 lg:h-10 2xl:w-12 2xl:h-12 lg:mt-[70%]'
                        : '!w-36 lg:my-6'
                    }`
                } />

                { isOpen &&
                    <>
                        <Skeleton.Container width='full' className='flex flex-col gap-1 mx-auto'>
                            <Skeleton.Container width='full' className='max-w-[calc(100%-6rem)] flex gap-4'>
                                <Skeleton.Item height='md' />
                                <Skeleton.Item height='md' className='max-w-[5rem]' />
                            </Skeleton.Container>
                            <Skeleton.Container width='full' className='max-w-[calc(100%-4rem)] flex gap-4'>
                                <Skeleton.Item height='md' />
                                <Skeleton.Item height='md' className='max-w-[5rem]' />
                            </Skeleton.Container>
                            <Skeleton.Container width='full' className='max-w-[calc(100%-2rem)] flex gap-4'>
                                <Skeleton.Item height='md' />
                                <Skeleton.Item height='md' className='max-w-[5rem]' />
                            </Skeleton.Container>
                        </Skeleton.Container>

                        <Skeleton.List width='full' height='lg' count={5} className='my-4' />
                    </>
                }
            </Skeleton.Container>

            <div
                className={
                    `w-full lg:h-full h-[calc(98%-2rem)] overflow-auto flex
                    ${!isOpen ? 'lg:w-[calc(98%-2rem)]' : 'lg:max-w-[calc(100%-18rem)]'}`
                }
            >
                <div className='max-w-fit m-auto'>
                    <main className='w-72 sm:w-[35rem] md:w-[40rem]'>
                        <Skeleton.Container className='skeleton-school-report'>
                            <Skeleton.Item height='md' className='my-2 sm:h-9 sm:mb-4' />

                            <Skeleton.Container width='full' className='flex mx-auto gap-4 sm:gap-8 md:gap-20'>
                                <Skeleton.Item className='sm:h-6' />
                                <Skeleton.Item className='max-w-[17rem] sm:h-6' />
                            </Skeleton.Container>
                            <Skeleton.Container width='full' className='flex mx-auto gap-4 sm:gap-8 md:gap-20'>
                                <Skeleton.Item className='sm:h-6' />

                                <Skeleton.Container width='full' className='max-w-[17rem] flex gap-2 !p-0 sm:gap-4 md:gap-8'>
                                    <Skeleton.Item className='!mx-0 sm:h-6' />
                                    <Skeleton.Item className='!mx-0 sm:h-6' />
                                </Skeleton.Container>
                            </Skeleton.Container>

                            <Skeleton.Item className='flex items-center justify-center mx-auto my-2 h-8 sm:h-24 sm:my-4 md:h-36 lg:my-4' />

                            <Skeleton.Container width='full' className='flex gap-4 mx-auto sm:gap-8 md:gap-12'>
                                <Skeleton.Item className='sm:h-6' />
                                <Skeleton.Item className='sm:h-6' />
                            </Skeleton.Container>
                            <Skeleton.Container width='full' className='flex gap-4 mx-auto sm:gap-8 md:gap-12'>
                                <Skeleton.Item className='sm:h-6' />
                                <Skeleton.Item className='sm:h-6' />
                            </Skeleton.Container>
                        </Skeleton.Container>
                    </main>
                </div>
            </div>
        </div>
    )
}