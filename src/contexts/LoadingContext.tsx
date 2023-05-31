import {
    createContext,
    ReactNode,
    useState
} from 'react'

export interface LoadingContextData {
    isLoading:    boolean
    setIsLoading: (state: boolean) => void
}
interface LoadingProviderProps { children: ReactNode }

export const LoadingContext = createContext({} as LoadingContextData)

export function LoadingProvider({ children }: LoadingProviderProps) {
    const [isLoading, setIsLoading] = useState(true)

    return(
        <LoadingContext.Provider
            value={{
                isLoading,
                setIsLoading
            }}>
            {children}
        </LoadingContext.Provider>
    )
}