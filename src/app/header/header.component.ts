import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { SendMessageService } from '../services/send-message.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
	type: any;
	selectedItem: any = '/home';
  pageData: any;
  pageDataContact : any;
  sitePending : any = '';
  siteBlocked : any = '';
  isStaticSite: any = false;
  constructor(private sendMessageService: SendMessageService, public route: ActivatedRoute, public router: Router, public adminService: AdminService,
      private changeDetection: ChangeDetectorRef) { 

  }

  ngOnInit()
  {
  	this.type = this.route.snapshot.paramMap.get('type');
  	console.log(this.type);
  	this.selectedItem  = '/' + window.location.href.split('/')[4];

    if(this.type != null)
    {
      this.adminService.postData('getUserDomain',{username: this.type}).subscribe((response:any) => {
        console.log(response)
        if(response.status == 1){
          var date1 = new Date();
            date1.setHours(0);
            date1.setMinutes(0);
            date1.setSeconds(0);
            var date2 = new Date(response.data.expiry_date);

            // To calculate the time difference of two dates
            var Difference_In_Time = date2.getTime() - date1.getTime();

            // To calculate the no. of days between two dates
            var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

            // alert(Difference_In_Days)
          if(response.data.status == 0 || Difference_In_Days < 0)
          {
            this.siteBlocked = 'yes';
            this.sendMessageService.messageEmitter.emit('1');
          }
          else if(response.data.status == 1)
          {
            this.getPageData(response.data._id);
          }
          else
          {
            this.isStaticSite = true;
            this.changeDetection.detectChanges();

            //localStorage.clearAll();
            //this.router.navigateByUrl('/auth/error');
          }
        }else{
          this.isStaticSite = true;
          this.changeDetection.detectChanges();
        }
      });
    }else{
      this.router.navigateByUrl('/web/home');
    }
  }

  getPageData(user_id)
  {
    let dict = {
      "page" : "home",
      "user_id" : user_id,
    };

    this.adminService.postData('getPageData',dict).subscribe((response: any) => {
      console.log(response);
      if(response.data == null)
      {
        this.sitePending = 'yes';
        this.sendMessageService.messageEmitter.emit('2');
      }
      this.pageData = response.data.data;
      console.log("pagedata = "+this.pageData);
    });

    let dict2 = {
      "page" : "contact",
      "user_id" : user_id,
    };

    this.adminService.postData('getPageData',dict2).subscribe((response : any) => {
      console.log(response);
      this.pageDataContact = response.data.data;
      // this.changeDetection.detectChanges();
    });
    
  }


  openUrl(page){
  	this.router.navigate(['/' + this.type + page]);
  }

  openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

 closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

}


//this.router.navigate( [ routing.path ] , { relativeTo: route , queryParams: paramsInUrl } );
