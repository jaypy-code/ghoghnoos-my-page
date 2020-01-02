import { NgModule } from '@angular/core';

import {
  MatProgressSpinnerModule,
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatDialogModule,
  MatInputModule,
  MatFormFieldModule,
  MatSnackBarModule,
  MatMenuModule,
  MatTableModule,
  MatBottomSheetModule,
  MatSelectModule,
  MatDividerModule,
  MatCheckboxModule,
  MatCardModule,
  MatSortModule,
  MatProgressBarModule,
} from '@angular/material';


const modules = [
  MatProgressSpinnerModule,
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatDialogModule,
  MatInputModule,
  MatFormFieldModule,
  MatSnackBarModule,
  MatMenuModule,
  MatTableModule,
  MatBottomSheetModule,
  MatSelectModule,
  MatDividerModule,
  MatCheckboxModule,
  MatCardModule,
  MatSortModule,
  MatProgressBarModule,
];
@NgModule({
  imports: modules,
  exports: modules
})
export class MaterialModule { }
