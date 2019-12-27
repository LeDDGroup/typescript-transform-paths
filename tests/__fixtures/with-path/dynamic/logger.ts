type Tester = import("@dynamic/tester").Tester;

export class Logger {
  level: string = 'hi';
  tester: Tester;

  public log (x: string): void {
    console.log(x);
  };
}