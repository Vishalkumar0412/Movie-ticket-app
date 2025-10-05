import { Progress } from "./progress"


interface UploadProgressProps {
  progress: number
  fileName: string
}

export function UploadProgress({ progress, fileName }: UploadProgressProps) {
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500 truncate">{fileName}</span>
        <span className="text-gray-700 font-medium">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  )
}