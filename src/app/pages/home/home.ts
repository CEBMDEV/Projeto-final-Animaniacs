import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit, AfterViewInit {
  @ViewChild('captureBtn', { static: false }) captureBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('videoInput', { static: false }) videoInput!: ElementRef<HTMLInputElement>;
  @ViewChild('result', { static: false }) result!: ElementRef<HTMLDivElement>;
  @ViewChild('frameCarousel', { static: false }) frameCarousel!: ElementRef<HTMLDivElement>;

  private video: HTMLVideoElement | null = null;
  private captureInProgress: boolean = false;
  private frames: string[] = [];
  private currentFrameIndex: number = 0;

  constructor() { }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.setupEventListeners();

    // Botões de navegação na tela principal
    const prevBtn = document.getElementById('prev-frame');
    const nextBtn = document.getElementById('next-frame');

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => this.showFrame(this.currentFrameIndex - 1));
      nextBtn.addEventListener('click', () => this.showFrame(this.currentFrameIndex + 1));
    }

    // Modal fullscreen e seus controles
    const openGalleryBtn = document.getElementById('open-gallery');
    const fullscreenModal = document.getElementById('fullscreen-modal');
    const fullscreenImage = document.getElementById('fullscreen-image');
    const closeModalBtn = document.getElementById('close-modal');
    const fullscreenPrevBtn = document.getElementById('fullscreen-prev');
    const fullscreenNextBtn = document.getElementById('fullscreen-next');

    if (openGalleryBtn && fullscreenModal && fullscreenImage && closeModalBtn && fullscreenPrevBtn && fullscreenNextBtn) {
      openGalleryBtn.addEventListener('click', () => {
        if (this.frames.length === 0) return;
        fullscreenImage.setAttribute('src', this.frames[this.currentFrameIndex]);
        fullscreenModal.style.display = 'flex';
      });

      closeModalBtn.addEventListener('click', () => {
        fullscreenModal.style.display = 'none';
        fullscreenImage.setAttribute('src', '');
      });

      // Fechar modal clicando fora da imagem
      fullscreenModal.addEventListener('click', (event) => {
        if (event.target === fullscreenModal) {
          fullscreenModal.style.display = 'none';
          fullscreenImage.setAttribute('src', '');
        }
      });

      fullscreenPrevBtn.addEventListener('click', () => {
        this.currentFrameIndex--;
        if (this.currentFrameIndex < 0) this.currentFrameIndex = this.frames.length - 1;
        fullscreenImage.setAttribute('src', this.frames[this.currentFrameIndex]);
        this.showFrame(this.currentFrameIndex);  // Atualiza o preview normal
      });

      fullscreenNextBtn.addEventListener('click', () => {
        this.currentFrameIndex++;
        if (this.currentFrameIndex >= this.frames.length) this.currentFrameIndex = 0;
        fullscreenImage.setAttribute('src', this.frames[this.currentFrameIndex]);
        this.showFrame(this.currentFrameIndex);  // Atualiza o preview normal
      });
    }
  }

  private setupEventListeners(): void {
    this.videoInput.nativeElement.addEventListener('change', (e: Event) => {
      this.onVideoInputChange(e);
    });

    this.captureBtn.nativeElement.addEventListener('click', async () => {
      await this.onCaptureClick();
    });
  }

  private onVideoInputChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const url: string = URL.createObjectURL(file);
    this.video = document.createElement('video');
    this.video.src = url;
    this.video.preload = "auto";
    this.video.muted = true;
    this.video.crossOrigin = "anonymous";
    this.video.setAttribute("playsinline", "");

    this.clearPreviousData();
  }

  private async onCaptureClick(): Promise<void> {
    if (!this.video) {
      alert("Carregue um vídeo primeiro!");
      return;
    }

    if (this.captureInProgress) {
      alert("Captura em andamento...");
      return;
    }

    this.captureInProgress = true;
    this.clearPreviousData();

    const canvas: HTMLCanvasElement = document.createElement("canvas");
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    canvas.width = this.video.videoWidth;
    canvas.height = this.video.videoHeight;
    this.video.pause();

    const frameRate: number = 10;
    const duration: number = this.video.duration;
    let currentTime: number = 0;

    while (currentTime < duration) {
      const frame: string = await this.captureFrame(currentTime);
      this.frames.push(frame);
      currentTime += 1 / frameRate;
    }

    // Limpa o carrossel (não mostra miniaturas)
    this.frameCarousel.nativeElement.innerHTML = "";

    // Mostra o primeiro frame no resultado
    this.showFrame(0);

    this.captureInProgress = false;
  }

  private clearPreviousData(): void {
    this.frameCarousel.nativeElement.innerHTML = "";
    this.result.nativeElement.innerHTML = "";
    this.frames = [];
    this.currentFrameIndex = 0;
  }

  private async captureFrame(time: number): Promise<string> {
    return new Promise((resolve) => {
      if (!this.video) return;
      this.video.currentTime = time;

      this.video.onseeked = () => {
        const canvas: HTMLCanvasElement = document.createElement("canvas");
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        canvas.width = this.video!.videoWidth;
        canvas.height = this.video!.videoHeight;
        ctx.drawImage(this.video!, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/png"));
      };
    });
  }

  private showFrame(index: number): void {
    if (this.frames.length === 0) return;

    if (index < 0) index = this.frames.length - 1;
    if (index >= this.frames.length) index = 0;
    this.currentFrameIndex = index;

    this.result.nativeElement.innerHTML = `<img src="${this.frames[index]}" class="w-100" alt="Frame selecionado" style="max-height: 80vh; object-fit: contain;" />`;
  }
}
