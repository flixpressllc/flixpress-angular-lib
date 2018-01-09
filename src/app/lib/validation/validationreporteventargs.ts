export class ValidationReportEventArgs {
  uniqueIdentifier: string;
  passesValidation: boolean;
  message: string;

  constructor(uniqueIdentifier: string, passesValidation: boolean, message: string) {
    this.uniqueIdentifier = uniqueIdentifier;
    this.passesValidation = passesValidation;
    this.message = message;
  }
}
