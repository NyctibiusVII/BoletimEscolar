import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    const
        language            = 'pt-BR',
        title               = 'Boletim escolar',
        site                = 'Boletim escolar',
        link                = 'https://boletim-escolar.vercel.app',
        favicon             = `${link}/favicon.svg`,
        homePageImage       = `${link}/HomePage-1366x768.png`,
        homePageImageWidth  = '1366',
        homePageImageHeight = '768',
        homePageImageType   = 'image/png',
        author              = 'Matheus Vidigal - (NyctibiusVII)',
        twitterAtSign       = '@NyctibiusVII',
        description         = `Faça o boletim de seus alunos de forma mais rápida e personalizada. 👩🏻‍🏫📇🎨`,
        keywords            = 'html, tailwindcss, react, next, boletim, escolar, boletim escolar, boletim escolar online, boletim escolar digital, personalizar, download'

    return (
        <Html lang={language}>
            <Head>
                <meta charSet='utf-8' />
                <meta name='language' content={language} />

                <meta name='robots'       content='all' />
                <meta name='rating'       content='general' />
                <meta name='distribution' content='global' />
                <meta name='description'  content={ description } />

                <meta name='MobileOptimized'         content='320' />
                <meta name='HandheldFriendly'        content='True' />
                <meta name='google'                  content='notranslate' />
                <meta name='referrer'                content='no-referrer-when-downgrade' />
                <meta name='theme-color'             content='#030712' />
                <meta name='msapplication-TileColor' content='#030712' />
                <meta name='msapplication-TileImage' content={ favicon } />

                <meta name='author'   content={ author } />
                <meta name='creator'  content={ author } />
                <meta name='keywords' content={ keywords } />

                <meta httpEquiv='content-type'     content='text/html; charset=UTF-8' />
                <meta httpEquiv='content-language' content={ language } />
                <meta httpEquiv='X-UA-Compatible'  content='ie=edge' />

                <meta property='og:title'            content={ title } />
                <meta property='og:description'      content={ description } />
                <meta property='og:locale'           content={ language } />
                <meta property='og:type'             content='website' />
                <meta property='og:site_name'        content={ site } />
                <meta property='og:url'              content={ link } />
                <meta property='og:image'            content={ homePageImage } />
                <meta property='og:image:secure_url' content={ homePageImage } />
                <meta property='og:image:alt'        content='Thumbnail' />
                <meta property='og:image:type'       content={ homePageImageType } />
                <meta property='og:image:width'      content={ homePageImageWidth } />
                <meta property='og:image:height'     content={ homePageImageHeight } />

                <meta property='article:author' content={ author } />

                <meta name='twitter:title'        content={ title } />
                <meta name='twitter:description'  content={ description } />
                <meta name='twitter:card'         content='summary_large_image' />
                <meta name='twitter:site'         content={ site } />
                <meta name='twitter:creator'      content={ twitterAtSign } />
                <meta name='twitter:image'        content={ homePageImage } />
                <meta name='twitter:image:src'    content={ homePageImage } />
                <meta name='twitter:image:alt'    content='Thumbnail' />
                <meta name='twitter:image:width'  content={ homePageImageWidth } />
                <meta name='twitter:image:height' content={ homePageImageHeight } />

                <link rel='shortcut icon' href='/favicon.svg' type='image/svg' />

                <meta name='google-site-verification' content='OjYiqlxK64Fx5dZre97pwHGJ7pYgOP4vQYH1UCOdBuo' />
            </Head>
            <body>
                <Main />
                <noscript data-n-css=''>
                    <br/><br/>
                    Caro leitor!<br/><br/>
                    Se você estiver lendo esta mensagem é porque o seu navegador não suporta<br/>
                    &quot;Javascript&quot; ou porque a permissão de executar &quot;Javascript&quot; está<br/>
                    desabilitada, se for o caso, por favor habilite.
                </noscript>
                <NextScript />
            </body>
        </Html>
    )
}