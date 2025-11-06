import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="LiveBackdrop — AI virtual backgrounds for livestreams and videos. Upload an image, generate stunning scenes, and go live." />
        <meta name="keywords" content="virtual background, livestream, AI background, streaming, Zoom background" />
        <link rel="icon" href="/images/favicon.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
