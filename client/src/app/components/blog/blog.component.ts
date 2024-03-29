import { Component, OnInit, inject, NgZone, ViewChild, AfterViewChecked } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';
import { SocketService } from '../../services/socket.service';
import { EventEmitterService } from '../../services/event-emitter.service';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { QuillEditorComponent } from '../../modules/quill-editor/quill-editor/quill-editor.component';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})

export class BlogComponent implements OnInit, AfterViewChecked {

  blogService: BlogService = inject(BlogService);

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
    private formBuilder: UntypedFormBuilder,
    public authService: AuthService,
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
    this.getBlogs();
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
  //       this.getBlogs();
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

  getBlogs() {
    this.blogService.getBlogs().subscribe((data: any) => {
      var blogs = <Array<any>>data.blogs;
      blogs.forEach(blog => {
        if (blog.leadin) {
          blog.leadin = blog.leadin.replace(/\n/g, "<br>");
        }
      });
      this.blogPosts = blogs;
    });
  }

  likeBlog(id) {
    this.blogService.likeBlog(id).subscribe(data => {
      this.getBlogs();
    });
  }

  dislikeBlog(id) {
    this.blogService.dislikeBlog(id).subscribe(data => {
      this.getBlogs();
    });
  }

  postComment(id) {
    this.disableCommentForm();
    this.processing = true;
    const comment = this.commentForm.get('comment').value;
    this.blogService.postComment(id, comment).subscribe(data => {
      this.getBlogs();
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

    this.getBlogs();

    this.socketService.on('actionOther', (act) => {
      if (act == 'updateBlog') {
        this.zone.run(() => {
          this.getBlogs();
        });
      }
    });

  }

}
