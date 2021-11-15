import { B } from '@circular/b';

export class A {
  constructor(public name: string) {}
}

export const b = new B();
b.print(new A('This is a random name'));
