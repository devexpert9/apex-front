import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../services/admin.service';


@Component({
  selector: 'app-domain',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.css']
})
export class DomainComponent implements OnInit {
  type: any;
  constructor(public route: ActivatedRoute, public adminService: AdminService, public router: Router) { }

  ngOnInit() {
  	
  	this.type = this.route.snapshot.paramMap.get('type');
	  console.log('here')
    if(this.type != null){
      this.adminService.postData('getUserDomain',{username: this.type}).subscribe((response: any) => {
       console.log(response)
        if(response.status == 1){
          localStorage.setItem('token', response.data._id);
          this.router.navigate(['/'+ this.type + '/home']);
        }else{
          localStorage.setItem('token', 'wvfhjqgwfehjqwf');
          this.router.navigate(['/web/home']);
          //localStorage.clearAll();
          // if(this.route.url._value[1].path == 'signup'){
          //   this.router.navigateByUrl('/auth/signup');
          // }else{
            // this.router.navigateByUrl('/auth/error');
          // }
          
        }
      }); 
    }else{
      this.router.navigateByUrl('/web/home');
    }
  	
  }

}
