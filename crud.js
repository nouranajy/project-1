/* crud.js — pink petals CRUD app
   Storage: localStorage key "pinkPetals"
   Model:   { id, name, color, price, desc, createdAt }
*/
$(function () {

  const STORAGE_KEY = 'pinkPetals';

  /* ---------- STATE ---------- */
  let petals = [];         // full dataset
  let editingId = null;    // null = create mode
  let searchTerm = '';
  let sortMode = 'newest';

  /* ---------- STORAGE HELPERS ---------- */
  function loadPetals() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      petals = raw ? JSON.parse(raw) : [];
    } catch (e) {
      petals = [];
    }
  }
  function savePetals() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(petals));
  }

  /* ---------- UTILS ---------- */
  function uid() {
    return 'p_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
  }
  function money(n) {
    return '€' + Number(n).toFixed(2);
  }
  function toast(msg) {
    $('#toastMsg').text(msg);
    const t = bootstrap.Toast.getOrCreateInstance(document.getElementById('appToast'));
    t.show();
  }

  /* ---------- FORM: reset / fill / mode switch ---------- */
  function resetForm() {
    editingId = null;
    $('#petalForm')[0].reset();
    $('#petalForm').removeClass('was-validated');
    $('#petalId').val('');
    $('#formTitle').text('Add a petal');
    $('#submitBtn').text('Save petal 🌷');
    $('#cancelEdit').addClass('d-none');
  }

  function enterEditMode(petal) {
    editingId = petal.id;
    $('#petalId').val(petal.id);
    $('#petalName').val(petal.name);
    $('#petalColor').val(petal.color);
    $('#petalPrice').val(petal.price);
    $('#petalDesc').val(petal.desc || '');
    $('#formTitle').text('Edit petal ✏️');
    $('#submitBtn').text('Update petal 💾');
    $('#cancelEdit').removeClass('d-none');
    $('html, body').animate({ scrollTop: 0 }, 250);
    $('#petalName').trigger('focus');
  }

  /* ---------- FILTER + SORT ---------- */
  function getVisiblePetals() {
    let list = petals.slice();

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.color || '').toLowerCase().includes(q) ||
        (p.desc  || '').toLowerCase().includes(q)
      );
    }

    switch (sortMode) {
      case 'oldest':     list.sort((a, b) => a.createdAt - b.createdAt); break;
      case 'name-asc':   list.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc':  list.sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'newest':
      default:           list.sort((a, b) => b.createdAt - a.createdAt); break;
    }
    return list;
  }

  /* ---------- RENDER TABLE ---------- */
  function renderTable() {
    const $body = $('#petalTableBody').empty();
    const list = getVisiblePetals();

    $('#countBadge').text(list.length + (list.length === 1 ? ' item' : ' items'));

    if (list.length === 0) {
      $('#emptyState').show();
      return;
    }
    $('#emptyState').hide();

    list.forEach((p, i) => {
      const $tr = $(`
        <tr data-id="${p.id}">
          <td>${i + 1}</td>
          <td class="fw-semibold">${escapeHtml(p.name)}</td>
          <td><span class="badge rounded-pill" style="background:#ff8da1;">${escapeHtml(p.color)}</span></td>
          <td>${money(p.price)}</td>
          <td class="text-truncate" style="max-width:240px;" title="${escapeHtml(p.desc || '')}">
            ${escapeHtml(p.desc || '—')}
          </td>
          <td class="text-end">
            <button class="btn btn-sm rounded-pill edit-btn me-1"
                    style="background:#ffe4e9; color:#8a2e4a; border:1px solid #ffb6c1;">
              Edit
            </button>
            <button class="btn btn-sm rounded-pill delete-btn"
                    style="background:#ffd9e2; color:#6b2d44; border:1px solid #ff97b0;">
              Delete
            </button>
          </td>
        </tr>
      `);
      $tr.hide().appendTo($body).fadeIn(180);
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  /* ---------- VALIDATION ---------- */
  function validateForm() {
    const nameOk  = $('#petalName').val().trim().length > 0;
    const priceV  = parseFloat($('#petalPrice').val());
    const priceOk = !isNaN(priceV) && priceV >= 0;

    $('#petalName').toggleClass('is-invalid', !nameOk);
    $('#petalPrice').toggleClass('is-invalid', !priceOk);

    return nameOk && priceOk;
  }

  /* ---------- CREATE / UPDATE ---------- */
  $('#petalForm').on('submit', function (e) {
    e.preventDefault();
    $('#petalForm').addClass('was-validated');
    if (!validateForm()) return;

    const data = {
      name:  $('#petalName').val().trim(),
      color: $('#petalColor').val(),
      price: parseFloat($('#petalPrice').val()),
      desc:  $('#petalDesc').val().trim()
    };

    if (editingId) {
      // UPDATE
      const idx = petals.findIndex(p => p.id === editingId);
      if (idx > -1) {
        petals[idx] = { ...petals[idx], ...data };
        toast('Petal updated ✏️');
      }
    } else {
      // CREATE
      petals.push({ id: uid(), createdAt: Date.now(), ...data });
      toast('Petal added 🌷');
    }

    savePetals();
    resetForm();
    renderTable();
  });

  $('#cancelEdit').on('click', function () {
    resetForm();
  });

  /* ---------- READ (edit / delete actions — delegated) ---------- */
  $('#petalTableBody').on('click', '.edit-btn', function () {
    const id = $(this).closest('tr').data('id');
    const petal = petals.find(p => p.id === id);
    if (petal) enterEditMode(petal);
  });

  $('#petalTableBody').on('click', '.delete-btn', function () {
    const $tr = $(this).closest('tr');
    const id  = $tr.data('id');
    const petal = petals.find(p => p.id === id);
    if (!petal) return;
    if (!confirm(`Delete "${petal.name}"?`)) return;

    petals = petals.filter(p => p.id !== id);
    savePetals();
    $tr.fadeOut(180, function () {
      $(this).remove();
      renderTable();
      toast('Petal deleted 🗑️');
    });
  });

  /* ---------- SEARCH + SORT ---------- */
  $('#searchInput').on('input', function () {
    searchTerm = $(this).val();
    renderTable();
  });

  $('#sortSelect').on('change', function () {
    sortMode = $(this).val();
    renderTable();
  });

  /* ---------- SEED / CLEAR ---------- */
  $('#seedBtn').on('click', function () {
    const demo = [
      { name: 'Rose blush',     color: 'Blush',   price: 12.5, desc: 'Soft sunrise petals' },
      { name: 'Coral whisper',  color: 'Coral',   price: 9.9,  desc: 'Beach-walk pink' },
      { name: 'Fuchsia flame',  color: 'Fuchsia', price: 18.0, desc: 'Bold and bright' },
      { name: 'Magenta muse',   color: 'Magenta', price: 22.0, desc: 'Evening glow' },
      { name: 'Petal dream',    color: 'Rose',    price: 7.5,  desc: 'Gentle everyday' }
    ];
    demo.forEach(d => petals.push({ id: uid(), createdAt: Date.now(), ...d }));
    savePetals();
    renderTable();
    toast('Demo petals seeded 🌱');
  });

  $('#clearAllBtn').on('click', function () {
    if (petals.length === 0) return toast('Nothing to clear.');
    if (!confirm('Delete ALL petals? This cannot be undone.')) return;
    petals = [];
    savePetals();
    renderTable();
    toast('All petals removed 🧹');
  });

  /* ---------- INIT ---------- */
  loadPetals();
  renderTable();
});