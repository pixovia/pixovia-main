// Supabase Configuration
const SUPABASE_URL = 'https://jyzlkuihyujfucaxuaql.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5emxrdWloeXVqZnVjYXh1YXFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3OTIxOTMsImV4cCI6MjA4MzM2ODE5M30.Xqr0m8gUMZOt9Qwm-Xom6T5JnnRqIoFqoWBDOnEZ0Hc';

// Initialize Supabase (only if not already initialized)
if (typeof window.supabaseFiles === 'undefined') {
    window.supabaseFiles = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
const supabaseFiles = window.supabaseFiles;

// DOM Elements
const filesGrid = document.getElementById('filesGrid');
const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const uploadModal = document.getElementById('uploadModal');
const uploadBtn = document.getElementById('uploadBtn');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const uploadForm = document.getElementById('uploadForm');

// State
let allFiles = [];
let filteredFiles = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadFiles();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    if (uploadBtn) uploadBtn.addEventListener('click', () => openModal());
    if (closeModal) closeModal.addEventListener('click', () => closeModalFunc());
    if (cancelBtn) cancelBtn.addEventListener('click', () => closeModalFunc());
    if (uploadForm) uploadForm.addEventListener('submit', handleUpload);
    if (searchInput) searchInput.addEventListener('input', handleSearch);
    if (sortSelect) sortSelect.addEventListener('change', handleSort);
    
    // Close modal on outside click
    if (uploadModal) {
        uploadModal.addEventListener('click', (e) => {
            if (e.target === uploadModal) closeModalFunc();
        });
    }
}

// Load Files
async function loadFiles() {
    try {
        showLoading();
        
        const { data: files, error } = await supabaseFiles
            .from('files')
            .select(`
                *,
                authors (
                    id,
                    name,
                    email,
                    avatar_url,
                    bio
                )
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        allFiles = files || [];
        filteredFiles = [...allFiles];
        renderFiles();
    } catch (error) {
        console.error('Error loading files:', error);
        showError('Failed to load files. Please refresh the page.');
    } finally {
        hideLoading();
    }
}

// Render Files
function renderFiles() {
    if (!filesGrid) return;

    if (filteredFiles.length === 0) {
        filesGrid.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    filesGrid.innerHTML = filteredFiles.map(file => createFileCard(file)).join('');
    
    // Add click handlers
    document.querySelectorAll('.file-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const fileId = card.dataset.fileId;
            window.location.href = `detail.html?id=${fileId}`;
        });
    });
}

// Create File Card
function createFileCard(file) {
    const author = file.authors || {};
    const authorName = author.name || 'Unknown';
    const authorInitials = getInitials(authorName);
    const thumbnail = file.thumbnail_url || file.file_url;
    const description = file.description || 'No description available.';
    const views = file.views_count || 0;
    const likes = file.likes_count || 0;
    const createdAt = formatDate(file.created_at);

    return `
        <div class="file-card" data-file-id="${file.id}">
            <img src="${thumbnail}" alt="${file.title}" class="file-card-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23f3f4f6%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%239ca3af%22%3ENo Image%3C/text%3E%3C/svg%3E'">
            <div class="file-card-content">
                <h3 class="file-card-title">${escapeHtml(file.title)}</h3>
                <p class="file-card-description">${escapeHtml(description)}</p>
                <div class="file-card-footer">
                    <div class="file-card-author">
                        ${author.avatar_url 
                            ? `<img src="${author.avatar_url}" alt="${authorName}" class="author-avatar-small" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`
                            : ''
                        }
                        <div class="author-initials-small" style="${author.avatar_url ? 'display: none;' : ''}">${authorInitials}</div>
                        <span>${escapeHtml(authorName)}</span>
                    </div>
                    <div>
                        <span>👁️ ${views}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Handle Upload
async function handleUpload(e) {
    e.preventDefault();
    
    const title = document.getElementById('fileTitle').value.trim();
    const description = document.getElementById('fileDescription').value.trim();
    const fileUrl = document.getElementById('fileUrl').value.trim();
    const thumbnailUrl = document.getElementById('thumbnailUrl').value.trim();
    const authorName = document.getElementById('authorName').value.trim();
    const authorEmail = document.getElementById('authorEmail').value.trim();
    const tagsInput = document.getElementById('fileTags').value.trim();

    if (!title || !fileUrl || !authorName) {
        alert('Please fill in all required fields.');
        return;
    }

    try {
        // Get or create author
        let authorId = await getOrCreateAuthor(authorName, authorEmail);

        // Parse tags
        const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];

        // Detect file type
        const fileType = detectFileType(fileUrl);

        // Insert file
        const { data: file, error } = await supabaseFiles
            .from('files')
            .insert([
                {
                    title,
                    description: description || null,
                    file_url: fileUrl,
                    thumbnail_url: thumbnailUrl || fileUrl,
                    author_id: authorId,
                    file_type: fileType,
                    tags: tags.length > 0 ? tags : null
                }
            ])
            .select()
            .single();

        if (error) throw error;

        alert('File uploaded successfully!');
        closeModalFunc();
        uploadForm.reset();
        loadFiles();
    } catch (error) {
        console.error('Error uploading file:', error);
        alert('Failed to upload file. Please try again.');
    }
}

// Get or Create Author
async function getOrCreateAuthor(name, email) {
    // First, try to find existing author by name or email
    let query = supabaseFiles.from('authors').select('id');
    
    if (email) {
        const { data: existingByEmail } = await query.eq('email', email).single();
        if (existingByEmail) return existingByEmail.id;
    }

    const { data: existingByName } = await query.eq('name', name).single();
    if (existingByName) return existingByName.id;

    // Create new author
    const { data: newAuthor, error } = await supabaseFiles
        .from('authors')
        .insert([{ name, email: email || null }])
        .select()
        .single();

    if (error) throw error;
    return newAuthor.id;
}

// Detect File Type
function detectFileType(url) {
    const extension = url.split('.').pop().toLowerCase().split('?')[0];
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
    const videoTypes = ['mp4', 'webm', 'ogg', 'mov', 'avi'];
    const audioTypes = ['mp3', 'wav', 'ogg', 'aac'];
    
    if (imageTypes.includes(extension)) return 'image';
    if (videoTypes.includes(extension)) return 'video';
    if (audioTypes.includes(extension)) return 'audio';
    return 'other';
}

// Handle Search
function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();
    
    if (!query) {
        filteredFiles = [...allFiles];
    } else {
        filteredFiles = allFiles.filter(file => {
            const titleMatch = file.title.toLowerCase().includes(query);
            const descMatch = file.description?.toLowerCase().includes(query);
            const authorMatch = file.authors?.name?.toLowerCase().includes(query);
            const tagMatch = file.tags?.some(tag => tag.toLowerCase().includes(query));
            
            return titleMatch || descMatch || authorMatch || tagMatch;
        });
    }
    
    handleSort();
}

// Handle Sort
function handleSort() {
    const sortBy = sortSelect.value;
    
    switch (sortBy) {
        case 'newest':
            filteredFiles.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
        case 'oldest':
            filteredFiles.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            break;
        case 'popular':
            filteredFiles.sort((a, b) => (b.views_count || 0) - (a.views_count || 0));
            break;
        case 'featured':
            filteredFiles.sort((a, b) => {
                if (a.is_featured && !b.is_featured) return -1;
                if (!a.is_featured && b.is_featured) return 1;
                return new Date(b.created_at) - new Date(a.created_at);
            });
            break;
    }
    
    renderFiles();
}

// Modal Functions
function openModal() {
    if (uploadModal) uploadModal.classList.add('active');
}

function closeModalFunc() {
    if (uploadModal) uploadModal.classList.remove('active');
    if (uploadForm) uploadForm.reset();
}

// Utility Functions
function showLoading() {
    if (loadingState) loadingState.style.display = 'block';
    if (filesGrid) filesGrid.style.display = 'none';
}

function hideLoading() {
    if (loadingState) loadingState.style.display = 'none';
    if (filesGrid) filesGrid.style.display = 'grid';
}

function showError(message) {
    if (filesGrid) {
        filesGrid.innerHTML = `<div class="error-state"><p>${message}</p></div>`;
    }
}

function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

