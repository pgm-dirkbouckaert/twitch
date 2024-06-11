(() => {
  const app = {
    init() {
      this.cacheElements();
      this.getSearchQuery();
      this.listenForWatchVideo();
    },
    cacheElements() {
      this.$modal = document.getElementById('modal');
      this.$modalTitle = document.getElementById('modal-title');
      this.$modalBody = document.getElementById('modal-body');
    },
    getSearchQuery() {
      const params = new URLSearchParams(window.location.search);
      const videoId = params.get('v');
      if (videoId) {
        const $target = document.getElementById(videoId);
        $target.scrollIntoView({ behavior: 'smooth' });
        $target.firstElementChild.classList.add('focus');
        setTimeout(() => {
          $target.firstElementChild.classList.remove('focus');
        }, 1000);
      }
    },
    listenForWatchVideo() {
      const links = document.querySelectorAll('.watch-video');
      for (const link of links) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const youtubeId = e.currentTarget.dataset.youtubeId;
          const title = e.currentTarget.dataset.title;
          const teacher = e.currentTarget.dataset.teacher;
          const teacherId = e.currentTarget.dataset.teacherId;
          this.$modalTitle.innerHTML = this.renderModalTitle(
            title,
            teacher,
            teacherId
          );
          this.$modalBody.innerHTML = this.renderModalBody(youtubeId);
          const modal = new bootstrap.Modal(this.$modal);
          modal.show();
          this.$modal.addEventListener('hidden.bs.modal', (event) => {
            this.$modalTitle.innerHTML = '';
            this.$modalBody.innerHTML = '';
          });
        });
      }
    },
    renderModalTitle(title, teacher, teacherId) {
      return `${title}<br><small>By <a href="/teachers/${teacherId}">${teacher}</a></small>`;
    },
    renderModalBody(youtubeId) {
      return `
        <div class="iframe-container">
          <iframe width="560" height="315"
          src="https://www.youtube.com/embed/${youtubeId}" 
          frameborder="0" allowfullscreen>
          </iframe>
        </div`;
    },
  };
  app.init();
})();
