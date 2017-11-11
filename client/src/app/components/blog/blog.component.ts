import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  messageClass;
  message;
  newPost = false;
  loadingBlogs = false;
  form;

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.createNewBlogForm();
  }

  createNewBlogForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(100),
        Validators.minLength(2),
        this.alphaNumericValidation
        ])],
      body: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(1500),
        Validators.minLength(1)
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

  newBlogForm() {
  	this.newPost = true;
  }
  
  reloadBlogs() {
    this.loadingBlogs = true;
    // retrieve all blogs
    setTimeout(() => {
      this.loadingBlogs = false;
    }, 1000);
  }

  draftComment() {

  }

  onBlogSubmit() {
    console.log('form submitted.');
  }

  ngOnInit() {
  }

}
