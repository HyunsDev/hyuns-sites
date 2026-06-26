export function readFileAsText(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("파일을 텍스트로 읽지 못했습니다."));
    };
    reader.onerror = () => reject(new Error("파일 읽기 중 오류가 발생했습니다."));
    reader.readAsText(file);
  });
}

export function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("파일을 Data URL로 읽지 못했습니다."));
    };
    reader.onerror = () => reject(new Error("파일 읽기 중 오류가 발생했습니다."));
    reader.readAsDataURL(file);
  });
}

export function errorMessageFromUnknown(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "알 수 없는 오류가 발생했습니다.";
}

