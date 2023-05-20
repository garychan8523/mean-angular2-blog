import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { BlogService } from '../../../services/blog.service';
import { EventEmitterService } from '../../../services/event-emitter.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-blog-setting',
  templateUrl: './blog-setting.component.html',
  styleUrls: ['./blog-setting.component.css']
})
export class BlogSettingComponent implements OnInit {

  processing = true;

  username;

  publishForm;
  publishDatetimeValue;

  published = false;
  publishedChecked = true;

  isNewPost = false;
  blog;
  blogId;
  storedBlog;
  neverPublished;
  publishedDate;

  publishAction;

  dataRegister: any = {};

  constructor(
    public authService: AuthService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private blogService: BlogService,
    private eventEmitterService: EventEmitterService,
    private flashMessagesService: FlashMessagesService
  ) {
    this.publishForm = new FormGroup({
      published: new FormControl(),
      schedule: new FormControl('now'),
      publishedAt: new FormControl()
    });
  }

  ngOnInit(): void {
    this.processing = true;

    this.eventEmitterService.updateNavbarStatus('hide');

    this.blogId = this.activatedRoute.snapshot.params.id;

    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params.newPost) {
          this.isNewPost = true;
        } else {
          this.isNewPost = false;
        }
      }
      );

    this.getUserProfile()
      .then((data) => {
        this.username = data;
        this.getBlog(this.blogId)
          .then((blog) => {
            this.blog = blog;
            if (this.blog.published == undefined) {
              this.neverPublished = true;
            }
            if (this.blog.published) {
              this.blog.published = true;
            } else {
              this.blog.published = false;
            }
            if (this.blog.publishedAt) {
              this.publishedDate = this.blog.publishedAt;
            }
            this.storedBlog = Object.assign({}, this.blog);
            this.publishForm.patchValue({ published: this.storedBlog.published });
          })
          .catch((message) => {
            this.flashMessagesService.show(message, { cssClass: 'alert-danger', timeout: 5000 });
          })
      })
      .finally(() => {
        this.processing = false;
      })

    this.publishForm.patchValue({ publishedAt: this.getCurrentDatetimeIsoString() });
  }

  getUserProfile = () => new Promise(resolve => {
    this.authService.getProfile().subscribe(profile => {
      this.dataRegister = profile;
      if (!this.dataRegister.success) {
        this.authService.logout();
        resolve(undefined);
      } else {
        resolve(this.dataRegister.user.username);
      }
    });
  });

  getBlog = (blogId) => new Promise((resolve, reject) => {
    this.blogService.getBlog(blogId).subscribe(data => {
      this.dataRegister = data;
      if (!this.dataRegister.success) {
        reject(this.dataRegister.message);
      } else {
        let blog = (Object.assign({}, this.dataRegister.blog));
        if (blog.createdBy !== this.username) {
          reject('unauthorized');
          this.goBack();
        } else {
          resolve(blog);
        }
      }
    });
  });

  goBack() {
    this.location.back();
  }

  goSkip() {
    parent.history.go(-2);
  }

  togglePublished() {
    if (this.publishForm.get('published').value) {
      this.publishForm.patchValue({ published: !this.publishForm.get('published').value })
    } else {
      this.publishForm.patchValue({ published: true })
    }

  }

  getCurrentDatetimeIsoString() {
    let utc_datetime = new Date;
    let utc_timestamp = Date.UTC(utc_datetime.getUTCFullYear(), utc_datetime.getUTCMonth(), utc_datetime.getUTCDate(),
      utc_datetime.getUTCHours(), utc_datetime.getUTCMinutes(), utc_datetime.getUTCSeconds(), utc_datetime.getUTCMilliseconds());
    let offset_utc_timestamp = utc_timestamp + 1000 * 3600 * 8;
    offset_utc_timestamp = new Date(offset_utc_timestamp).setSeconds(0);
    offset_utc_timestamp = new Date(offset_utc_timestamp).setMilliseconds(0);
    let offset_isostring = (new Date(offset_utc_timestamp)).toISOString();
    //this.date = new FormControl(offset_isostring);
    return offset_isostring.substr(0, 16);
    //this.publishDatetimeValue = offset_isostring.substr(0, 16);
  }

  resetPublishForm() {
    this.publishForm.reset({
      published: this.storedBlog.published,
    });
    if (this.isNewPost || this.neverPublished) {
      this.publishAction = undefined;
    }
  }

  dateChanged(e) {
    this.publishForm.patchValue({ publishedAt: e.target.value })
  }

  onItemChange(action) {
    this.publishAction = action;
  }

  onSettingSubmit() {
    let updateObj = {};
    updateObj['blogId'] = this.blogId;
    updateObj['published'] = this.publishForm.get('published').value;

    if (this.isNewPost) {
      if (this.publishAction == 'skip') {
        parent.history.go(-2);
        return
      }
    }

    if (this.neverPublished) {
      if (this.publishAction == 'publish-schedule') {
        updateObj['published'] = true;
        updateObj['publishedAt'] = new Date(this.publishForm.get('publishedAt').value + ':00');
        if (updateObj['publishedAt'].toString().includes('Jan 01 2000')) {
          this.flashMessagesService.show('rejected date (prevent default)', { cssClass: 'alert-danger', timeout: 5000 });
          return
        }
      } else if (this.publishAction == 'publish-now') {
        updateObj['published'] = true;
        updateObj['publishedAt'] = Date.now() + new Date().getTimezoneOffset();
      }
    }

    let settingPatchObj = { 'settingPatchObj': updateObj };

    this.blogService.patchBlogSetting(settingPatchObj).subscribe(data => {
      this.dataRegister = data;
      if (!this.dataRegister) {
        this.flashMessagesService.show('something wrong', { cssClass: 'alert-danger', timeout: 5000 });
      } else {
        setTimeout(() => {
          this.flashMessagesService.show(this.dataRegister.message, { cssClass: 'alert-success', timeout: 5000 });
          if (this.isNewPost) {
            this.goSkip();
          } else {
            this.goBack();
          }
        }, 1000);
      }
    }, err => {
      this.flashMessagesService.show(err.error.message, { cssClass: 'alert-danger', timeout: 5000 });
    });
  }

}
