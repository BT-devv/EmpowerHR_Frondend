import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import { createViewWeek } from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { useEffect } from "react";
import axios from "axios";
import apiRoutes from "../../apiRoutes";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import "@schedule-x/theme-default/dist/index.css";

const Calendar = () => {
  const eventsService = createEventsServicePlugin();
  const eventModalPlugin = createEventModalPlugin(); // <-- quan trọng

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
    plugins: [
      eventsService,
      eventModalPlugin, // <-- dùng đúng instance
      createDragAndDropPlugin(),
    ],
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios(apiRoutes.holiday.getAllHolidays);
        const data = await response.data;

        const mappedEvents = data.map((event) => ({
          id: event._id,
          title: event.name,
          start: `${formatDate(event.startDate)} 10:00`,
          end: `${formatDate(event.endDate)} 10:00`,
        }));

        eventsService.events.set(mappedEvents);
      } catch (error) {
        console.error("Lỗi khi get events:", error);
      }
    };

    fetchEvents();
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

  const openModal = () => {
    eventModalPlugin.openEmptyModal();
  };

  return (
    <div>
      <button onClick={handleCreateTask}>Tạo Task (Code)</button>
      <button onClick={openModal}>Thêm sự kiện (Modal)</button>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
};

export default Calendar;
