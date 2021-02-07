import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as QuillNamespace from 'quill';
let Quill: any = QuillNamespace;
import ImageResize from 'quill-image-resize-module';

@Component({
  selector: 'app-quill-editor',
  templateUrl: './quill-editor.component.html',
  styleUrls: ['./quill-editor.component.css']
})
export class QuillEditorComponent implements OnInit {

  form;
  quill;
  blogContent;
  blogLength;
  isContentValid;
  isContentDirty = false;


  constructor(
    private formBuilder: FormBuilder,
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
      ['link', 'image'],
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

    var that = this;
    this.quill.on('text-change', function (delta, oldDelta, source) {
      that.isContentDirty = true;
      that.blogContent = that.quill.getContents();
      that.blogLength = that.quill.getLength();
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
