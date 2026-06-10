import CategoryBadge from './CategoryBadge.jsx';

const EventsTable = ({ events }) => (
  <section className="events-panel" aria-labelledby="events-title">
    <div className="events-panel__header">
      <div>
        <span className="events-panel__eyebrow">Agenda parroquial</span>
        <h2 id="events-title">Próximos eventos y misas</h2>
      </div>
      <span className="events-panel__filter">Esta semana</span>
    </div>

    <div className="events-table-wrapper">
      <table className="events-table">
        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Categoría</th>
            <th scope="col">Fecha</th>
            <th scope="col">Hora</th>
            <th scope="col">Lugar</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td data-label="Nombre">
                <strong className="events-table__name">{event.name}</strong>
              </td>
              <td data-label="Categoría">
                <CategoryBadge category={event.category} />
              </td>
              <td data-label="Fecha">{event.date}</td>
              <td data-label="Hora">{event.time}</td>
              <td data-label="Lugar">{event.place}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default EventsTable;
