'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const images = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  "https://cuigfae3o8.ufs.sh/f/P2M7SP8XUkN7LqR8BDVjxOln8NI5mATXedhLVBWkrFJHazpM"
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