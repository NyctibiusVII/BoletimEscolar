import {
    useEffect,
    useState
} from 'react'
import {
    getCookie,
    setCookie
} from 'cookies-next'

export const CookieConcent = () => {
    const [showCookieConcent, setShowCookieConcent] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() =>
            setShowCookieConcent(!(getCookie('__cookie_concent') === true)),
            5000
        )

        return () => clearTimeout(timer)
    }, [])

    const handleAcceptCookies = () => {
        setCookie('__cookie_concent', true)
        setShowCookieConcent(false)
    }

    return showCookieConcent
        ? (
            <div className='w-screen h-screen fixed top-0 flex items-end bg-shadow-30 left-0 z-30'>
                <div className='w-full bg-amber-900'>
                    <div className='bg-center bg-cookie-texture mix-blend-screen'>
                        <div className='backdrop-blur-[4px] p-2 flex flex-col gap-4 md:p-4 md:flex-row md:items-center md:justify-between md:gap-8 lg:px-8'>
                            <div className='text-amber-200'>
                                <h1 className='text-center text-lg font-bold md:text-left'>Cookies</h1>
                                <p className='whitespace-normal'>Ao usar este site, você concorda com o uso de cookies. Usamos cookies para lhe proporcionar uma ótima experiência e para ajudar o nosso site a funcionar de forma eficaz.</p>
                            </div>

                            <button
                                className='w-full bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold py-2 md:px-20 md:w-fit rounded-md transition-all'
                                onClick={handleAcceptCookies}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
        : null
}