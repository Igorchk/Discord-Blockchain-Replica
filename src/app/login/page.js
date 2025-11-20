import { getImageProps } from "next/image";

function getBackgroundImage(srcSet = '') {
  const imageSet = srcSet
    .split(', ')
    .map((str) => {
      const [url, dpi] = str.split(' ')
      return `url("${url}") ${dpi}`
    })
    .join(', ')
  return `image-set(${imageSet})`
}

export default function LoginPage() {
  const {
    props: { srcSet },
  } = getImageProps({ alt: '', width: 1920, height: 1080, src: '/background1.jpg' })
  const backgroundImage = getBackgroundImage(srcSet)
  const style = { height: '100vh', width: '100vw',
    backgroundImage, backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat', backgroundPosition: 'center', }


  return (
    <main style={style}>
      <h1>Test</h1>
    </main>
  );
}