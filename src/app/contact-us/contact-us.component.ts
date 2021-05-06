import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SendMessageService } from '../services/send-message.service';

@Component({
  selector: 'app-contact-us', 
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  homeForm: FormGroup;
	pageData : any;
  pageDataHome : any;
  currentUserID : any;
	pageDataContact : any;
  siteStatus : any;
  pageDataUsers : any;
  currentAgentEmail : any;
  baseUrl : any;
  totalAgents : any;
  totalSubscriptions : any;
  allInquiries : any;
  packages : any;
  testimonials : any;
  securityPrivacy : any;
  	imageUrl:any = "https://www.apex-4u.com:8080/images/";

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false
  }
  type: any;
  isStaticPage: any = false;
  constructor(private sendMessageService: SendMessageService,private toastr: ToastrService, private fb: FormBuilder, public route: ActivatedRoute, public adminService: AdminService, public router: Router, public changeDetection: ChangeDetectorRef) { 
    this.sendMessageService.messageEmitter.subscribe(msg=>{
      this.siteStatus = msg;
    });
  }

  ngOnInit() {
    this.initHomeForm();

    this.type = this.route.snapshot.paramMap.get('type');
    
    if(this.type != null){
      this.adminService.postData('getUserDomain',{username: this.type}).subscribe((response:any) => {
        if(response.status == 1){
          this.getPageData(response.data._id);
        }else{
          this.isStaticPage = true;
          console.log(this.route.snapshot)
          this.getStaticData();

          //localStorage.clearAll();
          //this.router.navigateByUrl('/auth/error');
        }
      });
    }
  }

  getStaticData(){
    this.baseUrl = "https://www.apex-4u.com:8080/images/";
    // GET ALL AGENTS---------------------
    let dict = {
      "page" : "home",
    };
    this.adminService.postData('listuser',dict).subscribe((response: any) => {
      // //console.log(response.data.length);
      this.totalAgents = response.data.length;
    });

    // SUBSCRIBED USERS ------------------
    let dict1 = {
        "page" : "home",
      };
      this.adminService.postData('subscriptionGet',dict1).subscribe((response: any) => {
        // //console.log("AGENTS = "+response);
        this.totalSubscriptions = response.data.length;
      });

    // All INQUIRIES ------------------
    let dict2 = {
        "page" : "home",
      };
      this.adminService.postData('contactData',dict2).subscribe((response: any) => {
        // //console.log("AGENTS = "+response);
        this.allInquiries = response.data.length;
      });

    // All PACKAGES ------------------
    let dict3 = {
        "page" : "home",
      };
      this.adminService.postData('getAllPackages',dict3).subscribe((response: any) => {
        //console.log("packages = "+response.data);
        this.packages = response.data;
      });

    // All TESTIMONIALS ------------------
    let dict4 = {
        "page" : "home",
      };
      this.adminService.postData('getAllTestimonials',dict4).subscribe((response: any) => {
        //console.log("packages = "+response.data);
        this.testimonials = response.data;
      });

    // All Privacy and Security ------------------
      this.adminService.postData('getSecurityPrivacyById',dict4).subscribe((response: any) => {
        //console.log("packages = "+response.data);
        this.securityPrivacy = response.data;
      });
  }
  
  initHomeForm()
  {
    const emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    const phoneRegex = /^\(\d{3}\) \d{3}-?\d{4}$/;

    this.homeForm = this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      phone: ['', Validators.compose([Validators.required, Validators.pattern(phoneRegex)])],
      // phone: ['', Validators.compose([Validators.required])],
      insurance: ['', Validators.compose([Validators.required])],
      subject: ['', Validators.compose([Validators.required])],
      message: ['', Validators.compose([Validators.required])],
    });
  }

  getPageData(user_id){
    this.currentUserID = user_id;
    let dict = {
      "page" : "home",
      "user_id" : user_id
    };

    this.adminService.postData('getPageData',dict).subscribe((response: any) => {
      console.log(response);
      this.pageDataHome = response.data.data;
    });

    let dict2 = {
      "page" : "contact",
      "user_id" : user_id,
    };

    this.adminService.postData('getPageData',dict2).subscribe((response : any) => {
      console.log(response);
      this.pageDataContact    = response.data.data;
      this.currentAgentEmail  = response.data.data.email;
      this.changeDetection.detectChanges();
    });

    // GET USER FULL DATA ---------------------
    let dict3 = {
      "id" : user_id,
    };

    this.adminService.postData('getUserByID',dict3).subscribe((response : any) => {
      console.log(response);
      this.pageDataUsers    = response.data;
      this.changeDetection.detectChanges();
    });
  }


  submit()
  {
    // alert('sdf');
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
    
    let dict = {
      "domain" : this.currentUserID,
      "data" :{
        "name"      : controls.name.value,
        "email"     : controls.email.value,
        "subject"   : controls.subject.value,
        "phone"     : controls.phone.value,
        "insurance" : controls.insurance.value,
        "message"   : controls.message.value,
        "currentAgentEmail": this.currentAgentEmail,
      }
    };

    console.log(dict)

    this.adminService.postData('contactRequest',dict).subscribe((response:any) => {
      console.log(response);
      if(response.status == 1){
        this.homeForm.reset();
        this.toastr.success('Contact request has been sent successfully.', 'Success')
      }else{
        this.toastr.error('Something went wrong, please try again.', 'Error');
      }
    })
  };

}
