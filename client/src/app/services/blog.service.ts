import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class BlogService {

	options;
	domain = this.authService.domain;

  constructor(
  	private authService: AuthService,
  	private http: Http
  	) { }

    createAuthenticationHeaders() {
    this.authService.loadToken(); // Get token so it can be attached to headers
    // Headers configuration options
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Format set to JSON
        'authorization': this.authService.authToken // Attach token
      })
    });
  }

  newBlog(blog) {
  	this.createAuthenticationHeaders();
  	return this.http.post(this.domain + 'blogs/newBlog', blog, this.options).map(res => res.json());
  }

  getAllBlogs() {
  	//this.createAuthenticationHeaders();
  	return this.http.get(this.domain + 'blogs/allBlogs', this.options).map(res => res.json());
  }

  getSingleBlog(id) {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'blogs/singleBlog/' + id, this.options).map(res => res.json());
  }

  editBlog(blog) {
    this.createAuthenticationHeaders();
    return this.http.put(this.domain + 'blogs/updateBlog/', blog, this.options).map(res => res.json());
  }

  deleteBlog(id) {
    this.createAuthenticationHeaders();
    return this.http.delete(this.domain + 'blogs/deleteBlog/' + id, this.options).map(res => res.json());
  }

  likeBlog(id) {
    this.createAuthenticationHeaders();
    const blogData = { id: id };
    return this.http.put(this.domain + 'blogs/likeBlog/', blogData, this.options).map(res => res.json());
  }

  dislikeBlog(id) {
    this.createAuthenticationHeaders();
    const blogData = { id: id };
    return this.http.put(this.domain + 'blogs/dislikeBlog/', blogData, this.options).map(res => res.json());
  }

  postComment(id, comment) {
    this.createAuthenticationHeaders();
    const blogData = {
      id: id,
      comment: comment
    };
    return this.http.post(this.domain + 'blogs/comment', blogData, this.options).map(res => res.json());
  }

}
