import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  public payPalConfig?: IPayPalConfig;
  homeForm: FormGroup;
  valid: any = false;
  selectedPlan: any = 1.99;
  showSuccess:any;
  emailExist:any = '';
  constructor(private fb: FormBuilder, public adminService: AdminService) { }

  ngOnInit() {
  	this.initHomeForm();
    this.initConfig();
  }

  initHomeForm()
  {  
    const emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

    this.homeForm = this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      username: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      // password: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100)
        ])
      ],
      cpassword: ['', Validators.compose([Validators.required])],
    });
    this.onChanges();
  }

  onChanges(): void {
    this.homeForm.valueChanges.subscribe(val => {
      this.valid = false;
    });
  }

  submit(price)
  {

    this.selectedPlan = price;
    const controls = this.homeForm.controls;
    console.log(controls);
    /** check form */
    if (this.homeForm.invalid)
    {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    if(controls.password.value != controls.cpassword.value)
    {
      alert('Confirm password');
      return;
    }

    
      let dict = {
        "email" : controls.email.value
      };

      this.adminService.postData('checkEmailExist',dict).subscribe((response:any) => {
        if(response.status == 0)
        {
          this.valid = true;
        }
        else{
          this.valid = false;
          alert('Email already exist in our system.');
        }
      });
  };

   private initConfig(): void {
      let self = this;
      this.payPalConfig = {
      currency: 'EUR',
      clientId: 'sb',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'EUR',
              value: self.selectedPlan,
              breakdown: {
                item_total: {
                  currency_code: 'EUR',
                  value: self.selectedPlan
                }
              }
            },
            items: [
              {
                name: 'Enterprise Subscription',
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: 'EUR',
                  value: self.selectedPlan,
                },
              }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
        const controls = self.homeForm.controls;
        let dict = {
            "name"         : controls.name.value,
            "username"     : controls.username.value,
            "email"        : controls.email.value,
            "password"     : controls.password.value,
          };

        self.adminService.postData('addUser',dict).subscribe((response:any) => {
          if(response.status == 1){
            alert('Your account has been created successfully.')
            self.homeForm.reset();
            self.valid = false;
          }else{
            alert('Something went wrong, please try again.');
          }
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
    }

}
