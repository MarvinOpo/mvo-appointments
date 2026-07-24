export function semesterToDates(semester: string) {
  const [sem, yearStr] = semester.split('-');
  const year = Number(yearStr);
  let start: Date, end: Date;

  if (sem === '1') {
    start = new Date(year, 0, 1);
    end = new Date(year, 5, 30);
  } else {
    start = new Date(year, 6, 1);
    end = new Date(year, 11, 31);
  }

  return { start, end };
}
