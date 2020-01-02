import { Component, Inject } from '@angular/core';
import {MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent {

  constructor(public bootomSheetRef: MatBottomSheetRef<ConfirmComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data) { }

  close(status: boolean =false){
    this.bootomSheetRef.dismiss(status);
  }
}
