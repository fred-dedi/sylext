import Image from 'next/image'
import logo from 'public/images/logo.svg'

export default function LogoIcon(props: React.ComponentProps<'svg'>) {
  return (
    <Image
      src={logo}
      alt={`${process.env.SITE_NAME}`}
    />
  );
}
