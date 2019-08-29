/**
 * HH:mm:ss形式の時間を秒に変換する
 * @param time (例: 10:05:02)
 */
export function toSeconds(time: string): number {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 60 * 60 + minutes * 60 + seconds;
}
