import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  messageClass;
  message;
  newPost = false;
  deleteBlogDisplay = false;
  deleteBlogPost;
  loadingBlogs = false;
  form;
  processing = false;
  username;
  blogPosts;
  overlay = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private blogService: BlogService,
    private router: Router
  ) {
    this.createNewBlogForm();
  }

  onEvent(event) {
   event.stopPropagation();
  }

  createNewBlogForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(100),
        Validators.minLength(2),
        //this.specialCharacterValidation
        ])],
      body: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(1500),
        Validators.minLength(2)
        ])]
    });
  }

  enableFormNewBlogForm() {
    this.form.get('title').enable();
    this.form.get('body').enable();
  }

  disableFormNewBlogForm() {
    this.form.get('title').disable();
    this.form.get('body').disable();
  }

  // specialCharacterValidation(controls) {
  //   const regExp = new RegExp(/[-a-zA-Z0-9《》（）「」＜＞〈〉，。<>():：!！?？#＃．・…\/／\u4e00-\u9eff]/g);
  //   if(regExp.test(controls.value) || controls.value == '') {
  //     return null;
  //   }else {
  //     return { 'specialCharacterValidation': true }
  //   }
  // }

  newBlogForm() {
  	this.newPost = true;
  }
  
  deleteBlogPopup(blog) {
    this.overlay = true;
    this.deleteBlogDisplay = true;
    this.deleteBlogPost = blog;
  }

  reloadBlogs() {
    this.loadingBlogs = true;
    this.getAllBlogs();
    setTimeout(() => {
      this.loadingBlogs = false;
    }, 1000);
  }

  draftComment() {

  }

  onBlogSubmit() {
    this.processing = true;
    this.disableFormNewBlogForm();

    const blog = {
      title: this.form.get('title').value,
      body: this.form.get('body').value,
      createdBy: this.username
    }

    this.blogService.newBlog(blog).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
        this.enableFormNewBlogForm();
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.getAllBlogs();
        setTimeout(() => {
          this.newPost = false;
          this.processing = false;
          this.message = false;
          this.form.reset();
          this.enableFormNewBlogForm();
        }, 2000);
      }
    })
  }

  deleteBlog() {
    this.processing = true;
    this.blogService.deleteBlog(this.deleteBlogPost._id).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.processing = false;
        this.overlay = false;
        this.deleteBlogDisplay = false;
        this.getAllBlogs();
        setTimeout(() => {
          this.message = false;
        }, 2000);
      }
    });
  }

  goBack() {
    //window.location.reload();
    this.overlay = false;
    this.newPost = false;
    this.deleteBlogDisplay = false;
  }

  resetForm() {
    this.form.reset()﻿;
  }

  getAllBlogs() {
    this.blogService.getAllBlogs().subscribe(data => {
      this.blogPosts = data.blogs;
    });
  }

  likeBlog(id) {
    this.blogService.likeBlog(id).subscribe(data => {
      this.getAllBlogs();
    });
  }

  dislikeBlog(id) {
    this.blogService.dislikeBlog(id).subscribe(data => {
      this.getAllBlogs();
    });
  }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      if(!profile.success){
        this.authService.logout();
      } else {
        this.username = profile.user.username;
      }
    });

    this.getAllBlogs();
  }

}
