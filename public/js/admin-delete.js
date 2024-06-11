(() => {
  const app = {
    init() {
      this.cacheElements();
      this.listenForDeleteItem();
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
    listenForDeleteItem() {
      const buttons = document.querySelectorAll('.btn-delete');
      for (const btn of buttons) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const { currentPage } = e.currentTarget.dataset;
          const { action } = e.currentTarget.dataset;
          const { id } = e.currentTarget.dataset;
          const { name } = e.currentTarget.dataset;
          const { username } = e.currentTarget.dataset;
          this.$modalTitle.innerHTML = this.renderModalTitle();
          this.$modalBody.innerHTML = this.renderModalBody(
            action,
            id,
            name,
            username,
            currentPage
          );
          const modal = new bootstrap.Modal(this.$modal);
          modal.show();
          this.$modal.addEventListener('hidden.bs.modal', (event) => {
            this.$modalTitle.innerHTML = '';
            this.$modalBody.innerHTML = '';
          });
        });
      }
    },
    renderModalTitle() {
      return `Delete item`;
    },
    renderModalBody(action, id, name, username, currentPage) {
      return `
        <form action="/admin/${action}?_method=DELETE" method="post">
          <input type="hidden" name="id" value="${id}" />
          <input type="hidden" name="currentPage" value="${currentPage}" />
          <p>
            Are you sure you want to delete this ${action.slice(
              0,
              action.length - 1
            )}?
            ${
              action === 'topics' ? '<br>This will also delete all videos.' : ''
            }
          </p>
       
          <ul>
            <li>ID: ${id}</li>
            ${
              username
                ? `<li>Username: ${username}</li>`
                : `<li>Title: ${name}</li>`
            }
          </ul>
          <button type="button" class="btn btn-outline-secondary float-end" data-bs-dismiss="modal">Cancel</button>
          <button type="submit" class="btn btn-danger float-end me-2">Delete</button>
        </form`;
    },
  };
  app.init();
})();
