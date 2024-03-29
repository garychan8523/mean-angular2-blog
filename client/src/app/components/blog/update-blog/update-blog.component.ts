import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { BlogService } from '../../../services/blog.service';
import { EventEmitterService } from '../../../services/event-emitter.service';
import { FlashMessagesService } from '../../../modules/flash-messages/flash-messages.service';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { QuillEditorComponent } from 'src/app/modules/quill-editor/quill-editor/quill-editor.component';

@Component({
  selector: 'app-update-blog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    QuillEditorComponent
  ],
  templateUrl: './update-blog.component.html',
  styleUrls: ['./update-blog.component.css']
})
export class UpdateBlogComponent implements OnInit {

  form;
  processing = false;
  userId;

  deleteBlogPost;

  overlay = false;
  discardBlogDisplay = false;
  deleteBlogDisplay = false;

  currentUrl;
  editMode = false;
  blog;
  leadinView;
  storedBlog;

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    public authService: AuthService,
    private blogService: BlogService,
    private eventEmitterService: EventEmitterService,
    private flashMessagesService: FlashMessagesService,
    private router: Router
  ) {
    this.initBlogForm();
  }

  @ViewChild(QuillEditorComponent)
  editorComponent: QuillEditorComponent;

  onEvent(event) {
    event.stopPropagation();
  }

  ngOnInit(): void {
    this.processing = true;
    this.eventEmitterService.updateNavbarStatus('hide');
    this.authService.getProfile().subscribe((profile: any) => {
      if (!profile.success) {
        this.authService.logout();
        window.location.reload();
      } else {
        this.userId = profile.user._id;
      }
    });

    this.currentUrl = this.activatedRoute.snapshot.params;
    if (this.currentUrl.id) {
      this.editMode = true;

      this.blogService.getBlog(this.currentUrl.id).subscribe((data: any) => {
        if (!data.success) {
          this.flashMessagesService.show(data.message, { cssClass: 'alert-danger', timeout: 5000 });
        } else {
          this.blog = (Object.assign({}, data.blog));

          this.form.controls['title'].setValue(this.blog.title);
          this.leadinView = this.blog.leadin;
          if (this.blog.leadin) {
            this.blog.leadin = this.blog.leadin.replace(/<br>/g, "\n");
            this.form.controls['leadin'].setValue(this.blog.leadin);
            this.form.controls['leadin'].markAsDirty();
          }
          this.editorComponent.quill.setContents(JSON.parse(this.blog.body).ops);

          this.storedBlog = Object.assign({}, this.blog);
          // this.form.controls['title'].enable();
          // this.form.controls['leadin'].enable();
        }
      });
    }

    this.processing = false;
  }

  initBlogForm() {
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

  enableBlogForm() {
    this.processing = false;
    this.form.get('title').enable();
    this.form.get('leadin').enable();
    this.editorComponent.quill.enable(true);
  }

  disableBlogForm() {
    this.processing = true;
    this.form.get('title').disable();
    this.form.get('leadin').disable();
    this.editorComponent.quill.enable(false);
  }

  onBlogSubmit() {
    this.disableBlogForm();

    let blog = {
      title: this.form.get('title').value,
      leadin: this.form.get('leadin').value,
      body: JSON.stringify(this.editorComponent.quill.getContents()),
      createdBy: this.userId
    }

    if (!this.editMode) {
      this.blogService.postBlog(blog).subscribe((data: any) => {
        if (!data.success) {
          this.flashMessagesService.show(data.message, { cssClass: 'alert-danger', timeout: 5000 });
          this.enableBlogForm();
        } else {
          setTimeout(() => {
            this.flashMessagesService.show(data.message, { cssClass: 'alert-success', timeout: 5000 });
            this.router.navigate(['/blog/setting/', data.blogId], { queryParams: { newPost: true } });
          }, 1000);
        }
      })
    } else {
      blog['_id'] = this.currentUrl.id;
      this.blogService.putBlog(blog).subscribe((data: any) => {
        if (!data.success) {
          this.flashMessagesService.show(data.message, { cssClass: 'alert-danger', timeout: 5000 });
          this.enableBlogForm();
        } else {
          setTimeout(() => {
            this.flashMessagesService.show(data.message, { cssClass: 'alert-success', timeout: 5000 });
            this.goBack();
          }, 1000);
        }
      });
    }

  }

  checkDiscard() {
    if (this.editMode) {
      if (this.form.get('title').value != this.storedBlog.title
        || this.form.get('leadin').value != this.storedBlog.leadin
        || JSON.stringify(this.editorComponent.quill.getContents()) != this.blog.body) {
        this.discardBlogPopup();
      } else {
        this.resetForm();
        this.goBack();
      }
    } else {
      if ((this.form.get('title').value && this.form.get('title').value.length > 0)
        || (this.form.get('leadin').value && this.form.get('leadin').value.length > 0)
        || (this.editorComponent.getQuillTextLength() && this.editorComponent.getQuillTextLength() > 1)) {
        this.discardBlogPopup();
      } else {
        this.resetForm();
        this.goBack();
      }
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
    this.blogService.deleteBlog(this.deleteBlogPost._id).subscribe((data: any) => {
      if (!data.success) {
        this.flashMessagesService.show(data.message, { cssClass: 'alert-danger', timeout: 5000 });
      } else {
        this.flashMessagesService.show(data.message, { cssClass: 'alert-success', timeout: 5000 });
        this.processing = false;
        this.overlay = false;
        this.deleteBlogDisplay = false;
        //this.getBlogs();
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
