import { Component, OnInit, NgZone, ViewChild, AfterViewChecked } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';
import { SocketService } from '../../services/socket.service';
import { EventEmitterService } from '../../services/event-emitter.service';

import { QuillEditorComponent } from '../../modules/quill-editor/quill-editor/quill-editor.component';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})

export class BlogComponent implements OnInit, AfterViewChecked {

  notificationClass;
  notification = false;
  loadingBlogs = false;
  form;
  commentForm;
  processing = false;
  username;
  blogPosts;
  newComment = [];
  enabledComments = [];
  dataRegister: any = {};

  constructor(
    private zone: NgZone,
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private blogService: BlogService,
    private socketService: SocketService,
    private eventEmitterService: EventEmitterService
  ) {
    this.createNewBlogForm();
    this.createCommentForm();
  }

  @ViewChild(QuillEditorComponent)
  editorComponent: QuillEditorComponent;
  ngAfterViewChecked(): void {
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
      leadin: ['', Validators.compose([
        Validators.maxLength(300),
        //this.specialCharacterValidation
      ])]
    });
  }

  createCommentForm() {
    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(50000),
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
    this.form.get('leadin').enable();
  }

  disableFormNewBlogForm() {
    this.form.get('title').disable();
    this.form.get('leadin').disable();
  }

  // specialCharacterValidation(controls) {
  //   const regExp = new RegExp(/[-a-zA-Z0-9《》（）「」＜＞〈〉，。<>():：!！?？#＃．・…\/／\u4e00-\u9eff]/g);
  //   if(regExp.test(controls.value) || controls.value == '') {
  //     return null;
  //   }else {
  //     return { 'specialCharacterValidation': true }
  //   }
  // }

  // deleteBlogPopup(blog) {
  //   this.overlay = true;
  //   this.deleteBlogDisplay = true;
  //   this.deleteBlogPost = blog;
  // }

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

  // deleteBlog() {
  //   this.processing = true;
  //   this.blogService.deleteBlog(this.deleteBlogPost._id).subscribe(data => {
  //     this.dataRegister = data
  //     if (!this.dataRegister.success) {
  //       this.messageClass = 'alert alert-danger';
  //       this.message = this.dataRegister.message;
  //     } else {
  //       this.messageClass = 'alert alert-success';
  //       this.message = this.dataRegister.message;
  //       this.processing = false;
  //       this.overlay = false;
  //       this.deleteBlogDisplay = false;
  //       this.getAllBlogs();
  //       setTimeout(() => {
  //         this.message = false;
  //       }, 2000);
  //     }
  //   });
  // }

  goBack() {
    this.eventEmitterService.updateNavbarStatus('show');
  }

  // resetForm() {
  //   this.form.reset();
  //   this.editorComponent.resetQuillEditor();
  // }

  getAllBlogs() {
    this.blogService.getAllBlogs().subscribe(data => {
      this.dataRegister = data
      this.blogPosts = this.dataRegister.blogs;
      this.blogPosts.array.forEach(blog => {
        blog.leadin = blog.leadin.replace(/\n/g, "<br>");
      });
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

  setArrayFromNumber(i: number) {
    return new Array(i);
  }

  ngOnInit() {
    this.eventEmitterService.updateNavbarStatus('show');
    this.authService.getProfile().subscribe(profile => {
      this.dataRegister = profile
      if (!this.dataRegister.success) {
        this.authService.logout();
      } else {
        this.username = this.dataRegister.user.username;
      }
    });

    this.getAllBlogs();

    this.socketService.on('actionOther', (act) => {
      if (act == 'updateBlog') {
        this.zone.run(() => {
          this.getAllBlogs();
        });
      }
    });

  }

}
