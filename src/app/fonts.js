import localFont from 'next/font/local'

export const gilroy = localFont({
  src: [
    {
      path: '../../public/fonts/gilroy/regular/gilroy-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/gilroy/medium/gilroy-medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/gilroy/bold/gilroy-bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-gilroy',
})