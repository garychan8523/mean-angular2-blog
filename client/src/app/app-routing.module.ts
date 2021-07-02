import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { ChannelComponent } from './components/channel/channel.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AboutComponent } from './components/about/about.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PersonalDetailsComponent } from './components/profile/profile-components/personal-details/personal-details.component';
import { LoginStatusComponent } from './components/profile/profile-components/login-status/login-status.component';
import { UnpublishedComponent } from './components/profile/profile-components/unpublished/unpublished.component';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';
import { BlogComponent } from './components/blog/blog.component';
import { UpdateBlogComponent } from './components/blog/update-blog/update-blog.component';
import { BlogSettingComponent } from './components/blog/blog-setting/blog-setting.component';
import { ViewBlogComponent } from './components/blog/view-blog/view-blog.component';
import { DeleteBlogComponent } from './components/blog/delete-blog/delete-blog.component';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';

const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'channel',
    component: ChannelComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [NotAuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NotAuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    children: [
      { path: 'personal-details', component: PersonalDetailsComponent, outlet: 'profile-content' },
      { path: 'login-status', component: LoginStatusComponent, outlet: 'profile-content' },
      { path: 'unpublished', component: UnpublishedComponent, outlet: 'profile-content' },
    ],
    canActivate: [AuthGuard],
    data: { shouldReuse: true, showNavbar: true }
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'blog/create',
    component: UpdateBlogComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'blog/update/:id',
    component: UpdateBlogComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'blog/setting/:id',
    component: BlogSettingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'blog/:id',
    component: ViewBlogComponent
  },
  {
    path: 'feed',
    component: BlogComponent,
    data: { shouldReuse: true, showNavbar: true }
  },
  {
    path: 'delete-blog/:id',
    component: DeleteBlogComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'user/:username',
    component: PublicProfileComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/' }
];


@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(
    appRoutes,
    { enableTracing: true } // <-- debugging purposes only
  )],
  providers: [],
  bootstrap: [],
  exports: [RouterModule]
})

export class AppRoutingModule { }