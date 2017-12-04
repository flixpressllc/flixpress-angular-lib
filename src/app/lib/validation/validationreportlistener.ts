import { ValidationReportEventArgs } from './validationreporteventargs';

export interface ValidationReportListener{
	validationReports:Array<ValidationReportEventArgs>;
	onReportValidationHandler(e:ValidationReportEventArgs);
	isValidated:boolean;
}