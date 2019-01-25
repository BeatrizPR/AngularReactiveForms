import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn} from '@angular/forms';

import { Customer } from './customer';

// check if the email and the confirmEmail is the same
function emailMatcher(c: AbstractControl): {[key: string]: boolean} | null {
  const emailControl = c.get('email');
  const confirmControl = c.get('confirmEmail');

  // not return error when the form is iniciate at first
  if( emailControl.pristine || confirmControl.pristine){
    return null;
  }

  if(emailControl.value === confirmControl.value){
    return null;
  }
  return {'match' : true};
}

// check if the range is a number and it is between 1 and 5
function ratingRange (min: number, max: number): ValidatorFn{ 
  return (c: AbstractControl): { [Key: string]: boolean } | null  => {
    if(c.value !== null && (isNaN(c.value) || c.value < min || c.value > max)){
      return {'range' : true};
    }
    // rating is valid
    return null;
  }
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
      
      emailGroup: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', Validators.required]
      }, {validator: emailMatcher} ), 
      phone: '',
      notification: 'email',
      sendCatalog:true,
      rating : [null, ratingRange(1,5)]

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
