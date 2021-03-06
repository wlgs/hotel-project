import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { DataService } from '../shared/data.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {

  modelForm!: FormGroup;
  formErrors:Map<string, string>;
  validationMessages:Map<string, Map<string, string>>;

  constructor(private dataService: DataService,
    private formBuilder: FormBuilder) {
      this.formErrors = new Map([
        ['room_type', ''],
        ['start_date', ''],
        ['end_date', ''],
        ['email', ''],
      ])

      this.validationMessages = new Map([
        ['email', new Map([['required', 'email cannot be blank']])],
        ['room_type', new Map([['required', 'room type cannot be blank']])],
        ['start_date', new Map([['required', 'please specify the start date']])],
        ['end_date', new Map([['required', 'please specify the end date']])],
      ]);

    }

  ngOnInit(): void {
    this.modelForm = this.formBuilder.group({
      email: ['',Validators.required],
      room_type: ['',Validators.required],
      start_date: ['',Validators.required],
      end_date: ['',Validators.required]
    });

    this.modelForm.valueChanges
          .subscribe((value) => {
            this.onControlValueChanged();
          })
    this.onControlValueChanged();
  }

  async onSubmit(form: FormGroup) {
    if (form.valid) {
      console.log(form.value.start_date);
      console.log(form.value.end_date);
      console.log(form.value.room_type);
      console.log(form.value.email);
      this.dataService.makeReservation(form.value.start_date,form.value.end_date,form.value.room_type,form.value.email).pipe(first()).subscribe(res => {
        console.log(res);
      })
      form.reset();
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