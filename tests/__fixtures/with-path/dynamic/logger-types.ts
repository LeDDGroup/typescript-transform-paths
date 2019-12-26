export enum LogLevel {
  DEBUG = 1,
  INFO = 2,
}

export interface Log {
  level: LogLevel;
  text: string;
}
