type Logger = import("@dynamic/logger").Logger;

export interface LoggerManager {
  loggers: Array<Logger>;
}
