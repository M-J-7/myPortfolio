import { useEffect, useState } from "react";
import { profile } from "@/data/profile";

/** Live local time where Mihir actually is — a small signal that the page is awake. */
export function Clock({ className }: { className?: string }) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: profile.timezone,
      }).format(new Date());

    setTime(format());
    const id = window.setInterval(() => setTime(format()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className={className}>
      {time} {profile.timezoneLabel}
    </span>
  );
}
