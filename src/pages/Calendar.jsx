import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import { createViewWeek } from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { useState, useEffect } from "react";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import "@schedule-x/theme-default/dist/index.css";

const Calendar = () => {
  const eventsService = useState(() => createEventsServicePlugin())[0];
  const eventModal = createEventModalPlugin();

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
    events: [
      {
        id: "1",
        title: "Event 1",
        start: "2025-04-29 10:05",
        end: "2025-04-30 10:05",
      },
    ],
    plugins: [
      eventsService,
      eventModal,
      createDragAndDropPlugin(),
      createEventModalPlugin(),
    ],
  });

  useEffect(() => {
    // get all events
    eventsService.getAll();
  }, []);

  const handleCreateTask = () => {
    const now = new Date();
    const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);

    calendar.events.add({
      id: String(now.getTime()),
      title: "Task mới",
      start: now.toISOString(),
      end: inOneHour.toISOString(),
    });
  };

  return (
    <div>
      <button onClick={handleCreateTask}>Tạo Task</button>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
};

export default Calendar;
