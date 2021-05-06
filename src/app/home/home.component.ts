import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef} from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SendMessageService } from '../services/send-message.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('bg', { static: true }) bg: ElementRef;

  homeForm: FormGroup;
  pageData : any;
  cmsData : any;
  pageDataHome : any;
  pageDataContact : any;
  currentUserID : any;
  siteStatus: any;
  conditionalSections: any;
  currentAgentEmail : any;
  maintext : any;
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
  };


  totalAgents:any;
  totalSubscriptions:any;
  allInquiries:any;
  packages:any;
  testimonials:any;
  securityPrivacy:any;
  baseUrl:any;



  type: any;
  selectedCmsData: any;
  sections: any;
  isStaticPage: any = false;
  constructor(private sendMessageService: SendMessageService,private fb: FormBuilder, public route: ActivatedRoute, public adminService: AdminService, private toastr: ToastrService, public router: Router, public changeDetection: ChangeDetectorRef) { 
    
    this.sendMessageService.messageEmitter.subscribe(msg=>{
      this.siteStatus = msg;
    });

  }

  ngOnInit()
  {
    this.initHomeForm();

    this.type = this.route.snapshot.paramMap.get('type');
    // alert(this.type);
    if(this.type != null && this.type != 'about')
    {
      this.adminService.postData('getUserDomain',{username: this.type}).subscribe((response:any) => {
        if(response.status == 1){


          this.getPageData(response.data._id);
        }else{
          this.isStaticPage = true;
          //localStorage.clearAll();
          console.log(this.route.snapshot)

          this.getStaticData();
          // this.router.navigateByUrl('/auth/error');
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

    getCmsData(user_id)
    {
      
      this.adminService.postData('getAllSections',{}).subscribe((response: any) => {
        console.log(response);
        if(response.status == 1){
          this.cmsData = response.data;
          let dict = {
            "page" : "home",
            "user_id" : user_id
          };
          this.sections = response.data;
          this.adminService.postData('getPageData',dict).subscribe((response: any) => {
            console.log(response);
            if(response.status == 1){
              this.pageData = response.data.data;
              this.patchValues(this.pageData);
              //add props to sections
              let assignValues = [];
              for(var i=0; i<this.sections.length; i++)
              {
                let dictSection = {
                  "name"    : this.sections[i].name,
                  "message" : this.sections[i].message,
                  "status"  : this.sections[i].status,
                  "image"   : this.sections[i].image,
                  "_id" : this.sections[i]._id,
                  "text": '',
                  "url": '',
                  'isChecked':''
                };

                assignValues.push(dictSection);
              }
              //add values to props
              for(var i=0; i<assignValues.length; i++)
              {
                for(var k=0; k < response.data.data.sectionData.length; k++){
                  if(assignValues[i]._id == response.data.data.sectionData[k].id){
                    let dictSection = {
                      "name"    : this.sections[i].name,
                      "message" : this.sections[i].message,
                      "status"  : this.sections[i].status,
                      "image"   : this.sections[i].image,
                      "_id" : this.sections[i]._id,
                      "text": response.data.data.sectionData[k].text,
                      "url": response.data.data.sectionData[k].url,
                      "isChecked": response.data.data.sectionData[k].isChecked
                    };

                    assignValues.splice(i,1, dictSection);
                  }
                }
              }

              this.sections = assignValues;
              // console.log(this.getAllSections);
              this.changeDetection.detectChanges();
            }
          });
        }
        
      });

      //---GET MAIN TEXT---------------------
      let dict = {
        "page" : "maintext",
        "user_id" : user_id
      };
      this.adminService.postData('getPageData',dict).subscribe((response: any) => {
        if(response.status == 1)
        {
          this.maintext = response.data.data;
        }else{
          this.maintext = null;
        }
      });
    }

  addBackground(data){
    this.bg.nativeElement.style.background = this.imageUrl + data.banner_image;
  }

  initHomeForm()
  {
    const emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

    const phoneRegex = /^\(\d{3}\) \d{3}-?\d{4}$/;

    this.homeForm = this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      phone: ['', Validators.compose([Validators.required, Validators.pattern(phoneRegex)])],
      insurance: ['', Validators.compose([Validators.required])],
      subject: ['', Validators.compose([Validators.required])],
      message: ['', Validators.compose([Validators.required])],
    });
  }

  openUrl(page){
    this.router.navigate(['/' + this.type + page]);
  }

  getPageData(user_id)
  {
    this.currentUserID = user_id;
    // let dict = {
    //   "page" : "home",
    //   "user_id" : user_id
    // };
    // this.adminService.postData('getPageData',dict).subscribe((response: any) => {
    //   console.log(response);
    //   this.pageData = response.data.data;
      this.getCmsData(user_id);
    // });

    let dict2 = {
      "page" : "contact",
      "user_id" : user_id,
    };

    this.adminService.postData('getPageData',dict2).subscribe((response : any) => {
      console.log(response);
      this.pageDataContact = response.data.data;
      this.currentAgentEmail  = response.data.data.email;
      this.changeDetection.detectChanges();
    });
  }

  selectInsurance(insurance){
    this.patchValues(insurance);
  }

  patchValues(pageData){
    this.homeForm.patchValue({
      insurance: pageData
    });
  }

  submit()
  {
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
        // alert('Contact request has been sent successfully.')
      }else{
        this.toastr.error('Something went wrong, please try again.', 'Error');
      }
    })
  };

}
