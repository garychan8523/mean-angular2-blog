import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
//import { Http, Headers, RequestOptions } from '@angular/http';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, tap, catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  options;
  domain = this.authService.domain;

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }

  createAuthenticationHeaders() {
    this.authService.loadToken();
    this.options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'authorization': this.authService.authToken
      }),
    };
  }

  getBlogs() {
    //this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'blogs', this.options);
  }

  getPublishedBlogsByUserId(userId) {
    //this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'profile/' + userId + '/blogs', this.options);
  }

  postBlog(blog) {
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'blogs', blog, this.options);
  }

  getBlog(blogId) {
    //this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'blogs/' + blogId, this.options);
  }

  putBlog(blog) {
    this.createAuthenticationHeaders();
    return this.http.put(this.domain + 'blogs/' + blog._id, blog, this.options);
  }

  deleteBlog(id) {
    this.createAuthenticationHeaders();
    return this.http.delete(this.domain + 'blogs/' + id, this.options);
  }

  patchBlogSetting(patchObj) {
    this.createAuthenticationHeaders();
    return this.http.patch(this.domain + 'blogs/' + patchObj.settingPatchObj.blogId + '/setting', patchObj, this.options);
  }

  likeBlog(id) {
    this.createAuthenticationHeaders();
    const blogData = { id: id };
    return this.http.put(this.domain + 'blogs/likeBlog/', blogData, this.options);
  }

  dislikeBlog(id) {
    this.createAuthenticationHeaders();
    const blogData = { id: id };
    return this.http.put(this.domain + 'blogs/dislikeBlog/', blogData, this.options);
  }

  postComment(id, comment) {
    this.createAuthenticationHeaders();
    const blogData = {
      id: id,
      comment: comment
    };
    return this.http.post(this.domain + 'blogs/comment', blogData, this.options);
  }

}
