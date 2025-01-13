'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const images = [
  "https://cuigfae3o8.ufs.sh/f/P2M7SP8XUkN7K8Y9UZJUir0wlpbAF8Yd21jVhgquCLoNkP3I",
  "https://cuigfae3o8.ufs.sh/f/P2M7SP8XUkN7GnAHShP6DJbjHam9vUCFZ53WrdALqlcuhk7T",
  "https://cuigfae3o8.ufs.sh/f/P2M7SP8XUkN7lbsQCSMlnf6zTRBbUmCeJX5pK8ghq9jsFDN0",
  "https://cuigfae3o8.ufs.sh/f/P2M7SP8XUkN767sYGWpixfvSGDP2C4V0AjTwNZ9sWk5rKnFu"
]

export default function AutoSlideshow() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full h-[340px] shadow-md block mx-auto md:mx-0 rotate-1 pointer-events-none">
      {images.map((src, index) => (
        <div
          key={src}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={src}
            width={1920}
            height={1080}
            alt={""}
            objectFit="cover"
            className="pointer-events-none"
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  )
}