import React, { useState } from 'react';

const ProgressPreview = () => {
  const imageGroups = [
    Array(9).fill('https://via.placeholder.com/100'), // شريحة 1
    Array(9).fill('https://via.placeholder.com/100?text=Slide+2'), // شريحة 2
    Array(9).fill('https://via.placeholder.com/100?text=Slide+3')  // شريحة 3
  ];

  const progressData = [
    { percentage: '20%', comment: 'تم إنجاز مرحلة التخطيط لحل المشكلة' },
    { percentage: '40%', comment: 'تم شراء المواد' },
    { percentage: '60%', comment: 'تم البدء بالعمل' }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % imageGroups.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + imageGroups.length) % imageGroups.length);
  };

  return (
    <div dir='ltr' className='flex flex-row justify-between gap-40 '>
      {/* القسم الأيسر - صور */}
      <div className='grid grid-cols-3 gap-5 relative w-[60%]' >
        {imageGroups[currentSlide].map((src, index) => (
          <div key={index} className='w-[100px] h-[100px] bg-neutral-400 flex justify-center items-center'>
            <img src={src} alt={`img-${index}`} style={{ width: '80%', height: '80%', objectFit: 'cover' }} />
          </div>
        ))}
        {/* أسهم التنقل */}
        <button onClick={prevSlide} style={{ position: 'absolute', left: '-30px', top: '40%', fontSize: '24px' }}>{'<'}</button>
        <button onClick={nextSlide} style={{ position: 'absolute', right: '-30px', top: '40%', fontSize: '24px' }}>{'>'}</button>
      </div>

      {/* القسم الأيمن - تعليقات */}
      <div dir='ltr' className='w-full text-end flex flex-col gap-5'>
        {progressData.map((item, index) => (
          <div key={index} className=' mt-5 border-b border-gray-300 pb-4'>
            <div className='text-lg font-semibold'>{item.percentage}</div>
            <div className='text-neutral-400 text-sm'>التعليق</div>
            <div className='mt-2'>{item.comment}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressPreview;
