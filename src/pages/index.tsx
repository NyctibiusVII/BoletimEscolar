import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    return (
        <div className='min-h-screen flex flex-col items-center justify-center'>
            <main className={`w-auto min-w-[30rem] bg-white border-2 border-solid border-gray-70 ${inter.className} p-2 flex flex-col items-center justify-center gap-4 hover:border-dashed hover:border-red-600`}>
                <div className='w-full font-bold flex flex-col gap-4'>
                    <div className='flex gap-4'>
                        <div className='w-full flex items-end'><p className='w-24'>1° Bim:</p><span className='w-full h-0.5 bg-black' /></div>
                        <div className='w-full flex items-end'><p className='w-24'>2° Bim:</p><span className='w-full h-0.5 bg-black' /></div>
                    </div>

                    <div className='flex gap-4'>
                        <div className='w-full flex items-end'><p className='w-24'>3° Bim:</p><span className='w-full h-0.5 bg-black' /></div>
                        <div className='w-full flex items-end'><p className='w-24'>4° Bim:</p><span className='w-full h-0.5 bg-black' /></div>
                    </div>
                </div>
            </main>
        </div>
    )
}
