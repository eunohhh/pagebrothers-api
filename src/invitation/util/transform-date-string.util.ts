export function transformDateString(dateString: string): string {
  // 1. ISO 형식의 날짜를 JavaScript Date 객체로 변환
  const date = new Date(dateString);

  // 2. 연도, 월, 일 추출 및 변환
  const year = date.getFullYear().toString().slice(2); // 마지막 두 자리 연도
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 1월 = 0이므로 +1, 두 자리로
  const day = date.getDate().toString().padStart(2, '0'); // 두 자리로

  // 3. 랜덤한 소문자 세 글자 생성
  const randomChars = Array.from({ length: 3 }, () =>
    String.fromCharCode(97 + Math.floor(Math.random() * 26)),
  ).join('');

  // 4. 변환된 문자열 반환
  return `${year}${month}${day}${randomChars}`;
}
