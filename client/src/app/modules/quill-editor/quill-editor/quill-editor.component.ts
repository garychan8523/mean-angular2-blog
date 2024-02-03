import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import * as QuillNamespace from 'quill';
let Quill: any = QuillNamespace;
import ImageResize from 'quill-image-resize-module';

import { AuthService } from '../../../services/auth.service';
import { UploadService } from '../../../services/upload.service';
import { FlashMessagesService } from '../../../modules/flash-messages/flash-messages.service';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quill-editor',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './quill-editor.component.html',
  styleUrls: ['./quill-editor.component.css']
})
export class QuillEditorComponent implements OnInit {

  uploadService: UploadService = inject(UploadService);

  form;
  quill;
  blogContent;
  blogLength = 1;
  isContentValid;
  isContentDirty = false;
  isEditing = true;

  constructor(
    private formBuilder: UntypedFormBuilder,
    public authService: AuthService,
    private flashMessagesService: FlashMessagesService,
  ) {
    Quill.register('modules/imageResize', ImageResize);
  }

  resetQuillEditor() {
    this.quill.setContents([{ insert: '\n' }]);
    this.isContentDirty = false;
  }

  getQuillTextLength() {
    return this.quill.getLength();
  }

  isLengthWithinLimit(limit) {
    return this.blogLength <= limit;
  }

  setEditing(isEditing) {
    this.isEditing = isEditing;
  }

  ngOnInit(): void {
    this.isContentValid = true;
    var toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],                                        // remove formatting button
      ['link', 'image', 'formula'],
    ];

    this.quill = new Quill('#editor', {
      placeholder: 'Enter content here...',
      readOnly: false,
      modules: {
        toolbar: toolbarOptions,
        imageResize: true
      },
      theme: 'snow'
    });

    this.quill.getModule("toolbar").addHandler("image", () => {
      selectLocalImage();
    });

    var that = this;

    function selectLocalImage() {
      that.authService.getProfile().subscribe((data: any) => {
        if (!data.success) {
          that.authService.logout();
          window.location.reload();
        } else {
          const input = document.createElement('input');
          input.setAttribute('accept', 'image/*')
          input.setAttribute('type', 'file');
          input.click();

          input.onchange = () => {
            const file = input.files[0];

            if (/^image\//.test(file.type)) {
              saveToServer(file);
            } else {
              that.flashMessagesService.show('only accpt image file', { cssClass: 'alert-danger', timeout: 5000 });
            }
          };
        }
      });
    }

    function saveToServer(file: File) {
      that.uploadService.uploadImage(file).subscribe((data: any) => {
        if (!data.success) {
          that.flashMessagesService.show(data.message, { cssClass: 'alert-danger', timeout: 5000 });
        } else {
          that.flashMessagesService.show(data.message, { cssClass: 'alert-success', timeout: 5000 });
          insertToEditor(data.key);
        }
      })
    }

    function insertToEditor(url: string) {
      const range = that.quill.getSelection();
      that.quill.insertEmbed(range.index, 'image', url);
    }

    this.quill.getModule('toolbar').addHandler('image', () => {
      selectLocalImage();
    });


    this.quill.on('text-change', function (delta, oldDelta, source) {
      that.isContentDirty = true;
      that.blogContent = that.quill.getContents();
      console.log(that.blogContent)
      let imageLength = 0;
      for (const i in that.blogContent.ops) {
        if (that.blogContent.ops[i].insert && that.blogContent.ops[i].insert.image) {
          imageLength += that.blogContent.ops[i].insert.image.length;
        }
      }
      that.blogLength = that.quill.getLength() + imageLength;
      if (that.isContentDirty && that.quill.getLength() < 2) {
        that.isContentValid = false;
      } else {
        that.isContentValid = true;
      }
      if (that.quill.getLength() > 50000) {
        that.quill.deleteText(50000, that.quill.getLength());
      }
      // if (source == 'api') {
      //   console.log('An API call triggered this change.');
      // } else if (source == 'user') {
      //   console.log('A user action triggered this change.');
      // }
    });

  }

}
