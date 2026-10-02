"use client"

import { cn } from "cn"
import Image from "next/image"
import { useState } from "react"

const ProductImages = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <div className="space-y-4">
      <Image
        src={images[currentIndex]}
        alt="Product Image"
        width={1000}
        height={1000}
        className="min-h-[300px] object-cover object-center"
        priority
      />
      <div className="flex">
        {images.map((item, index) => (
          <div
            key={item}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "border mr-2 cursor-pointer hover:border-orange-600",
              currentIndex === index && "border-orange-500",
            )}
          >
            <Image src={item} alt="image" width={100} height={100} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductImages
