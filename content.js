// 创建悬浮按钮
function createToggleButton() {
    // 检查是否已存在
    if (document.querySelector('.qr-toggle-button')) {
        return;
    }

    // 创建按钮
    const button = document.createElement('div');
    button.className = 'qr-toggle-button';
    
    // 创建QR图标 (更现代的设计)
    const icon = document.createElement('img');
    icon.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMyAzaDd2N0gzVjN6bTIgMnYzaDN2LTNINXptLTIgOWg3djdIM3YtN3ptMiAydjNoM3YtM0g1ek0xNCAzaDd2N2gtN1Yzem0yIDJ2M2gzdi0zaC0zek0xNiAxNmgydjNoLTJ2LTN6bS0yLTJoNnY3aC0ydi0zaC00di00eiIgZmlsbD0iY3VycmVudENvbG9yIi8+PC9zdmc+';
    button.appendChild(icon);

    // 添加点击事件
    button.addEventListener('click', showQRCode);

    // 添加到页面
    document.body.appendChild(button);
}

// 创建二维码容器
function createQRCodeContainer() {
    // 检查是否已存在
    if (document.querySelector('.qr-code-container')) {
        return;
    }

    // 创建主容器
    const container = document.createElement('div');
    container.className = 'qr-code-container';

    // 创建二维码容器
    const qrWrapper = document.createElement('div');
    qrWrapper.className = 'qr-wrapper';
    container.appendChild(qrWrapper);

    // 创建二维码图片
    const qrImg = document.createElement('img');
    qrImg.className = 'qr-code-image';
    const currentUrl = encodeURIComponent(window.location.href);
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${currentUrl}&qzone=2`;
    qrWrapper.appendChild(qrImg);

    // 创建网站信息区域
    const infoDiv = document.createElement('div');
    infoDiv.className = 'website-info';

    // 添加网站名称
    const websiteName = document.createElement('div');
    websiteName.className = 'website-name';
    websiteName.textContent = window.location.hostname;
    if (websiteName.textContent.length > 15) {
        websiteName.textContent = websiteName.textContent.substring(0, 15) + '...';
    }

    // 添加页面标题
    const pageTitle = document.createElement('div');
    pageTitle.className = 'page-title';
    pageTitle.textContent = document.title;
    if (pageTitle.textContent.length > 15) {
        pageTitle.textContent = pageTitle.textContent.substring(0, 15) + '...';
    }

    // 将信息添加到容器
    infoDiv.appendChild(websiteName);
    infoDiv.appendChild(pageTitle);
    container.appendChild(infoDiv);

    // 获取网站图标
    const favicon = document.createElement('img');
    favicon.className = 'website-logo';
    favicon.src = getFaviconUrl();
    favicon.onerror = () => favicon.style.display = 'none';
    qrWrapper.appendChild(favicon);

    // 添加点击事件，点击二维码区域时收起
    container.addEventListener('click', () => {
        hideQRCode();
    });

    // 添加到页面
    document.body.appendChild(container);
}

// 显示二维码
function showQRCode() {
    let container = document.querySelector('.qr-code-container');
    if (!container) {
        createQRCodeContainer();
        container = document.querySelector('.qr-code-container');
    }
    container.classList.add('visible');
    
    // 隐藏悬浮按钮
    const button = document.querySelector('.qr-toggle-button');
    if (button) {
        button.style.opacity = '0';
        button.style.visibility = 'hidden';
        button.style.transform = 'translateY(20px) scale(0.95)';
    }
}

// 隐藏二维码
function hideQRCode() {
    const container = document.querySelector('.qr-code-container');
    if (container) {
        container.classList.remove('visible');
    }
    
    // 显示悬浮按钮
    const button = document.querySelector('.qr-toggle-button');
    if (button) {
        button.style.opacity = '1';
        button.style.visibility = 'visible';
        button.style.transform = 'translateY(0) scale(1)';
    }
}

// 获取网站图标URL
function getFaviconUrl() {
    const selectors = [
        'link[rel="apple-touch-icon"]',
        'link[rel="icon"][sizes="192x192"]',
        'link[rel="icon"][sizes="128x128"]',
        'link[rel="icon"]',
        'link[rel="shortcut icon"]'
    ];

    for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element && element.href) {
            return element.href;
        }
    }

    return window.location.origin + '/favicon.ico';
}

// 确保按钮始终存在
function ensureButtonExists() {
    const observer = new MutationObserver(() => {
        if (!document.querySelector('.qr-toggle-button')) {
            createToggleButton();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// 在页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createToggleButton);
} else {
    createToggleButton();
}

// 确保按钮始终存在
ensureButtonExists();

// 监听 URL 变化（用于单页应用）
let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        // 移除现有的二维码容器
        const container = document.querySelector('.qr-code-container');
        if (container) {
            container.remove();
        }
        // 确保按钮存在
        if (!document.querySelector('.qr-toggle-button')) {
            createToggleButton();
        }
    }
}).observe(document, { subtree: true, childList: true }); 