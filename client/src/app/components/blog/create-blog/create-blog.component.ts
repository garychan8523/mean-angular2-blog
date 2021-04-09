import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { QuillEditorComponent } from 'src/app/modules/quill-editor/quill-editor/quill-editor.component';

import { AuthService } from '../../../services/auth.service';
import { BlogService } from '../../../services/blog.service';
import { EventEmitterService } from '../../../services/event-emitter.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-create-blog',
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.css']
})
export class CreateBlogComponent implements OnInit {

  form;
  processing = false;
  username;

  dataRegister: any = {};

  deleteBlogPost;

  overlay = false;
  discardBlogDisplay = false;
  deleteBlogDisplay = false;

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private blogService: BlogService,
    private eventEmitterService: EventEmitterService,
    private flashMessagesService: FlashMessagesService,
  ) {
    this.createNewBlogForm();
  }

  @ViewChild(QuillEditorComponent)
  editorComponent: QuillEditorComponent;

  onEvent(event) {
    event.stopPropagation();
  }

  ngOnInit(): void {
    this.eventEmitterService.updateNavbarStatus('hide');
    this.authService.getProfile().subscribe(profile => {
      this.dataRegister = profile
      if (!this.dataRegister.success) {
        this.authService.logout();
      } else {
        this.username = this.dataRegister.user.username;
      }
    });
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

  enableFormNewBlogForm() {
    this.processing = false;
    this.form.get('title').enable();
    this.form.get('leadin').enable();
  }

  disableFormNewBlogForm() {
    this.processing = true;
    this.form.get('title').disable();
    this.form.get('leadin').disable();
  }

  onBlogSubmit() {
    this.disableFormNewBlogForm();

    const blog = {
      title: this.form.get('title').value,
      leadin: this.form.get('leadin').value,
      body: JSON.stringify(this.editorComponent.quill.getContents()),
      createdBy: this.username
    }

    this.blogService.newBlog(blog).subscribe(data => {
      this.dataRegister = data
      if (!this.dataRegister.success) {
        this.flashMessagesService.show(this.dataRegister.message, { cssClass: 'alert-danger', timeout: 5000 });
        this.enableFormNewBlogForm();
      } else {
        setTimeout(() => {
          this.flashMessagesService.show(this.dataRegister.message, { cssClass: 'alert-success', timeout: 5000 });
          this.goBack();
        }, 1000);
      }
    })
  }

  checkDiscard() {
    if ((this.form.get('title').value && this.form.get('title').value.length > 0)
      || (this.form.get('leadin').value && this.form.get('leadin').value.length > 0)
      || (this.editorComponent.getQuillTextLength() && this.editorComponent.getQuillTextLength() > 1)) {
      this.discardBlogPopup();
    } else {
      this.resetForm();
      this.goBack();
    }
  }

  discardBlogPopup() {
    this.overlay = true;
    this.discardBlogDisplay = true;
  }

  discardBlog() {
    this.resetForm();
    this.goBack();
  }

  deleteBlog() {
    this.processing = true;
    this.blogService.deleteBlog(this.deleteBlogPost._id).subscribe(data => {
      this.dataRegister = data
      if (!this.dataRegister.success) {
        this.flashMessagesService.show(this.dataRegister.message, { cssClass: 'alert-danger', timeout: 5000 });
      } else {
        this.flashMessagesService.show(this.dataRegister.message, { cssClass: 'alert-success', timeout: 5000 });
        this.processing = false;
        this.overlay = false;
        this.deleteBlogDisplay = false;
        //this.getAllBlogs();
        setTimeout(() => {
        }, 2000);
      }
    });
  }

  resetForm() {
    this.form.reset();
    this.editorComponent.resetQuillEditor();
  }

  goBack() {
    //window.location.reload();
    //this.eventEmitterService.updateNavbarStatus('show');
    this.overlay = false;
    //this.newPost = false;
    //this.pageTitle = "Feed";
    this.deleteBlogDisplay = false;
    this.discardBlogDisplay = false;
    this.location.back();
  }

  cancelAction() {
    this.overlay = false;
    this.deleteBlogDisplay = false;
    this.discardBlogDisplay = false;
  }

}
