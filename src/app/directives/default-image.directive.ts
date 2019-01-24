import {AfterViewInit, Directive, ElementRef, Input, OnChanges, Renderer, SimpleChanges} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {ConfigService} from '../services/config.service';

@Directive({
  selector: 'img[onImageLoadFail]',
  providers: [ConfigService],
  host: {
    '(error)': 'updateUrl($event)',
    '[src]': 'src'
  }
})
export class DefaultImage implements AfterViewInit, OnChanges {
  @Input() src;
  @Input() onImageLoadFail: string;
  @Input() onParent = false;
  tried = false;

  constructor(private sanitizer: DomSanitizer, private configService: ConfigService, private renderer: Renderer, private elemRef: ElementRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['src']) {
      this.tried = false;
    }
    this.setImage();
  }

  ngAfterViewInit(): void {
    this.setImage();
  }

  public setImage(): void {
    if (this.onParent) {
      if (this.src !== undefined) {
        this.renderer.setElementStyle(this.elemRef.nativeElement.parentElement, 'backgroundImage', 'url(' + this.src + ')');
      }
      this.renderer.setElementStyle(this.elemRef.nativeElement, 'display', 'none');
    }
  }

  public updateUrl(event: any): void {
    if (!this.tried) {
      if (this.onImageLoadFail == null || this.onImageLoadFail === '') {
        this.onImageLoadFail = this.configService.get('buddy', 'ERROR_IMAGE');
      }
      this.src = this.sanitizer.bypassSecurityTrustUrl(this.onImageLoadFail);
      if (this.onParent) {
        this.renderer.setElementStyle(this.elemRef.nativeElement.parentElement, 'backgroundImage', 'url(' + this.onImageLoadFail + ')');
        this.renderer.setElementStyle(this.elemRef.nativeElement, 'display', 'none');
      }
      this.tried = true;
    }
    if (event.type === 'error') {
      this.src = this.sanitizer.bypassSecurityTrustUrl(this.onImageLoadFail);
      if (this.onParent) {
        this.renderer.setElementStyle(this.elemRef.nativeElement.parentElement, 'backgroundImage', 'url(' + this.onImageLoadFail + ')');
        this.renderer.setElementStyle(this.elemRef.nativeElement, 'display', 'none');
      }
    }
  }
}
