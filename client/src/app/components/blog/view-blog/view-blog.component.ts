import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { BlogService } from '../../../services/blog.service';
import { EventEmitterService } from '../../../services/event-emitter.service';
import { FlashMessagesService } from '../../../modules/flash-messages/flash-messages.service';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { QuillEditorComponent } from 'src/app/modules/quill-editor/quill-editor/quill-editor.component';

@Component({
  selector: 'app-view-blog',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    QuillEditorComponent
  ],
  templateUrl: './view-blog.component.html',
  styleUrls: ['./view-blog.component.css']
})
export class ViewBlogComponent implements OnInit, AfterViewInit {

  blog;
  username;
  currentUrl;
  loading;
  leadinView;

  constructor(
    public authService: AuthService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private blogService: BlogService,
    private eventEmitterService: EventEmitterService,
    private flashMessagesService: FlashMessagesService
  ) {
    this.loading = true;
  }

  @ViewChild(QuillEditorComponent) editorComponent!: QuillEditorComponent;
  ngAfterViewInit() {
    setTimeout(() => {
      this.editorComponent.setEditing(false);
      this.editorComponent.quill.enable(false);
    }, 0)
  }

  goBack() {
    this.location.back();
  }

  ngOnInit() {
    this.eventEmitterService.updateNavbarStatus('hide');
    this.authService.getProfile().subscribe((profile: any) => {
      if (!profile.success) {
        this.authService.logout();
      } else {
        this.username = profile.user.username;
      }
    });
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.blogService.getBlog(this.currentUrl.id).subscribe((data: any) => {
      if (!data.success) {
        this.flashMessagesService.show(data.message, { cssClass: 'alert-danger', timeout: 5000 });
      } else {
        this.blog = (Object.assign({}, data.blog));
        this.editorComponent.quill.setContents(JSON.parse(this.blog.body).ops);
        this.leadinView = this.blog.leadin;
      }
    }, err => {
      this.flashMessagesService.show(err.error.message, { cssClass: 'alert-danger', timeout: 5000 });
    }, () => {
      this.loading = false;
    });
  }

}
