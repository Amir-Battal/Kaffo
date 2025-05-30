import { useGetProblemPhotos } from '@/hooks/use-problem-photo';
import { useGetAllProblemProgress } from '@/hooks/use-progress';
import { JSX, useState } from 'react';

interface ProgressPreviewProps {
  problemId: number;
}

const ProgressPreview = ({ problemId }: ProgressPreviewProps): JSX.Element => {
  const [currentSlides, setCurrentSlides] = useState<{ [key: number]: number }>({});

  const { progressList, isLoading: isProgressLoading } = useGetAllProblemProgress(problemId);
  const { photos, isLoading: isPhotosLoading } = useGetProblemPhotos(problemId);

  if (isProgressLoading) return <div>جاري تحميل بيانات التقدم...</div>;

  if (!Array.isArray(progressList) || progressList.length === 0) {
    return <div>لا توجد بيانات تقدم لعرضها.</div>;
  }

  const handleNextSlide = (progressId: number, maxLength: number) => {
    setCurrentSlides((prev) => ({
      ...prev,
      [progressId]: (prev[progressId] + 1) % maxLength,
    }));
  };

  const handlePrevSlide = (progressId: number, maxLength: number) => {
    setCurrentSlides((prev) => ({
      ...prev,
      [progressId]: (prev[progressId] - 1 + maxLength) % maxLength,
    }));
  };

  return (
    <div dir="ltr" className="flex flex-col gap-10">
      {progressList.map((progress) => {
        const relatedPhotos = photos.filter((photo) => progress.photoIds.includes(photo.id));
        const currentSlide = currentSlides[progress.id] || 0;

        return (
          <div key={progress.id} className="flex flex-row justify-between gap-40 border-b pb-6">
            {/* صور التقدم */}
            <div className="grid grid-cols-3 gap-5 relative w-[60%]">
              {relatedPhotos.length > 0 ? (
                relatedPhotos.slice(currentSlide * 9, (currentSlide + 1) * 9).map((photo, index) => (
                  <div key={index} className="w-[100px] h-[100px] bg-neutral-200 flex justify-center items-center">
                    <img
                      src={photo.url}
                      alt={`progress-${progress.id}-img-${index}`}
                      style={{ width: '80%', height: '80%', objectFit: 'cover' }}
                    />
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-400 col-span-3">لا توجد صور لهذا التقدم</div>
              )}

              {/* أسهم التنقل */}
              {relatedPhotos.length > 9 && (
                <>
                  <button
                    onClick={() => handlePrevSlide(progress.id, Math.ceil(relatedPhotos.length / 9))}
                    style={{ position: 'absolute', left: '-30px', top: '40%', fontSize: '24px' }}
                  >
                    {'<'}
                  </button>
                  <button
                    onClick={() => handleNextSlide(progress.id, Math.ceil(relatedPhotos.length / 9))}
                    style={{ position: 'absolute', right: '-30px', top: '40%', fontSize: '24px' }}
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
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressPreview;
