import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { BlogService } from '../../../services/blog.service';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnInit {

  message;
  messageClass;
  blog;
  form;
  processing = true;
  currentUrl;
  loading = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
  	private location: Location,
  	private activatedRoute: ActivatedRoute,
  	private blogService: BlogService,
  	private router: Router
  ) { 
    this.createEditBlogForm();
  }

  createEditBlogForm() {
    this.form = this.formBuilder.group({
      title: [{value: '', disabled: true}, Validators.compose([
        Validators.required,
        Validators.maxLength(100),
        Validators.minLength(2),
        this.alphaNumericValidation
        ])],
      body: [{value: '', disabled: true}, Validators.compose([
        Validators.required,
        Validators.maxLength(1500),
        Validators.minLength(2)
        ])]
    });
  }

  alphaNumericValidation(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
    if(regExp.test(controls.value) || controls.value == '') {
      return null;
    }else {
      return { 'alphaNumericValidation': true }
    }
  }

  updateBlogSubmit() {
  	this.processing = true;
    this.form.controls['title'].disable();
    this.form.controls['body'].disable();
  	let regex2 = /\n/g
  	this.blog.body = this.blog.body.replace(regex2, "<br>");
  	this.blogService.editBlog(this.blog).subscribe(data => {
  		if (!data.success) {
  			this.messageClass = 'alert alert-danger';
        	this.message = data.message;
        	this.processing = false;
          this.form.controls['title'].enable();
          this.form.controls['body'].enable();
  		} else {
  			this.messageClass = 'alert alert-success';
  			this.message = data.message;
  			setTimeout(() => {
  				this.router.navigate(['/blog']);
  			}, 2000);
  		}
  	});
  }

  goBack() {
  	this.location.back();
  }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      if(!profile.success){
        this.authService.logout();
        window.location.reload();
      }
    });

  	this.currentUrl = this.activatedRoute.snapshot.params;
    this.blogService.getSingleBlog(this.currentUrl.id).subscribe(data => {
    	if (!data.success) {
    		this.messageClass = 'alert alert-danger';
        this.message = data.message;
    	} else {
        let regex = /<br\s*[\/]?>/gi;
        data.blog.body = data.blog.body.replace(regex, "\n");
       	this.blog = data.blog;
        this.processing = false;
        this.form.controls['title'].enable();
        this.form.controls['body'].enable();
    		this.loading = false;
    	}
  	});
  }

}
