import { Component, effect, input, model, signal } from '@angular/core';

@Component({
  selector: 'app-info-overlay',
  imports: [],
  templateUrl: './info-overlay.html',
  styleUrl: './info-overlay.scss',
})
export class InfoOverlay {
  isOverlayActive = signal(false);
  showOverlay = model<boolean>(false);
  overlayMessage = input<string>('');

  readonly TIME_SHOW_OVERLAY_TOTAL = 1300;
  readonly TIME_SHOW_OVERLAY_FADE = 300;

  /**
   * This constructor sets up an effect that manages the visibility of the overlay based on the showOverlay and overlayMessage signals.
   * It ensures that the overlay is displayed for a specified duration and then fades out smoothly. The effect also handles cleanup of timers to prevent memory leaks.
   * The overlay will only be active if both showOverlay is true and overlayMessage is not empty.
   * If showOverlay becomes false, it will wait for the fade duration before setting isOverlayActive to false, allowing for a smooth transition.
   * If showOverlay is true and overlayMessage is set, it will display the overlay and automatically hide it after the total duration minus the fade time.
   * @param onCleanup - A callback function that allows for cleanup of resources when the effect is disposed of.
   */
  constructor() {
    effect((onCleanup) => {
      if (!this.showOverlay() || !this.overlayMessage()) {
        if (!this.showOverlay()) {
          const hideTimer = window.setTimeout(() => {
            this.isOverlayActive.set(false);
          }, this.TIME_SHOW_OVERLAY_FADE);

          onCleanup(() => window.clearTimeout(hideTimer));
        }

        return;
      }

      this.isOverlayActive.set(true);

      const closeTimer = window.setTimeout(() => {
        this.showOverlay.set(false);
      }, this.TIME_SHOW_OVERLAY_TOTAL - this.TIME_SHOW_OVERLAY_FADE);

      onCleanup(() => window.clearTimeout(closeTimer));
    });
  }

  /**
   * This function opens an overlay message with a specific message based on the provided index. It sets the overlayMessage signal to the corresponding
   * message from the overlayMessageText array and shows the overlay for a specified duration before hiding it again.
   * @param messageIndex - The index of the message to be displayed in the overlay. It should correspond to an entry in the overlayMessageText array.
  */
  async openOverlay() {
    if (!this.overlayMessage()) return;

    this.isOverlayActive.set(true);
    this.showOverlay.set(true);
  }

  /**
  * This function closes the overlay message by setting the showOverlay signal to false, making the overlay invisible to the user.
  * It is typically called when the user interacts with the overlay's close button or when the overlay needs to be dismissed programmatically.
  */
  closeOverlay() {
    this.showOverlay.set(false);
  }
}
