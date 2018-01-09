import { ValidationReportEventArgs } from './validationreporteventargs';

export interface ValidationReportListener {
  validationReports: Array<ValidationReportEventArgs>;
  isValidated: boolean;
  onReportValidationHandler(e: ValidationReportEventArgs);
}
