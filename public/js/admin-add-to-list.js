(() => {
  const app = {
    init() {
      this.cacheElements();
      this.listenForRemoveVideoFromList();
      this.listenForAddVideoToList();
    },
    cacheElements() {
      // modal
      this.$modal = document.getElementById('modal');
      this.$modalTitle = document.getElementById('modal-title');
      this.$modalBody = document.getElementById('modal-body');
      // Edit playlist: hidden input with csv of video ids
      this.$inputVideos = document.getElementById('videos');
      this.$videoList = document.getElementById('video-list');
      this.$inputAddVideo = document.getElementById('input-add-video');
      this.$btnAddVideo = document.getElementById('btn-add-video');
    },
    listenForRemoveVideoFromList() {
      const buttons = document.querySelectorAll('.btn-delete-from-list');
      for (const btn of buttons) {
        btn.addEventListener('click', (e) => {
          const parent = e.currentTarget.parentElement;
          const videoId = e.currentTarget.dataset.videoId;
          // Update form: remove videoId from value of hidden input 'videos'
          const newIds = this.$inputVideos.value
            .split(',')
            .filter((id) => id !== videoId)
            .join(',');
          this.$inputVideos.value = newIds;
          // Update UI: remove video from list
          parent.remove();
        });
      }
    },
    listenForAddVideoToList() {
      this.$btnAddVideo.addEventListener('click', (e) => {
        const videoName = this.$inputAddVideo.value;
        let videoId;
        for (const item of videoName.split('|')) {
          if (item.includes('id: ')) videoId = item.split(':')[1].trim();
        }
        if (!videoId) {
          this.$inputAddVideo.value = '';
          return;
        }
        // Update form: add videoId to value of hidden input 'videos'
        const inputVal = this.$inputVideos.value;
        if (inputVal === '') this.$inputVideos.value = videoId;
        else {
          const ids = inputVal.split(',');
          ids.push(videoId);
          this.$inputVideos.value = ids.join(',');
        }
        // Update UI: add video to list
        this.$videoList.innerHTML += this.renderVideoList(videoId, videoName);
        this.listenForRemoveVideoFromList();
        this.$inputAddVideo.value = '';
        // Update UI: remove video from datalist
        document.querySelector(`[value="${videoName}"]`).remove();
      });
    },
    renderVideoList(id, name) {
      return `
        <li class="list-group-item px-2 py-1">
          ${name}
          <i class="fa-regular fa-trash-can hover float-end pt-1 btn-delete-from-list" 
             role="button" data-video-id="${id}"></i>
        </li>`;
    },
  };
  app.init();
})();
