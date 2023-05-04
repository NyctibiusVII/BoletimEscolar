import type { AppProps } from 'next/app'

import { SidebarProvider } from '@/contexts/SidebarContext'
import { GenerateImageProvider } from '@/contexts/GenerateImageContext'
import { SchoolReportConfigProvider } from '@/contexts/SchoolReportConfigContext'
import { SchoolReportProvider } from '@/contexts/SchoolReportContext'

import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <SidebarProvider>
            <SchoolReportConfigProvider>
                <SchoolReportProvider>
                    <GenerateImageProvider>
                        <Component {...pageProps} />
                    </GenerateImageProvider>
                </SchoolReportProvider>
            </SchoolReportConfigProvider>
        </SidebarProvider>
    )
}