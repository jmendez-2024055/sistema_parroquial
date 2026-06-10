import DashboardHeader from '../components/DashboardHeader.jsx';
import StatsGrid from '../components/StatsGrid.jsx';
import EventsTable from '../components/EventsTable.jsx';
import { dashboardStats, upcomingEvents } from '../data/mockData.js';

import '../../../styles/dashboard.css';

const DashboardPage = () => {
return ( <div className="parish-dashboard"> <DashboardHeader />

  <StatsGrid
    stats={dashboardStats}
  />

  <EventsTable
    events={upcomingEvents}
  />
</div>


);
};

export default DashboardPage;
