import { useRef, useState, useEffect } from "react"

export function MultiImageUploader({
  onFilesSelected
}: {
  onFilesSelected: (files: File[]) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])

  // عند اختيار ملفات جديدة من input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    // دمج الملفات الجديدة مع القديمة (أو استبدال حسب رغبتك)
    const newFiles = Array.from(e.target.files)
    setFiles((prev) => {
      // لتجنب تكرار الملفات (حسب الاسم وحجم الملف)
      const merged = [...prev]
      newFiles.forEach((newFile) => {
        if (!merged.some(f => f.name === newFile.name && f.size === newFile.size)) {
          merged.push(newFile)
        }
      })
      return merged
    })

    // تنظيف قيمة input حتى نتمكن من اختيار نفس الملف مرة أخرى إذا أردنا
    e.target.value = ""
  }

  // حذف صورة معينة من القائمة
  const handleRemoveFile = (index: number) => {
    setFiles((prev) => {
      const copy = [...prev]
      copy.splice(index, 1)
      return copy
    })
  }

  // نرسل الملفات المختارة إلى الـ parent عند تغيرها
  useEffect(() => {
    onFilesSelected(files)
  }, [files, onFilesSelected])

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="border p-2 rounded mb-3"
      >
        اختر صور الشكوى 📷
      </button>

      {/* معاينة الصور */}
      <div className="flex flex-wrap gap-3">
        {files.map((file, i) => {
          const objectUrl = URL.createObjectURL(file)
          return (
            <div key={file.name + file.size} className="relative w-24 h-24 border rounded overflow-hidden">
              <img
                src={objectUrl}
                alt={file.name}
                className="w-full h-full object-cover"
                onLoad={() => URL.revokeObjectURL(objectUrl)} // لتحرير الذاكرة
              />
              <button
                type="button"
                onClick={() => handleRemoveFile(i)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                aria-label="حذف الصورة"
              >
                ×
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
