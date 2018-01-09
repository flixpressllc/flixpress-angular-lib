import { EventEmitter, Output } from '@angular/core';

import { ValidationReportEventArgs } from './validationreporteventargs';

export interface ValidationReporting {
  onReportValidation: EventEmitter<ValidationReportEventArgs>;
}
