import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';

import { Customer } from './customer';

// check if the range is a number and it is between 1 and 5
function ratingRange (c: AbstractControl): { [Key: string]: boolean } | null {
  if(c.value !== null && (isNaN(c.value) || c.value < 1 || c.value > 5)){
    return {'range' : true};
  }
  // rating is valid
  return null;
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm: FormGroup;
 
  customer = new Customer();

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.customerForm = this.fb.group({
      // cwith validators required y minLength we can delete that validations in the html page
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone: '',
      notification: 'email',
      sendCatalog:true,
      rating : [null, ratingRange]

      // if i want a value input disable, i can do that
      //lastName: {value: 'n/a', disabled: true}
    })
  }

  populateTestData(): void{
    this.customerForm.patchValue({
      firstName: 'Jack',
      lastName: 'Harknesss',
      sendCatalog: false
    });
  }

  save() {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }

  setNotification(notifyVia: string): void{
    const phoneControl = this.customerForm.get('phone');

    if(notifyVia === 'text'){
      phoneControl.setValidators(Validators.required);
    } else{
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }
}
