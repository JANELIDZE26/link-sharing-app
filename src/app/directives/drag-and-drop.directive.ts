import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDragAndDrop]',
})
export class DragAndDropDirective {
  @Output() dragState = new EventEmitter<boolean>();
  @Output() file = new EventEmitter<File>();

  constructor() {}

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragState.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  onLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragState.emit(false);
  }

  @HostListener('drop', ['$event'])
  onDrag(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragState.emit(false);

    for (let i = 0; i < event.dataTransfer!.files.length; i++) {
      var file = event.dataTransfer!.files[i];
    }

    this.file.emit(file!);
  }

  @HostListener('body:dragover', ['$event'])
  onBodyDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
  @HostListener('body:drop', ['$event'])
  onBodyDrop(event: DragEvent) {
    event.preventDefault();
  }
}
