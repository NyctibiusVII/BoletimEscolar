import {
    createContext,
    ReactNode,
    useState
} from 'react'

export interface SidebarContextData {
    isOpen:        boolean
    toggleSidebar: (state?: boolean) => void
}
interface SidebarProviderProps { children: ReactNode }

export const SidebarContext = createContext({} as SidebarContextData)

export function SidebarProvider({ children }: SidebarProviderProps) {
    const [isOpen, setIsOpen] = useState(false)

    const toggleSidebar = (state?: boolean) => {
        if (state === undefined) setIsOpen(!isOpen)
        else if (state) setIsOpen(true)
        else setIsOpen(false)
    }

    return(
        <SidebarContext.Provider
            value={{
                isOpen,
                toggleSidebar
            }}>
            {children}
        </SidebarContext.Provider>
    )
}