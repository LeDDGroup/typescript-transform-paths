export class Tester {
  public test (x: number): void {
    console.log(x);
  };
}

export const tester = {
  test: (x: string) => console.log(x),
};
