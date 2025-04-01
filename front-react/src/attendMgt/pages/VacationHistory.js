import FullCalendar from '@fullcalendar/react';
import React from 'react';
import dayGridPlugin from "@fullcalendar/daygrid";

const VacationHistory = () => {
  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin,]}
        initialView={'dayGridMonth'}
        height={"55vh"}

      />
    </div>
  );
};

export default VacationHistory;