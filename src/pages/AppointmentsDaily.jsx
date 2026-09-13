import { Fragment } from 'react';
import PageHeader from '../components/PageHeader';
import ChannelPills from '../components/ChannelPills';
import CalendarToolbar from '../components/CalendarToolbar';
import StatusLegend from '../components/StatusLegend';
import AppointmentBlock from '../components/AppointmentBlock';
import CalendarViewSwitcher from '../components/CalendarViewSwitcher';
import { DAILY_SCHEDULE } from '../data/appointments';

export default function AppointmentsDaily() {
  function handleNewBooking() {
    console.log('New booking');
  }
  function handlePrevDay() {
    console.log('Go to previous day');
  }
  function handleNextDay() {
    console.log('Go to next day');
  }

  return (
    <>
      <PageHeader eyebrow="Appointments" title="Daily Schedule">
        <CalendarViewSwitcher />
        <button className="btn btn-primary" onClick={handleNewBooking}>+ New Booking</button>
      </PageHeader>

      <ChannelPills />

      <div style={{ marginTop: 18 }}>
        <CalendarToolbar label="Wednesday, 26 August 2026" onPrev={handlePrevDay} onNext={handleNextDay}>
          <StatusLegend />
        </CalendarToolbar>
      </div>
    <div className="calendar-scroll">
      <div className="day-grid">
        <div className="col-head"></div>
        <div className="col-head">All Staff</div>
        {DAILY_SCHEDULE.map((row) => (
          <Fragment key={row.time}>
            <div className="time-cell">{row.time}</div>
            <div className="slot-cell">
              <AppointmentBlock appt={row.appt} />
            </div>
          </Fragment>
        ))}
      </div>
    </div>  
    </>
  );
}