import type { AppProps } from 'next/app'

import { ThemeProvider } from 'next-themes'
import { SidebarProvider } from '@/contexts/SidebarContext'
import { GenerateImageProvider } from '@/contexts/GenerateImageContext'
import { SchoolReportConfigProvider } from '@/contexts/SchoolReportConfigContext'
import { SchoolReportProvider } from '@/contexts/SchoolReportContext'

import Head from 'next/head'

import BuildProviderTree from '@/utils/providerTree'
import '@/styles/globals.css'

const Providers = BuildProviderTree([
    [ThemeProvider, { attribute: 'class' }],
    [SidebarProvider],
    [SchoolReportConfigProvider],
    [SchoolReportProvider],
    [GenerateImageProvider]
])

export default function App({ Component, pageProps }: AppProps) {
    return (
        <Providers>
            <Head>
                <meta name='viewport' content='width=device-width, initial-scale=1.0' />
                <title>Boletim Escolar</title>
            </Head>
            <Component {...pageProps} />
        </Providers>
    )
}