import { useContext } from 'react'

import { SidebarContext, SidebarContextData } from '@/contexts/SidebarContext'

export function useSidebar(): SidebarContextData {
    const context = useContext(SidebarContext)

    if (!context) throw new Error('useSidebar must be used within an SidebarProvider')

    return context
}