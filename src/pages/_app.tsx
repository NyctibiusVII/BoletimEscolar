import type { AppProps } from 'next/app'

import { ThemeProvider } from 'next-themes'
import { SidebarProvider } from '@/contexts/SidebarContext'
import { GenerateImageProvider } from '@/contexts/GenerateImageContext'
import { SchoolReportConfigProvider } from '@/contexts/SchoolReportConfigContext'
import { SchoolReportProvider } from '@/contexts/SchoolReportContext'

import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider attribute='class'>
            <SidebarProvider>
                <SchoolReportConfigProvider>
                    <SchoolReportProvider>
                        <GenerateImageProvider>
                            <title>Boletim Escolar</title>
                            <Component {...pageProps} />
                        </GenerateImageProvider>
                    </SchoolReportProvider>
                </SchoolReportConfigProvider>
            </SidebarProvider>
        </ThemeProvider>
    )
}