import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AdminService } from '../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
	pageDataHome : any;
	pageDataContact : any;
  	imageUrl:any = "https://www.apex-4u.com:8080/images/";
  	type: any;
  	constructor(public route: ActivatedRoute, public adminService: AdminService, public router: Router, public changeDetection: ChangeDetectorRef) { }

  	ngOnInit() {
		this.type = this.route.snapshot.paramMap.get('type');
    
	    if(this.type != null){
	      	this.adminService.postData('getUserDomain',{username: this.type}).subscribe((response:any) => {
	    	  	if(response.status == 1){
		        	this.getPageData(response.data._id);
		      	}else{
		        	//localStorage.clearAll();
		        	//this.router.navigateByUrl('/auth/error');
		      	}
		    });
	    }  	
  	}

  	openUrl(page){
  		this.router.navigate(['/' + this.type + page]);
  	}

  	getPageData(user_id){
	    let dict = {
	      "page" : "home",
	      "user_id" : user_id,
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
	      this.pageDataContact = response.data.data;
	      this.changeDetection.detectChanges();
	    });
  	}
}
