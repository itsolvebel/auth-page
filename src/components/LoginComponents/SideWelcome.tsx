import Image from 'next/image'

export function SideWelcome() {
  return (
    <div className='hidden h-full flex-col justify-center gap-8 rounded-2xl bg-[#FFFFFF] p-16 lg:flex lg:w-full'>
      <Image src='/assets/logoGray.png' width={50} height={50} alt='Logo' />
      <h1 className='text-5xl font-bold leading-relaxed text-black/75'>
        <span className='bg-gradient-to-r from-[#01A0C4] to-[#5bd9f5] bg-clip-text text-transparent'>
          Say goodbye{' '}
        </span>
        to the frustration of freelancing and hello to success with us!
      </h1>
      <p className='text-lg text-[#00000070]'>
        No more endless browsing, click and make your idea into reality
      </p>
    </div>
  )
}
