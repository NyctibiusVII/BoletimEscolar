import { useEffect } from 'react'

import { useLoading } from '@/hooks/useLoading'
import { useSidebar } from '@/hooks/useSidebar'
import { useTheme }   from '@/hooks/useTheme'
import { SkeletonHome } from '@/components/Skeleton/pages/SkeletonHome'
import { Sidebar }      from '@/components/sidebar'
import { SchoolReport } from '@/components/schoolReport'

export default function Home() {
    const { currentTheme } = useTheme()
    const { isLoading } = useLoading()
    const { isOpen } = useSidebar()

    useEffect(() => {
        const body = document.getElementsByTagName('body') as HTMLCollectionOf<HTMLBodyElement>
        if (!body) return

        const backgroundImage = {
            bg: currentTheme === 'dark' ? '#030712' : '#e2e8f0',
            fg: currentTheme === 'dark' ? '#111827' : '#cbd5e1'
        }

        body[0].style.backgroundImage = `radial-gradient(${backgroundImage.fg} 2px, ${backgroundImage.bg} 2px)`
        body[0].style.backgroundSize = '40px 40px'
    }, [currentTheme])

    return isLoading
        ? <SkeletonHome />
        : <div className='w-screen h-screen flex items-end lg:justify-end'>
            <Sidebar />

            <div
                className={
                    `w-full lg:h-full h-[calc(98%-2rem)] overflow-auto flex
                    ${!isOpen ? 'lg:w-[calc(98%-2rem)]' : 'lg:max-w-[calc(100%-18rem)]'}`
                }
            >
                <SchoolReport />
            </div>
        </div>
}