import path from 'path';
import DailyRotateFile from 'winston-daily-rotate-file';

export default class FileTransport {
  public static create(appName = 'default-app') {
    return new DailyRotateFile({
      dirname: path.join('logs', appName),
      filename: `log-${appName}-%DATE%.log`,
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    });
  }
}
