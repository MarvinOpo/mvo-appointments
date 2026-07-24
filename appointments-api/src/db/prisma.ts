import { PrismaClient as ServiceClient } from '../../prisma-services/client/client';
import { PrismaClient as AppointmentClient } from '../../prisma-appointments/client/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

declare global {
  var vsmmc_services: ServiceClient | undefined;
  var mvo_appointments: AppointmentClient | undefined;
}

function parseDbUrl(url: string) {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: parsed.port ? parseInt(parsed.port, 10) : 3306,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.slice(1),
  };
}

const servicesAdapter = new PrismaMariaDb(
  parseDbUrl(process.env.SERVICES_DATABASE_URL!),
);
const appointmentsAdapter = new PrismaMariaDb(
  parseDbUrl(process.env.APPT_DATABASE_URL!),
);

export const vsmmc_services: ServiceClient =
  globalThis.vsmmc_services ??
  new ServiceClient({ adapter: servicesAdapter, errorFormat: 'minimal' });

export const mvo_appointments: AppointmentClient =
  globalThis.mvo_appointments ??
  new AppointmentClient({
    adapter: appointmentsAdapter,
    errorFormat: 'minimal',
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.vsmmc_services = vsmmc_services;
  globalThis.mvo_appointments = mvo_appointments;
}
