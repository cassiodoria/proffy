export default function convertHourToMinutes(time: string) {
    const [hour, minutes] = time.split(':').map(Number); // 8:00
    const timeInMinutes = (hour * 60) + minutes;
    return timeInMinutes;
}