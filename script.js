let items = JSON.parse(localStorage.getItem("coupleList")) || [];
let photos = JSON.parse(localStorage.getItem("ourPhotos")) || [];

// === Save Helpers ===
function saveItems() {
  localStorage.setItem("coupleList", JSON.stringify(items));
}

function savePhotos() {
  localStorage.setItem("ourPhotos", JSON.stringify(photos));
}

// === Render Items ===
function render(filter = "all") {
  const list = document.getElementById("list");
  list.innerHTML = "";
  items
    .filter(i => filter === "all" || i.category === filter)
    .forEach((item, index) => {
      let li = document.createElement("li");

      if (item.category === "song" && item.file) {
        // Song entry with audio player
        li.innerHTML = `
          <span>${item.emoji} ${item.text}</span>
          <audio controls src="${item.file}"></audio>
          <button onclick="deleteItem(${index})">❌</button>
        `;
      } else {
        // Normal entry
        li.innerHTML = `
          <span>${item.emoji} ${item.text}</span>
          <button onclick="deleteItem(${index})">❌</button>
        `;
      }

      list.appendChild(li);
    });
}

// === Add Item ===
function addItem() {
  const text = document.getElementById("item").value.trim();
  const category = document.getElementById("category").value;
  const songFileInput = document.getElementById("songFile");

  if (category === "song" && songFileInput.files.length > 0) {
    const file = songFileInput.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
      let emoji = "🎶";
      items.push({ text: text || file.name, category, emoji, file: e.target.result });
      saveItems();
      render();
      resetInputs();
    };
    reader.readAsDataURL(file);
  } else {
    if (text === "") return;
    let emoji = category === "date" ? "🌸" : category === "wishlist" ? "🎁" : "🎶";
    items.push({ text, category, emoji });
    saveItems();
    render();
    resetInputs();
  }
}

function resetInputs() {
  document.getElementById("item").value = "";
  document.getElementById("songFile").value = "";
}

function deleteItem(index) {
  items.splice(index, 1);
  saveItems();
  render();
}

function filterItems(type) {
  render(type);
}

function toggleSongUpload() {
  const category = document.getElementById("category").value;
  const songFileInput = document.getElementById("songFile");
  songFileInput.style.display = category === "song" ? "block" : "none";
}

// === Photo Upload / Gallery ===
function uploadPhotos() {
  const fileInput = document.getElementById("photoUpload");
  if (fileInput.files.length > 0) {
    Array.from(fileInput.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = function(e) {
        photos.push(e.target.result);
        savePhotos();
        renderGallery();
      };
      reader.readAsDataURL(file);
    });
    fileInput.value = "";
  }
}

function renderGallery() {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";
  photos.forEach((src, index) => {
    let img = document.createElement("img");
    img.src = src;
    img.onclick = () => deletePhoto(index);
    gallery.appendChild(img);
  });
}

function deletePhoto(index) {
  if (confirm("Delete this picture?")) {
    photos.splice(index, 1);
    savePhotos();
    renderGallery();
  }
}

// === Init ===
render();
renderGallery();

