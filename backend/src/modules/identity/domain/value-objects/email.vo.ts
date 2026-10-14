import { InvalidEmailError } from "../errors/index.js";

export class Email {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private readonly value: string;
  constructor(email: string) {
    const normalize = Email.normalize(email);
    if (!Email.isValid(normalize)) {
      throw new InvalidEmailError(email);
    }
    this.value = normalize;
  }
  public static create(email: string): Email {
    return new Email(email);
  }
  public static isValid(email: string): boolean {
    return Email.EMAIL_REGEX.test(email);
  }
  private static normalize(email: string): string {
    return email.trim().toLocaleLowerCase();
  }
  public equals(other: Email): boolean {
    return this.value === other.value;
  }
  public getValue(): string {
    return this.value;
  }
}
