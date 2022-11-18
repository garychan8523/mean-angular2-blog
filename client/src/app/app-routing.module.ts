import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { ChannelComponent } from './components/channel/channel.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PersonalDetailsComponent } from './components/profile/profile-components/personal-details/personal-details.component';
import { ActiveSessionsComponent } from './components/profile/profile-components/active-sessions/active-sessions.component';
import { LoginStatusComponent } from './components/profile/profile-components/login-status/login-status.component';
import { UnpublishedComponent } from './components/profile/profile-components/unpublished/unpublished.component';
import { PublishedComponent } from './components/profile/profile-components/published/published.component';
import { PublishedPrivateComponent } from './components/profile/profile-components/published-private/published-private.component';
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
    path: 'about',
    component: HomeComponent
  },
  {
    path: 'privacy-policy',
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
    path: 'settings',
    component: ProfileComponent,
    children: [
      { path: '', redirectTo: 'personal-details', pathMatch: 'full' },
      { path: 'personal-details', component: PersonalDetailsComponent },
      { path: 'active-sessions', component: ActiveSessionsComponent },
      { path: 'login-status', component: LoginStatusComponent },
      { path: 'unpublished-draft', component: UnpublishedComponent },
      { path: 'published', component: PublishedComponent },
      { path: 'published-private', component: PublishedPrivateComponent },
    ],
    canActivate: [AuthGuard],
    data: { shouldReuse: true, showNavbar: true }
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
    component: PublicProfileComponent
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