// Supabase Configuration
const SUPABASE_URL = 'https://jyzlkuihyujfucaxuaql.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5emxrdWloeXVqZnVjYXh1YXFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3OTIxOTMsImV4cCI6MjA4MzM2ODE5M30.Xqr0m8gUMZOt9Qwm-Xom6T5JnnRqIoFqoWBDOnEZ0Hc';

// Initialize Supabase (only if not already initialized)
if (typeof window.supabaseFiles === 'undefined') {
    window.supabaseFiles = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
const supabaseFiles = window.supabaseFiles;

// Get file ID from URL
const urlParams = new URLSearchParams(window.location.search);
const fileId = urlParams.get('id');

// DOM Elements
const loadingState = document.getElementById('loadingState');
const fileDetail = document.getElementById('fileDetail');
const errorState = document.getElementById('errorState');

// Load File Details
document.addEventListener('DOMContentLoaded', async () => {
    if (!fileId) {
        showError();
        return;
    }

    await loadFileDetails(fileId);
    await incrementViews(fileId);
});

// Load File Details
async function loadFileDetails(id) {
    try {
        showLoading();

        // Fetch file with author
        const { data: file, error } = await supabaseFiles
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
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!file) throw new Error('File not found');

        renderFileDetail(file);
    } catch (error) {
        console.error('Error loading file details:', error);
        showError();
    } finally {
        hideLoading();
    }
}

// Render File Detail
function renderFileDetail(file) {
    const author = file.authors || {};
    const authorName = author.name || 'Unknown';
    const authorInitials = getInitials(authorName);

    // Set title
    document.title = `${file.title} - Pixovia`;

    // Set file title
    const fileTitleEl = document.getElementById('fileTitle');
    if (fileTitleEl) fileTitleEl.textContent = file.title;

    // Set description
    const fileDescEl = document.getElementById('fileDescription');
    if (fileDescEl) {
        fileDescEl.textContent = file.description || 'No description available.';
    }

    // Set stats
    const viewsCountEl = document.getElementById('viewsCount');
    if (viewsCountEl) viewsCountEl.textContent = file.views_count || 0;

    const likesCountEl = document.getElementById('likesCount');
    if (likesCountEl) likesCountEl.textContent = file.likes_count || 0;

    // Set file media
    renderFileMedia(file);

    // Set tags
    const fileTagsEl = document.getElementById('fileTags');
    if (fileTagsEl) {
        if (file.tags && file.tags.length > 0) {
            fileTagsEl.innerHTML = file.tags.map(tag => 
                `<span class="tag" onclick="window.location.href='index.html?tag=${encodeURIComponent(tag)}'">${escapeHtml(tag)}</span>`
            ).join('');
        } else {
            fileTagsEl.innerHTML = '';
        }
    }

    // Set author info
    const authorNameEl = document.getElementById('authorName');
    if (authorNameEl) authorNameEl.textContent = authorName;

    const authorBioEl = document.getElementById('authorBio');
    if (authorBioEl) {
        authorBioEl.textContent = author.bio || '';
        if (!author.bio) authorBioEl.style.display = 'none';
    }

    const authorEmailEl = document.getElementById('authorEmail');
    if (authorEmailEl) {
        if (author.email) {
            authorEmailEl.textContent = author.email;
            authorEmailEl.href = `mailto:${author.email}`;
        } else {
            authorEmailEl.style.display = 'none';
        }
    }

    const authorAvatarEl = document.getElementById('authorAvatar');
    const authorInitialsEl = document.getElementById('authorInitials');
    if (author.avatar_url) {
        if (authorAvatarEl) {
            authorAvatarEl.src = author.avatar_url;
            authorAvatarEl.alt = authorName;
        }
        if (authorInitialsEl) authorInitialsEl.style.display = 'none';
    } else {
        if (authorAvatarEl) authorAvatarEl.style.display = 'none';
        if (authorInitialsEl) {
            authorInitialsEl.textContent = authorInitials;
            authorInitialsEl.style.display = 'flex';
        }
    }

    // Set meta info
    const createdAtEl = document.getElementById('createdAt');
    if (createdAtEl) createdAtEl.textContent = formatDate(file.created_at);

    const fileTypeEl = document.getElementById('fileType');
    if (fileTypeEl) fileTypeEl.textContent = file.file_type || 'Unknown';

    const fileUrlEl = document.getElementById('fileUrl');
    if (fileUrlEl) {
        fileUrlEl.href = file.file_url;
        fileUrlEl.textContent = 'View Original';
    }

    const downloadBtnEl = document.getElementById('downloadBtn');
    if (downloadBtnEl) {
        downloadBtnEl.href = file.file_url;
        downloadBtnEl.download = file.title || 'download';
    }

    // Show detail section
    if (fileDetail) fileDetail.style.display = 'block';
}

// Render File Media
function renderFileMedia(file) {
    const fileImage = document.getElementById('fileImage');
    const fileVideo = document.getElementById('fileVideo');
    const fileIframe = document.getElementById('fileIframe');

    // Hide all first
    if (fileImage) fileImage.style.display = 'none';
    if (fileVideo) fileVideo.style.display = 'none';
    if (fileIframe) fileIframe.style.display = 'none';

    const fileType = file.file_type || detectFileType(file.file_url);

    switch (fileType) {
        case 'image':
            if (fileImage) {
                fileImage.src = file.file_url;
                fileImage.alt = file.title;
                fileImage.style.display = 'block';
            }
            break;
        case 'video':
            if (fileVideo) {
                fileVideo.src = file.file_url;
                fileVideo.style.display = 'block';
            }
            break;
        default:
            // Try to embed as iframe for other types
            if (fileIframe) {
                fileIframe.src = file.file_url;
                fileIframe.style.display = 'block';
            } else if (fileImage) {
                // Fallback to image
                fileImage.src = file.thumbnail_url || file.file_url;
                fileImage.alt = file.title;
                fileImage.style.display = 'block';
            }
    }
}

// Increment Views
async function incrementViews(id) {
    try {
        await supabaseFiles.rpc('increment_file_views', { file_id: id });
    } catch (error) {
        console.error('Error incrementing views:', error);
        // Fallback: update directly
        const { data: file } = await supabaseFiles
            .from('files')
            .select('views_count')
            .eq('id', id)
            .single();

        if (file) {
            await supabaseFiles
                .from('files')
                .update({ views_count: (file.views_count || 0) + 1 })
                .eq('id', id);
        }
    }
}

// Show/Hide Loading
function showLoading() {
    if (loadingState) loadingState.style.display = 'block';
    if (fileDetail) fileDetail.style.display = 'none';
    if (errorState) errorState.style.display = 'none';
}

function hideLoading() {
    if (loadingState) loadingState.style.display = 'none';
}

function showError() {
    if (loadingState) loadingState.style.display = 'none';
    if (fileDetail) fileDetail.style.display = 'none';
    if (errorState) errorState.style.display = 'block';
}

// Utility Functions
function detectFileType(url) {
    const extension = url.split('.').pop().toLowerCase().split('?')[0];
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
    const videoTypes = ['mp4', 'webm', 'ogg', 'mov', 'avi'];
    
    if (imageTypes.includes(extension)) return 'image';
    if (videoTypes.includes(extension)) return 'video';
    return 'other';
}

function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
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

