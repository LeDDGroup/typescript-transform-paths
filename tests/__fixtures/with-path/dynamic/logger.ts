type Log = import("@dynamic/logger-types").Log;
type LogLevel = import("@dynamic/logger-types").LogLevel;

export class Logger {
  level: LogLevel;

  public log (x: Log): void {
    console.log(x);
  };
}