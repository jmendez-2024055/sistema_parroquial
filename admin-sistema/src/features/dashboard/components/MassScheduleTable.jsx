const MassScheduleTable = ({ massSchedules }) => (
  <section className="events-panel" aria-labelledby="masses-title">
    <div className="events-panel__header">
      <div>
        <span className="events-panel__eyebrow">Horarios de misa</span>
        <h2 id="masses-title">Próximas celebraciones</h2>
      </div>
      <span className="events-panel__filter">Esta semana</span>
    </div>

    <div className="events-table-wrapper">
      <table className="events-table">
        <thead>
          <tr>
            <th scope="col">Día</th>
            <th scope="col">Hora</th>
            <th scope="col">Tipo</th>
            <th scope="col">Celebrante</th>
          </tr>
        </thead>
        <tbody>
          {massSchedules.map((schedule) => (
            <tr key={schedule._id}>
              <td data-label="Día">
                <strong className="events-table__name">{schedule.diaSemana}</strong>
              </td>
              <td data-label="Hora">{schedule.hora}</td>
              <td data-label="Tipo">{schedule.tipoMisa}</td>
              <td data-label="Celebrante">{schedule.celebrante}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default MassScheduleTable;
