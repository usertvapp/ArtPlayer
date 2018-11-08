import { append, getStorage, clamp, tooltip, setStyle } from '../utils';
import icons from '../icons';

export default class Volume {
  constructor(option) {
    this.option = option;
    this.isDroging = false;
  }

  apply(art, $control) {
    this.art = art;
    this.$control = $control;
    this.init();
  }

  init() {
    const { events: { proxy }, player, i18n } = this.art;
    this.$volume = append(this.$control, icons.volume);
    this.$volumeClose = append(this.$control, icons.volumeClose);
    this.$volumePanel = append(this.$control, '<div class="art-volume-panel"></div>');
    this.$volumeHandle = append(this.$volumePanel, '<div class="art-volume-slider-handle"></div>');
    tooltip(this.$volume, i18n.get('Mute'));
    setStyle(this.$volumeClose, 'display', 'none');

    const volume = getStorage('volume');
    this.setVolumeHandle(volume);
    player.volume(volume);

    proxy(this.$volume, 'click', () => {
      setStyle(this.$volume, 'display', 'none');
      setStyle(this.$volumeClose, 'display', 'block');
      player.volume(0);
    });

    proxy(this.$volumeClose, 'click', () => {
      setStyle(this.$volume, 'display', 'block');
      setStyle(this.$volumeClose, 'display', 'none');
      player.volume(getStorage('volume'));
    });

    proxy(this.$control, 'mouseenter', () => {
      this.$volumePanel.classList.add('art-volume-panel-hover');

      // TODO
      setTimeout(() => {
        this.setVolumeHandle(player.volume());
      }, 200);
    });

    proxy(this.$control, 'mouseleave', () => {
      this.$volumePanel.classList.remove('art-volume-panel-hover');
    });

    proxy(this.$volumePanel, 'click', event => {
      this.volumeChangeFromEvent(event);
    });

    proxy(this.$volumeHandle, 'mousedown', () => {
      this.isDroging = true;
    });

    proxy(this.$volumeHandle, 'mousemove', event => {
      if (this.isDroging) {
        this.volumeChangeFromEvent(event);
      }
    });

    proxy(document, 'mouseup', () => {
      if (this.isDroging) {
        this.isDroging = false;
      }
    });

    this.art.on('video:volumechange', () => {
      const percentage = player.volume();
      this.setVolumeHandle(percentage);
      if (percentage === 0) {
        setStyle(this.$volume, 'display', 'none');
        setStyle(this.$volumeClose, 'display', 'block');
      } else {
        setStyle(this.$volume, 'display', 'block');
        setStyle(this.$volumeClose, 'display', 'none');
      }
    });
  }

  volumeChangeFromEvent(event) {
    const { player } = this.art;
    const { left: panelLeft, width: panelWidth } = this.$volumePanel.getBoundingClientRect();
    const { width: handleWidth } = this.$volumeHandle.getBoundingClientRect();
    const percentage = clamp(event.x - panelLeft - handleWidth / 2, 0, panelWidth - handleWidth / 2) / (panelWidth - handleWidth);
    player.volume(percentage);
  }

  setVolumeHandle(percentage = 0.7) {
    const { width: panelWidth } = this.$volumePanel.getBoundingClientRect();
    const { width: handleWidth } = this.$volumeHandle.getBoundingClientRect();
    const width = handleWidth / 2 + (panelWidth - handleWidth) * percentage - handleWidth / 2;
    setStyle(this.$volumeHandle, 'left', `${width}px`);
  }
}