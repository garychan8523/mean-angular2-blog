import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { BlogService } from '../../../services/blog.service';
import { EventEmitterService } from '../../../services/event-emitter.service';

import { QuillEditorComponent } from '../../../modules/quill-editor/quill-editor/quill-editor.component';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnInit, AfterViewInit {

  message;
  messageClass;
  storedBlog;
  blog;
  form;
  processing = true;
  username;
  currentUrl;
  loading = false;
  dataRegister: any = {};
  toolbarClass;
  editMode = false;
  leadinView;

  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private blogService: BlogService,
    private eventEmitterService: EventEmitterService,
    private router: Router
  ) {
    this.createEditBlogForm();
  }

  setEditMode(bool) {
    if (bool) {
      this.editMode = true;
      this.form.controls['title'].enable();
      this.form.controls['leadin'].enable();
      this.showToolbar(true);
      this.editorComponent.setEditing(true);
      this.editorComponent.quill.enable(true);
    } else {
      this.editMode = false;
      this.form.controls['title'].disable();
      this.form.controls['leadin'].disable();
      this.showToolbar(false);
      this.editorComponent.setEditing(false);
      this.editorComponent.quill.enable(false);
    }
  }

  @ViewChild(QuillEditorComponent)
  editorComponent: QuillEditorComponent;
  ngAfterViewInit() {
    this.setEditMode(false);
    this.editorComponent.quill.setContents(JSON.parse(this.blog.body).ops);
    //console.log(JSON.parse(this.blog.body).ops);
  }

  showToolbar(bool) {
    if (bool) {
      this.toolbarClass = '';
    } else {
      this.toolbarClass = 'ql-hide';
    }
  }

  createEditBlogForm() {
    this.form = this.formBuilder.group({
      title: [{ value: '', disabled: true }, Validators.compose([
        Validators.required,
        Validators.maxLength(100),
        Validators.minLength(2)
      ])],
      leadin: [{ value: '', disabled: true }, Validators.compose([
        Validators.maxLength(300)
      ])]
    });
  }

  updateBlogSubmit() {
    this.processing = true;
    this.form.controls['title'].disable();
    this.form.controls['leadin'].disable();
    this.showToolbar(false);
    this.editorComponent.quill.enable(false);

    // this.blog.leadin = this.blog.leadin.replace(/\n/g, "<br>");
    this.blog.body = JSON.stringify(this.editorComponent.quill.getContents());

    this.blogService.editBlog(this.blog).subscribe(data => {
      this.dataRegister = data;
      if (!this.dataRegister.success) {
        this.messageClass = 'alert alert-danger';
        this.message = this.dataRegister.message.errors.title.message || "Error";
        this.processing = false;
        this.form.controls['title'].enable();
        this.form.controls['leadin'].enable();
        this.showToolbar(true);
        this.editorComponent.quill.enable(true);
      } else {
        this.messageClass = 'alert alert-success';
        this.message = this.dataRegister.message;
        setTimeout(() => {
          window.location.reload();
          // this.eventEmitterService.updateNavbarStatus('show');
          // this.router.navigate(['/blog']);
        }, 2000);
      }
    });

  }

  goBack() {
    if (this.editMode) {
      this.setEditMode(false);
      this.blog = Object.assign({}, this.storedBlog);
      this.editorComponent.quill.setContents(JSON.parse(this.blog.body).ops);
    } else {
      this.location.back();
    }
  }

  enterEdit() {
    this.setEditMode(true);
  }

  ngOnInit() {
    this.eventEmitterService.updateNavbarStatus('hide');
    this.authService.getProfile().subscribe(profile => {
      this.dataRegister = profile;
      if (!this.dataRegister.success) {
        this.authService.logout();
        //window.location.reload();
      } else {
        this.username = this.dataRegister.user.username;
      }
    });
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.blogService.getSingleBlog(this.currentUrl.id).subscribe(data => {
      this.dataRegister = data;
      if (!this.dataRegister.success) {
        this.messageClass = 'alert alert-danger';
        this.message = this.dataRegister.message;
      } else {
        this.blog = (Object.assign({}, this.dataRegister.blog));
        // this.leadinView = this.blog.leadin.replace(/\n/g, "<br>");
        this.leadinView = this.blog.leadin;
        if (this.blog.leadin) {
          this.blog.leadin = this.blog.leadin.replace(/<br>/g, "\n");
        }
        this.storedBlog = Object.assign({}, this.blog);
        this.processing = false;
        this.form.controls['title'].enable();
        this.form.controls['leadin'].enable();
        //this.loading = false;
      }
    });
  }

}
