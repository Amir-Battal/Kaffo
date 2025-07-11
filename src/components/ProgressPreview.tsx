import { useGetProblemPhotos } from '@/hooks/use-problem-photo';
import { useGetAllProblemProgress } from '@/hooks/use-progress';
import { JSX, useState } from 'react';

interface ProgressPreviewProps {
  problemId: number;
}

const ProgressPreview = ({ problemId }: ProgressPreviewProps): JSX.Element => {
  const [currentSlides, setCurrentSlides] = useState<{ [key: number]: number }>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { progressList, isLoading: isProgressLoading } = useGetAllProblemProgress(problemId);
  const { photos, isLoading: isPhotosLoading } = useGetProblemPhotos(problemId);

  if (isProgressLoading || isPhotosLoading) return <div>جاري تحميل البيانات...</div>;

  if (!Array.isArray(progressList) || progressList.length === 0) {
    return <div>لا توجد بيانات تقدم لعرضها.</div>;
  }

  const handleNextSlide = (progressId: number, maxSlides: number) => {
    setCurrentSlides((prev) => ({
      ...prev,
      [progressId]: ((prev[progressId] || 0) + 1) % maxSlides,
    }));
  };

  const handlePrevSlide = (progressId: number, maxSlides: number) => {
    setCurrentSlides((prev) => ({
      ...prev,
      [progressId]: ((prev[progressId] || 0) - 1 + maxSlides) % maxSlides,
    }));
  };

  return (
    <div dir="ltr" className="flex flex-col gap-10">
      {progressList.map((progress) => {
        const relatedPhotos = photos.filter((photo) => progress.photoIds.includes(photo.id));
        const photosPerSlide = 3;
        const numSlides = Math.ceil(relatedPhotos.length / photosPerSlide);
        const currentSlide = currentSlides[progress.id] || 0;

        const startIndex = currentSlide * photosPerSlide;
        const endIndex = startIndex + photosPerSlide;
        const displayedPhotos = relatedPhotos.slice(startIndex, endIndex);

        return (
          <div
            key={progress.id}
            className="flex flex-row justify-between gap-40 border-b pb-6 relative"
          >
            {/* صور التقدم */}
            <div className="relative w-[60%] flex items-center">
              <div className="grid grid-cols-3 gap-5 w-full">
                {displayedPhotos.length > 0 ? (
                  displayedPhotos.map((photo, index) => (
                    <div
                      key={index}
                      className="w-[100px] h-[100px] bg-neutral-200 flex justify-center items-center rounded overflow-hidden cursor-pointer"
                      onClick={() => setSelectedImage(photo.s3Key)}
                    >
                      <img
                        src={photo.s3Key}
                        alt={`progress-${progress.id}-img-${index}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-400 col-span-3">
                    لا توجد صور لهذا التقدم
                  </div>
                )}
              </div>

              {numSlides > 1 && (
                <>
                  <button
                    onClick={() => handlePrevSlide(progress.id, numSlides)}
                    className="absolute left-[-30px] top-[40%] text-2xl bg-white rounded-full shadow px-2 py-1"
                  >
                    {'<'}
                  </button>
                  <button
                    onClick={() => handleNextSlide(progress.id, numSlides)}
                    className="absolute right-[-30px] top-[40%] text-2xl bg-white rounded-full shadow px-2 py-1"
                  >
                    {'>'}
                  </button>
                </>
              )}
            </div>

            {/* نص التقدم */}
            <div dir="ltr" className="w-full text-end flex flex-col gap-3">
              <div className="text-lg font-semibold">{progress.percentage}%</div>
              <div className="text-neutral-400 text-sm">التعليق</div>
              <div className="mt-2">{progress.comment}</div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(progress.progressDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        );
      })}

      {/* Dialog لعرض الصورة المكبرة */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
        >
          <img
            src={selectedImage}
            alt="Enlarged"
            className="max-w-[90%] max-h-[90%] rounded shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default ProgressPreview;
