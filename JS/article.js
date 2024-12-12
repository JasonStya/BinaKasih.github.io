const ADMIN_PASSWORD = "binakasih";
const ARTICLES_PER_PAGE = 6;
let articles = JSON.parse(localStorage.getItem('articles')) || [];
let currentPage = 1;

// Sort articles by date in descending order
articles.sort((a, b) => new Date(b.date) - new Date(a.date));

window.onload = function () {
    displayArticles();
    displayPagination();
};

// Open modal for adding articles
function openArticleModal() {
    document.getElementById('addArticleModal').classList.add('show');
}

// Close the add article modal
function closeArticleModal() {
    document.getElementById('addArticleModal').classList.remove('show');
    clearForm();
}

// Add article with validation and password protection
function confirmAddArticle() {
const password = document.getElementById('adminPassword').value;
if (password === ADMIN_PASSWORD) {
const authorName = document.getElementById('authorName').value;
const title = document.getElementById('articleTitle').value;
const content = document.getElementById('articleContent').value;
const imageFile = document.getElementById('articleImage').files[0]; // Corrected here

if (!authorName || !title || !content || !imageFile) {
    alert('Please fill in all fields.');
    return;
}

const reader = new FileReader();
reader.onloadend = function () {
    const imageBase64 = reader.result;

    // Check if the image already exists in any article
    const isDuplicate = articles.some(article => article.image === imageBase64);
    if (isDuplicate) {
        alert("This image has been used before. Please choose a different image.");
        return;
    }

    const newArticle = {
        id: Date.now(), // Use timestamp as a unique ID
        author: authorName,
        title: title,
        content: content,
        image: imageBase64,
        date: new Date().toISOString(),
    };

    articles.push(newArticle);
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    localStorage.setItem('articles', JSON.stringify(articles));

    displayArticles();
    displayPagination();
    closeArticleModal();
    document.getElementById('adminPassword').value = '';
};
reader.readAsDataURL(imageFile);
} else {
alert("Incorrect Password");
}
}

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


// Display pagination buttons
function displayPagination() {
    const paginationButtons = document.getElementById('paginationButtons');
    paginationButtons.innerHTML = '';
    const totalPages = Math.ceil(articles.length / ARTICLES_PER_PAGE);
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add(i === currentPage ? 'active' : '');
        button.onclick = () => {
            currentPage = i;
            displayArticles();
            displayPagination();
        };
        paginationButtons.appendChild(button);
    }
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

// Close the article view modal
function closeViewModal() {
    document.getElementById('viewArticleModal').classList.remove('show');
}

// Open delete confirmation modal
function openDeleteModal() {
    document.getElementById('deleteArticleModal').classList.add('show');
}

// Close the delete confirmation modal
function closeDeleteModal() {
    document.getElementById('deleteArticleModal').classList.remove('show');
}

// Close article view modal
function closeViewModal() {
    document.getElementById('viewArticleModal').classList.remove('show');
}

// Open delete confirmation modal
function openDeleteModal() {
    document.getElementById('deleteArticleModal').classList.add('show');
}

// Close delete confirmation modal
function closeDeleteModal() {
    document.getElementById('deleteArticleModal').classList.remove('show');
}

// Delete article with password protection
function deleteArticle() {
    const password = document.getElementById('adminPasswordForDelete').value;
    if (password === ADMIN_PASSWORD) {
        const articleIndex = articles.findIndex(a => a.title === document.getElementById('modalTitle').innerText);
        articles.splice(articleIndex, 1);
        localStorage.setItem('articles', JSON.stringify(articles));

        closeDeleteModal();
        displayArticles();
        closeViewModal();
        displayPagination();
        document.getElementById('adminPasswordForDelete').value = '';
    } else {
        alert("Incorrect password");
    }
}

document.getElementById('addArticleBtn').addEventListener('click', openArticleModal);
document.getElementById('closeAddModal').addEventListener('click', closeArticleModal);
document.getElementById('closeViewModal').addEventListener('click', closeViewModal);
document.getElementById('closeDeleteModal').addEventListener('click', closeDeleteModal);

function openArticleModal() {
    document.getElementById('addArticleModal').classList.add('show');
    document.querySelector('.modal-backdrop').style.display = 'block'; // Show backdrop
}

function closeArticleModal() {
    document.getElementById('addArticleModal').classList.remove('show');
    document.querySelector('.modal-backdrop').style.display = 'none'; // Hide backdrop
}

function clearForm() {
    document.getElementById('authorName').value = '';
    document.getElementById('articleTitle').value = '';
    document.getElementById('articleContent').value = '';
    document.getElementById('articleImage').value = '';
    document.getElementById('adminPassword').value = '';
}

window.onclick = function (event) {
    if (event.target === calendarModal) {
      calendarModal.style.display = "none";
    }
    if (event.target === articleModal) {
      articleModal.style.display = "none";
    }
  };