import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import {SharedModule} from './shared/shared.module';
import { FooterComponent } from './footer/footer.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { AboutUsComponent } from './about-us/about-us.component';
import { BlogComponent } from './blog/blog.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

import { AdminService } from './services/admin.service';
import { SendMessageService } from './services/send-message.service';
import { HttpClientModule } from '@angular/common/http';
import { DomainComponent } from './domain/domain.component';
import { ErrorComponent } from './error/error.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './signup/signup.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { GlossaryComponent } from './glossary/glossary.component';
import { ToastrModule } from 'ngx-toastr';
import { PrivacyComponent } from './privacy/privacy.component';

import { DomSanitizer } from '@angular/platform-browser';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';

@Pipe({ name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform  {
  constructor(private sanitized: DomSanitizer) {}
  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    AboutUsComponent,
    BlogComponent,
    ContactUsComponent,
    DomainComponent,
    ErrorComponent,
    SignupComponent,
    SafeHtmlPipe,
    GlossaryComponent,
    PrivacyComponent,
    AboutComponent,
    ContactComponent
    
  ],
  imports: [ 
    FormsModule, ReactiveFormsModule, 
    HttpClientModule,
    NgxPayPalModule,
    BrowserModule,SharedModule,CarouselModule  , BrowserAnimationsModule ,
    AppRoutingModule,
    ToastrModule.forRoot(),

  ],
  providers: [
    AdminService,
    SendMessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
