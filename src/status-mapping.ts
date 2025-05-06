export const problemStatusMap = {
  PENDING_APPROVAL: "بانتظار الموافقة",
  APPROVED: "تمت الموافقة",
  REJECTED: "تم رفض الشكوى",
  IN_PROGRESS: "جاري المعالجة",
  RESOLVED: "تم حل المشكلة",
};

export const arabicToEnglishStatus = Object.entries(problemStatusMap).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {} as Record<string, string>);
