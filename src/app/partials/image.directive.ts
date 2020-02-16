import {
  Directive, Attribute, Renderer2,
  ElementRef, Input,
  AfterContentInit, OnDestroy, OnChanges
} from '@angular/core'

@Directive({
  selector: '[appImage]'
})
export class ImageDirective implements AfterContentInit, OnDestroy {

  private errorImage = 'https://static.sinfo.org/static/25-sinfo/speakers/hacky.png'
  private loadingImage = 'assets/img/logos/loading.gif'

  private nativeElement: HTMLElement
  private cancelOnError: Function
  private cancelOnLoad: Function

  private original: string
  private current: string

  @Input('src')
  set src(value: string) {
    if (this.original === undefined || this.original !== value) {
      this.original = value
      this.current = value
    }

    this.load()
  }

  constructor(
    @Attribute('loader') public loader: string,
    @Attribute('onErrorSrc') public onErrorSrc: string,
    private renderer: Renderer2,
    private el: ElementRef) {
    this.renderer.setAttribute(this.el.nativeElement, 'src', this.loadingImage)
  }

  ngAfterContentInit() {
    this.load()
  }

  load() {
    this.nativeElement = this.el.nativeElement
    this.onError = this.onError.bind(this)
    this.onLoad = this.onLoad.bind(this)
    this.cancelOnError = this.renderer.listen(this.nativeElement, 'error', this.onError)
    this.cancelOnLoad = this.renderer.listen(this.nativeElement, 'load', this.onLoad)
  }

  onLoad() {
    this.removeOnLoadEvent()
    this.renderer.setAttribute(this.nativeElement, 'src', this.current)
  }

  onError() {
    let src = this.nativeElement.getAttribute('src')

    if (src.includes('.webp')) {
      this.current = src.replace('.webp', '.png')
      this.renderer.setAttribute(this.nativeElement, 'src', this.current)
    } else if (src !== this.errorImage) {
      this.renderer.setAttribute(this.nativeElement, 'src', this.errorImage)
      this.current = this.errorImage
    } else {
      this.removeOnLoadEvent()
    }
  }

  private removeErrorEvent() {
    if (this.cancelOnError) {
      this.cancelOnError()
    }
  }

  private removeOnLoadEvent() {
    if (this.cancelOnLoad) {
      this.cancelOnLoad()
    }
  }

  ngOnDestroy() {
    this.removeErrorEvent()
    this.removeOnLoadEvent()
  }
}
