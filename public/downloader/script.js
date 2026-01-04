const API_BASE = 'https://pixovia-downloader.pixovia.workers.dev';
let progressInterval;
let selectedFormat = 'mp4';
let selectedQuality = 'best';
let isMuted = false;

// URL validation for all supported platforms
function isValidUrl(url) {
    const patterns = {
        // Video Platforms
        youtube: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/,
        vimeo: /^(https?:\/\/)?(www\.)?vimeo\.com\/.+/,
        dailymotion: /^(https?:\/\/)?(www\.)?dailymotion\.com\/.+/,
        twitch: /^(https?:\/\/)?(www\.)?twitch\.tv\/.+/,
        peertube: /^https?:\/\/[\w.-]+\/(videos\/watch|w)\/.+/,
        
        // Social Media
        instagram: /^(https?:\/\/)?(www\.)?instagram\.com\/(p\/|reel\/|tv\/|stories\/).+/,
        facebook: /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\/.+/,
        twitter: /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/.+/,
        tiktok: /^(https?:\/\/)?(www\.)?tiktok\.com\/@.+\/video\/.+/,
        reddit: /^(https?:\/\/)?(www\.)?reddit\.com\/r\/.+/,
        vk: /^(https?:\/\/)?(www\.)?vk\.com\/.+/,
        
        // Audio Platforms
        soundcloud: /^(https?:\/\/)?(www\.)?soundcloud\.com\/.+/,
        bandcamp: /^https?:\/\/[\w.-]+\.bandcamp\.com\/.+/,
        mixcloud: /^(https?:\/\/)?(www\.)?mixcloud\.com\/.+/,
        
        // News & TV
        bbc: /^(https?:\/\/)?(www\.)?bbc\.(co\.uk|com)\/.+/,
        cnn: /^(https?:\/\/)?(www\.)?cnn\.com\/.+/,
        nbc: /^(https?:\/\/)?(www\.)?nbc\.com\/.+/,
        comedycentral: /^(https?:\/\/)?(www\.)?cc\.com\/.+/,
        discovery: /^(https?:\/\/)?(www\.)?discovery(go)?\.com\/.+/,
        
        // Educational & Others
        archive: /^(https?:\/\/)?(www\.)?archive\.org\/.+/,
        ninegag: /^(https?:\/\/)?(www\.)?9gag\.com\/.+/,
        linkedin: /^(https?:\/\/)?(www\.)?linkedin\.com\/learning\/.+/,
        coursera: /^(https?:\/\/)?(www\.)?coursera\.org\/.+/,
        udemy: /^(https?:\/\/)?(www\.)?udemy\.com\/.+/
    };
    
    return Object.values(patterns).some(pattern => pattern.test(url));
}

function detectPlatform(url) {
    if (/youtube\.com|youtu\.be/.test(url)) return 'YouTube';
    if (/vimeo\.com/.test(url)) return 'Vimeo';
    if (/dailymotion\.com/.test(url)) return 'Dailymotion';
    if (/twitch\.tv/.test(url)) return 'Twitch';
    if (/instagram\.com/.test(url)) return 'Instagram';
    if (/facebook\.com|fb\.watch/.test(url)) return 'Facebook';
    if (/twitter\.com|x\.com/.test(url)) return 'Twitter/X';
    if (/tiktok\.com/.test(url)) return 'TikTok';
    if (/reddit\.com/.test(url)) return 'Reddit';
    if (/vk\.com/.test(url)) return 'VK';
    if (/soundcloud\.com/.test(url)) return 'SoundCloud';
    if (/bandcamp\.com/.test(url)) return 'Bandcamp';
    if (/mixcloud\.com/.test(url)) return 'Mixcloud';
    if (/bbc\.(co\.uk|com)/.test(url)) return 'BBC';
    if (/cnn\.com/.test(url)) return 'CNN';
    if (/nbc\.com/.test(url)) return 'NBC';
    if (/cc\.com/.test(url)) return 'Comedy Central';
    if (/discovery(go)?\.com/.test(url)) return 'Discovery';
    if (/archive\.org/.test(url)) return 'Archive.org';
    if (/9gag\.com/.test(url)) return '9GAG';
    if (/linkedin\.com\/learning/.test(url)) return 'LinkedIn Learning';
    if (/coursera\.org/.test(url)) return 'Coursera';
    if (/udemy\.com/.test(url)) return 'Udemy';
    if (/[\w.-]+\.bandcamp\.com/.test(url)) return 'Bandcamp';
    if (/[\w.-]+\/(videos\/watch|w)\//.test(url)) return 'PeerTube';
    return 'Supported Platform';
}

// Format selection
function selectFormat(format) {
    if (isDownloading || !hasValidUrl) return; // Prevent changes during download or without URL
    
    selectedFormat = format;
    
    document.querySelectorAll('.format-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelector(`[data-format="${format}"]`).classList.add('active');
    
    // Show/hide quality and audio options
    const qualitySection = document.getElementById('qualitySection');
    const audioOptions = document.getElementById('audioOptions');
    
    if (format === 'mp3') {
        qualitySection.style.opacity = '0.5';
        qualitySection.style.pointerEvents = 'none';
        audioOptions.style.display = 'none';
    } else {
        qualitySection.style.opacity = '1';
        qualitySection.style.pointerEvents = 'auto';
        audioOptions.style.display = 'block';
    }
}

// Fetch available qualities from API
async function fetchAvailableQualities(url) {
    const dropdownSelected = document.getElementById('dropdownSelected');
    const qualityLoading = document.getElementById('qualityLoading');
    
    qualityLoading.classList.add('show');
    dropdownSelected.classList.add('disabled');
    
    try {
        const response = await fetch(`${API_BASE}/qualities`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });
        
        const result = await response.json();
        
        if (result.success) {
            availableQualities = result.qualities;
            populateQualityDropdown(result.qualities);
        } else {
            // Fallback to default qualities
            const defaultQualities = [
                { value: 'best', label: 'Best Available', resolution: 'Auto' },
                { value: '1080p', label: '1080p HD', resolution: '' },
                { value: '720p', label: '720p HD', resolution: '' },
                { value: '480p', label: '480p', resolution: '' },
                { value: '360p', label: '360p', resolution: '' }
            ];
            populateQualityDropdown(defaultQualities);
        }
    } catch (error) {
        // Fallback to default qualities
        const defaultQualities = [
            { value: 'best', label: 'Best Available', resolution: 'Auto' },
            { value: '1080p', label: '1080p HD', resolution: '' },
            { value: '720p', label: '720p HD', resolution: '' },
            { value: '480p', label: '480p', resolution: '' }
        ];
        populateQualityDropdown(defaultQualities);
    } finally {
        qualityLoading.classList.remove('show');
    }
}

// Populate quality dropdown with real data
function populateQualityDropdown(qualities) {
    const dropdownOptions = document.getElementById('dropdownOptions');
    const dropdownSelected = document.getElementById('dropdownSelected');
    
    // Clear existing options
    dropdownOptions.innerHTML = '';
    
    // Add available qualities
    qualities.forEach((quality, index) => {
        const option = document.createElement('div');
        option.className = 'dropdown-option';
        option.dataset.value = quality.value;
        option.innerHTML = `
            <span>${quality.label}</span>
            <span class="quality-badge">${quality.resolution || 'Auto'}</span>
        `;
        option.addEventListener('click', () => selectQualityOption(quality.value, quality.label));
        dropdownOptions.appendChild(option);
        
        // Select first quality by default
        if (index === 0) {
            selectQualityOption(quality.value, quality.label);
        }
    });
    
    // Enable dropdown
    dropdownSelected.classList.remove('disabled');
}

// Reset quality dropdown
function resetQualityDropdown() {
    const dropdownOptions = document.getElementById('dropdownOptions');
    const dropdownSelected = document.getElementById('dropdownSelected');
    const selectedText = dropdownSelected.querySelector('.selected-text');
    
    dropdownOptions.innerHTML = '<div class="dropdown-option" data-value="">Select quality...</div>';
    selectedText.textContent = 'Select quality...';
    dropdownSelected.classList.add('disabled');
    selectedQuality = 'best';
    availableQualities = [];
}

// Handle quality option selection
function selectQualityOption(value, label) {
    if (isDownloading) return;
    
    selectedQuality = value;
    const selectedText = document.querySelector('.selected-text');
    selectedText.textContent = label;
    
    // Update selected state
    document.querySelectorAll('.dropdown-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    document.querySelector(`[data-value="${value}"]`).classList.add('selected');
    
    // Close dropdown
    closeDropdown();
}

// Toggle dropdown
function toggleDropdown() {
    if (isDownloading || !hasValidUrl) return;
    
    const dropdownSelected = document.getElementById('dropdownSelected');
    const dropdownOptions = document.getElementById('dropdownOptions');
    
    if (dropdownOptions.classList.contains('show')) {
        closeDropdown();
    } else {
        openDropdown();
    }
}

// Open dropdown
function openDropdown() {
    const dropdownSelected = document.getElementById('dropdownSelected');
    const dropdownOptions = document.getElementById('dropdownOptions');
    
    dropdownSelected.classList.add('active');
    dropdownOptions.classList.add('show');
}

// Close dropdown
function closeDropdown() {
    const dropdownSelected = document.getElementById('dropdownSelected');
    const dropdownOptions = document.getElementById('dropdownOptions');
    
    dropdownSelected.classList.remove('active');
    dropdownOptions.classList.remove('show');
}

// Add dropdown event listeners
document.addEventListener('DOMContentLoaded', function() {
    const dropdownSelected = document.getElementById('dropdownSelected');
    dropdownSelected.addEventListener('click', toggleDropdown);
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        const dropdown = document.getElementById('qualityDropdown');
        if (!dropdown.contains(e.target)) {
            closeDropdown();
        }
    });
});

// Mute toggle
document.getElementById('muteToggle').addEventListener('change', function() {
    if (!isDownloading) {
        isMuted = this.checked;
    }
});

let isDownloading = false;
let downloadAbortController = null;
let availableQualities = [];
let hasValidUrl = false;

// Main download function
async function downloadVideo() {
    if (isDownloading) return;
    
    const url = document.getElementById('videoUrl').value.trim();
    const downloadBtn = document.getElementById('downloadBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const progressContainer = document.getElementById('progressContainer');
    const downloadResult = document.getElementById('downloadResult');
    const downloadCard = document.querySelector('.download-card');
    
    // Validation
    if (!url) {
        showNotification('Please enter a video URL', 'error');
        return;
    }
    
    if (!isValidUrl(url)) {
        showNotification('Please enter a valid URL from supported platforms', 'error');
        return;
    }
    
    const platform = detectPlatform(url);
    
    // Lock UI and show cancel button
    isDownloading = true;
    downloadCard.classList.add('downloading');
    downloadBtn.disabled = true;
    downloadBtn.classList.add('loading');
    downloadBtn.innerHTML = '<i class="fas fa-spinner"></i><span>Processing...</span>';
    cancelBtn.classList.add('show');
    
    downloadResult.innerHTML = '';
    downloadResult.classList.remove('show');
    showProgress();
    startProgressAnimation(platform);
    
    // Create abort controller for cancellation
    downloadAbortController = new AbortController();
    
    try {
        const response = await fetch(`${API_BASE}/download`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url,
                format: selectedFormat,
                quality: selectedQuality,
                mute: selectedFormat === 'mp4' ? isMuted : false
            }),
            signal: downloadAbortController.signal
        });
        
        const result = await response.json();
        clearInterval(progressInterval);
        
        if (result.success) {
            completeProgress();
            setTimeout(() => {
                showPremiumDownloadLink(result.downloadUrl, result.filename, platform);
                hideProgress();
                showNotification(`${platform} download completed successfully!`, 'success');
            }, 1000);
        } else {
            showNotification(result.error || 'Download failed', 'error');
            hideProgress();
        }
        
    } catch (error) {
        clearInterval(progressInterval);
        if (error.name === 'AbortError') {
            showNotification('Download cancelled by user', 'error');
        } else {
            showNotification('Network error. Please check your connection.', 'error');
        }
        hideProgress();
    } finally {
        setTimeout(() => {
            resetDownloadUI();
        }, 1000);
    }
}

// Cancel download function
function cancelDownload() {
    if (downloadAbortController) {
        downloadAbortController.abort();
    }
    clearInterval(progressInterval);
    hideProgress();
    resetDownloadUI();
    showNotification('Download cancelled', 'error');
}

// Reset UI after download/cancel
function resetDownloadUI() {
    const downloadBtn = document.getElementById('downloadBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const downloadCard = document.querySelector('.download-card');
    
    isDownloading = false;
    downloadCard.classList.remove('downloading');
    downloadBtn.disabled = false;
    downloadBtn.classList.remove('loading');
    downloadBtn.innerHTML = '<i class="fas fa-download"></i><span>Download Now</span>';
    cancelBtn.classList.remove('show');
    downloadAbortController = null;
}

// Progress functions
function showProgress() {
    const progressContainer = document.getElementById('progressContainer');
    progressContainer.classList.add('show');
    updateProgress(0, 'Initializing download...');
}

function hideProgress() {
    const progressContainer = document.getElementById('progressContainer');
    setTimeout(() => {
        progressContainer.classList.remove('show');
    }, 2000);
}

function updateProgress(percent, text) {
    document.getElementById('progressFill').style.width = percent + '%';
    document.getElementById('progressPercent').textContent = Math.round(percent) + '%';
    document.getElementById('progressText').textContent = text;
}

function startProgressAnimation(platform) {
    let progress = 0;
    const stages = [
        { percent: 20, text: `Connecting to ${platform}...` },
        { percent: 40, text: 'Analyzing video data...' },
        { percent: 60, text: 'Downloading content...' },
        { percent: 80, text: 'Processing video...' },
        { percent: 95, text: 'Finalizing download...' }
    ];
    
    let stageIndex = 0;
    
    progressInterval = setInterval(() => {
        if (stageIndex < stages.length) {
            const stage = stages[stageIndex];
            const targetPercent = stage.percent;
            
            if (progress < targetPercent) {
                progress += Math.random() * 3 + 1;
                progress = Math.min(progress, targetPercent);
                updateProgress(progress, stage.text);
            } else {
                stageIndex++;
            }
        }
    }, 200);
}

function completeProgress() {
    updateProgress(100, 'Download completed!');
}

function showPremiumDownloadLink(downloadUrl, filename, platform) {
    const downloadResult = document.getElementById('downloadResult');
    const fileIcon = filename.endsWith('.mp3') ? 'fas fa-music' : 'fas fa-video';
    const fileSize = '~15.2 MB'; // This would come from backend in real implementation
    const fileType = filename.split('.').pop().toUpperCase();
    
    downloadResult.innerHTML = `
        <div class="file-info">
            <div class="file-details">
                <span class="file-name">${filename}</span>
                <span class="file-size">${fileSize}</span>
            </div>
            <div class="file-type">
                <i class="${fileIcon}"></i>
                ${fileType} from ${platform}
            </div>
        </div>
        <a href="${downloadUrl}" download="${filename}" target="_blank">
            <i class="fas fa-download"></i>
            Download Your File
        </a>
    `;
    
    downloadResult.classList.add('show');
}

// Clipboard functionality
async function pasteFromClipboard() {
    try {
        const text = await navigator.clipboard.readText();
        if (text && isValidUrl(text)) {
            const urlInput = document.getElementById('videoUrl');
            urlInput.value = text;
            
            // Trigger input event to enable options
            urlInput.dispatchEvent(new Event('input'));
            
            const platform = detectPlatform(text);
            showNotification(`${platform} URL pasted successfully!`, 'success');
        } else {
            showNotification('No valid URL found in clipboard', 'error');
        }
    } catch (err) {
        showNotification('Unable to access clipboard', 'error');
    }
}

// Notification system
function showNotification(message, type) {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #48bb78, #38a169)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #f56565, #e53e3e)';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Input validation and styling
document.getElementById('videoUrl').addEventListener('input', async function() {
    const url = this.value.trim();
    const wrapper = this.parentElement;
    const optionsSection = document.getElementById('optionsSection');
    
    if (url && isValidUrl(url)) {
        wrapper.style.borderColor = '#48bb78';
        wrapper.style.boxShadow = '0 0 0 3px rgba(72, 187, 120, 0.1)';
        
        if (!hasValidUrl) {
            hasValidUrl = true;
            optionsSection.classList.remove('disabled');
            await fetchAvailableQualities(url);
        }
    } else if (url) {
        wrapper.style.borderColor = '#f56565';
        wrapper.style.boxShadow = '0 0 0 3px rgba(245, 101, 101, 0.1)';
        
        if (hasValidUrl) {
            hasValidUrl = false;
            optionsSection.classList.add('disabled');
            resetQualityDropdown();
        }
    } else {
        wrapper.style.borderColor = '#e2e8f0';
        wrapper.style.boxShadow = 'none';
        
        if (hasValidUrl) {
            hasValidUrl = false;
            optionsSection.classList.add('disabled');
            resetQualityDropdown();
        }
    }
});

// Enter key support
document.getElementById('videoUrl').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        downloadVideo();
    }
});

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    selectFormat('mp4'); // Set default format
});