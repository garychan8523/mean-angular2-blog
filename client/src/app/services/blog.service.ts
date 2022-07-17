import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
//import { Http, Headers, RequestOptions } from '@angular/http';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, tap, catchError, retry } from 'rxjs/operators';

@Injectable()
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

  newBlog(blog) {
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'blogs/newBlog', blog, this.options);
  }

  getAllBlogs() {
    //this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'blogs/allBlogs', this.options);
  }

  getPublishedBlogsByUserId(userId) {
    //this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'blogs/user/' + userId, this.options);
  }

  getSingleBlog(id) {
    //this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'blogs/singleBlog/' + id, this.options);
  }

  editBlog(blog) {
    this.createAuthenticationHeaders();
    return this.http.put(this.domain + 'blogs/updateBlog/' + blog._id, blog, this.options);
  }

  patchBlogSetting(patchObj) {
    this.createAuthenticationHeaders();
    return this.http.patch(this.domain + 'blogs/setting/' + patchObj.settingPatchObj.blogId, patchObj, this.options);
  }

  deleteBlog(id) {
    this.createAuthenticationHeaders();
    return this.http.delete(this.domain + 'blogs/deleteBlog/' + id, this.options);
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
