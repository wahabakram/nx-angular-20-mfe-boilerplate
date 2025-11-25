import { Component } from '@angular/core';
import { IncomeTable } from '@/datatables/income-table/income-table';

@Component({
  selector: 'app-general',
  imports: [
    IncomeTable
  ],
  templateUrl: './general.html',
  styleUrl: './general.scss'
})
export class General {

}
