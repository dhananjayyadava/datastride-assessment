export default function formatTime(date) {
  const d = new Date(date);

  // Convert to IST
  const istDate = new Date(
    d.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  // Weekday (Mon, Tue, Wed...)
  const day = istDate.toLocaleDateString("en-IN", {
    weekday: "short",
  }); // "Mon"

  // Time in 12-hour format
  const time = istDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${day} ${time}`;
}
