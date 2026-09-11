import { STATUS_CLASS } from '../data/appointments';

export default function AppointmentBlock({ appt }) {
  if (!appt) return null;
  return (
    <div className={`appt-block ${STATUS_CLASS[appt.status] || ''}`}>
      {appt.customer}
      {(appt.service || appt.staff) && (
        <div className="sub">{[appt.service, appt.staff].filter(Boolean).join(' · ')}</div>
      )}
    </div>
  );
}