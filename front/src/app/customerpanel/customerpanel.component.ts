import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { DataService } from '../shared/data.service';

@Component({
  selector: 'app-customerpanel',
  templateUrl: './customerpanel.component.html',
  styleUrls: ['./customerpanel.component.css']
})
export class CustomerpanelComponent implements OnInit {
  modelForm!: FormGroup;
  formErrors:Map<string, string>;
  validationMessages:Map<string, Map<string, string>>;
  fetchedReservations: any = [];

  constructor(private dataService: DataService,
    private formBuilder: FormBuilder) {
      this.formErrors = new Map([
        ['email', ''],
      ])

      this.validationMessages = new Map([
        ['email', new Map([['required', 'email cannot be blank']])]
      ]);

    }

  ngOnInit(): void {
    this.modelForm = this.formBuilder.group({
      email: ['',Validators.required],
    });

    this.modelForm.valueChanges
          .subscribe((value) => {
            this.onControlValueChanged();
          })
    this.onControlValueChanged();
  }

  async onSubmit(form: FormGroup) {
    if (form.valid) {
      this.fetchedReservations = this.dataService.getClientReservations(form.value.email).pipe(first()).subscribe((res:any) => {
        res.map((el:any) => {
          el.start_date = el.start_date.split('T')[0];
          el.end_date = el.end_date.split('T')[0];
        });
        console.log(res);
        this.fetchedReservations = res;
    })
      form.reset();
    } else {
      this.checkValidity('ignore-dirty');
    }
  }

  onControlValueChanged() {    
    this.checkValidity('check-dirty');
  }

  cancelReservation(id:string) {
    this.dataService.cancelReservation(id).pipe(first()).subscribe(res => {
      console.log(res);
    });
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