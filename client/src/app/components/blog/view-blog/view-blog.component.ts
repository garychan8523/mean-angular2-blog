import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { BlogService } from '../../../services/blog.service';
import { EventEmitterService } from '../../../services/event-emitter.service';
import { FlashMessagesService } from 'angular2-flash-messages';

import { QuillEditorComponent } from '../../../modules/quill-editor/quill-editor/quill-editor.component';

@Component({
  selector: 'app-view-blog',
  templateUrl: './view-blog.component.html',
  styleUrls: ['./view-blog.component.css']
})
export class ViewBlogComponent implements OnInit, AfterViewChecked {

  blog;
  username;
  currentUrl;
  loading = true;
  dataRegister: any = {};
  leadinView;

  constructor(
    public authService: AuthService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private blogService: BlogService,
    private eventEmitterService: EventEmitterService,
    private flashMessagesService: FlashMessagesService
  ) {
  }

  @ViewChild(QuillEditorComponent)
  editorComponent: QuillEditorComponent;
  ngAfterViewChecked() {
    this.editorComponent.setEditing(false);
    this.editorComponent.quill.enable(false);
    this.editorComponent.quill.setContents(JSON.parse(this.blog.body).ops);
  }

  goBack() {
    this.location.back();
  }

  ngOnInit() {
    this.loading = true;
    this.eventEmitterService.updateNavbarStatus('hide');
    this.authService.getProfile().subscribe(profile => {
      this.dataRegister = profile;
      if (!this.dataRegister.success) {
        this.authService.logout();
      } else {
        this.username = this.dataRegister.user.username;
      }
    });
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.blogService.getSingleBlog(this.currentUrl.id).subscribe(data => {
      this.dataRegister = data;
      if (!this.dataRegister.blog) {
        this.flashMessagesService.show('something wrong', { cssClass: 'alert-danger', timeout: 5000 });
      } else {
        this.blog = (Object.assign({}, this.dataRegister.blog));
        this.leadinView = this.blog.leadin;
      }
    }, err => {
      this.flashMessagesService.show(err.error.message, { cssClass: 'alert-danger', timeout: 5000 });
    }, () => {
      this.loading = false;
    });
  }

}
