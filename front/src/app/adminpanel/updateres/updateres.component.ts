import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-updateres',
  templateUrl: './updateres.component.html',
  styleUrls: ['./updateres.component.css']
})
export class UpdateresComponent implements OnInit {

  modelForm!: FormGroup;
  formErrors:Map<string, string>;
  validationMessages:Map<string, Map<string, string>>;
  fetchedReservations: any = [];

  constructor(private dataService: DataService,
    private formBuilder: FormBuilder) {
      this.formErrors = new Map([
        ['start_date', ''],
      ])

      this.validationMessages = new Map([
        ['start_date', new Map([['required', 'please specify the start date']])],
      ]);

    }

  ngOnInit(): void {
    this.modelForm = this.formBuilder.group({
      start_date: ['',Validators.required],
    });

    this.modelForm.valueChanges
          .subscribe((value) => {
            this.onControlValueChanged();
          })
    this.onControlValueChanged();
  }

  async onSubmit(form: FormGroup) {
    if (form.valid) {
      // TODO
      this.dataService.getActiveReservationsByDay(form.value.start_date).pipe(first()).subscribe((res:any) => {
        res.map((el:any) => {
          el.start_date = el.start_date.split('T')[0];
          el.end_date = el.end_date.split('T')[0];
        });
        console.log(res);
        this.fetchedReservations = res;
    })
    } else {
      this.checkValidity('ignore-dirty');
    }
  }

  onControlValueChanged() {    
    this.checkValidity('check-dirty');
  }

  checkValidity(mode:string) {
    const form = this.modelForm;
      for (let [key, value] of this.formErrors) {     
        this.formErrors.set(key, '');
        let control = form.get(key); 
        const modeControl = mode =='check-dirty' ? control?.dirty : true;
        if (control && modeControl && !control.valid) {
          const validationMessages = this.validationMessages.get(key);
          for (const key1 in control.errors) {
            this.formErrors.set(key, validationMessages?.get(key1) + ' ')
          }
        }
      }
  }
}