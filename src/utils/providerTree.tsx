import { ReactNode } from 'react'

type Provider = React.FunctionComponent<{ children: ReactNode }>

type ProviderWithProps = [Provider, Record<string, unknown>?]

const BuildProviderTree = (providers: ProviderWithProps[]): Provider => {
    if (providers.length === 1) {
        const [ProviderComponent, props] = providers[0]
        const ProviderWrapper: Provider = ({ children }) => (
            <ProviderComponent {...(props || {})}>
                { children }
            </ProviderComponent>
        )

        ProviderWrapper.displayName = ProviderComponent.displayName || ProviderComponent.name

        return ProviderWrapper
    }

    const [ProviderComponent, props] = providers.shift()!
    const ChildProvider = BuildProviderTree(providers)

    const ProviderWrapper: Provider = ({ children }) => (
        <ProviderComponent {...(props || {})}>
            <ChildProvider>{ children }</ChildProvider>
        </ProviderComponent>
    )

    ProviderWrapper.displayName = ProviderComponent.displayName || ProviderComponent.name

    return ProviderWrapper
}

export default BuildProviderTree