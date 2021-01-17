import { Component, OnInit, NgZone } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})

export class BlogComponent implements OnInit {

  messageClass;
  message = false;
  notificationClass;
  notification = false;
  newPost = false;
  deleteBlogDisplay = false;
  deleteBlogPost;
  loadingBlogs = false;
  form;
  commentForm;
  processing = false;
  username;
  blogPosts;
  overlay = false;
  newComment = [];
  enabledComments = [];
  dataRegister: any = {};

  constructor(
    private zone: NgZone,
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private blogService: BlogService,
    private socketService: SocketService,
    private router: Router
  ) {
    this.createNewBlogForm();
    this.createCommentForm();
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

  createCommentForm() {
    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(1500),
        Validators.minLength(2)
      ])]
    });
  }

  enableCommentForm() {
    this.commentForm.get('comment').enable();
  }

  disableCommentForm() {
    this.commentForm.get('comment').disable();
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

  draftComment(id) {
    this.commentForm.reset();
    this.newComment = [];
    this.newComment.push(id);
  }

  cancelSubmission(id) {
    const index = this.newComment.indexOf(id);
    this.newComment.splice(index, 1);
    this.commentForm.reset();
    this.enableCommentForm();
    this.processing = false;
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
      this.dataRegister = data
      if (!this.dataRegister.success) {
        this.messageClass = 'alert alert-danger';
        this.message = this.dataRegister.message;
        this.processing = false;
        this.enableFormNewBlogForm();
      } else {
        this.messageClass = 'alert alert-success';
        this.message = this.dataRegister.message;
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
      this.dataRegister = data
      if (!this.dataRegister.success) {
        this.messageClass = 'alert alert-danger';
        this.message = this.dataRegister.message;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = this.dataRegister.message;
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
    this.form.reset();
  }

  getAllBlogs() {
    this.blogService.getAllBlogs().subscribe(data => {
      this.dataRegister = data
      this.blogPosts = this.dataRegister.blogs;
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

  postComment(id) {
    this.disableCommentForm();
    this.processing = true;
    const comment = this.commentForm.get('comment').value;
    this.blogService.postComment(id, comment).subscribe(data => {
      this.getAllBlogs();
      const index = this.newComment.indexOf(id);
      this.newComment.splice(index, 1);
      this.enableCommentForm();
      this.commentForm.reset();
      this.processing = false;
      if (this.enabledComments.indexOf(id) < 0) this.expand(id);

      let _data = {
        act: 'updateBlog'
      };
      this.socketService.actionOther(_data);
    });
  }

  expand(id) {
    this.enabledComments.push(id);
  }

  collapse(id) {
    const index = this.enabledComments.indexOf(id);
    this.enabledComments.splice(index, 1);
  }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.dataRegister = profile
      if (!this.dataRegister.success) {
        this.authService.logout();
      } else {
        this.username = this.dataRegister.user.username;
      }
    });

    this.getAllBlogs();

    let data = {
      msg: 'test message'
    };

    this.socketService.notification(data);

    this.socketService.on('notification', (msg) => {
      this.zone.run(() => {
        this.notificationClass = 'alert alert-info';
        this.notification = msg;

        window.setTimeout(() => {
          this.notification = false;
        }, 5000);
      });
    });

    this.socketService.on('actionOther', (act) => {
      if (act == 'updateBlog') {
        this.zone.run(() => {
          this.getAllBlogs();
        });
      }
    });

  }

}
