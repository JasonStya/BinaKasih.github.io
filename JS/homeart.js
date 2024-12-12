const ARTICLES_PER_PAGE = 3;
        let articles = JSON.parse(localStorage.getItem('articles')) || [];
        let currentPage = 1;

        function displayArticles() {
            const articleList = document.getElementById('articleList');
            articleList.innerHTML = '';
            const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
            const endIndex = startIndex + ARTICLES_PER_PAGE;
            const articlesToDisplay = articles.slice(startIndex, endIndex);
        
            articlesToDisplay.forEach((article, index) => {
                const articleElement = document.createElement('article');
                articleElement.classList.add('article');
                
                // Format the date to a readable format (e.g., "Nov 21, 2024")
                const articleDate = new Date(article.date);
                const formattedDate = articleDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short', // "short" gives "Nov" instead of "November"
                    day: '2-digit'
                });
        
        
                // Add the article's content, including the date
                articleElement.innerHTML = `
                    <img src="${article.image}" alt="Article Image">
                    <div class="text-content">
                        <div class="text-content-title">
                            <h1>${article.title}</h1> 
                            <span class="article-date">${formattedDate}</span> <!-- Date added here -->
                        </div>    
                        <p>${article.content.slice(0, 100)}...</p>
                    </div>
                `;
        
                articleElement.onclick = function () {
                    viewArticleDetails(index + startIndex);
                };
                articleList.appendChild(articleElement);
            });
        }

// View an article in modal
function viewArticleDetails(index) {
    const article = articles[index];
    const articleDate = new Date(article.date);
    const formattedDate = articleDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    });

    document.getElementById('modalImage').src = article.image;
    document.getElementById('modalTitle').innerText = article.title;
    document.getElementById('modalAuthor').innerText = `By: ${article.author}`;
    document.getElementById('modalDate').innerText = ` ${formattedDate}`;
    document.getElementById('modalContent').innerText = article.content;
    document.getElementById('viewArticleModal').classList.add('show');
}


// Close the modal
document.getElementById('closeViewModal').addEventListener('click', () => {
    document.getElementById('viewArticleModal').classList.remove('show');
});

// Close modal by clicking outside content
document.getElementById('viewArticleModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('viewArticleModal')) {
        document.getElementById('viewArticleModal').classList.remove('show');
    }
});

// Initialize page
window.onload = () => {
    displayEvents();
    displayArticles();
};