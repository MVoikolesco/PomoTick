export const formatTimerTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const remainingSeconds = (seconds % 60).toString().padStart(2, '0');

  return `${minutes}:${remainingSeconds}`;
};

export const formatDuration = (seconds: number) => {
  const minutes = Math.round(seconds / 60);

  if (minutes < 60) {
    return `${minutes}min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  return remainder ? `${hours}h ${remainder}min` : `${hours}h`;
};

export const formatHistoryDateTime = (isoDate: string) => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoDate));
};

export const formatWeekHours = (hours: number) => {
  const rounded = hours >= 10 ? hours.toFixed(0) : hours.toFixed(1);

  return rounded.replace('.0', '');
};
