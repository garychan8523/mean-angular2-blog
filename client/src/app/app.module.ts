import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
//import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
//import { JwtModule } from "@auth0/angular-jwt";
import { ReactiveFormsModule } from '@angular/forms';
import { QuillEditorModule } from './modules/quill-editor/quill-editor.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { ChannelComponent } from './components/channel/channel.component';
import { FooterComponent } from './components/footer/footer.component';
import { RegisterComponent } from './components/register/register.component'
import { AuthService } from './services/auth.service';
import { BlogService } from './services/blog.service';
import { SocketService } from './services/socket.service';
import { EventEmitterService } from './services/event-emitter.service';
import { AboutComponent } from './components/about/about.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';
import { BlogComponent } from './components/blog/blog.component';
import { ViewBlogComponent } from './components/blog/view-blog/view-blog.component';
import { DeleteBlogComponent } from './components/blog/delete-blog/delete-blog.component';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { UpdateBlogComponent } from './components/blog/update-blog/update-blog.component';
import { BlogSettingComponent } from './components/blog/blog-setting/blog-setting.component';

import { RouteReuseStrategy } from '@angular/router';
import { RouteStrategyService } from './route-strategy.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ChannelComponent,
    FooterComponent,
    RegisterComponent,
    AboutComponent,
    LoginComponent,
    ProfileComponent,
    BlogComponent,
    ViewBlogComponent,
    DeleteBlogComponent,
    PublicProfileComponent,
    PrivacyPolicyComponent,
    UpdateBlogComponent,
    BlogSettingComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    FlashMessagesModule.forRoot(),
    QuillEditorModule,
  ],
  providers: [
    AuthService,
    AuthGuard,
    NotAuthGuard,
    BlogService,
    SocketService,
    EventEmitterService,
    { provide: RouteReuseStrategy, useClass: RouteStrategyService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
