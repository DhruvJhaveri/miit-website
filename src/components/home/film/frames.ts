/**
 * Progressive loader for a numbered frame sequence.
 *
 * Frames load in strided passes (0, every 16th, every 8th, … every frame) so the
 * whole film is scrubbable at coarse resolution within a few requests, then fills
 * in. While a frame is missing, the nearest loaded frame is drawn instead, so the
 * canvas never shows a blank frame.
 */
export function loadOrder(count: number, strides = [16, 8, 4, 2, 1]): number[] {
  const seen = new Set<number>();
  const order: number[] = [];
  const push = (i: number) => {
    if (i >= 0 && i < count && !seen.has(i)) {
      seen.add(i);
      order.push(i);
    }
  };
  push(0);
  push(count - 1);
  for (const s of strides) for (let i = 0; i < count; i += s) push(i);
  return order;
}

export function nearestLoaded(target: number, loaded: ArrayLike<unknown>): number {
  const n = loaded.length;
  if (loaded[target]) return target;
  for (let d = 1; d < n; d++) {
    if (target - d >= 0 && loaded[target - d]) return target - d;
    if (target + d < n && loaded[target + d]) return target + d;
  }
  return -1;
}

export interface FrameSet {
  frames: number;
  width: number;
  height: number;
  ext: string;
  base: string;
}

export class FrameSequence {
  readonly images: (HTMLImageElement | null)[];
  private aborted = false;
  failures = 0;

  constructor(
    readonly set: FrameSet,
    private onLoad: (index: number) => void,
  ) {
    this.images = new Array(set.frames).fill(null);
  }

  url(i: number) {
    return `${this.set.base}/${String(i).padStart(4, "0")}.${this.set.ext}`;
  }

  loaded = 0;

  async start(concurrency = 6) {
    const queue = loadOrder(this.set.frames);
    const worker = async () => {
      while (queue.length && !this.aborted) {
        // circuit breaker: if the first requests all fail, stop and keep the poster
        if (this.loaded === 0 && this.failures >= concurrency) return;
        const i = queue.shift()!;
        try {
          const img = new Image();
          img.decoding = "async";
          img.src = this.url(i);
          await img.decode();
          if (this.aborted) return;
          this.images[i] = img;
          this.loaded++;
          this.onLoad(i);
        } catch {
          this.failures++;
        }
      }
    };
    await Promise.all(Array.from({ length: concurrency }, worker));
  }

  /** Returns the requested frame, or the nearest loaded one. */
  get(i: number) {
    const k = nearestLoaded(i, this.images);
    return k >= 0 ? this.images[k] : null;
  }

  abort() {
    this.aborted = true;
  }
}

/** Draws an image into the canvas using object-fit: cover semantics. */
export function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, cw: number, ch: number, focusX = 0.5) {
  const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  ctx.drawImage(img, (cw - w) * focusX, (ch - h) / 2, w, h);
}
