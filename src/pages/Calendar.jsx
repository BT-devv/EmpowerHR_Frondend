import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import { createViewWeek } from "@schedule-x/calendar";
import { useEffect } from "react";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import "@schedule-x/theme-default/dist/index.css";
import { useNavigate } from "react-router-dom";
import UsePermission from "../components/UsePermission";

const Calendar = () => {
  const navigate = useNavigate();
  const { hasPermission, loading } = UsePermission("calendar.read");

  const calendar = useCalendarApp({
    views: [
      createViewWeek({
        eventContent({ event }) {
          return (
            <div style={{ padding: 4 }}>
              <b>{event.title}</b>
              <br />
              <small>{new Date(event.start).toLocaleTimeString()}</small>
            </div>
          );
        },
      }),
    ],
    events: [],
    plugins: [createDragAndDropPlugin()],
  });

  useEffect(() => {
    if (!loading && !hasPermission) {
      navigate("/notpermission");
    }
  }, [loading, hasPermission]);

  if (loading) return <div></div>;

  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
};

export default Calendar;
