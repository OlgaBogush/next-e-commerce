import Image from "next/image"
import loading from "@/assets/loader.gif"

const LoadingPage = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Image
        src={loading}
        width={0}
        height={0}
        style={{ width: "150px", height: "auto" }}
        alt="Loading..."
        unoptimized
      />
    </div>
  )
}

export default LoadingPage
