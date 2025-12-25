'use client';

import Header from '../_components/header';
import CalendarView from '../_components/calendar-view';

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header showAuthorSwitcher={false} />

      <main className="max-w-2xl mx-auto pb-24">
        <CalendarView />
      </main>
    </div>
  );
}
