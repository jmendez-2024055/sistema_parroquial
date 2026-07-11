/**
 * Calcula el Domingo de Resurrección (Pascua) usando el algoritmo de Computus (Gregoriano/Anónimo)
 * @param {number} year - Año para calcular la Pascua
 * @returns {Date} Fecha del Domingo de Resurrección
 */
export const calculateEaster = (year) => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  // JavaScript months are 0-indexed (0 = January)
  return new Date(year, month - 1, day);
};

/**
 * Calcula el domingo más cercano al 30 de noviembre (inicio del Adviento)
 * @param {number} year - Año para calcular el inicio del Adviento
 * @returns {Date} Fecha del primer domingo de Adviento
 */
const getAdventStart = (year) => {
  // El primer domingo de Adviento es el domingo más cercano al 30 de noviembre
  // Es decir, el único domingo entre el 27 de noviembre y el 3 de diciembre
  const november30 = new Date(year, 10, 30); // November 30
  const dayOfWeek = november30.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Si el 30 de noviembre es domingo, ese es el inicio
  if (dayOfWeek === 0) {
    return november30;
  }
  
  // Si el 30 de noviembre es sábado (6), el domingo es el 1 de diciembre
  if (dayOfWeek === 6) {
    return new Date(year, 11, 1); // December 1
  }
  
  // Si el 30 de noviembre es lunes (1), el domingo anterior es el 27 de noviembre
  if (dayOfWeek === 1) {
    return new Date(year, 10, 27); // November 27
  }
  
  // Si el 30 de noviembre es martes (2), el domingo anterior es el 28 de noviembre
  if (dayOfWeek === 2) {
    return new Date(year, 10, 28); // November 28
  }
  
  // Si el 30 de noviembre es miércoles (3), el domingo anterior es el 29 de noviembre
  if (dayOfWeek === 3) {
    return new Date(year, 10, 29); // November 29
  }
  
  // Si el 30 de noviembre es jueves (4), el domingo anterior es el 27 de noviembre
  if (dayOfWeek === 4) {
    return new Date(year, 10, 27); // November 27
  }
  
  // Si el 30 de noviembre es viernes (5), el domingo anterior es el 27 de noviembre
  if (dayOfWeek === 5) {
    return new Date(year, 10, 27); // November 27
  }
  
  return november30;
};

/**
 * Calcula el domingo después del 6 de enero (Bautismo del Señor)
 * @param {number} year - Año para calcular el final de la Navidad
 * @returns {Date} Fecha del Bautismo del Señor
 */
const getEpiphanyEnd = (year) => {
  const january6 = new Date(year, 0, 6); // January 6
  const dayOfWeek = january6.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // El domingo después del 6 de enero
  if (dayOfWeek === 0) {
    // Si el 6 de enero es domingo, el domingo después es el 13 de enero
    return new Date(year, 0, 13);
  }
  
  // Si no es domingo, el siguiente domingo es 7 - dayOfWeek días después
  const daysUntilSunday = 7 - dayOfWeek;
  return new Date(year, 0, 6 + daysUntilSunday);
};

/**
 * Determina la temporada litúrgica actual basándose en la fecha
 * @param {Date} date - Fecha para evaluar (por defecto: hoy)
 * @returns {string} Clave de la temporada litúrgica: 'adviento', 'navidad', 'cuaresma', 'triduo', 'pascua', 'pentecostes', 'ordinario'
 */
export const getCurrentLiturgicalSeason = (date = new Date()) => {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-11
  const day = date.getDate();
  
  // Normalizar la fecha a medianoche para comparaciones
  const normalizedDate = new Date(year, month, day);
  
  // Calcular Pascua del año actual y del año anterior (para fechas de enero)
  const easterThisYear = calculateEaster(year);
  const easterLastYear = calculateEaster(year - 1);
  
  // Calcular fechas clave
  const ashWednesday = new Date(easterThisYear);
  ashWednesday.setDate(easterThisYear.getDate() - 46); // Miércoles de Ceniza
  
  const holyThursday = new Date(easterThisYear);
  holyThursday.setDate(easterThisYear.getDate() - 3); // Jueves Santo
  
  const holySaturday = new Date(easterThisYear);
  holySaturday.setDate(easterThisYear.getDate() - 1); // Sábado Santo
  
  const pentecost = new Date(easterThisYear);
  pentecost.setDate(easterThisYear.getDate() + 49); // Pentecostés (Pascua + 49 días)
  
  const adventStart = getAdventStart(year);
  const christmasStart = new Date(year, 11, 25); // 25 de diciembre
  const epiphanyEnd = getEpiphanyEnd(year + 1); // Bautismo del Señor del siguiente año
  
  // Calcular fechas de Navidad del año anterior (para fechas de enero)
  const adventStartLastYear = getAdventStart(year - 1);
  const christmasStartLastYear = new Date(year - 1, 11, 25);
  const epiphanyEndThisYear = getEpiphanyEnd(year);
  
  // PRIORIDAD 1: Pentecostés (exactamente Pascua + 49 días)
  if (normalizedDate.getTime() === pentecost.getTime()) {
    return 'pentecostes';
  }
  
  // PRIORIDAD 2: Pascua (entre Pascua y Pascua + 48 días)
  const easterEnd = new Date(easterThisYear);
  easterEnd.setDate(easterThisYear.getDate() + 48);
  if (normalizedDate >= easterThisYear && normalizedDate <= easterEnd) {
    return 'pascua';
  }
  
  // PRIORIDAD 3: Triduo (entre Jueves Santo y Sábado Santo, inclusive)
  if (normalizedDate >= holyThursday && normalizedDate <= holySaturday) {
    return 'triduo';
  }
  
  // PRIORIDAD 4: Cuaresma (entre Miércoles de Ceniza y Miércoles Santo, inclusive)
  const wednesdayOfHolyWeek = new Date(easterThisYear);
  wednesdayOfHolyWeek.setDate(easterThisYear.getDate() - 4); // Miércoles Santo
  if (normalizedDate >= ashWednesday && normalizedDate <= wednesdayOfHolyWeek) {
    return 'cuaresma';
  }
  
  // PRIORIDAD 5: Adviento (entre el primer domingo de Adviento y el 24 de diciembre)
  const christmasEve = new Date(year, 11, 24); // 24 de diciembre
  if (normalizedDate >= adventStart && normalizedDate <= christmasEve) {
    return 'adviento';
  }
  
  // PRIORIDAD 6: Navidad (entre el 25 de diciembre y el Bautismo del Señor)
  // Para fechas de enero, verificar si pertenece a Navidad del año anterior
  if (month === 0) {
    // Enero: verificar si está en Navidad del año anterior
    if (normalizedDate >= christmasStartLastYear && normalizedDate <= epiphanyEndThisYear) {
      return 'navidad';
    }
  } else if (month === 11) {
    // Diciembre: verificar si está en Navidad del año actual
    if (normalizedDate >= christmasStart && normalizedDate <= epiphanyEnd) {
      return 'navidad';
    }
  }
  
  // PRIORIDAD 7: Ordinario (cualquier otra fecha)
  return 'ordinario';
};
